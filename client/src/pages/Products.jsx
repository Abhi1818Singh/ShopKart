import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const debounceTimer = setTimeout(async () => {
            if (isMounted) {
                setLoading(true);
                setError('');
            }
            try {
                const params = {};
                if (searchTerm.trim()) {
                    params.search = searchTerm.trim();
                }
                if (selectedCategory && selectedCategory.trim()) {
                    params.category = selectedCategory.trim();
                }

                const response = await getProducts(params);

                if (isMounted) {
                    if (response.data && Array.isArray(response.data.products)) {
                        setProducts(response.data.products);
                    } else if (Array.isArray(response.data)) {
                        setProducts(response.data);
                    } else {
                        setProducts([]);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error loading products:', err);
                    setError('Something went wrong while loading products.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(debounceTimer);
        };
    }, [searchTerm, selectedCategory]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };

    return (
        <main className="page-container products-page">
            <header className="products-hero-header">
                <span className="section-eyebrow">Explore Catalogue</span>
                <h1 className="products-main-title">Discover Products</h1>
                <p className="products-subtitle">
                    Browse our curated collection of electronics, fashion, books, and home essentials.
                </p>
            </header>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            {/* Loading State */}
            {loading && (
                <div className="state-container loading-state" id="loading-state">
                    <div className="spinner" aria-hidden="true"></div>
                    <p className="state-message">Loading products...</p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="state-container error-state" id="error-state">
                    <div className="state-icon error-icon" aria-hidden="true">⚠️</div>
                    <p className="state-message">{error}</p>
                    <button
                        type="button"
                        className="btn-retry"
                        onClick={() => {
                            setLoading(true);
                            setError('');
                            getProducts({
                                search: searchTerm.trim() || undefined,
                                category: selectedCategory.trim() || undefined
                            })
                                .then((res) => {
                                    setProducts(res.data?.products || []);
                                })
                                .catch(() => {
                                    setError('Something went wrong while loading products.');
                                })
                                .finally(() => setLoading(false));
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
                <div className="state-container empty-state" id="empty-state">
                    <div className="state-icon empty-icon" aria-hidden="true">📦</div>
                    <p className="state-message">No products found.</p>
                    <p className="state-submessage">
                        Try adjusting your search terms or choosing another category.
                    </p>
                    {(searchTerm || selectedCategory) && (
                        <button
                            type="button"
                            className="btn-clear-filters"
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
                <div className="products-grid-wrapper">
                    <div className="products-meta-bar">
                        <span>Showing {products.length} {products.length === 1 ? 'product' : 'products'}</span>
                        {(searchTerm || selectedCategory) && (
                            <button
                                type="button"
                                className="filter-chip-clear"
                                onClick={handleClearFilters}
                            >
                                Reset Filters ✕
                            </button>
                        )}
                    </div>
                    <section className="products-grid" aria-label="Product list">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </section>
                </div>
            )}
        </main>
    );
};

export default Products;
