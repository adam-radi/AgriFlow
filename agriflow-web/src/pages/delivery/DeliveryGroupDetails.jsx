import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Table, Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import { fetchDeliveryGroupDetails, updateDeliveryStatus, assignLivreurToGroup, clearSelectedGroup, clearDeliveryError } from "../../features/delivery/deliverySlice";
import {
    selectDeliveryGroupById,
    selectDeliveryLoading,
    selectDeliveryError,
} from "../../features/delivery/deliverySelectors";
import DeliveryStatusBadge from "../../components/delivery/DeliveryStatusBadge";
import DeliveryRouteMap from "../../components/delivery/DeliveryRouteMap";
import { adminAPI } from "../../app/store/slices/admin/adminApi";

const STATUS_FLOW = ["pending", "planned", "assigned", "in_progress", "delivered"];

export default function DeliveryGroupDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector(selectDeliveryGroupById);
    const loading = useSelector(selectDeliveryLoading);
    const error = useSelector(selectDeliveryError);

    const [showAssign, setShowAssign] = useState(false);
    const [livreurs, setLivreurs] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");

    useEffect(() => {
        dispatch(fetchDeliveryGroupDetails(id));
        return () => dispatch(clearSelectedGroup());
    }, [dispatch, id]);

    useEffect(() => {
        adminAPI.getUsers({ role: "Delivery" }).then((res) => {
            const data = res.data?.data ?? res.data;
            setLivreurs(Array.isArray(data) ? data : data.users ?? data.results ?? []);
        }).catch(() => {});
    }, []);

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
                <Link to="/delivery/groups" className="btn btn-outline-success">{""}← Back to Groups</Link>
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

    function handleAssignLivreur() {
        if (!selectedUserId) return;
        dispatch(assignLivreurToGroup({ id, userId: Number(selectedUserId) }));
        setShowAssign(false);
        setSelectedUserId("");
    }

    const hasLivreur = !!(group?.delivery_user?.name);

    return (
        <div className="container py-4">
            {error && <Alert variant="danger" dismissible onClose={() => dispatch(clearDeliveryError())}>{typeof error === "string" ? error : "An error occurred"}</Alert>}
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
                                    <small className="text-muted text-uppercase fw-semibold">Items</small>
                                    <p className="mb-0 fw-bold">{group?.items?.length ?? 0}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Assigned Livreur</small>
                                    <p className="mb-0">{group?.delivery_user?.name || "Unassigned"}</p>
                                </div>
                            </div>

                            {!hasLivreur && (
                                <button className="btn btn-outline-primary w-100 mt-3" onClick={() => setShowAssign(true)} disabled={loading}>
                                    Assign Livreur
                                </button>
                            )}

                            {nextStatus && (
                                <button className="btn btn-success w-100 mt-2" onClick={handleAdvanceStatus} disabled={loading}>
                                    Advance to "{nextStatus.replace(/_/g, " ")}"
                                </button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">Items in this Group</Card.Title>
                            <Table striped bordered hover responsive className="align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Item #</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!group?.items || group.items.length === 0) ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-3">No items assigned.</td>
                                        </tr>
                                    ) : (
                                        group.items.map((item, i) => (
                                            <tr key={item.id || i}>
                                                <td className="fw-medium">#{item.id}</td>
                                                <td>{item.order_item?.product?.name || "—"}</td>
                                                <td>{item.order_item?.quantity ?? "—"}</td>
                                                <td>{item.order_item?.subtotal != null ? `${Number(item.order_item.subtotal).toFixed(2)} MAD` : "—"}</td>
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

            <Modal show={showAssign} onHide={() => setShowAssign(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Livreur to Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Select Delivery User</Form.Label>
                        <Form.Select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                            <option value="">— Choose —</option>
                            {livreurs.map((u) => (
                                <option key={u.id} value={u.id}>{u.name || `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.email}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAssign(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleAssignLivreur} disabled={!selectedUserId}>Assign</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
