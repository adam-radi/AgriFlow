import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeliveryStatusBadge from "./DeliveryStatusBadge";

export default function DeliveryGroupCard({ group, linkPrefix = "/delivery/groups" }) {
    return (
        <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="h6 mb-0 fw-bold">
                        {group.zone || `Group #${group.id}`}
                    </Card.Title>
                    <DeliveryStatusBadge status={group.status} />
                </div>
                <div className="mt-auto small text-muted">
                    <div className="d-flex justify-content-between mb-1">
                        <span>Date:</span>
                        <span className="fw-medium">{group.delivery_date ? new Date(group.delivery_date).toLocaleDateString() : "—"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                        <span>Orders:</span>
                        <span className="fw-medium">{group.items?.length ?? 0}</span>
                    </div>
                </div>
                <Link to={`${linkPrefix}/${group.id}`} className="btn btn-outline-success btn-sm mt-3 w-100">
                    View Details
                </Link>
            </Card.Body>
        </Card>
    );
}
