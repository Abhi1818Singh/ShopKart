import React from 'react';

const CATEGORIES = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Books',
    'Home'
];

const SearchBar = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange }) => {
    return (
        <section className="search-filter-section" aria-label="Search and Filter">
            <div className="search-input-wrapper">
                <svg
                    className="search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    id="search-input"
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search products"
                />
                {searchTerm && (
                    <button
                        type="button"
                        id="clear-search-btn"
                        className="search-clear-btn"
                        onClick={() => onSearchChange('')}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="category-select-wrapper">
                <select
                    id="category-select"
                    className="category-select"
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    aria-label="Filter products by category"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};

export default SearchBar;
