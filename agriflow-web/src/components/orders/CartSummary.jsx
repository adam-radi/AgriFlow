/**
 * CartSummary — Synthèse financière et réassurance du panier d'achat
 */
export default function CartSummary({ cartItems = [], cartTotal = 0, cartCount = 0 }) {
    const totalAmount = Number(cartTotal) || 0;

    return (
        <div
            className="p-4 rounded-4"
            style={{
                backgroundColor: "var(--af-surface, #FFFFFF)",
                border: "1px solid var(--af-border, #E2E9E3)",
            }}
        >
            <h2 className="af-panel-title mb-3">Synthèse du Panier</h2>

            <div className="d-flex flex-column gap-2 mb-3">
                <div className="d-flex justify-content-between text-muted small">
                    <span>Nombre de références</span>
                    <span className="fw-semibold text-dark">{cartItems.length} article(s)</span>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                    <span>Total conditionnements</span>
                    <span className="fw-semibold text-dark">{cartCount} lot(s)</span>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                    <span>Frais de logistique</span>
                    <span className="text-success fw-semibold">Circuit court direct</span>
                </div>

                <hr className="my-2" style={{ borderColor: "var(--af-border, #E2E9E3)" }} />

                <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ color: "var(--af-green-950, #15372F)" }}>
                        Total Estimé
                    </span>
                    <span
                        className="fs-4 fw-bold"
                        style={{ color: "var(--af-primary-forest, #15372F)" }}
                    >
                        {totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                    </span>
                </div>
            </div>

            {/* Reassurance pills */}
            <div
                className="p-3 rounded-3 mt-3"
                style={{ backgroundColor: "var(--af-green-50, #F4F9F6)", border: "1px solid var(--af-green-200, #C4DFD1)" }}
            >
                <div className="d-flex align-items-start gap-2 mb-2">
                    <span>🌱</span>
                    <span className="small text-dark">
                        <strong>Circuit direct :</strong> 100% reversé aux exploitants partenaires.
                    </span>
                </div>
                <div className="d-flex align-items-start gap-2">
                    <span>🚚</span>
                    <span className="small text-dark">
                        <strong>Livraison groupée :</strong> Planifiée directement avec le producteur.
                    </span>
                </div>
            </div>
        </div>
    );
}
