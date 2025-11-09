import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../Components/Header/Header";
import ShopBanner from "../../Components/Banner/Banner";
import Footer from '../../Components/Footer/Footer';
import './ProductDetails.css';
import BottomNavigation from '../../Components/BottomMenu/BottomNavigation';
import { addToWishlist, addToCart, getWishist, getCartist } from "../../redux/services/productService";

const ProductDetails = () => {
  const { state } = useLocation();
  const product = state?.product; // ✅ this is the clicked product

  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
const [userId, setUserId] = useState(null);
const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();


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

  useEffect(() => {
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
          setCartCount(mappedItems.length);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
    }, []);
  
    const handleAddToWishlist = async (product) => {
      try {
        const payload = {
          transId: 0,
          product: product.Id,
          quantity: 1,
          customer: userId,
          remarks: "",
          be: 0,
          rate:product.Rate
        };
        await addToWishlist(payload);
        setWishlist([...wishlist, { Product: product.Id }]);
      } catch (err) {
        console.error("Error adding to wishlist:", err);
      }
    };
  
    const handleAddToCart = async (product) => {
      try {
        const payload = {
          transId: 0,
          date: new Date().toISOString().split("T")[0],
          customer: userId,
          warehouse: 2,
          remarks: "",
          discountType: 1,
          discountCouponRef: "ref01",
          discountRef: "Ref809",
          sampleRequestedBy: 1,
          product: product.Id,
          qty: quantity,
          rate: product.Rate || 1,
          unit: 1,
          totalRate: (product.Rate || 1) * quantity,
          addCharges: 0,
          discount: 0,
          discountAmt: 0,
          discountRemarks: "",
          be: 0,
        };
        await addToCart(payload);
        const newCart = [...cartItems, { productId: product.Id }];
        setCartItems(newCart);
        setCartCount(newCart.length);
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    };

    const updateQuantity = (newQuantity) => {
      if (newQuantity >= 1 && newQuantity <= product.Stock) {
        setQuantity(newQuantity);
      }
    };
  
    if (!product) {
      return <p style={{ textAlign: "center", margin: "50px" }}>No product selected</p>;
    }
  
    const inWishlist = wishlist.some((w) => w.Product === product.Id);
    const inCart = cartItems.some((c) => c.productId === product.Id);
  
    return (
      <>
        <Header />
        <ShopBanner
          header=""
          badgeText="Product details"
          subheader=""
          backgroundImage="/banner.jpg"
          height="94px"
        />
  
        <div className="product-details-container">
          {/* Breadcrumb Navigation */}
          <div className="product-breadcrumb">
            <button
              className="breadcrumb-back-btn"
              onClick={() => navigate('/shop')}
            >
              ← Back to Products
            </button>
          </div>

          <div className="product-layout">
            {/* Left Side - Image */}
            <div className="product-image-section">
              {product.sale && (
                <div className="discount-badge">-{product.sale}%</div>
              )}
              {product.Stock === 0 && (
                <div className="sold-out-badge">SOLD<br />OUT</div>
              )}
              <div className="product-image-wrapper">
                <img
                  src={product.Image || "/api/placeholder/400/400"}
                  alt={product.Name}
                  className="product-image5"
                />
              </div>
            </div>
  
            {/* Right Side - Details */}
            <div className="product-info-section">
              <h1 className="product-title">{product.Name}</h1>
  {product ? (
                  <>
                    {/* <span className="original-price" style={{fontSize: '20px', margin: '5px'}}>
                      AED {(product.Rate + 20).toFixed(2)}
                    </span> */}
                    <span className="current-price" style={{fontSize: '25px'}}>
                      AED {product.Rate.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="current-price"  style={{fontSize: '25px'}}>
                    AED {product.Rate.toFixed(2)}
                  </span>
                )}
              {/* Quantity Selector */}
              <div className="quantity-selector">
                <label className="quantity-label">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn quantity-decrement"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="quantity-btn quantity-increment"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= product.Stock}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="quantity-selector">
                <label className="quantity-label">Available Quantity:</label>
                <div className="quantity-label">
                  {product.Stock} 
                </div>
              </div>

              {/* Price Section */}
              <div className="price-section">
                {inWishlist ? (
                  <button className="product-details-added-btn">❤️ Wishlist Added</button>
                ) : (
                  <button className="product-details-wishlist-btn" onClick={() => handleAddToWishlist(product)}>❤️ Add to wishlist</button>
                )}
                {inCart ? (
                  <button className="product-details-added-btn">✅ IN Cart</button>
                ) : (
                  <button className="product-details-add-to-cart" onClick={() => handleAddToCart(product)}>🛒 Add to Cart</button>
                )}
                <button className="product-details-compare-btn">🔄 Compare</button>
              </div>

            {/* Product Meta */}
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">SKU:</span>
                <span className="meta-value">{product.Id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.CategoryName || "N/A"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">SubCategory:</span>
                <span className="meta-value">{product.SubCategoryName || "General"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Description:</span>
                <span className="meta-value">{product.ExtraDescription || "General"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
                     <BottomNavigation
                       cartCount={cartCount}
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
                               setCartCount(mappedItems.length);
                             }
                           } catch (error) {
                             console.error("Error fetching cart:", error);
                           }
                         };
                         fetchCart();
                       }}
                     />

      <Footer />
    </>
  );
};

export default ProductDetails;
