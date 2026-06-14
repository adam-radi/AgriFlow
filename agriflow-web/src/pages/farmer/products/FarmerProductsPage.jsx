import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFarmerProducts, deleteProduct, clearProductSuccess, clearProductError } from "../../../features/products/productSlice";
import {
    selectFarmerProducts,
    selectProductsLoading,
    selectProductsError,
    selectProductsSuccess,
} from "../../../features/products/productSelectors";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

export default function FarmerProductsPage() {
    const dispatch = useDispatch();
    const products = useSelector(selectFarmerProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const success = useSelector(selectProductsSuccess);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    useEffect(() => {
        dispatch(fetchFarmerProducts());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            const t = setTimeout(() => dispatch(clearProductSuccess()), 3500);
            return () => clearTimeout(t);
        }
    }, [success, dispatch]);

    async function handleDelete(id) {
        setDeletingId(id);
        await dispatch(deleteProduct(id));
        setDeletingId(null);
        setConfirmId(null);
    }

    return (
        <>
            <style>{styles}</style>
            <div className="fp-page">

                {/* ── Header ── */}
                <div className="fp-header">
                    <div>
                        <h1 className="fp-title">My Products</h1>
                        <p className="fp-subtitle">Manage your farm listings</p>
                    </div>
                    <Link to="/farmer/products/new" className="fp-btn-add" id="add-product-btn">
                        + Add Product
                    </Link>
                </div>

                {/* ── Toast notifications ── */}
                {success && (
                    <div className="fp-toast fp-toast-success" id="product-success-toast">
                        ✅ {success}
                    </div>
                )}
                {error && (
                    <div className="fp-toast fp-toast-error" id="product-error-toast">
                        ⚠️ {typeof error === "string" ? error : "An error occurred"}
                        <button onClick={() => dispatch(clearProductError())} className="fp-toast-close">✕</button>
                    </div>
                )}

                {/* ── Loading skeleton ── */}
                {loading && !products.length && (
                    <div className="fp-grid">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div className="fp-card fp-skeleton" key={i}>
                                <div className="fp-sk fp-sk-img" />
                                <div className="fp-sk-body">
                                    <div className="fp-sk fp-sk-line w70" />
                                    <div className="fp-sk fp-sk-line w50" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && products.length === 0 && !error && (
                    <div className="fp-empty">
                        <div className="fp-empty-icon">🌱</div>
                        <h2>No products yet</h2>
                        <p>Start listing your farm products for buyers to discover.</p>
                        <Link to="/farmer/products/new" className="fp-btn-add" id="add-first-product-btn">
                            + Add Your First Product
                        </Link>
                    </div>
                )}

                {/* ── Products grid ── */}
                {products.length > 0 && (
                    <div className="fp-grid">
                        {products.map((product) => (
                            <div className="fp-card" key={product.id} id={`farmer-product-${product.id}`}>
                                <div className="fp-card-img-wrap">
                                    <img
                                        src={product.image || PLACEHOLDER_IMG}
                                        alt={product.name}
                                        className="fp-card-img"
                                        onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                                    />
                                    <span className={`fp-status${product.is_available === false ? " out" : " in"}`}>
                                        {product.is_available === false ? "Out of Stock" : "Available"}
                                    </span>
                                </div>
                                <div className="fp-card-body">
                                    <h3 className="fp-card-name">{product.name}</h3>
                                    <p className="fp-card-price">
                                        {product.price != null ? `${parseFloat(product.price).toFixed(2)} MAD` : "—"}
                                    </p>
                                    <p className="fp-card-desc">{product.description}</p>

                                    <div className="fp-card-actions">
                                        <Link
                                            to={`/farmer/products/${product.id}/edit`}
                                            className="fp-btn-edit"
                                            id={`edit-product-${product.id}`}
                                        >
                                            ✏️ Edit
                                        </Link>

                                        {confirmId === product.id ? (
                                            <div className="fp-confirm-row">
                                                <span className="fp-confirm-text">Delete?</span>
                                                <button
                                                    className="fp-btn-confirm-del"
                                                    id={`confirm-delete-${product.id}`}
                                                    disabled={deletingId === product.id}
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    {deletingId === product.id ? "…" : "Yes"}
                                                </button>
                                                <button
                                                    className="fp-btn-cancel"
                                                    onClick={() => setConfirmId(null)}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="fp-btn-delete"
                                                id={`delete-product-${product.id}`}
                                                onClick={() => setConfirmId(product.id)}
                                            >
                                                🗑 Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.fp-page {
    min-height: 100vh;
    background: linear-gradient(160deg,#0a1628 0%,#0d2b1a 50%,#0a1628 100%);
    font-family: 'Inter',sans-serif;
    color: #e2e8f0;
    padding: 2.5rem 2rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
}
.fp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}
.fp-title { font-size: 1.9rem; font-weight: 800; color: #f1f5f9; margin: 0; }
.fp-subtitle { font-size: .88rem; color: #64748b; margin: .2rem 0 0; }

/* ── Toast ── */
.fp-toast {
    display: flex; align-items: center; justify-content: space-between;
    padding: .85rem 1.2rem; border-radius: 12px; margin-bottom: 1.5rem;
    font-size: .9rem; font-weight: 600; animation: fadeIn .3s ease;
}
.fp-toast-success { background: rgba(34,197,94,.14); border:1px solid rgba(34,197,94,.3); color:#4ade80; }
.fp-toast-error   { background: rgba(239,68,68,.14);  border:1px solid rgba(239,68,68,.3);  color:#f87171; }
.fp-toast-close { background:none; border:none; color:inherit; cursor:pointer; font-size:1rem; padding:0; margin-left:.8rem; }
@keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }

/* ── Grid ── */
.fp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px,1fr));
    gap: 1.5rem;
}

/* ── Card ── */
.fp-card {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: border-color .2s, box-shadow .2s;
}
.fp-card:hover {
    border-color: rgba(74,222,128,.3);
    box-shadow: 0 12px 36px rgba(0,0,0,.4);
}
.fp-card-img-wrap { position:relative; height:180px; overflow:hidden; }
.fp-card-img { width:100%; height:100%; object-fit:cover; transition:transform .35s; }
.fp-card:hover .fp-card-img { transform:scale(1.06); }
.fp-status {
    position:absolute; top:8px; right:8px;
    font-size:.7rem; font-weight:700; padding:.25rem .7rem; border-radius:999px;
}
.fp-status.in { background:rgba(34,197,94,.18); border:1px solid rgba(34,197,94,.4); color:#4ade80; }
.fp-status.out { background:rgba(239,68,68,.18); border:1px solid rgba(239,68,68,.4); color:#f87171; }
.fp-card-body { padding:1.1rem 1.1rem 1.2rem; display:flex; flex-direction:column; gap:.4rem; flex:1; }
.fp-card-name { font-size:1rem; font-weight:700; color:#f1f5f9; margin:0; }
.fp-card-price { font-size:1.05rem; font-weight:800; color:#4ade80; margin:0; }
.fp-card-desc {
    font-size:.83rem; color:#64748b; margin:0;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.fp-card-actions { display:flex; gap:.6rem; margin-top:.8rem; flex-wrap:wrap; }
.fp-btn-edit, .fp-btn-delete {
    flex:1; padding:.55rem; border-radius:9px; font-size:.82rem; font-weight:600;
    cursor:pointer; font-family:inherit; text-align:center;
    transition:all .18s; text-decoration:none; display:inline-flex; align-items:center; justify-content:center;
}
.fp-btn-edit {
    background:rgba(59,130,246,.12); border:1px solid rgba(59,130,246,.3); color:#93c5fd;
}
.fp-btn-edit:hover { background:rgba(59,130,246,.22); border-color:rgba(59,130,246,.5); }
.fp-btn-delete {
    background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.25); color:#f87171;
}
.fp-btn-delete:hover { background:rgba(239,68,68,.2); border-color:rgba(239,68,68,.45); }

.fp-confirm-row { display:flex; align-items:center; gap:.5rem; flex:1; }
.fp-confirm-text { font-size:.8rem; color:#f87171; font-weight:600; }
.fp-btn-confirm-del {
    padding:.45rem .9rem; border-radius:8px; border:none;
    background:rgba(239,68,68,.25); color:#f87171; font-weight:700; cursor:pointer; font-family:inherit;
    transition:background .18s;
}
.fp-btn-confirm-del:hover { background:rgba(239,68,68,.4); }
.fp-btn-cancel {
    padding:.45rem .9rem; border-radius:8px; background:rgba(255,255,255,.07);
    border:1px solid rgba(255,255,255,.12); color:#94a3b8; cursor:pointer; font-family:inherit;
}

/* ── Add button ── */
.fp-btn-add {
    padding:.75rem 1.5rem; border-radius:12px; border:none;
    background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff;
    font-weight:700; font-size:.92rem; cursor:pointer; text-decoration:none;
    font-family:inherit; display:inline-flex; align-items:center;
    transition:transform .15s, box-shadow .15s;
}
.fp-btn-add:hover {
    transform:translateY(-2px);
    box-shadow:0 8px 24px rgba(34,197,94,.35);
}

/* ── Empty ── */
.fp-empty {
    text-align:center; padding:5rem 2rem;
    display:flex; flex-direction:column; align-items:center; gap:1rem;
}
.fp-empty-icon { font-size:3.5rem; }
.fp-empty h2 { color:#f1f5f9; margin:0; font-size:1.3rem; }
.fp-empty p { color:#64748b; margin:0; font-size:.9rem; }

/* ── Skeleton ── */
.fp-skeleton { pointer-events:none; }
.fp-sk {
    background:linear-gradient(90deg,rgba(255,255,255,.05) 25%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.05) 75%);
    background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:8px;
}
.fp-sk-img { height:180px; border-radius:0; }
.fp-sk-body { padding:1rem; display:flex; flex-direction:column; gap:.7rem; }
.fp-sk-line { height:14px; }
.w70{ width:70%; } .w50{ width:50%; }
@keyframes shimmer {
    0%{ background-position:200% 0; } 100%{ background-position:-200% 0; }
}
`;
