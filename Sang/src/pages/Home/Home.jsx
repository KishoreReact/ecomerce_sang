import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart,Shuffle, Maximize } from 'lucide-react';
import './Home.css';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer'
import SearchHeader from '../../Components/Header/SearchHeader';
import { getProducts, getTagList, getSubCategoryByCategory, getCartist, addToCart, addToWishlist, getWishist } from '../../redux/services/productService';
import { fetchCartCount, fetchWishlistCount } from '../../redux/actions/cartActions';
import BottomNavigation from '../../Components/BottomMenu/BottomNavigation';
import { showError } from '../../utils/alert';

const Home = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [currentSlide, setCurrentSlide] = useState(0);
        const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [brands, setBrands] = useState([]);
      const [cartCount, setCartCount] = useState(0);
      const [wishlist, setWishlist] = useState([]);
      const [cartItems, setCartItems] = useState([]);
      const [subCategories, setSubCategories] = useState([]);
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardsPerSlide = 4; // Number of cards visible at a time
      const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
 const [userId, setUserId] = useState(null);
 const [cartChange, setCartChange] = useState(false);
 const [cartTrigger, setCartTrigger] = useState(0);
 const [wishlistTrigger, setWishlistTrigger] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
 
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1025);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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




  // Categories (static)
  // const categories = [
  //   { name: 'CONSUMABLES', icon: '🔴', description: 'IV Cannulas' },
  //   { name: 'LAB CONSUMAB...', icon: '🔵', description: 'Ey Syringes' },
  //   { name: 'MEDICINES', icon: '🟡', description: 'Pharmaceuticals' },
  //   { name: 'BIOMEDICAL', icon: '⚪', description: 'Phy Equipments' },
  //   { name: 'DISPOSABLES', icon: '💉', description: 'Safety Products' },
  //   { name: 'OFFICE SUPPL...', icon: '📋', description: 'Stationery' },
  //   { name: 'DISINFECTANT', icon: '🧴', description: 'Sanitizers' }
  // ];

  // Brands (static)
  // const brands = [
  //   { name: 'Elckmeijer', logo: '/api/placeholder/120/60' },
  //   { name: 'Weinx Medical', logo: '/api/placeholder/120/60' },
  //   { name: 'Minitube', logo: '/api/placeholder/120/60' },
  //   { name: 'Syntex', logo: '/api/placeholder/120/60' },
  //   { name: 'Vetoquinol', logo: '/api/placeholder/120/60' },
  //   { name: 'Zoetis', logo: '/api/placeholder/120/60' }
  // ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({
          category: selectedCategory?.Id,
          subCategory: selectedSubCategory?.Id,
          itemBrand: selectedBrand?.Id,
          pageSize: 3,
        });
        const parsedResult = JSON.parse(res.result);
        setFeaturedProducts(parsedResult.Data || []);
        const gradients = [
          "linear-gradient(135deg, #FFA726 0%, #FF5722 100%)",
          "linear-gradient(135deg, #FFA726 0%, #FF5722 100%)",
          "linear-gradient(135deg, #FFA726 0%, #FF5722 100%)",

        ];
        setSlides(parsedResult.Data.slice(0,3).map((product, index) => ({
          id: product.Id,
          title: product.Name,
          price: `AED ${product.Rate.toFixed(2)}`,
          image: product.Image,
          description: product.Name,
          gradient: gradients[index] || gradients[0],
          product: product
        })));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubCategory, selectedBrand]);
useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartist();
        const parsedResult = JSON.parse(res.result);
        if (parsedResult?.Data) {
          const mappedItems = parsedResult.Data.map((item, index) => ({
            id: item.TransId || index,
            transId: item.TransId,
            productId: item.Product, // important for matching
            name: item.Product_Name || "Unnamed Product",
            price: item.Rate || 0,
            quantity: item.Quantity || 1,
            image: "/api/placeholder/60/60",
          }));
          setCartCount(mappedItems.length);
          setCartItems(mappedItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
   }, [cartChange]);

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
   }, [wishlistTrigger]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getTagList(3004); // or pass tagId if required
        // API returns stringified JSON inside result
        const parsedResult = JSON.parse(res?.result);
        setCategories(parsedResult);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
useEffect(() => {
  const fetchBrands = async () => {
    try {
      const res = await getTagList(3008); // or pass tagId if required
      // API returns stringified JSON inside result
      const parsedResult = JSON.parse(res.result);

      // Take only the first 10 items
      const firstTen = parsedResult.slice(0, 10);

      setBrands(firstTen);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  fetchBrands();
}, []);


  useEffect(() => {
    if (user) {
      dispatch(fetchCartCount());
      dispatch(fetchWishlistCount());
    }
  }, [user, dispatch]);
console.log("categories33",categories);

  useEffect(() => {
    if (!selectedCategory && categories.length === 0) return;

    const fetchSubCategories = async () => {
      try {
        const categoryId = selectedCategory?.Id || categories[0]?.Id;
        if (!categoryId) return;

        const res = await getSubCategoryByCategory(categoryId);
        // "result" is stringified, then "data" inside is also stringified → double parse
        const parsedResult = JSON.parse(res.result);

        const parsedData = JSON.parse(parsedResult[0].data);

        setSubCategories(parsedData[0].SubCategories || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories();
  }, [selectedCategory, categories]);

  // Auto slide functionality
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

const totalSlides = Math.ceil(featuredProducts.length / cardsPerSlide);

const nextSlide = () => {
  if (window.innerWidth <= 768) {
    // On mobile, scroll to next card smoothly
    const container = document.querySelector('.products-carousel-track');
    if (container) {
      const cardWidth = 290; // Approximate card width + margin
      container.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  } else {
    // On desktop, use slide index
    setCurrentIndex((prevIndex) =>
      prevIndex < totalSlides - 1 ? prevIndex + 1 : 0
    );
  }
};

const prevSlide = () => {
  if (window.innerWidth <= 768) {
    // On mobile, scroll to previous card smoothly
    const container = document.querySelector('.products-carousel-track');
    if (container) {
      const cardWidth = 290; // Approximate card width + margin
      container.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  } else {
    // On desktop, use slide index
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : totalSlides - 1
    );
  }
};

const nextHeroSlide = () => {
  setCurrentSlide((prev) => (prev + 1) % slides.length);
};

const prevHeroSlide = () => {
  setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
};

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
    setWishlist([...wishlist, { Product: product.Id }]); // update state
    setWishlistTrigger(prev => prev + 1); // Trigger wishlist count refresh
  } catch (err) {
    console.error("Error adding to wishlist:", err);
  }
};

const handleAddToCart = async (product) => {
  if (product.Stock === 0 || product.Stock === 0.0) {
    showError("Product is out of stock. Please try after the stock update.");
    return;
  }
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
      qty: 1,
      rate: product.Rate || 1,
      unit: 1,
      totalRate: product.Rate || 1,
      addCharges: 0,
      discount: 0,
      discountAmt: 0,
      discountRemarks: "",
      be: 0,
    };
    await addToCart(payload);
    const newCart = [...cartItems, { productId: product.Id }];
    setCartItems(newCart);
    setCartChange(!cartChange);
    setCartTrigger(prev => prev + 1); // Trigger cart count refresh
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};

  const brandColors = [
  "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"
];



  return (
    <div className="home-container">
      <Header />
      <SearchHeader
      categories={categories}
      selectedCategory={selectedCategory}
      cartTrigger={cartTrigger}
      wishlistTrigger={wishlistTrigger}
      onSearch={(q) => {
        navigate("/shop", {
          state: {
            query: q,
            category: selectedCategory,
          },
        });
      }}
      onCategoryChange={(category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
  }}/>
    
      {/* Hero Carousel */}
      {slides.length > 0 && (
      <section className="hero-carousel">
        <div className="carousel-container">
          <div
            className="carousel-slide"
            style={{ background: slides[currentSlide].gradient }}
          >
            <div key={currentSlide} className="slide-content">
              <div className="slide-image">
                <img src={slides[currentSlide].image} alt={slides[currentSlide].title} />
              </div>
              <div className="slide-text">
                <p className="slide-subtitle">New Available In Stock</p>
                <h1 className="slide-title">{slides[currentSlide].title}</h1>
                <p className="slide-price">{slides[currentSlide].price}</p>
                <button className="shop-now-btn" onClick={async () => { await handleAddToCart(slides[currentSlide]?.product); navigate('/cart'); }}>ADD TO CART</button>
              </div>

            </div>
          </div>

          <button className="carousel-btn prev-btn" onClick={prevHeroSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-btn next-btn" onClick={nextHeroSlide}>
            <ChevronRight size={24} />
          </button>

          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>
      )}
<div className='section-comb'>
      {/* Explore Categories */}
      <section className="explore-categories">
        <h2>Explore Categories</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div
              key={category.Id}
              className={`category-card ${selectedCategory?.Id === category.Id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedSubCategory(null); // reset subcategory
              }}
            >
              <h3>{category.Name}</h3>
            </div>

          ))}
        </div>
      </section>
      {/* Subcategories instead of hardcoded tabs */}
      {/* {selectedCategory && (
        <section className="subcategories">
          <div className="section-header">
            <h2>{selectedCategory.Name} - Subcategories</h2>
            <div className="product-tabs">
              {subCategories.map((sub) => (
                <button
                  key={sub.Id}
                  className={`tab-btn ${selectedSubCategory?.Id === sub.Id ? 'active' : ''}`}
                  onClick={() => setSelectedSubCategory(sub)}
                >
                  {sub.Name}
                </button>
              ))}

            </div>
          </div>
        </section>
      )} */}

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-header">
          <h2>FEATURED PRODUCTS</h2>
          <div className="product-tabs">
            {subCategories.map((sub) => (
            <button 
            className={`tab-btn ${selectedSubCategory?.Id === sub.Id ? 'active' : ''}`} 
            onClick={() => setSelectedSubCategory(sub)}>{sub.Name}</button>
            ))}
          </div>
        </div>

           
  <div className="carousel-wrapper">
    <div className="products-carousel-container">
      <div
        className="products-carousel-track"
        style={{
          transform: `translateX(-${currentIndex * (100 / cardsPerSlide)}%)`
        }}
      >
        {featuredProducts.map((product) => (
          <div key={product.Id} className="product-card" >
            {(product.Stock === 0 || product.Stock === 0.0) && (
      <div className="sold-out">Sold Out</div>
    )}
            <div className="product-image">
              <img src={product.Image} alt={product.Name} />
              <div className="product-overlay">
  <button className="overlay-btn" onClick={() => handleAddToCart(product)}><ShoppingCart size={20} /></button>
  {/* <button className="overlay-btn"><Search size={20} /></button> */}
  <button className="overlay-btn"><Shuffle size={20} /></button>
  <button className="overlay-btn" onClick={() => handleAddToWishlist(product)}><Heart size={20} /></button>
</div>

            </div>
            <div className="product-info">
              <h3>{product.Name}</h3>
              <div className="product-pricing">
                {/* <span className="old-price">AED {(product?.Rate + 20).toFixed(2)}</span> */}
                <span className="current-price">AED {product?.Rate?.toFixed(2)}</span>

                  <button 
    className="enlarge-btn"
    onClick={(e) => {
      e.stopPropagation(); // Prevent opening popup when clicking enlarge
      setSelectedProduct(product);
      setShowPopup(true);
    }}
  >
     <Maximize size={18} />Click to Enlarge
  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Navigation Buttons */}
    <button className="nav-btn left" onClick={prevSlide}>‹</button>
    <button className="nav-btn right" onClick={nextSlide}>›</button>

    {/* Dots */}
    <div className="dots">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <span
          key={index}
          className={`dot ${index === currentIndex ? "active" : ""}`}
          onClick={() => setCurrentIndex(index)}
        />
      ))}
    </div>
  </div>
</section>

      {/* Brands */}
<section className="brands" style={{width: isMobile ? "100%" : "74%"}}>
  <h2 className="brands-title">Brands</h2>
  <div className="brands-row">
    {brands.map((brand, index) => (
      <div
        key={brand.Id}
        className={`brand-card ${selectedBrand?.Id === brand.Id ? 'selected' : ''}`}
        style={{ backgroundColor: brandColors[index % brandColors.length] }}
        onClick={() => setSelectedBrand(brand)}
      >
        <span className="brand-name">{brand.Name}</span>
      </div>
    ))}
  </div>
</section>
</div>
        <BottomNavigation
          cartCount={cartCount}
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
                  setCartCount(mappedItems.length);
                }
              } catch (error) {
                console.error("Error fetching cart:", error);
              }
            };
            fetchCart();
            // Also update SearchHeader cart count
            setCartTrigger(prev => prev + 1);
          }}
        />

<Footer />

      {/* Product Details Popup */}
      {showPopup && selectedProduct && (
        <div className="home-product-details-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="home-product-details-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="home-product-details-popup-close" onClick={() => setShowPopup(false)}>×</button>
            <div className="home-product-details-popup-layout">
              {/* Left Side - Image */}
              <div className="home-product-details-popup-image-section">
                {selectedProduct.sale && (
                  <div className="home-product-details-popup-discount-badge">-{selectedProduct.sale}%</div>
                )}
                {selectedProduct.Stock === 0 && (
                  <div className="home-product-details-popup-sold-out-badge">SOLD<br />OUT</div>
                )}
                <div className="home-product-details-popup-image-wrapper">
                  <img
                    src={selectedProduct.Image || "/api/placeholder/400/400"}
                    alt={selectedProduct.Name}
                    className="home-product-details-popup-image"
                  />
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="home-product-details-popup-info-section">
                <h1 className="home-product-details-popup-title">{selectedProduct.Name}</h1>

                {/* Price Section */}
                <div className="home-product-details-popup-price-section">
                  {selectedProduct.sale ? (
                    <>
                      {/* <span className="home-product-details-popup-original-price">
                        AED {(selectedProduct.Rate + 20).toFixed(2)}
                      </span> */}
                      <span className="home-product-details-popup-current-price">
                        AED {selectedProduct.Rate.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="home-product-details-popup-current-price">
                      AED {selectedProduct.Rate.toFixed(2)}
                    </span>
                  )}
                  {wishlist.some((w) => w.Product === selectedProduct.Id) ? (
                    <button className="home-product-details-popup-added-btn">❤️ Wishlist Added</button>
                  ) : (
                    <button className="home-product-details-popup-wishlist-btn" onClick={() => handleAddToWishlist(selectedProduct)}>❤️ Add to wishlist</button>
                  )}
                  {cartItems.some((c) => c.productId === selectedProduct.Id) ? (
                    <button className="home-product-details-popup-added-btn">✅ In Cart</button>
                  ) : (
                    <button className="home-product-details-popup-add-to-cart" onClick={() => handleAddToCart(selectedProduct)}>🛒 Add to Cart</button>
                  )}
                  <button className="home-product-details-popup-compare-btn">🔄 Compare</button>
                </div>

                {/* Product Meta */}
                <div className="home-product-details-popup-meta">
                  <div className="home-product-details-popup-meta-item">
                    <span className="home-product-details-popup-meta-label">SKU:</span>
                    <span className="home-product-details-popup-meta-value">{selectedProduct.Id}</span>
                  </div>
                  <div className="home-product-details-popup-meta-item">
                    <span className="home-product-details-popup-meta-label">Category:</span>
                    <span className="home-product-details-popup-meta-value">{selectedProduct.CategoryName || "N/A"}</span>
                  </div>
                  <div className="home-product-details-popup-meta-item">
                    <span className="home-product-details-popup-meta-label">SubCategory</span>
                    <span className="home-product-details-popup-meta-value">{selectedProduct.SubCategoryName || "General"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
