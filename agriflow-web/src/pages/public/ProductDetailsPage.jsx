import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, clearSelectedProduct } from "../../features/products/productSlice";
import {
    selectSelectedProduct,
    selectProductsLoading,
    selectProductsError,
} from "../../features/products/productSelectors";
import { addToCart } from "../../features/orders/orderSlice";

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
    const stdQty = parseFloat(product.standard_quantity) || 1;
    const [packQty, setPackQty] = useState(1);
    const totalWeight = (stdQty * packQty).toFixed(2);

    function handleAddToCart() {
        dispatch(addToCart({
            productId: product.id,
            productName: product.name,
            standardQuantity: stdQty,
            packQuantity: packQty,
            totalWeight: parseFloat(totalWeight),
            unitPrice: parseFloat(product.price) || 0,
            subtotal: (parseFloat(product.price) || 0) * parseFloat(totalWeight),
            harvestId: product.harvest_id || null,
            harvestDate: product.harvest_date || null,
            estimatedDeliveryDate: product.estimated_delivery_date || null,
        }));
    }

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

                        {/* ── Add to Cart Section ── */}
                        {isAvailable && (
                            <div className="pd-cart-section">
                                <div className="pd-cart-row">
                                    <span className="pd-cart-label">Standard Qty:</span>
                                    <span className="pd-cart-value">{stdQty} kg</span>
                                </div>
                                <div className="pd-cart-row">
                                    <span className="pd-cart-label">Pack Quantity:</span>
                                    <div className="pd-qty-control">
                                        <button className="pd-qty-btn" onClick={() => setPackQty(Math.max(1, packQty - 1))}>−</button>
                                        <span className="pd-qty-num">{packQty}</span>
                                        <button className="pd-qty-btn" onClick={() => setPackQty(packQty + 1)}>+</button>
                                    </div>
                                </div>
                                <div className="pd-cart-row">
                                    <span className="pd-cart-label">Total Weight:</span>
                                    <span className="pd-cart-value">{totalWeight} kg</span>
                                </div>
                                <button className="pd-btn-add-cart" onClick={handleAddToCart} id="product-add-cart">
                                    🛒 Add to Cart
                                </button>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="pd-actions">
                            {!isAvailable && (
                                <button className="pd-btn-primary" disabled id="product-order-btn">
                                    Out of Stock
                                </button>
                            )}
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
    background-color: #f5f8f6;
    font-family: 'Inter', sans-serif;
    color: #334155;
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
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    color: #0f2942;
    padding: .5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: .88rem;
    font-weight: 700;
    transition: all .15s;
}
.pd-back-btn:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
.pd-breadcrumb { font-size: .83rem; color: #475569; }
.pd-breadcrumb a { color: #16a34a; text-decoration: none; font-weight: 600; }
.pd-breadcrumb a:hover { text-decoration: underline; }

/* ── Main card ── */
.pd-card {
    max-width: 1100px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e2ede6;
    border-radius: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(15, 41, 66, 0.08);
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
    background: #d1fae5;
    border: 1px solid #10b981;
    color: #065f46;
}
.pd-status-badge.out {
    background: #fee2e2;
    border: 1px solid #ef4444;
    color: #991b1b;
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
    background: #e6f7ed;
    border: 1px solid rgba(22, 163, 74, 0.25);
    color: #15803d;
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
    font-weight: 850;
    color: #0f2942;
    margin: 0;
    line-height: 1.2;
}

.pd-price {
    font-size: 1.7rem;
    font-weight: 850;
    color: #16a34a;
    margin: 0;
}

.pd-description {
    font-size: .93rem;
    color: #475569;
    line-height: 1.7;
    margin: 0;
}

/* ── Details grid ── */
.pd-details-grid {
    display: flex;
    flex-direction: column;
    gap: .8rem;
    padding: 1.2rem;
    background: #f8faf9;
    border-radius: 14px;
    border: 1px solid #e2ede6;
}
.pd-detail-row {
    display: flex;
    align-items: flex-start;
    gap: .85rem;
}
.pd-detail-icon { font-size: 1.1rem; margin-top: .1rem; flex-shrink: 0; }
.pd-detail-label { font-size: .75rem; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: .06em; font-weight: 700; }
.pd-detail-value { font-size: .9rem; color: #0f2942; margin: .1rem 0 0; font-weight: 600; }

/* ── Harvest section ── */
.pd-harvest-section {
    padding: 1.2rem;
    background: #e6f7ed;
    border: 1px solid rgba(22, 163, 74, 0.2);
    border-radius: 14px;
}
.pd-harvest-section-title {
    font-size: .88rem;
    font-weight: 700;
    color: #15803d;
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
    font-weight: 700;
}
.pd-harvest-value {
    font-size: .88rem;
    color: #0f2942;
    font-weight: 700;
}

/* ── Harvest link ── */
.pd-harvest-link {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    color: #15803d;
    font-size: .88rem;
    font-weight: 700;
    text-decoration: none;
    padding: .6rem 1rem;
    border-radius: 10px;
    background: #e6f7ed;
    border: 1px solid rgba(22, 163, 74, 0.3);
    transition: all .15s;
    align-self: flex-start;
}
.pd-harvest-link:hover {
    background: #d1fae5;
    border-color: #10b981;
}

/* ── Add to Cart ── */
.pd-cart-section {
    padding: 1.2rem;
    background: #f8faf9;
    border: 1.5px solid #e2ede6;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    gap: .7rem;
}
.pd-cart-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.pd-cart-label { font-size: .82rem; color: #475569; font-weight: 600; }
.pd-cart-value { font-size: .9rem; color: #0f2942; font-weight: 750; }
.pd-qty-control {
    display: flex;
    align-items: center;
    gap: .5rem;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: .2rem;
}
.pd-qty-btn {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: none;
    background: #e6f7ed;
    color: #15803d;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .15s;
}
.pd-qty-btn:hover { background: #d1fae5; }
.pd-qty-num {
    font-size: 1rem;
    font-weight: 750;
    color: #0f2942;
    min-width: 24px;
    text-align: center;
}
.pd-btn-add-cart {
    width: 100%;
    padding: .8rem;
    border-radius: 12px;
    border: none;
    background: #16a34a;
    color: #ffffff;
    font-weight: 700;
    font-size: .95rem;
    cursor: pointer;
    transition: transform .15s, background-color .15s, box-shadow .15s;
    font-family: inherit;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
}
.pd-btn-add-cart:hover {
    background-color: #15803d;
    transform: translateY(-1.5px);
    box-shadow: 0 6px 18px rgba(22, 163, 74, 0.3);
}

/* ── Actions ── */
.pd-actions { display: flex; gap: .8rem; flex-wrap: wrap; margin-top: .4rem; }

.pd-btn-primary {
    flex: 1;
    min-width: 140px;
    padding: .9rem 1.6rem;
    border-radius: 12px;
    border: none;
    background: #16a34a;
    color: #ffffff;
    font-weight: 700;
    font-size: .95rem;
    cursor: pointer;
    transition: transform .15s, background-color .15s, box-shadow .15s;
    font-family: inherit;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
}
.pd-btn-primary:hover:not(:disabled) {
    background-color: #15803d;
    transform: translateY(-1.5px);
    box-shadow: 0 6px 18px rgba(22, 163, 74, 0.3);
}
.pd-btn-primary:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
    color: #94a3b8;
    box-shadow: none;
}

.pd-btn-secondary {
    flex: 1;
    min-width: 140px;
    padding: .9rem 1.6rem;
    border-radius: 12px;
    border: 1.5px solid #cbd5e1;
    background: #ffffff;
    color: #475569;
    font-weight: 600;
    font-size: .95rem;
    cursor: pointer;
    transition: all .15s;
    font-family: inherit;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.pd-btn-secondary:hover {
    border-color: #0f2942;
    color: #0f2942;
    background: #f8fafc;
}

/* ── Skeleton ── */
.pd-skeleton-page {
    max-width: 1100px;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 24px;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #e2ede6;
}
@media(max-width:768px){ .pd-skeleton-page{ grid-template-columns:1fr; } }
.pd-sk {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
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