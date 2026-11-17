import { Card } from "react-bootstrap";

export default function FarmerStatsCard({ title, value, icon, color }) {
    return (
        <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
            <Card.Body className="d-flex align-items-center gap-3">
                <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                        width: 48,
                        height: 48,
                        fontSize: "1.5rem",
                        backgroundColor: color || "var(--agri-bg)",
                    }}
                >
                    {icon}
                </div>
                <div>
                    <div className="text-muted small text-uppercase fw-semibold">{title}</div>
                    <div className="fw-bold fs-4" style={{ color: "var(--text-dark)" }}>{value}</div>
                </div>
            </Card.Body>
        </Card>
    );
}
