import { useDispatch } from "react-redux";
import { Card, Button, Spinner } from "react-bootstrap";
import { updateDeliveryStatus } from "../../features/delivery/deliverySlice";
import DeliveryStatusBadge from "./DeliveryStatusBadge";

const STATUS_FLOW = ["pending", "planned", "assigned", "in_progress", "delivered"];

export default function DeliveryGroupTracker({ group, loading }) {
    const dispatch = useDispatch();
    const currentIdx = STATUS_FLOW.indexOf(group?.status);
    const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

    function handleAction(status) {
        dispatch(updateDeliveryStatus({ id: group.id, status }));
    }

    return (
        <Card className="shadow-sm border-0 mb-3" style={{ borderRadius: "12px" }}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 className="fw-bold mb-1">{group.zone || `Group #${group.id}`}</h6>
                        <DeliveryStatusBadge status={group.status} />
                    </div>
                    <small className="text-muted">{group.delivery_date ? new Date(group.delivery_date).toLocaleDateString() : ""}</small>
                </div>
                <div className="small text-muted mb-2">
                    📦 {group.items?.length ?? 0} items
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    {nextStatus && (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAction(nextStatus)}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : `→ ${nextStatus.replace(/_/g, " ")}`}
                        </Button>
                    )}
                    {group.status === "assigned" && (
                        <Button variant="warning" size="sm" onClick={() => handleAction("in_progress")} disabled={loading}>
                            Start Delivery
                        </Button>
                    )}
                    {group.status === "in_progress" && (
                        <>
                            <Button variant="success" size="sm" onClick={() => handleAction("delivered")} disabled={loading}>
                                ✅ Confirm Delivered
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleAction("failed")} disabled={loading}>
                                ❌ Mark Failed
                            </Button>
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}
