import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, MessageCircle } from 'lucide-react';
import { getCartist, updateCart, deleteTransaction } from '../../redux/services/productService';

const SlideCart = ({ cartItems: propCartItems = [], onClose, onViewCart, onCheckout, onCartUpdate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    
    
useEffect(() => {
  const storedData = localStorage.getItem('userData');

  if (storedData) {
    let parsedData = JSON.parse(storedData);

    // Check if parsedData is still a string (double stringified case)
    if (typeof parsedData === 'string') {
      parsedData = JSON.parse(parsedData);
    }

    if (parsedData && parsedData[0]?.UserId) {
      setUserId(parsedData[0].UserId);
    }
  }
}, []);

  useEffect(() => {
    // Always fetch fresh cart data from API, similar to Cart.jsx
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await getCartist();
      const parsedData = JSON.parse(res.result);
      console.log("parsedData",parsedData);
      
      if (parsedData?.Data) {
        const mappedItems = parsedData.Data.map((item, index) => ({
          id: item.TransId || index,
          transId: item.TransId,
          product:item.Product_Id,
          name: item.Product_Name || "Unnamed Product",
          price: item.Rate || 0,
          quantity: item.Quantity || 1,
          image: item.Image,
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, change) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);

    // Update local state immediately for UI responsiveness
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: newQuantity }
        : item
    ));

    // Update cart via API
    try {
      const payload = {
        transId: item.transId || 0,
        date: new Date().toISOString().split("T")[0],
        customer: userId, // You might need to get this from context/state
        warehouse: 2,
        remarks: "",
        discountType: 0,
        discountCouponRef: "",
        discountRef: "",
        sampleRequestedBy: 0,
        product: item.product,
        qty: newQuantity,
        rate: item.price,
        unit: 1,
        totalRate: item.price * newQuantity,
        addCharges: 0,
        discount: 0,
        discountAmt: 0,
        discountRemarks: "",
        be: 0,
      };
      await updateCart(payload);

      // Notify parent component of cart update
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      // Revert local state on error
      setItems(items.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - change }
          : item
      ));
    }
  };
  console.log("userId33", items);
  

  const removeItem = async (id) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    // Update local state immediately
    setItems(items.filter(item => item.id !== id));

    // Remove from cart via API
    try {
      const payload = {
        docType: 3,
        be: 0,
        idCollection: [{ id }]
      };
      await deleteTransaction(payload);

      // Notify parent component of cart update
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      // Revert local state on error
      fetchCartItems(); // Refetch to restore state
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="cart-container">
      {/* Header */}
      <div className="cart-header">
        <h2>SHOPPING CART</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
          <span>CLOSE</span>
        </button>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {loading ? (
          <div className="loading">Loading cart...</div>
        ) : items.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                 <img  className="cart-image" src={item.image} />
              </div>

              <div className="item-details">
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="item-price">
                  {item.quantity} × {item.price.toFixed(2)} AED
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat with us button */}
      {/* <div className="chat-button">
        <MessageCircle size={24} fill="white" color="white" />
        <span>Chat with us</span>
      </div> */}

      {/* Footer */}
      <div className="cart-footer">
        <div className="subtotal">
          <span>SUBTOTAL:</span>
          <span className="subtotal-amount">
            {calculateSubtotal().toFixed(2)} AED
          </span>
        </div>

        <button className="view-cart-btn" onClick={onViewCart}>VIEW CART</button>
        {/* <button className="checkout-btn" onClick={onCheckout}>CHECKOUT</button> */}
      </div>

      <style jsx>{`
        .cart-container {
           width: 340px;
           height: 600px;
           background: white;
           border: 2px solid #e0e0e0;
           border-radius: 8px;
           display: flex;
           flex-direction: column;
           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
           position: relative;
           animation: slideIn 0.3s ease-out;
         }

         @keyframes slideIn {
           from {
             transform: translateX(100%);
             opacity: 0;
           }
           to {
             transform: translateX(0);
             opacity: 1;
           }
         }

         .cart-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 20px;
           border-bottom: 1px solid #e0e0e0;
         }

         .cart-header h2 {
           margin: 0;
           font-size: 16px;
           font-weight: 600;
           letter-spacing: 0.5px;
         }

         .close-btn {
           display: flex;
           align-items: center;
           gap: 4px;
           background: none;
           border: none;
           cursor: pointer;
           font-size: 14px;
           color: #333;
         }

         .close-btn:hover {
           color: #666;
         }

         .cart-items {
           flex: 1;
           overflow-y: auto;
           padding: 16px;
         }

         .cart-item {
           display: flex;
           gap: 12px;
           padding: 16px 0;
           border-bottom: 1px solid #f0f0f0;
         }

         .item-image {
           width: 60px;
           height: 60px;
           background: #f5f5f5;
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           flex-shrink: 0;
         }

         .image-placeholder {
           font-size: 32px;
           display:none;
         }

         .item-details {
           flex: 1;
           display: flex;
           flex-direction: column;
           gap: 8px;
         }

         .item-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-start;
         }

         .item-header h3 {
           margin: 0;
           font-size: 14px;
           font-weight: 500;
           color: #333;
           line-height: 1.4;
           flex: 1;
         }

         .remove-btn {
           background: none;
           border: none;
           cursor: pointer;
           padding: 0;
           color: #999;
           margin-left: 8px;
         }

         .remove-btn:hover {
           color: #333;
         }

         .quantity-controls {
           display: flex;
           align-items: center;
           gap: 12px;
           width: fit-content;
         }

         .qty-btn {
           width: 28px;
           height: 28px;
           border: 1px solid #e0e0e0;
           border-radius: 50%;
           background: white;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #666;
         }

         .qty-btn:hover {
           background: #f5f5f5;
           border-color: #ccc;
         }

         .quantity {
           font-size: 14px;
           font-weight: 500;
           min-width: 20px;
           text-align: center;
         }

         .item-price {
           font-size: 13px;
           color: #ff5722;
           font-weight: 500;
         }

         .chat-button {
           position: absolute;
           right: 0;
           top: 50%;
           transform: translateY(-50%);
           background: #ff5722;
           color: white;
           padding: 12px 8px;
           border-radius: 24px 0 0 24px;
           cursor: pointer;
           writing-mode: vertical-rl;
           text-orientation: mixed;
           font-size: 12px;
           font-weight: 600;
           letter-spacing: 0.5px;
           display: flex;
           align-items: center;
           gap: 8px;
           box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.1);
         }

         .chat-button:hover {
           background: #f4511e;
         }

         .cart-footer {
           padding: 16px;
           border-top: 1px solid #e0e0e0;
           background: white;
         }

         .subtotal {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 16px;
           font-weight: 600;
         }

         .subtotal span:first-child {
           font-size: 14px;
           color: #333;
         }

         .subtotal-amount {
           font-size: 18px;
           color: #ff5722;
         }

         .view-cart-btn,
         .checkout-btn {
           width: 100%;
           padding: 14px;
           border: none;
           border-radius: 30px;
           font-weight: 600;
           font-size: 14px;
           letter-spacing: 0.5px;
           cursor: pointer;
           margin-bottom: 8px;
         }

         .view-cart-btn {
           background: #ff5722;
           color: white;
         }

         .view-cart-btn:hover {
           background: #f4511e;
         }

         .checkout-btn {
           background: #e64a19;
           color: white;
           margin-bottom: 0;
         }

         .checkout-btn:hover {
           background: #d84315;
         }
       `}</style>
    </div>
  );
};

export default SlideCart;