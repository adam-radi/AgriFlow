import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, clearSelectedProduct } from "../../features/products/productSlice";
import {
    selectSelectedProduct,
    selectProductsLoading,
    selectProductsError,
} from "../../features/products/productSelectors";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80";

function DetailRow({ icon, label, value }) {
    if (!value) return null;
    return (
        <div className="pd-detail-row">
            <span className="pd-detail-icon">{icon}</span>
            <div>
                <p className="pd-detail-label">{label}</p>
                <p className="pd-detail-value">{value}</p>
            </div>
        </div>
    );
}

export default function ProductDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const product = useSelector(selectSelectedProduct);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);

    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => dispatch(clearSelectedProduct());
    }, [dispatch, id]);

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="pd-page">
                <div className="pd-skeleton-page">
                    <div className="pd-sk pd-sk-img" />
                    <div className="pd-sk-body">
                        <div className="pd-sk pd-sk-line w80" />
                        <div className="pd-sk pd-sk-line w60" />
                        <div className="pd-sk pd-sk-line w90" />
                        <div className="pd-sk pd-sk-line w40" />
                    </div>
                </div>
            </div>
        </>
    );

    if (error || !product) return (
        <>
            <style>{styles}</style>
            <div className="pd-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌾</div>
                    <h2 style={{ color: "#f1f5f9", marginBottom: ".5rem" }}>Product not found</h2>
                    <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                        {typeof error === "string" ? error : "This product doesn't exist or has been removed."}
                    </p>
                    <Link to="/products" className="pd-btn-primary">← Back to Marketplace</Link>
                </div>
            </div>
        </>
    );

    const isAvailable = product.is_available !== false;
    const price = product.price != null ? `${parseFloat(product.price).toFixed(2)} MAD` : "Contact farmer";

    return (
        <>
            <style>{styles}</style>
            <div className="pd-page">

                {/* ── Back nav ── */}
                <div className="pd-topnav">
                    <button className="pd-back-btn" onClick={() => navigate(-1)} id="product-detail-back">
                        ← Back
                    </button>
                    <span className="pd-breadcrumb">
                        <Link to="/products">Marketplace</Link> / {product.name}
                    </span>
                </div>

                {/* ── Card ── */}
                <div className="pd-card">
                    {/* Image column */}
                    <div className="pd-img-col">
                        <div className="pd-img-wrap">
                            <img
                                src={product.image || PLACEHOLDER_IMG}
                                alt={product.name}
                                className="pd-img"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                            />
                            <span className={`pd-status-badge${isAvailable ? " available" : " out"}`}>
                                {isAvailable ? "✔ Available" : "✗ Out of stock"}
                            </span>
                        </div>
                    </div>

                    {/* Info column */}
                    <div className="pd-info-col">

                        {/* Category pill */}
                        {product.category && (
                            <span className="pd-category-pill">{product.category}</span>
                        )}

                        <h1 className="pd-title" id="product-detail-title">{product.name}</h1>

                        <p className="pd-price">{price}</p>

                        <p className="pd-description">{product.description || "No description provided."}</p>

                        <div className="pd-details-grid">
                            <DetailRow icon="🌾" label="Farmer" value={product.farmer_name || product.farmer} />
                            <DetailRow icon="📦" label="Standard Quantity" value={product.standard_quantity} />
                            <DetailRow icon="🗓️" label="Harvest Date" value={product.harvest_date} />
                            <DetailRow icon="📍" label="Location" value={product.location} />
                        </div>

                        {/* ── Upcoming Harvest Section ── */}
                        <div className="pd-harvest-section">
                            <h3 className="pd-harvest-section-title">🌿 Upcoming Harvest</h3>
                            <div className="pd-harvest-grid">
                                <div className="pd-harvest-item">
                                    <span className="pd-harvest-label">Next Date</span>
                                    <span className="pd-harvest-value">{product.next_harvest_date || product.harvest_date || "TBD"}</span>
                                </div>
                                <div className="pd-harvest-item">
                                    <span className="pd-harvest-label">Status</span>
                                    <span className={`pd-harvest-value${product.is_available === false ? " text-danger" : " text-success"}`}>
                                        {product.is_available === false ? "Unavailable" : "Available"}
                                    </span>
                                </div>
                                <div className="pd-harvest-item">
                                    <span className="pd-harvest-label">Est. Stock</span>
                                    <span className="pd-harvest-value">{(product.estimated_stock ?? product.standard_quantity) || "—"}</span>
                                </div>
                                <div className="pd-harvest-item">
                                    <span className="pd-harvest-label">Remaining</span>
                                    <span className="pd-harvest-value">{product.remaining_capacity ?? "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Harvest link */}
                        {product.harvest_link && (
                            <a
                                href={product.harvest_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pd-harvest-link"
                                id="product-harvest-link"
                            >
                                🌿 View Harvest Details ↗
                            </a>
                        )}

                        {/* CTA */}
                        <div className="pd-actions">
                            <button
                                className="pd-btn-primary"
                                disabled={!isAvailable}
                                id="product-order-btn"
                            >
                                {isAvailable ? "🛒 Order Now" : "Out of Stock"}
                            </button>
                            <Link to="/products" className="pd-btn-secondary" id="product-back-catalog">
                                Browse More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.pd-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #0a1628 0%, #0d2b1a 50%, #0a1628 100%);
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
    padding: 2rem 1.5rem 4rem;
}

/* ── Top nav ── */
.pd-topnav {
    max-width: 1100px;
    margin: 0 auto 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}
.pd-back-btn {
    background: rgba(255,255,255,.07);
    border: 1.5px solid rgba(255,255,255,.12);
    color: #94a3b8;
    padding: .5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: .88rem;
    font-weight: 600;
    transition: all .18s;
}
.pd-back-btn:hover { border-color: #4ade80; color: #4ade80; background: rgba(74,222,128,.07); }
.pd-breadcrumb { font-size: .83rem; color: #475569; }
.pd-breadcrumb a { color: #4ade80; text-decoration: none; }
.pd-breadcrumb a:hover { text-decoration: underline; }

/* ── Main card ── */
.pd-card {
    max-width: 1100px;
    margin: 0 auto;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,.5);
}
@media(max-width:768px) {
    .pd-card { grid-template-columns: 1fr; }
}

/* ── Image column ── */
.pd-img-col { position: relative; }
.pd-img-wrap { position: relative; height: 100%; min-height: 360px; }
.pd-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.pd-status-badge {
    position: absolute;
    top: 1.2rem;
    left: 1.2rem;
    font-size: .78rem;
    font-weight: 700;
    padding: .4rem 1rem;
    border-radius: 999px;
    letter-spacing: .04em;
}
.pd-status-badge.available {
    background: rgba(34,197,94,.18);
    border: 1px solid rgba(34,197,94,.4);
    color: #4ade80;
}
.pd-status-badge.out {
    background: rgba(239,68,68,.18);
    border: 1px solid rgba(239,68,68,.4);
    color: #f87171;
}

/* ── Info column ── */
.pd-info-col {
    padding: 2.5rem 2.2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.pd-category-pill {
    display: inline-block;
    background: rgba(74,222,128,.12);
    border: 1px solid rgba(74,222,128,.25);
    color: #4ade80;
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: .3rem .85rem;
    border-radius: 999px;
    align-self: flex-start;
}

.pd-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    color: #f1f5f9;
    margin: 0;
    line-height: 1.2;
}

.pd-price {
    font-size: 1.7rem;
    font-weight: 800;
    color: #4ade80;
    margin: 0;
}

.pd-description {
    font-size: .93rem;
    color: #94a3b8;
    line-height: 1.7;
    margin: 0;
}

/* ── Details grid ── */
.pd-details-grid {
    display: flex;
    flex-direction: column;
    gap: .8rem;
    padding: 1.2rem;
    background: rgba(255,255,255,.03);
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.07);
}
.pd-detail-row {
    display: flex;
    align-items: flex-start;
    gap: .85rem;
}
.pd-detail-icon { font-size: 1.1rem; margin-top: .1rem; flex-shrink: 0; }
.pd-detail-label { font-size: .75rem; color: #475569; margin: 0; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
.pd-detail-value { font-size: .9rem; color: #e2e8f0; margin: .1rem 0 0; font-weight: 500; }

/* ── Harvest section ── */
.pd-harvest-section {
    padding: 1.2rem;
    background: rgba(74,222,128,.06);
    border: 1px solid rgba(74,222,128,.18);
    border-radius: 14px;
}
.pd-harvest-section-title {
    font-size: .88rem;
    font-weight: 700;
    color: #4ade80;
    margin: 0 0 .8rem;
}
.pd-harvest-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .6rem;
}
.pd-harvest-item {
    display: flex;
    flex-direction: column;
    gap: .15rem;
}
.pd-harvest-label {
    font-size: .7rem;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: .06em;
    font-weight: 600;
}
.pd-harvest-value {
    font-size: .88rem;
    color: #e2e8f0;
    font-weight: 600;
}

/* ── Harvest link ── */
.pd-harvest-link {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    color: #4ade80;
    font-size: .88rem;
    font-weight: 600;
    text-decoration: none;
    padding: .6rem 1rem;
    border-radius: 10px;
    background: rgba(74,222,128,.08);
    border: 1px solid rgba(74,222,128,.2);
    transition: all .18s;
    align-self: flex-start;
}
.pd-harvest-link:hover {
    background: rgba(74,222,128,.16);
    border-color: rgba(74,222,128,.45);
}

/* ── Actions ── */
.pd-actions { display: flex; gap: .8rem; flex-wrap: wrap; margin-top: .4rem; }

.pd-btn-primary {
    flex: 1;
    min-width: 140px;
    padding: .9rem 1.6rem;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #16a34a, #22c55e);
    color: #fff;
    font-weight: 700;
    font-size: .95rem;
    cursor: pointer;
    transition: transform .15s, box-shadow .15s;
    font-family: inherit;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.pd-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(34,197,94,.35);
}
.pd-btn-primary:disabled {
    background: rgba(255,255,255,.07);
    cursor: not-allowed;
    color: #475569;
}

.pd-btn-secondary {
    flex: 1;
    min-width: 140px;
    padding: .9rem 1.6rem;
    border-radius: 12px;
    border: 1.5px solid rgba(255,255,255,.15);
    background: rgba(255,255,255,.05);
    color: #cbd5e1;
    font-weight: 600;
    font-size: .95rem;
    cursor: pointer;
    transition: all .18s;
    font-family: inherit;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.pd-btn-secondary:hover {
    border-color: #4ade80;
    color: #4ade80;
    background: rgba(74,222,128,.06);
}

/* ── Skeleton ── */
.pd-skeleton-page {
    max-width: 1100px;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 24px;
    overflow: hidden;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
}
@media(max-width:768px){ .pd-skeleton-page{ grid-template-columns:1fr; } }
.pd-sk {
    background: linear-gradient(90deg,rgba(255,255,255,.05) 25%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.05) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}
.pd-sk-img { height: 100%; min-height: 360px; }
.pd-sk-body { padding: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
.pd-sk-line { height: 18px; border-radius: 8px; }
.w80{ width: 80%; } .w60{ width: 60%; } .w90{ width: 90%; } .w40{ width: 40%; }
@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
`;