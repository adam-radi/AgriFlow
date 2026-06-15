import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct, fetchProductById, clearProductError, clearSelectedProduct } from "../../../features/products/productSlice";
import {
    selectSelectedProduct,
    selectProductsLoading,
    selectProductsError,
} from "../../../features/products/productSelectors";

const CATEGORIES = [
    "Vegetables", "Fruits", "Grains", "Dairy", "Poultry",
    "Herbs & Spices", "Legumes", "Nuts & Seeds", "Other",
];

export default function EditProductPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const product = useSelector(selectSelectedProduct);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);

    const [form, setForm] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Load product into form when fetched
    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => dispatch(clearSelectedProduct());
    }, [dispatch, id]);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                category: product.category || "",
                standard_quantity: product.standard_quantity || "",
                harvest_date: product.harvest_date || "",
                harvest_link: product.harvest_link || "",
                is_available: product.is_available !== false,
            });
            if (product.image) setPreviewUrl(product.image);
        }
    }, [product]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(clearProductError());

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (val !== "" && val !== null) formData.append(key, val);
        });
        if (imageFile) formData.append("image", imageFile);

        const result = await dispatch(updateProduct({ id, formData }));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/farmer/products");
        }
    }

    // Loading state while product is being fetched
    if (!form) return (
        <>
            <style>{formStyles}</style>
            <div className="pf-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⏳</div>
                    <p style={{ color: "#64748b" }}>Loading product…</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{formStyles}</style>
            <div className="pf-page">
                <div className="pf-container">
                    {/* Header */}
                    <div className="pf-header">
                        <button className="pf-back" onClick={() => navigate(-1)} id="edit-back-btn">← Back</button>
                        <div>
                            <h1 className="pf-title">Edit Product</h1>
                            <p className="pf-sub">Update the details of "{product?.name}"</p>
                        </div>
                    </div>

                    {error && (
                        <div className="pf-error" id="edit-error-msg">
                            ⚠️ {typeof error === "string" ? error : JSON.stringify(error)}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="pf-form" id="edit-product-form">
                        <div className="pf-two-col">
                            {/* Left: fields */}
                            <div className="pf-fields">
                                <div className="pf-group">
                                    <label className="pf-label" htmlFor="ep-name">Product Name *</label>
                                    <input id="ep-name" name="name" className="pf-input" required
                                        value={form.name} onChange={handleChange} />
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label" htmlFor="ep-description">Description *</label>
                                    <textarea id="ep-description" name="description" className="pf-input pf-textarea"
                                        required rows={4} value={form.description} onChange={handleChange} />
                                </div>

                                <div className="pf-row">
                                    <div className="pf-group">
                                        <label className="pf-label" htmlFor="ep-price">Price (MAD) *</label>
                                        <input id="ep-price" name="price" type="number" min="0" step="0.01"
                                            className="pf-input" required value={form.price} onChange={handleChange} />
                                    </div>
                                    <div className="pf-group">
                                        <label className="pf-label" htmlFor="ep-category">Category</label>
                                        <select id="ep-category" name="category" className="pf-input pf-select"
                                            value={form.category} onChange={handleChange}>
                                            <option value="">Select…</option>
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pf-row">
                                    <div className="pf-group">
                                        <label className="pf-label" htmlFor="ep-quantity">Standard Quantity</label>
                                        <input id="ep-quantity" name="standard_quantity" className="pf-input"
                                            value={form.standard_quantity} onChange={handleChange} />
                                    </div>
                                    <div className="pf-group">
                                        <label className="pf-label" htmlFor="ep-harvest-date">Harvest Date</label>
                                        <input id="ep-harvest-date" name="harvest_date" type="date"
                                            className="pf-input" value={form.harvest_date} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label" htmlFor="ep-harvest-link">Harvest Info Link</label>
                                    <input id="ep-harvest-link" name="harvest_link" type="url"
                                        className="pf-input" placeholder="https://…"
                                        value={form.harvest_link} onChange={handleChange} />
                                </div>

                                <label className="pf-checkbox-row" htmlFor="ep-available">
                                    <input id="ep-available" type="checkbox" name="is_available"
                                        checked={form.is_available} onChange={handleChange} className="pf-checkbox" />
                                    <span>Mark as available for sale</span>
                                </label>
                            </div>

                            {/* Right: image */}
                            <div className="pf-image-col">
                                <label className="pf-label">Product Image</label>
                                <label htmlFor="ep-image" className="pf-dropzone" id="edit-image-drop">
                                    {previewUrl
                                        ? <img src={previewUrl} alt="preview" className="pf-preview-img" />
                                        : (
                                            <>
                                                <div className="pf-drop-icon">📷</div>
                                                <p className="pf-drop-text">Click to change image</p>
                                                <p className="pf-drop-hint">JPG, PNG, WEBP up to 5 MB</p>
                                            </>
                                        )
                                    }
                                    <input id="ep-image" type="file" accept="image/*"
                                        style={{ display: "none" }} onChange={handleImageChange} />
                                </label>
                                {previewUrl && imageFile && (
                                    <button type="button" className="pf-remove-img"
                                        onClick={() => { setImageFile(null); setPreviewUrl(product?.image || null); }}>
                                        Revert image
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="pf-submit-row">
                            <button type="button" className="pf-btn-cancel"
                                onClick={() => navigate(-1)} id="edit-cancel-btn">
                                Cancel
                            </button>
                            <button type="submit" className="pf-btn-submit" disabled={loading} id="edit-submit-btn">
                                {loading ? "Saving…" : "💾 Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

const formStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.pf-page {
    min-height:100vh;
    background:linear-gradient(160deg,#0a1628 0%,#0d2b1a 50%,#0a1628 100%);
    font-family:'Inter',sans-serif; color:#e2e8f0; padding:2.5rem 1.5rem 4rem;
}
.pf-container { max-width:880px; margin:0 auto; }
.pf-header { display:flex; align-items:flex-start; gap:1rem; margin-bottom:2rem; }
.pf-back {
    background:rgba(255,255,255,.07); border:1.5px solid rgba(255,255,255,.12);
    color:#94a3b8; padding:.55rem 1rem; border-radius:10px; cursor:pointer;
    font-family:inherit; font-size:.88rem; font-weight:600; transition:all .18s; flex-shrink:0;
}
.pf-back:hover { border-color:#4ade80; color:#4ade80; background:rgba(74,222,128,.07); }
.pf-title { font-size:1.8rem; font-weight:800; color:#f1f5f9; margin:0; }
.pf-sub { font-size:.88rem; color:#64748b; margin:.2rem 0 0; }
.pf-error {
    background:rgba(239,68,68,.14); border:1px solid rgba(239,68,68,.3); color:#f87171;
    padding:.85rem 1.2rem; border-radius:12px; margin-bottom:1.5rem; font-size:.9rem;
}
.pf-form {
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09);
    border-radius:20px; padding:2rem;
}
.pf-two-col { display:grid; grid-template-columns:1.4fr 1fr; gap:2rem; }
@media(max-width:700px){ .pf-two-col{ grid-template-columns:1fr; } }
.pf-fields { display:flex; flex-direction:column; gap:1.1rem; }
.pf-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
@media(max-width:480px){ .pf-row{ grid-template-columns:1fr; } }
.pf-group { display:flex; flex-direction:column; gap:.4rem; }
.pf-label { font-size:.8rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
.pf-input {
    padding:.8rem 1rem; border-radius:11px;
    border:1.5px solid rgba(255,255,255,.1); background:rgba(255,255,255,.06);
    color:#f1f5f9; font-size:.92rem; font-family:inherit; outline:none;
    transition:border-color .2s, background .2s;
}
.pf-input::placeholder { color:#475569; }
.pf-input:focus { border-color:#4ade80; background:rgba(74,222,128,.06); }
.pf-textarea { resize:vertical; min-height:90px; }
.pf-select { cursor:pointer; }
.pf-select option { background:#0d2b1a; color:#f1f5f9; }
.pf-checkbox-row {
    display:flex; align-items:center; gap:.7rem;
    cursor:pointer; font-size:.9rem; color:#94a3b8; font-weight:500;
}
.pf-checkbox { accent-color:#22c55e; width:16px; height:16px; cursor:pointer; }
.pf-image-col { display:flex; flex-direction:column; gap:.6rem; }
.pf-dropzone {
    border:2px dashed rgba(255,255,255,.15); border-radius:16px;
    aspect-ratio:1/1; display:flex; flex-direction:column;
    align-items:center; justify-content:center; cursor:pointer;
    transition:border-color .2s, background .2s; overflow:hidden;
    background:rgba(255,255,255,.03);
}
.pf-dropzone:hover { border-color:#4ade80; background:rgba(74,222,128,.05); }
.pf-drop-icon { font-size:2.5rem; margin-bottom:.6rem; }
.pf-drop-text { font-size:.9rem; color:#94a3b8; font-weight:600; margin:0; }
.pf-drop-hint { font-size:.75rem; color:#475569; margin:.25rem 0 0; }
.pf-preview-img { width:100%; height:100%; object-fit:cover; }
.pf-remove-img {
    background:none; border:1px solid rgba(239,68,68,.3); color:#f87171;
    border-radius:8px; padding:.4rem .8rem; font-size:.8rem; cursor:pointer;
    font-family:inherit; transition:background .18s;
}
.pf-remove-img:hover { background:rgba(239,68,68,.1); }
.pf-submit-row {
    display:flex; justify-content:flex-end; gap:1rem;
    margin-top:2rem; padding-top:1.5rem;
    border-top:1px solid rgba(255,255,255,.08);
}
.pf-btn-cancel {
    padding:.8rem 1.6rem; border-radius:12px;
    border:1.5px solid rgba(255,255,255,.13); background:rgba(255,255,255,.05);
    color:#94a3b8; font-weight:600; font-size:.93rem; cursor:pointer; font-family:inherit;
    transition:all .18s;
}
.pf-btn-cancel:hover { border-color:#4ade80; color:#4ade80; }
.pf-btn-submit {
    padding:.8rem 2rem; border-radius:12px; border:none;
    background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff;
    font-weight:700; font-size:.93rem; cursor:pointer; font-family:inherit;
    transition:transform .15s, box-shadow .15s, opacity .15s;
}
.pf-btn-submit:hover:not(:disabled) {
    transform:translateY(-2px); box-shadow:0 10px 28px rgba(34,197,94,.35);
}
.pf-btn-submit:disabled { opacity:.5; cursor:not-allowed; }
`;
