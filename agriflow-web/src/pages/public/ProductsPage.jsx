import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts, setSearchQuery } from "../../features/products/productSlice";
import {
    selectAllProducts,
    selectProductsLoading,
    selectProductsError,
    selectProductsPagination,
    selectSearchQuery,
} from "../../features/products/productSelectors";

/* ─── helpers ──────────────────────────────────────────────────────────────── */
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

function ProductCard({ product }) {
    return (
        <Link
            to={`/products/${product.id}`}
            className="agri-card"
            style={{ textDecoration: "none" }}
            id={`product-card-${product.id}`}
        >
            <div className="agri-card-img-wrap">
                <img
                    src={product.image || PLACEHOLDER_IMG}
                    alt={product.name}
                    className="agri-card-img"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                />
                {product.is_available === false && (
                    <span className="agri-badge agri-badge-out">Out of stock</span>
                )}
                {product.is_available !== false && (
                    <span className="agri-badge agri-badge-in">Available</span>
                )}
            </div>
            <div className="agri-card-body">
                <h3 className="agri-card-title">{product.name}</h3>
                <p className="agri-card-desc">{product.description}</p>
                <div className="agri-card-footer">
                    <span className="agri-price">
                        {product.price != null
                            ? `${parseFloat(product.price).toFixed(2)} MAD`
                            : "—"}
                    </span>
                    <span className="agri-card-farmer">
                        🌾 {product.farmer_name || product.farmer || "Farmer"}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function SkeletonCard() {
    return (
        <div className="agri-card agri-skeleton">
            <div className="agri-skeleton-img" />
            <div className="agri-card-body">
                <div className="agri-skeleton-line w-70" />
                <div className="agri-skeleton-line w-90" />
                <div className="agri-skeleton-line w-40" />
            </div>
        </div>
    );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function ProductsPage() {
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const pagination = useSelector(selectProductsPagination);
    const searchQuery = useSelector(selectSearchQuery);

    const [localSearch, setLocalSearch] = useState(searchQuery || "");
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchProducts({ page, search: localSearch }));
    }, [dispatch, page]);

    function handleSearch(e) {
        e.preventDefault();
        dispatch(setSearchQuery(localSearch));
        setPage(1);
        dispatch(fetchProducts({ page: 1, search: localSearch }));
    }

    return (
        <>
            {/* ── Inline styles (self-contained, no external CSS file needed) ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .agri-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #0a1628 0%, #0d2b1a 50%, #0a1628 100%);
                    font-family: 'Inter', sans-serif;
                    color: #e2e8f0;
                }

                /* ── Hero banner ── */
                .agri-hero {
                    position: relative;
                    padding: 4rem 2rem 3rem;
                    text-align: center;
                    overflow: hidden;
                }
                .agri-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.18) 0%, transparent 70%);
                    pointer-events: none;
                }
                .agri-hero-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: .45rem;
                    background: rgba(34,197,94,.12);
                    border: 1px solid rgba(34,197,94,.3);
                    border-radius: 999px;
                    padding: .35rem 1rem;
                    font-size: .78rem;
                    font-weight: 600;
                    color: #4ade80;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                    margin-bottom: 1.2rem;
                }
                .agri-hero h1 {
                    font-size: clamp(2rem, 5vw, 3.2rem);
                    font-weight: 800;
                    background: linear-gradient(135deg, #ffffff 0%, #4ade80 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 .8rem;
                    line-height: 1.15;
                }
                .agri-hero p {
                    color: #94a3b8;
                    font-size: 1.05rem;
                    max-width: 520px;
                    margin: 0 auto 2.2rem;
                }

                /* ── Search bar ── */
                .agri-search-form {
                    display: flex;
                    max-width: 540px;
                    margin: 0 auto;
                    gap: .6rem;
                }
                .agri-search-input {
                    flex: 1;
                    padding: .85rem 1.2rem;
                    border-radius: 12px;
                    border: 1.5px solid rgba(255,255,255,.12);
                    background: rgba(255,255,255,.07);
                    color: #fff;
                    font-size: .95rem;
                    font-family: inherit;
                    outline: none;
                    transition: border-color .2s, background .2s;
                }
                .agri-search-input::placeholder { color: #64748b; }
                .agri-search-input:focus {
                    border-color: #4ade80;
                    background: rgba(74,222,128,.07);
                }
                .agri-search-btn {
                    padding: .85rem 1.6rem;
                    border-radius: 12px;
                    border: none;
                    background: linear-gradient(135deg, #16a34a, #22c55e);
                    color: #fff;
                    font-weight: 700;
                    font-size: .95rem;
                    cursor: pointer;
                    transition: transform .15s, box-shadow .15s;
                    font-family: inherit;
                }
                .agri-search-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(34,197,94,.35);
                }

                /* ── Main content wrapper ── */
                .agri-content {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 1.5rem 4rem;
                }

                /* ── Stats bar ── */
                .agri-stats {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: .8rem 0 1.6rem;
                    border-bottom: 1px solid rgba(255,255,255,.08);
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: .6rem;
                }
                .agri-stats-count { font-size: .92rem; color: #64748b; }
                .agri-stats-count span { color: #4ade80; font-weight: 700; }

                /* ── Grid ── */
                .agri-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
                    gap: 1.6rem;
                }

                /* ── Product card ── */
                .agri-card {
                    background: rgba(255,255,255,.04);
                    border: 1px solid rgba(255,255,255,.09);
                    border-radius: 18px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: transform .22s, border-color .22s, box-shadow .22s;
                    cursor: pointer;
                }
                .agri-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(74,222,128,.4);
                    box-shadow: 0 20px 48px rgba(0,0,0,.45), 0 0 0 1px rgba(74,222,128,.15);
                }
                .agri-card-img-wrap {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }
                .agri-card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform .4s;
                }
                .agri-card:hover .agri-card-img { transform: scale(1.07); }
                .agri-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: .7rem;
                    font-weight: 700;
                    padding: .28rem .72rem;
                    border-radius: 999px;
                    letter-spacing: .05em;
                }
                .agri-badge-in {
                    background: rgba(34,197,94,.18);
                    border: 1px solid rgba(34,197,94,.45);
                    color: #4ade80;
                }
                .agri-badge-out {
                    background: rgba(239,68,68,.18);
                    border: 1px solid rgba(239,68,68,.4);
                    color: #f87171;
                }
                .agri-card-body {
                    padding: 1.1rem 1.2rem 1.2rem;
                    display: flex;
                    flex-direction: column;
                    gap: .4rem;
                    flex: 1;
                }
                .agri-card-title {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #f1f5f9;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .agri-card-desc {
                    font-size: .85rem;
                    color: #64748b;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.5;
                }
                .agri-card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: .6rem;
                    padding-top: .7rem;
                    border-top: 1px solid rgba(255,255,255,.07);
                }
                .agri-price {
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: #4ade80;
                }
                .agri-card-farmer {
                    font-size: .78rem;
                    color: #94a3b8;
                }

                /* ── Skeleton loader ── */
                .agri-skeleton { cursor: default; pointer-events: none; }
                .agri-skeleton-img {
                    height: 200px;
                    background: linear-gradient(90deg,rgba(255,255,255,.05) 25%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.05) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                .agri-skeleton-line {
                    height: 14px;
                    border-radius: 8px;
                    background: linear-gradient(90deg,rgba(255,255,255,.05) 25%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.05) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    margin-bottom: .6rem;
                }
                .w-70 { width: 70%; }
                .w-90 { width: 90%; }
                .w-40 { width: 40%; }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* ── Empty / Error states ── */
                .agri-state-box {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 5rem 2rem;
                }
                .agri-state-icon { font-size: 3.5rem; margin-bottom: 1rem; }
                .agri-state-box h2 { font-size: 1.3rem; color: #f1f5f9; margin: 0 0 .5rem; }
                .agri-state-box p { color: #64748b; font-size: .9rem; }

                /* ── Pagination ── */
                .agri-pagination {
                    display: flex;
                    justify-content: center;
                    gap: .5rem;
                    margin-top: 3rem;
                    flex-wrap: wrap;
                }
                .agri-page-btn {
                    min-width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1.5px solid rgba(255,255,255,.1);
                    background: rgba(255,255,255,.05);
                    color: #cbd5e1;
                    font-weight: 600;
                    font-size: .88rem;
                    cursor: pointer;
                    transition: all .18s;
                    font-family: inherit;
                    padding: 0 .8rem;
                }
                .agri-page-btn:hover:not(:disabled) {
                    border-color: #4ade80;
                    color: #4ade80;
                    background: rgba(74,222,128,.08);
                }
                .agri-page-btn.active {
                    background: linear-gradient(135deg, #16a34a, #22c55e);
                    border-color: transparent;
                    color: #fff;
                }
                .agri-page-btn:disabled { opacity: .35; cursor: not-allowed; }
            `}</style>

            <div className="agri-page">
                {/* ── Hero ── */}
                <header className="agri-hero">
                    <div className="agri-hero-tag">
                        <span>🌿</span> Fresh from the Farm
                    </div>
                    <h1>AgriFlow Marketplace</h1>
                    <p>Discover premium agricultural products, harvested fresh and delivered directly to you.</p>

                    {/* Search */}
                    <form className="agri-search-form" onSubmit={handleSearch} id="product-search-form">
                        <input
                            id="product-search-input"
                            type="text"
                            className="agri-search-input"
                            placeholder="Search products, categories…"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                        <button type="submit" className="agri-search-btn" id="product-search-btn">
                            Search
                        </button>
                    </form>
                </header>

                {/* ── Content ── */}
                <main className="agri-content">
                    {/* Stats bar */}
                    <div className="agri-stats">
                        <p className="agri-stats-count">
                            {loading ? "Loading…" : (
                                <>Showing <span>{products.length}</span>
                                    {pagination.totalItems > 0 && <> of <span>{pagination.totalItems}</span></>} products
                                </>
                            )}
                        </p>
                    </div>

                    {/* Error */}
                    {error && !loading && (
                        <div className="agri-grid">
                            <div className="agri-state-box">
                                <div className="agri-state-icon">⚠️</div>
                                <h2>Something went wrong</h2>
                                <p>{typeof error === "string" ? error : "Failed to load products. Please try again."}</p>
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    {!error && (
                        <div className="agri-grid">
                            {loading
                                ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                                : products.length === 0
                                    ? (
                                        <div className="agri-state-box">
                                            <div className="agri-state-icon">🌱</div>
                                            <h2>No products found</h2>
                                            <p>Try a different search term or check back later.</p>
                                        </div>
                                    )
                                    : products.map((p) => <ProductCard key={p.id} product={p} />)
                            }
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && pagination.totalPages > 1 && (
                        <nav className="agri-pagination" aria-label="Product pages">
                            <button
                                className="agri-page-btn"
                                id="pagination-prev"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                ← Prev
                            </button>

                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    id={`pagination-page-${n}`}
                                    className={`agri-page-btn${page === n ? " active" : ""}`}
                                    onClick={() => setPage(n)}
                                >
                                    {n}
                                </button>
                            ))}

                            <button
                                className="agri-page-btn"
                                id="pagination-next"
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next →
                            </button>
                        </nav>
                    )}
                </main>
            </div>
        </>
    );
}
