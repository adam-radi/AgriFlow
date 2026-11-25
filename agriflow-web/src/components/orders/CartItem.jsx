/**
 * CartItem — Article du panier d'achat avec sélecteur de quantité et suppression
 */
export default function CartItem({ item, onUpdate, onRemove }) {
    if (!item) return null;

    const productName = item.harvest?.product?.name || `Produit #${item.harvest?.product_id || item.product_id}`;
    const packLabel = item.quantity_standard?.label || "Standard";
    const unitPrice = item.unit_price != null ? Number(item.unit_price) : 0;
    const subtotal = item.subtotal != null ? Number(item.subtotal) : unitPrice * item.quantity;

    return (
        <div
            className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 p-3 p-md-4 mb-3 rounded-4 transition-all"
            style={{
                backgroundColor: "var(--af-surface, #FFFFFF)",
                border: "1px solid var(--af-border, #E2E9E3)",
            }}
        >
            {/* Infos produit */}
            <div className="d-flex align-items-center gap-3">
                <div
                    className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "var(--af-green-100, #E8F2EC)",
                        color: "var(--af-green-900, #194638)",
                        fontSize: "1.4rem",
                    }}
                >
                    🌾
                </div>
                <div>
                    <h3 className="h6 mb-1 fw-bold" style={{ color: "var(--af-green-950, #15372F)" }}>
                        {productName}
                    </h3>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span
                            className="badge px-2 py-0.5 rounded-pill"
                            style={{
                                backgroundColor: "var(--af-green-50, #F4F9F6)",
                                color: "var(--af-green-800, #215B46)",
                                border: "1px solid var(--af-green-200, #C4DFD1)",
                                fontSize: "0.75rem",
                            }}
                        >
                            Conditionnement : {packLabel}
                        </span>
                        <span className="small text-muted">
                            {unitPrice.toFixed(2)} DH / lot
                        </span>
                    </div>
                </div>
            </div>

            {/* Sélecteur de quantité et sous-total */}
            <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-3 flex-shrink-0">
                <div
                    className="d-inline-flex align-items-center border rounded-pill px-2 py-1"
                    style={{
                        backgroundColor: "var(--af-canvas, #F6F8F5)",
                        borderColor: "var(--af-border, #E2E9E3)",
                    }}
                >
                    <button
                        type="button"
                        className="btn btn-sm btn-link p-0 text-dark text-decoration-none px-2 fw-bold"
                        onClick={() => onUpdate(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        style={{ fontSize: "1.1rem", lineHeight: "1" }}
                    >
                        −
                    </button>
                    <span className="fw-bold px-2" style={{ color: "var(--af-green-950, #15372F)", minWidth: "28px", textAlign: "center" }}>
                        {item.quantity}
                    </span>
                    <button
                        type="button"
                        className="btn btn-sm btn-link p-0 text-dark text-decoration-none px-2 fw-bold"
                        onClick={() => onUpdate(item.id, item.quantity + 1)}
                        style={{ fontSize: "1.1rem", lineHeight: "1" }}
                    >
                        +
                    </button>
                </div>

                <div className="text-end" style={{ minWidth: "100px" }}>
                    <div className="fw-bold fs-6" style={{ color: "var(--af-primary-forest, #15372F)" }}>
                        {subtotal.toFixed(2)} DH
                    </div>
                </div>

                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-circle p-1 d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px" }}
                    onClick={() => onRemove(item.id)}
                    title="Supprimer cet article"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}
