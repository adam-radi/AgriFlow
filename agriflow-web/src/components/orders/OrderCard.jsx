import { Card, Row, Col } from "react-bootstrap";
import OrderStatusBadge from "./OrderStatusBadge";
import { Button } from "../common";

/**
 * OrderCard — Présentation harmonisée d'une commande selon le Design System AgriFlow
 */
export default function OrderCard({ order, onView }) {
    if (!order) return null;

    const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";

    const formattedDelivery = order.delivery_date
        ? new Date(order.delivery_date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
          })
        : null;

    const itemsCount = order.items_count ?? order.items?.length ?? 1;
    const totalAmount = order.total_amount != null
        ? Number(order.total_amount).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : order.total != null
        ? Number(order.total).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "—";

    return (
        <Card
            className="h-100 border-0 shadow-sm rounded-4 position-relative transition-all"
            style={{
                backgroundColor: "var(--af-surface, #FFFFFF)",
                border: "1px solid var(--af-border, #E2E9E3)",
            }}
        >
            <Card.Body className="p-4 d-flex flex-column justify-content-between">
                <div>
                    {/* Top Row: ID & Status */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.05rem" }}>
                                #{order.id}
                            </span>
                            {order.zone && (
                                <span
                                    className="badge px-2 py-1 rounded-pill"
                                    style={{
                                        backgroundColor: "var(--af-green-50, #F4F9F6)",
                                        color: "var(--af-green-800, #215B46)",
                                        border: "1px solid var(--af-green-200, #C4DFD1)",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    📍 {order.zone}
                                </span>
                            )}
                        </div>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="text-muted small mb-3">
                        Passée le {formattedDate}
                        {formattedDelivery && (
                            <span className="d-block text-dark mt-0.5">
                                🚚 Livraison prévue : <strong>{formattedDelivery}</strong>
                            </span>
                        )}
                    </div>

                    {/* Quick Metrics */}
                    <div
                        className="p-3 rounded-3 mb-3"
                        style={{ backgroundColor: "var(--af-canvas, #F6F8F5)" }}
                    >
                        <Row className="text-center g-2">
                            <Col xs={6} className="border-end" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                                <div className="text-muted small">Articles</div>
                                <div className="fw-bold fs-6" style={{ color: "var(--af-green-900, #194638)" }}>
                                    {itemsCount} lot{itemsCount > 1 ? "s" : ""}
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="text-muted small">Total TTC</div>
                                <div className="fw-bold fs-6" style={{ color: "var(--af-green-700, #398565)" }}>
                                    {totalAmount} DH
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Footer action */}
                {onView && (
                    <Button
                        variant="secondary"
                        size="sm"
                        pill
                        className="w-100"
                        onClick={() => onView(order.id)}
                    >
                        Consulter les détails →
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}
