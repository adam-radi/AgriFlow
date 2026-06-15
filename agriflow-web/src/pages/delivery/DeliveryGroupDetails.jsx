import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Table, Spinner, Alert } from "react-bootstrap";
import { fetchDeliveryGroupDetails, updateDeliveryStatus, clearSelectedGroup } from "../../features/delivery/deliverySlice";
import {
    selectDeliveryGroupById,
    selectDeliveryLoading,
    selectDeliveryError,
} from "../../features/delivery/deliverySelectors";
import DeliveryStatusBadge from "../../components/delivery/DeliveryStatusBadge";
import DeliveryRouteMap from "../../components/delivery/DeliveryRouteMap";

const STATUS_FLOW = ["pending", "planned", "assigned", "in_progress", "delivered"];

export default function DeliveryGroupDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector(selectDeliveryGroupById);
    const loading = useSelector(selectDeliveryLoading);
    const error = useSelector(selectDeliveryError);

    useEffect(() => {
        dispatch(fetchDeliveryGroupDetails(id));
        return () => dispatch(clearSelectedGroup());
    }, [dispatch, id]);

    if (loading && !group) {
        return (
            <div className="container py-5 text-center">
                <Spinner animation="border" variant="success" />
                <p className="text-muted mt-2">Loading group details…</p>
            </div>
        );
    }

    if (error && !group) {
        return (
            <div className="container py-5 text-center">
                <Alert variant="danger">{typeof error === "string" ? error : "Group not found"}</Alert>
                <Link to="/delivery/groups" className="btn btn-outline-success">← Back to Groups</Link>
            </div>
        );
    }

    const currentIdx = STATUS_FLOW.indexOf(group?.status);
    const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

    function handleAdvanceStatus() {
        if (nextStatus) {
            dispatch(updateDeliveryStatus({ id, status: nextStatus }));
        }
    }

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>← Back</button>
                <span className="text-muted">/ {group?.zone || `Group #${group?.id}`}</span>
            </div>

            <Row className="g-4">
                <Col lg={4}>
                    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">
                                {group?.zone || `Group #${group?.id}`}
                                <div className="mt-1">
                                    <DeliveryStatusBadge status={group?.status} />
                                </div>
                            </Card.Title>
                            <div className="d-flex flex-column gap-2">
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Delivery Date</small>
                                    <p className="mb-0">{group?.delivery_date ? new Date(group.delivery_date).toLocaleDateString() : "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Zone</small>
                                    <p className="mb-0">{group?.zone || "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Orders</small>
                                    <p className="mb-0 fw-bold">{group?.orders_count ?? group?.orders?.length ?? 0}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Total Weight</small>
                                    <p className="mb-0 fw-bold">{group?.total_weight ? `${group.total_weight} kg` : "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Assigned Livreur</small>
                                    <p className="mb-0">{group?.livreur_name || group?.livreur?.name || "Unassigned"}</p>
                                </div>
                            </div>
                            {nextStatus && (
                                <button
                                    className="btn btn-success w-100 mt-3"
                                    onClick={handleAdvanceStatus}
                                    disabled={loading}
                                >
                                    Advance to "{nextStatus.replace(/_/g, " ")}"
                                </button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">Orders in this Group</Card.Title>
                            <Table striped bordered hover responsive className="align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Weight</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!group?.orders || group.orders.length === 0) ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-3">No orders assigned.</td>
                                        </tr>
                                    ) : (
                                        group.orders.map((order, i) => (
                                            <tr key={order.id || i}>
                                                <td className="fw-medium">#{order.id}</td>
                                                <td>{order.customer_name || order.customer?.name || "—"}</td>
                                                <td>{order.items_count ?? order.items?.length ?? 0}</td>
                                                <td>{order.total_weight ? `${order.total_weight} kg` : "—"}</td>
                                                <td><DeliveryStatusBadge status={order.status} /></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <DeliveryRouteMap group={group} />
                </Col>
            </Row>
        </div>
    );
}
