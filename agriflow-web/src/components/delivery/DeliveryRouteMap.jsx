import { Card } from "react-bootstrap";

export default function DeliveryRouteMap({ group }) {
    return (
        <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <Card.Body>
                <Card.Title className="h6 fw-bold mb-3">🗺️ Route Map</Card.Title>
                <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                        minHeight: "200px",
                        background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
                        border: "2px dashed #81c784",
                    }}
                >
                    <div className="text-center text-muted">
                        <div style={{ fontSize: "2.5rem" }}>📍</div>
                        <p className="mb-0 small fw-medium mt-2">
                            {group?.zone ? `Route map for ${group.zone}` : "Map integration (coming soon)"}
                        </p>
                        {group?.orders_count > 0 && (
                            <p className="mb-0 small">{group.orders_count} stop(s) to optimize</p>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
