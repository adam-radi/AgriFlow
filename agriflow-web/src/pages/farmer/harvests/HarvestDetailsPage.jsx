import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Badge, Table, Spinner, Alert } from "react-bootstrap";

import {
    fetchHarvestById,
    fetchHarvestForecast,
    fetchHarvestOrders,
    clearSelectedHarvest,
} from "../../../features/harvests/harvestSlice";
import {
    selectSelectedHarvest,
    selectHarvestForecast,
    selectHarvestOrders,
    selectHarvestLoading,
    selectHarvestError,
} from "../../../features/harvests/harvestSelectors";
import HarvestForecastCard from "../../../components/harvests/HarvestForecastCard";

const statusVariant = {
    planned: "warning",
    active: "success",
    completed: "secondary",
    cancelled: "danger",
};

export default function HarvestDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const harvest = useSelector(selectSelectedHarvest);
    const forecast = useSelector(selectHarvestForecast);
    const orders = useSelector(selectHarvestOrders);
    const loading = useSelector(selectHarvestLoading);
    const error = useSelector(selectHarvestError);

    useEffect(() => {
        dispatch(fetchHarvestById(id));
        dispatch(fetchHarvestForecast(id));
        dispatch(fetchHarvestOrders(id));
        return () => dispatch(clearSelectedHarvest());
    }, [dispatch, id]);

    if (loading && !harvest) {
        return (
            <div className="container py-5 text-center">
                <Spinner animation="border" variant="success" />
                <p className="text-muted mt-2">Loading harvest details…</p>
            </div>
        );
    }

    if (error && !harvest) {
        return (
            <div className="container py-5 text-center">
                <Alert variant="danger">{typeof error === "string" ? error : "Harvest not found"}</Alert>
                <Link to="/farmer/harvests" className="btn btn-outline-success">← Back to Harvests</Link>
            </div>
        );
    }

    const remaining = harvest
        ? (harvest.estimated_quantity || 0) - (forecast?.reserved_quantity || 0)
        : 0;

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>← Back</button>
                <span className="text-muted">/ Harvest Details</span>
            </div>

            <Row className="g-4">
                {/* Harvest Info */}
                <Col lg={4}>
                    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">
                                {harvest?.name || `Harvest #${harvest?.id}`}
                                <Badge bg={statusVariant[harvest?.status] || "light"} className="ms-2 text-capitalize">
                                    {harvest?.status || "planned"}
                                </Badge>
                            </Card.Title>
                            <div className="d-flex flex-column gap-2">
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Product</small>
                                    <p className="mb-0 fw-medium">{harvest?.product_name || harvest?.product?.name || "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Start Date</small>
                                    <p className="mb-0">{harvest?.start_date ? new Date(harvest.start_date).toLocaleDateString() : "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">End Date</small>
                                    <p className="mb-0">{harvest?.end_date ? new Date(harvest.end_date).toLocaleDateString() : "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Estimated Quantity</small>
                                    <p className="mb-0 fw-bold fs-5 text-success">{harvest?.estimated_quantity ?? "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Daily Limit</small>
                                    <p className="mb-0">{harvest?.max_quantity_per_day ?? "—"}</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex gap-2">
                                <Link to={`/farmer/harvests/${id}/edit`} className="btn btn-outline-primary btn-sm flex-grow-1">
                                    Edit Harvest
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Forecast */}
                <Col lg={4}>
                    <HarvestForecastCard forecast={{ ...forecast, estimated_quantity: harvest?.estimated_quantity }} />
                </Col>

                {/* Capacity */}
                <Col lg={4}>
                    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h6 fw-bold mb-3">Capacity</Card.Title>
                            <div className="p-3 bg-light rounded-3 text-center mb-3">
                                <div className="text-muted small">Estimated Quantity</div>
                                <div className="fs-4 fw-bold">{harvest?.estimated_quantity ?? 0}</div>
                            </div>
                            <div className="p-3 bg-light rounded-3 text-center mb-3">
                                <div className="text-muted small">Reserved Quantity</div>
                                <div className="fs-4 fw-bold text-warning">{forecast?.reserved_quantity ?? 0}</div>
                            </div>
                            <div className="p-3 bg-success bg-opacity-10 rounded-3 text-center">
                                <div className="text-muted small">Remaining Capacity</div>
                                <div className="fs-4 fw-bold text-success">{remaining}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Orders Section */}
                <Col xs={12}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">Orders</Card.Title>
                            <Table striped bordered hover responsive className="align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Customer</th>
                                        <th>Quantity</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-3">No orders yet.</td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id}>
                                                <td>{order.customer_name || order.customer?.name || "—"}</td>
                                                <td>{order.quantity ?? "—"}</td>
                                                <td>{order.date ? new Date(order.date).toLocaleDateString() : "—"}</td>
                                                <td>
                                                    <Badge bg={order.status === "confirmed" ? "success" : order.status === "pending" ? "warning" : "secondary"} className="text-capitalize">
                                                        {order.status || "pending"}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
