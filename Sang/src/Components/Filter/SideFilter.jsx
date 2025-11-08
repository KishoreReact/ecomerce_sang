import React, { useState, useEffect } from "react";
import "./SideFilter.css";
import { getTagList, getSubCategoryByCategory, getBrandsByCategory } from "../../redux/services/productService";

const SideFilter = ({ isOpen, onClose, selectedCategoryId, selectedSubCategoryIds, selectedBrandIds, onCategorySelect, onSubCategoryToggle, onBrandToggle, onPriceRangeChange, onStockStatusChange }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // ✅ Price Range
  const [priceRange, setPriceRange] = useState([0, 74136]);
  const [maxPrice] = useState(741362);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getTagList(3004);
        const parsed = JSON.parse(res?.result);
        setCategories(parsed);

        // Auto-select first category if available
        // if (parsed.length > 0 && !selectedCategoryId) {
        //   onCategorySelect(parsed[0]);
        // }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch brands based on selected category
  useEffect(() => {
  const fetchBrands = async () => {
    try {
      if (!selectedCategoryId) {
        // No category selected → fetch all brands
        const res = await getBrandsByCategory();
        const parsed = JSON.parse(res.result);
        setBrands(parsed);
      } else {
        // Category selected → fetch brands by category
        const res = await getBrandsByCategory(selectedCategoryId);
        const parsed = JSON.parse(res.result);
        setBrands(parsed);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  fetchBrands();
}, [selectedCategoryId]);


  const toggleCategory = async (category) => {
    const isExpanded = expandedCategories[category.Id];
    setExpandedCategories((prev) => ({
      ...prev,
      [category.Id]: !isExpanded,
    }));

    if (!isExpanded && !category.subcategories) {
      try {
        const res = await getSubCategoryByCategory(category.Id);
        const parsed1 = JSON.parse(res.result);
        const parsed2 = JSON.parse(parsed1[0].data);
        const subcats = parsed2[0].SubCategories || [];

        setCategories((prev) =>
          prev.map((c) =>
            c.Id === category.Id ? { ...c, subcategories: subcats } : c
          )
        );
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }
  };

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
  };

  const handleSubCategoryToggle = (sub) => {
    onSubCategoryToggle(sub);
  };

  const handleBrandToggle = (brand) => {
    onBrandToggle(brand);
  };

  // ✅ Handle Price Change
  const handlePriceChange = (index, value) => {
    const updated = [...priceRange];
    updated[index] = Number(value);
    setPriceRange(updated);
  };

  const applyPriceFilter = () => {
    if (onPriceRangeChange) {
      onPriceRangeChange(priceRange);
    }
  };

  const handleStockStatusToggle = () => {
    const newInStockOnly = !inStockOnly;
    setInStockOnly(newInStockOnly);
    if (onStockStatusChange) {
      onStockStatusChange(newInStockOnly);
    }
  };

  return (
    <div className={`side-filter ${isOpen ? 'mobile-open' : ''}`}>
  <div className="stock-status">
    <h3 className="filter-title">STOCK STATUS</h3>

    <button
      className={`stock-btn ${inStockOnly ? "active" : ""}`}
      onClick={handleStockStatusToggle}
    >
      {!inStockOnly ? "In Stock": "Show All"}
    </button>
  </div>

      <div className="filter-section">
        <h3 className="filter-title">PRODUCT CATEGORIES</h3>
        <div className="categories-list">
          {categories.map((category) => (
            <div key={category.Id} className="category-item">
              <div className="category-header">
                <label className="category-label">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategoryId === category.Id}
                    onChange={() => handleCategorySelect(category)}
                  />
                  <span>{category.Name} ({category.ProductCount || 0})</span>
                </label>
                <button
                  className={`toggle-btn ${
                    expandedCategories[category.Id] ? "expanded" : ""
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {expandedCategories[category.Id] ? "−" : "+"}
                </button>
              </div>

              {expandedCategories[category.Id] &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                  <div className="subcategories">
                    {category.subcategories.map((sub) => (
                      <label key={sub.Id} className="subcategory-item">
                        <input
                          type="checkbox"
                          checked={selectedSubCategoryIds.includes(sub.Id)}
                          onChange={() => handleSubCategoryToggle(sub)}
                        />
                        <span>{sub.Name} ({sub.ProductCount || 0})</span>
                      </label>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">BRANDS</h3>
        <div className="brands-list">
          {brands.map((brand) => (
            <label key={brand.BrandId} className="brand-item">
              <input
                type="checkbox"
                checked={selectedBrandIds.includes(brand.BrandId)}
                onChange={() => handleBrandToggle(brand)}
              />
              <span>{brand.BrandName}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="price-range-container">
  <div className="slider-values">
    <span className="min-val">AED {priceRange[0]}</span>
    <span className="max-val">AED {priceRange[1]}</span>
  </div>

  <div className="range-slider-container">
    <div
      className="range-track"
      style={{
        left: `${(priceRange[0] / maxPrice) * 100}%`,
        width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`,
      }}
    ></div>

    <input
      type="range"
      min="0"
      max={maxPrice}
      value={priceRange[0]}
      onChange={(e) => handlePriceChange(0, e.target.value)}
      className="range-thumb"
    />
    <input
      type="range"
      min="0"
      max={maxPrice}
      value={priceRange[1]}
      onChange={(e) => handlePriceChange(1, e.target.value)}
      className="range-thumb"
    />
  </div>

  <div className="price-inputs">
    <span>AED</span>
    <input
      type="number"
      value={priceRange[0]}
      onChange={(e) => handlePriceChange(0, e.target.value)}
    />
    <span>-</span>
    <input
      type="number"
      value={priceRange[1]}
      onChange={(e) => handlePriceChange(1, e.target.value)}
    />
  </div>

  <button className="filter-btn" onClick={applyPriceFilter}>
    FILTER
  </button>
</div>

    </div>
  );
};

export default SideFilter;
