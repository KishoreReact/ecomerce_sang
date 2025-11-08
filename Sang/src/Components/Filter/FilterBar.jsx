import React, { useState, useEffect } from 'react';
import './FilterBar.css';
import { getTagList } from "../../redux/services/productService";


const FilterBar = ({ onSortChange, onPriceRangeChange, searchQuery = "" , onFilterChange, totalRows = 0, currentPage = 1, pageSize = 12, onMobileFilterToggle, isFilterOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState('all');
    const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);


  useEffect(() => {
      const fetchBrands = async () => {
        try {
          const res = await getTagList(3008);
          const parsed = JSON.parse(res.result);
          setBrands(parsed);
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      };
  
      fetchBrands();
    }, []);

    const handleBrandToggle = (brand) => {
    const isSelected = selectedBrands.some((b) => b.Id === brand.Id);
    const newSelection = isSelected
      ? selectedBrands.filter((b) => b.Id !== brand.Id)
      : [...selectedBrands, brand];

    setSelectedBrands(newSelection);
    onFilterChange({
      brandIds: newSelection.map((b) => b.Id),
    });
  };

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    onSortChange(e.target.value);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPriceRange(value);

    // Convert price range string to min/max values
    let minPrice, maxPrice;
    switch (value) {
      case '0-185340':
        minPrice = 0;
        maxPrice = 185340;
        break;
      case '185340-370680':
        minPrice = 185340;
        maxPrice = 370680;
        break;
      case '370680-556020':
        minPrice = 370680;
        maxPrice = 556020;
        break;
      case '556020-741360':
        minPrice = 556020;
        maxPrice = 741360;
        break;
      case '741360+':
        minPrice = 741360;
        maxPrice = undefined; // No upper limit
        break;
      case 'all':
      default:
        minPrice = undefined;
        maxPrice = undefined;
        break;
    }

    if (onPriceRangeChange) {
      onPriceRangeChange({ minPrice, maxPrice });
    }
  };

  return (
    <div className="filter-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => window.location.href = '/home'}>Home</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Shop</span>
        </div>

        <div className="display-controls">
         {searchQuery ? (
           <span className="search-result-text">
             Showing results for <strong>"{searchQuery}"</strong>
           </span>
         ) : (
           <span>Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalRows)} of {totalRows} results</span>
         )}
          <div className="view-options">
            {/* <button className="view-btn">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="2" y="2" width="6" height="6" fill="currentColor"/>
                <rect x="12" y="2" width="6" height="6" fill="currentColor"/>
                <rect x="2" y="12" width="6" height="6" fill="currentColor"/>
                <rect x="12" y="12" width="6" height="6" fill="currentColor"/>
              </svg>
            </button> */}
            <button className="view-btn active">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="2" y="2" width="5" height="5" fill="currentColor"/>
                <rect x="9" y="2" width="5" height="5" fill="currentColor"/>
                <rect x="16" y="2" width="2" height="5" fill="currentColor"/>
                <rect x="2" y="9" width="5" height="5" fill="currentColor"/>
                <rect x="9" y="9" width="5" height="5" fill="currentColor"/>
                <rect x="16" y="9" width="2" height="5" fill="currentColor"/>
                <rect x="2" y="16" width="5" height="2" fill="currentColor"/>
                <rect x="9" y="16" width="5" height="2" fill="currentColor"/>
                <rect x="16" y="16" width="2" height="2" fill="currentColor"/>
              </svg>
            </button>
            {/* <button className="view-btn">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="2" y="2" width="16" height="3" fill="currentColor"/>
                <rect x="2" y="8" width="16" height="3" fill="currentColor"/>
                <rect x="2" y="14" width="16" height="3" fill="currentColor"/>
              </svg>
            </button> */}
          </div>

          <button
            className="mobile-filter-toggle"
            onClick={onMobileFilterToggle}
          >
            {isFilterOpen ? '✕' : '☰'} Filters
          </button>

          <button className="filters-btn" onClick={toggleFilters}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="16" y2="6"/>
              <line x1="4" y1="10" x2="16" y2="10"/>
              <line x1="4" y1="14" x2="16" y2="14"/>
              <circle cx="8" cy="6" r="2" fill="white"/>
              <circle cx="12" cy="10" r="2" fill="white"/>
              <circle cx="10" cy="14" r="2" fill="white"/>
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
{isOpen && (
        <div className="filter-panel">
          {/* SORT BY */}
          <div className="filter-section2">
            <h3 className="filter-heading">SORT BY</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="sort"
                  value="popularity"
                  checked={sortBy === 'popularity'}
                  onChange={handleSortChange}
                />
                <span>Popularity</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="sort"
                  value="newness"
                  checked={sortBy === 'newness'}
                  onChange={handleSortChange}
                />
                <span>Newness</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="sort"
                  value="priceLowHigh"
                  checked={sortBy === 'priceLowHigh'}
                  onChange={handleSortChange}
                />
                <span>Price: low to high</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="sort"
                  value="priceHighLow"
                  checked={sortBy === 'priceHighLow'}
                  onChange={handleSortChange}
                />
                <span>Price: high to low</span>
              </label>
            </div>
          </div>

          {/* PRICE FILTER */}
          <div className="filter-section2">
            <h3 className="filter-heading">PRICE FILTER</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="all"
                  checked={priceRange === 'all'}
                  onChange={handlePriceChange}
                />
                <span>All</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="0-185340"
                  checked={priceRange === '0-185340'}
                  onChange={handlePriceChange}
                />
                <span>0.00 AED - 185,340.00 AED</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="185340-370680"
                  checked={priceRange === '185340-370680'}
                  onChange={handlePriceChange}
                />
                <span>185,340.00 AED - 370,680.00 AED</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="370680-556020"
                  checked={priceRange === '370680-556020'}
                  onChange={handlePriceChange}
                />
                <span>370,680.00 AED - 556,020.00 AED</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="556020-741360"
                  checked={priceRange === '556020-741360'}
                  onChange={handlePriceChange}
                />
                <span>556,020.00 AED - 741,360.00 AED</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="741360+"
                  checked={priceRange === '741360+'}
                  onChange={handlePriceChange}
                />
                <span>741,360.00 AED +</span>
              </label>
            </div>
          </div>
          <div className="filter-section2">
        <h3 className="filter-heading">BRANDS</h3>
        <div className="filter-options2">
          {brands.map((brand) => (
            <label key={brand.Id} className="brand-item">
              <input
                type="checkbox"
                checked={selectedBrands.some((b) => b.Id === brand.Id)}
                onChange={() => handleBrandToggle(brand)}
              />
              <span>{brand.Name}</span>
            </label>
          ))}
        </div>
      </div>
        </div>
      )}

      

    </div>
  );
};

export default FilterBar;