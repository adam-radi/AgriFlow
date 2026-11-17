import { Card } from "react-bootstrap";
import DeliveryStatusBadge from "./DeliveryStatusBadge";

export default function DeliveryDashboardCard({ group }) {
    return (
        <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="h6 fw-bold mb-0">
                        {group.zone || `Group #${group.id}`}
                    </Card.Title>
                    <DeliveryStatusBadge status={group.status} />
                </div>
                <div className="small text-muted">
                    <div>📅 {group.delivery_date ? new Date(group.delivery_date).toLocaleDateString() : "—"}</div>
                    <div>📦 {group.items?.length ?? 0} items</div>
                    <div>👤 {group.delivery_user?.name || "Unassigned"}</div>
                </div>
            </Card.Body>
        </Card>
    );
}
