import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import "./Cart.css";
import Header from "../../Components/Header/Header";
import { getCartist, placeOrder, getTransactionDetails, deleteTransaction, updateCart, getWishist  } from "../../redux/services/productService";
import BottomNavigation from "../../Components/BottomMenu/BottomNavigation";
import Checkout from "../Checkout/Checkout";
import OrderComplete from "../Checkout/Ordercomplete";
import ShopBanner from "../../Components/Banner/Banner";


const Cart = () => {
     const navigate = useNavigate();
     const location = useLocation();
   const [cartItems, setCartItems] = useState([]);
   const [originalCartItems, setOriginalCartItems] = useState([]);
   const [hasChanges, setHasChanges] = useState(false);
   const [couponCode, setCouponCode] = useState("");
   const [cartCount, setCartCount] = useState("");
  const [step, setStep] = useState(location.state?.step || "cart"); // cart | checkout | orderComplete
   const [transactionDetails, setTransactionDetails] = useState([]); // store API responses
   const [orderResp, setOrderResp] = useState(null); // store API responses
   const [wishlist, setWishlist] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle cart items from navigation state (from slide cart checkout)
  const cartItemsFromState = location.state?.cartItems;
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

  // Fetch cart data
   useEffect(() => {
     const fetchCart = async () => {
       try {
         const res = await getCartist();
         const parsedResult = JSON.parse(res.result);
               console.log("parsedData123",parsedResult);

         if (parsedResult?.Data) {
           const mappedItems = parsedResult.Data.map((item, index) => ({
             id: item.TransId || index,
             product:item.Product_Id,
             transId: item.TransId,
             name: item.Product_Name || "Unnamed Product",
             price: item.Rate || 0,
             quantity: item.Quantity || 1,
             image: item.Image,
             StockQty: item.StockQty || 0
           }));

           // If we have cart items from navigation state, use those instead
           const itemsToUse = cartItemsFromState || mappedItems;
           setCartItems(itemsToUse);
           setOriginalCartItems(itemsToUse);
           // Calculate total quantity for cart count
           const totalQuantity = itemsToUse.reduce((sum, item) => sum + (item.quantity || 1), 0);
           setCartCount(itemsToUse.length);
         }
       } catch (error) {
         console.error("Error fetching cart:", error);
       }
     };

     fetchCart();
   }, [cartItemsFromState]);

   // fetch wishlist
   useEffect(() => {
     const fetchWishlist = async () => {
       try {
         const res = await getWishist();
         const parsedResult = JSON.parse(res.result);
         setWishlist(parsedResult.Data || []);
       } catch (error) {
         console.error("Error fetching wishlist:", error);
       }
     };

     fetchWishlist();
   }, []);

    const handleProceedToCheckout = async () => {
    try {
      // Call getTransactionDetails for each cart item
      const promises = cartItems.map((item) =>
        getTransactionDetails(item.transId)
      );
      const results = await Promise.all(promises);

      // Each result.result is a string → parse it
      const parsedResults = results.map((res) => JSON.parse(res.result));
      setTransactionDetails(parsedResults);
      setStep("checkout");
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      alert("Failed to fetch transaction details.");
    }
  };

const updateQuantity = (id, newQuantity) => {
  if (newQuantity < 1) return;
  setCartItems((items) =>
    items.map((item) =>
      item.id === id && newQuantity <= item.StockQty ? { ...item, quantity: newQuantity, unit: newQuantity } : item
    )
  );
  setHasChanges(true);
};

  const handleShopNow = () => {
    navigate("/shop");
  };

const removeItem = async (id) => {
  try {
    const payload = {
      docType: 3,
      be: 0,
      idCollection: [{ id }]
    };

    await deleteTransaction(payload);

    // update UI after success
    setCartItems((prev) => {
      const updatedItems = prev.filter((item) => item.id !== id);
      const totalQuantity = updatedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(updatedItems.length);
      return updatedItems;
    });
    setOriginalCartItems((prev) => {
      const updatedItems = prev.filter((item) => item.id !== id);
      return updatedItems;
    });
  } catch (error) {
    console.error("Failed to delete transaction", error);
  }
};

  const calculateSubtotal = (items) => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  console.log("cartItems123",cartItems);
  
  const subtotal = calculateSubtotal(originalCartItems);
  const shipping = 0;
  const vat = subtotal * 0.05;
  const total = subtotal + shipping + vat;

  const handlePlaceOrder = async (billingInfo) => {
  try {
    const payload = {
      transId: 0,
      date: new Date().toISOString().split("T")[0],
      country: 1,
      be: 1,
      customer: billingInfo.customer || 0,
      deliveryAddress: `${billingInfo.address1}, ${billingInfo.address2}, ${billingInfo.city}, ${billingInfo.state}`,
      eventName: "chk",
      remarks: billingInfo.notes,
      discountType: 0,
      payTerms: billingInfo.payTerms || 1,
      discountCouponRef: null,
      discountRef: null,
      sampleRequestBy: 0,
      deliveryTerms: null,
      deliveryDate: null,
      body: transactionDetails.flatMap((t) =>
        t.Header.map((item) => ({
          transId: item.TransId,
          product: item.Product,
          qty: item.Quantity,
          headerId: 0,
          voucherType: 1,
          rate: item.Rate,
          unit: item.Unit,
          vat: 5,
          addcharges: item.AddCharges ?? 0,
          discount: item.Discount ?? 0,
          discountAmt: item.DiscountAmt ?? 0,
          discountRemarks: item.DiscountRemarks ?? null,
          remarks: item.Remarks ?? null,
        }))
      ),
    };

    const res = await placeOrder(payload);
    setOrderResp(res.result);
    // Clear cart and checkout data after successful order placement
    setCartItems([]);
    setOriginalCartItems([]);
    setTransactionDetails([]);
    setCouponCode("");
    setHasChanges(false);
    setCartCount(0);
    setStep("orderComplete");
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order. Please try again.");
  }
};
const handleUpdateCart = async () => {
  try {
    const promises = cartItems.map((item) => {
      const payload = {
        transId: item.transId || 0,
        date: new Date().toISOString().split("T")[0],
        customer: item.customer || userId,   // ✅ customer required
        warehouse: item.warehouse || 2, // ✅ warehouse required
        remarks: item.remarks || "",
        discountType: 0,
        discountCouponRef: "",
        discountRef: "",
        sampleRequestedBy: 0,
        product: item.product,  // depends on your API
        qty: item.quantity,
        rate: item.price,
        unit: item.unit || "1",         // ✅ must pass selected unit
        totalRate: item.price * item.quantity,
        addCharges: 0,
        discount: 0,
        discountAmt: 0,
        discountRemarks: "",
        be: 0,
      };
      return updateCart(payload);
    });

    await Promise.all(promises);
    setOriginalCartItems(cartItems);
    setHasChanges(false);
  } catch (error) {
    console.error("Failed to update cart:", error);
    alert("Failed to update cart. Please try again.");
  }
};

  if (step === "cart" && cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <Header />
        <ShopBanner
          header=""
          badgeText="Cart Details"
          subheader=""
          backgroundImage="/banner.jpg"
          height="94px"
        />
        <div className="breadcrumb">
          <span
            className={`breadcrumb-item ${step === "cart" ? "active" : ""}`}
            onClick={() => setStep("cart")}
          >
            SHOPPING CART
          </span>
          <span className="breadcrumb-arrow">→</span>
          <span
            className={`breadcrumb-item ${step === "checkout" ? "active" : ""}`}
            onClick={() => setStep("checkout")}
          >
            CHECKOUT
          </span>
          <span className="breadcrumb-arrow">→</span>
          <span
            className={`breadcrumb-item ${
              step === "orderComplete" ? "active" : ""
            }`}
            onClick={() => setStep("orderComplete")}
          >
            ORDER COMPLETE
          </span>
        </div>

        <div className="empty-cart-content">
          <h2>Your cart is currently empty 🛒</h2>
          <p>Looks like you haven’t added any products yet.</p>
          <button className="shop-now-btn2" onClick={handleShopNow}>
            🛍️ Shop Now
          </button>
        </div>

        <BottomNavigation
          cartCount={cartItems.length}
          wishlistCount={wishlist.length}
          cartItems={cartItems}
          onCartUpdate={() => {
            // Refetch cart data when updated from slide cart
            const fetchCart = async () => {
              try {
                const res = await getCartist();
                const parsedResult = JSON.parse(res.result);
                if (parsedResult?.Data) {
                  const mappedItems = parsedResult.Data.map((item, index) => ({
                    id: item.TransId || index,
                    transId: item.TransId,
                    productId: item.Product,
                    name: item.Product_Name || "Unnamed Product",
                    price: item.Rate || 0,
                    quantity: item.Quantity || 1,
                    image: "/api/placeholder/60/60",
                  }));
                  const totalQuantity = mappedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
                  setCartItems(mappedItems);
                  setOriginalCartItems(mappedItems);
                  setCartCount(mappedItems.length);
                }
              } catch (error) {
                console.error("Error fetching cart:", error);
              }
            };
            fetchCart();
          }}
        />
      </div>
    );
  }

console.log("step",step);

  return (
    <div className="cart-page">
      <Header />
            <ShopBanner
              header=""
              badgeText="Cart Details"
              subheader=""
              backgroundImage="/banner.jpg"
              height="94px"
            />
      <div className="cart-container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span
            className={`breadcrumb-item ${step === "cart" ? "active" : ""}`}
            onClick={() => setStep("cart")}
          >
            SHOPPING CART
          </span>
          <span className="breadcrumb-arrow">→</span>
          <span
            className={`breadcrumb-item ${step === "checkout" ? "active" : ""}`}
            onClick={() => setStep("checkout")}
          >
            CHECKOUT
          </span>
          <span className="breadcrumb-arrow">→</span>
          <span
  className={`breadcrumb-item ${
    step === "orderComplete" ? "active" : ""
  }`}
  onClick={() => setStep("orderComplete")}
  style={{
    fontWeight: step === "orderComplete" ? "bold" : "normal",
    color: step === "orderComplete" ? "#161616ff" : "#666", // black if active, gray if inactive
    cursor: "pointer",
  }}
>
  ORDER COMPLETE
</span>

        </div>

        {/* Step Views */}
        {step === "cart" && (
          <div className="cart-content">
            <div className="cart-main">
              {/* Cart Table */}
              <div className="cart-table">
                <div className="table-header">
                  <div className="col-product"> {isMobile ? "" : "IMAGE"}</div>
                  <div className="col-product">{isMobile ? "" :"PRODUCT"}</div>
                  <div className="col-price">{isMobile ? "" : "PRICE"}</div>
                  <div className="col-quantity">{isMobile ? "" :"QUANTITY"}</div>
                  <div className="col-subtotal">{isMobile ? "" : "SUBTOTAL"}</div>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="table-row">
                    <div className="col-product">
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-image"
                      />
                      <span className="product-name2">{item.name}</span>
                    </div>
                    <div className="col-price">
                      {item.price.toFixed(2)} AED
                    </div>
                    <div className="col-quantity">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.StockQty}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-subtotal">
                      {(item.price * item.quantity).toFixed(2)} AED
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon and Update Cart */}
              <div className="cart-actions">
                <div className="coupon-section">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <button className="apply-coupon-btn">APPLY COUPON</button>
                </div>
                <button className="update-cart-btn" onClick={handleUpdateCart} disabled={!hasChanges}>UPDATE CART</button>
              </div>
            </div>

            {/* Cart Totals */}
            <div className="cart-sidebar">
              <div className="cart-totals">
                <h3 className="totals-title">CART TOTALS</h3>

                <div className="totals-row">
                  <span className="totals-label">Subtotal</span>
                  <span className="totals-value">
                    {subtotal.toFixed(2)} AED
                  </span>
                </div>

                <div className="totals-row">
                  <span className="totals-label">Shipping</span>
                  <div className="shipping-info">
                    <span className="free-shipping">Free shipping</span>
                    <small className="shipping-note">
                      Shipping options will be updated during checkout.
                    </small>
                  </div>
                </div>

                <div className="totals-row">
                  <span className="totals-label">VAT</span>
                  <span className="totals-value">{vat.toFixed(2)} AED</span>
                </div>

                <div className="totals-row total-row">
                  <span className="totals-label">Total</span>
                  <span className="totals-value total-amount">
                    {total.toFixed(2)} AED
                  </span>
                </div>

                <button
                  className="proceed-checkout-btn"
                  onClick={handleProceedToCheckout}
                >
                  PROCEED TO CHECKOUT
                </button> 
              </div>
            </div>
          </div>
        )}

        {step === "checkout" && (
          <Checkout
            onPlaceOrder={handlePlaceOrder}
            details={transactionDetails}
            goToCart={() => setStep("cart")}
          />
        )}

        {step === "orderComplete" && <OrderComplete orderId={orderResp}/>}
      </div>

      <BottomNavigation
        cartCount={cartItems.length}
        wishlistCount={wishlist.length}
        cartItems={cartItems}
        onCartUpdate={() => {
          // Refetch cart data when updated from slide cart
          const fetchCart = async () => {
            try {
              const res = await getCartist();
              const parsedResult = JSON.parse(res.result);
              if (parsedResult?.Data) {
                const mappedItems = parsedResult.Data.map((item, index) => ({
                  id: item.TransId || index,
                  transId: item.TransId,
                  productId: item.Product,
                  name: item.Product_Name || "Unnamed Product",
                  price: item.Rate || 0,
                  quantity: item.Quantity || 1,
                  image: "/api/placeholder/60/60",
                }));
                setCartItems(mappedItems);
                setOriginalCartItems(mappedItems);
              }
            } catch (error) {
              console.error("Error fetching cart:", error);
            }
          };
          fetchCart();
        }}
      />
    </div>
  );
};

export default Cart;
