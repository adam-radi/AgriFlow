import { Card } from "react-bootstrap";

export default function AdminStatsCard({ title, value, icon, trend }) {
    return (
        <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
            <Card.Body className="d-flex align-items-center gap-3">
                {icon && (
                    <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                            width: 48,
                            height: 48,
                            fontSize: "1.5rem",
                            backgroundColor: "#e8f5e9",
                            color: "#2d6a4f",
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </div>
                )}
                <div>
                    <div className="text-muted small text-uppercase fw-semibold">{title}</div>
                    <div className="fw-bold fs-4">{value}</div>
                    {trend !== undefined && (
                        <small className={trend >= 0 ? "text-success" : "text-danger"}>
                            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
                        </small>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}
