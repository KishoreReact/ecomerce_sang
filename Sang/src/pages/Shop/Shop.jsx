import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Heart, ShoppingCart, Maximize } from 'lucide-react';
import "./Shop.css";
import Header from "../../Components/Header/Header";
import { getProducts, addToWishlist, addToCart, getWishist, getCartist, getTagList } from "../../redux/services/productService";
import ShopBanner from "../../Components/Banner/Banner";
import BottomNavigation from "../../Components/BottomMenu/BottomNavigation";
import FilterBar from "../../Components/Filter/FilterBar";
import SearchHeader from "../../Components/Header/SearchHeader";
import SideFilter from "../../Components/Filter/SideFilter";
import { showError } from "../../utils/alert";

const Shop = () => {
      const navigate = useNavigate();
      const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    //const { query = "", category = null } = location.state || {};
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [sortOption, setSortOption] = useState('popularity');
   const [searchQuery, setSearchQuery] = useState("");
      const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


    const [categories, setCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [userId, setUserId] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 741362]);
  const [cartTrigger, setCartTrigger] = useState(0);
  const [wishlistTrigger, setWishlistTrigger] = useState(0);
  const [cartUpdateCallback, setCartUpdateCallback] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  //const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

useEffect(() => {
  const navEntries = window.performance.getEntriesByType('navigation');
  const isPageReload = navEntries.length && navEntries[0].type === 'reload';

  if (isPageReload) {
    // 🔄 Reset all states when page is refreshed
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSubCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 741362]);
    setSortOption('popularity');
    setCurrentPage(1);

    // Optional: clear URL state to prevent restoring filters
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [navigate, location.pathname]);

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

useEffect(() => {
  // Reset to initial state on mount, but set from location.state if present
  if (location.state) {
    setSearchQuery(location.state.query || "");
    setSelectedCategory(location.state.category || null);
  } else {
    setSearchQuery("");
    setSelectedCategory(null);
  }
  setSelectedSubCategories([]);
  setSelectedBrands([]);
  setPriceRange([0, 741362]);
  setSortOption('popularity');
  setCurrentPage(1);
}, [location.state]); // Runs only on mount


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getTagList(3004); 
        const parsedResult = JSON.parse(res?.result);
        setCategories(parsedResult);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
console.log("searchQuery123",searchQuery)
  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let sortColumn, isAscending;
        switch (sortOption) {
          case 'newness':
            sortColumn = 'Id';
            isAscending = true;
            break;
          case 'priceLowHigh':
            sortColumn = 'Rate';
            isAscending = true;
            break;
          case 'priceHighLow':
            sortColumn = 'Rate';
            isAscending = false;
            break;
          default:
            sortColumn = null;
            isAscending = undefined;
        }
        const res = await getProducts({
          pageSize: 12,
          pageNumber: currentPage,
          search: searchQuery,
          category: selectedCategory?.Id || null,   // ✅ Pass search query to API
          subCategory: selectedSubCategories.join(",") || null,
        itemBrand: selectedBrands.join(",") || null,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortColumn,
        isAscending,
        inStock: inStockOnly,
        });
        const parsedResult = JSON.parse(res.result);
        setProducts(parsedResult.Data || []);
        setTotalRows(parsedResult.PageSummary?.[0]?.TotalRows || 0);
        setTotalPages(parsedResult.PageSummary?.[0]?.TotalPages || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery, selectedCategory, selectedSubCategories, selectedBrands, priceRange, sortOption, inStockOnly, location.state]);

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
      // finally {
      //   setLoading(false);
      // }
    };

    fetchWishlist();
  }, [wishlistTrigger]);

  // fetch cart
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
          setCartItems(mappedItems);
          setCartCount(mappedItems.length);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [cartTrigger]);

  const handleAddToWishlist = async (product) => {
    try {
      const payload = {
        transId: 0,
        product: product.Id,
        quantity: 1,
        customer: userId,
        remarks: "",
        be: 0,
        rate: product.Rate
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
  
      setCartTrigger(prev => prev + 1); // Trigger cart count refresh
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

    const handleProductView = (product) => {
        navigate('/view', { state: { product } });
      }

      const filteredProducts = products;


  return (
    <>
      <Header />
      <SearchHeader
      categories={categories}
      initialQuery={searchQuery}
        selectedCategory={selectedCategory}
        cartTrigger={cartTrigger}
        wishlistTrigger={wishlistTrigger}
        onCartUpdate={(callback) => setCartUpdateCallback(() => callback)}
        onSearch={(q) => setSearchQuery(q)}
        onCategoryChange={(cat) => setSelectedCategory(cat)}/>
      <ShopBanner
        header=""
        badgeText="Shop"
        subheader=""
        backgroundImage="/banner.jpg"
        height="94px"
      />
<FilterBar
  key={location.state ? searchQuery : ""}
  onSortChange={(sort) => setSortOption(sort)}
  onPriceRangeChange={({ minPrice, maxPrice }) => {
    setPriceRange([minPrice || 0, maxPrice || 741362]);
  }}
    searchQuery={location.state ? searchQuery : ""}
  onFilterChange={({ brandIds }) => {
    setSelectedBrands(brandIds);
  }}
  totalRows={totalRows}
  currentPage={currentPage}
  pageSize={12}
  onMobileFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
  isFilterOpen={isFilterOpen}
/>
<div className="shop-container">

        <div className="shop-main" style={{display:'flex',height: isMobile ? "" : '1150px', position: 'relative'}}>
          <SideFilter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            selectedCategoryId={selectedCategory?.Id || null}
            selectedSubCategoryIds={selectedSubCategories}
            selectedBrandIds={selectedBrands}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              setSelectedSubCategories([]);
            }}
            onSubCategoryToggle={(sub) => {
              const isSelected = selectedSubCategories.includes(sub.Id);
              const newSelection = isSelected
                ? selectedSubCategories.filter((id) => id !== sub.Id)
                : [...selectedSubCategories, sub.Id];
              setSelectedSubCategories(newSelection);
            }}
            onBrandToggle={(brand) => {
              const isSelected = selectedBrands.includes(brand.BrandId);
              const newSelection = isSelected
                ? selectedBrands.filter((id) => id !== brand.BrandId)
                : [...selectedBrands, brand.BrandId];
              setSelectedBrands(newSelection);
            }}
            onPriceRangeChange={(range) => setPriceRange(range)}
            onStockStatusChange={(inStock) => setInStockOnly(inStock)}
          />

          {/* Mobile Overlay */}
          {isFilterOpen && (
            <div
              className="mobile-filter-overlay"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

        <div className="products-grid">
          {filteredProducts
            // ?.filter((product) => product.Stock > 0 || product.Stock === 0.0)
            .map((product) => {
              const inWishlist = wishlist.some((w) => w.Product === product.Id);
              const inCart = cartItems.some((c) => c.productId === product.Id);

              return (
                <div key={product.Id} className="product-card">
                  {product?.sale && (
                    <div className="sale-badge">-{product.sale}%</div>
                  )}
                  {(product.Stock === 0 || product.Stock === 0.0) && (
      <div className="sold-out">Sold Out</div>
    )}

                  <div className="product-image" >
                    <img src={product.Image} alt={product.Name}  onClick={() => handleProductView(product)}/>
                  </div>

                  <div className="product-actions">
                    {inCart ? (
                      <button className="added-btn">✅ In Cart</button>
                    ) : (
                      <button
                        className="add-to-cart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={20} />
                      </button>
                    )}

                    {inWishlist ? (
                      <button className="added-btn">❤️ Wishlist Added</button>
                    ) : (
                      <button
                        className="add-to-wishlist"
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <Heart size={20} />
                      </button>
                    )}
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.Name}</h3>
                    <p className="product-description">{product?.CategoryName }</p>
                    <p className="product-description2">{product?.SubCategoryName}</p>
                    <div className="product-price">
                      {product.sale ? (
                        <>
                          {/* <span className="original-price">
                            AED{(product?.Rate + 20).toFixed(2)}
                          </span> */}
                          <span className="sale-price">
                            AED{product?.Rate?.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="sale-price">
                          AED{product?.Rate?.toFixed(2)}
                        </span>
                      )}
                    </div>
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
              );
            })}
        </div>
        </div>

<div className="pagination">
  <div className="pagination-numbers">
    {(() => {
      const pages = [];
      const totalPagesToShow = totalPages;

      if (totalPagesToShow <= 10) {
        // Show all pages if total pages <= 10
        for (let i = 1; i <= totalPagesToShow; i++) {
          pages.push(i);
        }
      } else {
        // Show first 4, then ..., then last 4
        if (currentPage <= 5) {
          // Near the beginning
          for (let i = 1; i <= 7; i++) {
            pages.push(i);
          }
          pages.push('...');
          for (let i = totalPagesToShow - 2; i <= totalPagesToShow; i++) {
            pages.push(i);
          }
        } else if (currentPage >= totalPagesToShow - 4) {
          // Near the end
          for (let i = 1; i <= 3; i++) {
            pages.push(i);
          }
          pages.push('...');
          for (let i = totalPagesToShow - 6; i <= totalPagesToShow; i++) {
            pages.push(i);
          }
        } else {
          // In the middle
          for (let i = 1; i <= 3; i++) {
            pages.push(i);
          }
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          for (let i = totalPagesToShow - 2; i <= totalPagesToShow; i++) {
            pages.push(i);
          }
        }
      }

      return pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
        ) : (
          <span
            key={page}
            className={`page-number ${currentPage === page ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </span>
        )
      ));
    })()}
  </div>
</div>


        <div className="brand-logos">
          <div className="brand-logo">{''}</div>
          <div className="brand-logo active"> {''}</div>
          <div className="brand-logo"> {''}</div>
          <div className="brand-logo">{''} </div>
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
            if (cartUpdateCallback) {
              cartUpdateCallback();
            }
          }}
        />
      </div>

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
                    <span className="home-product-details-popup-meta-label">SubCategory:</span>
                    <span className="home-product-details-popup-meta-value">{selectedProduct.SubCategoryName || "General"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;