import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spinner, Card, Table, Alert, Badge } from "react-bootstrap";
import { fetchStats, fetchUsers, fetchOrders } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminStats,
    selectAdminUsers,
    selectAdminOrders,
    selectAdminLoading,
    selectAdminError,
} from "../../app/store/slices/admin/adminSelectors";
import AdminStatsCard from "../../components/admin/AdminStatsCard";

const STATUS_COLORS = {
    pending: "warning",
    confirmed: "info",
    cancelled: "danger",
    delivered: "success",
};

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const stats = useSelector(selectAdminStats);
    const users = useSelector(selectAdminUsers);
    const orders = useSelector(selectAdminOrders);
    const loading = useSelector(selectAdminLoading);
    const error = useSelector(selectAdminError);

    useEffect(() => {
        dispatch(fetchStats());
        dispatch(fetchUsers({ limit: 5 }));
        dispatch(fetchOrders({ limit: 5 }));
    }, [dispatch]);

    const pendingOrders = orders.filter((o) => o.status === "pending");
    const confirmedOrders = orders.filter((o) => o.status === "confirmed");

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Admin Dashboard</h1>
                <p className="text-muted mb-0">System overview and monitoring</p>
            </div>

            {error && <Alert variant="danger" dismissible>{typeof error === "string" ? error : "Failed to load some data"}</Alert>}

            {loading && Object.keys(stats).length === 0 ? (
                <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
            ) : (
                <>
                    <Row className="g-3 mb-4">
                        <Col xs={6} md={3}>
                            <AdminStatsCard title="Users" value={stats.total_users ?? "—"} icon="Users" />
                        </Col>
                        <Col xs={6} md={3}>
                            <AdminStatsCard title="Products" value={stats.total_products ?? "—"} icon="Products" />
                        </Col>
                        <Col xs={6} md={3}>
                            <AdminStatsCard title="Orders" value={stats.total_orders ?? "—"} icon="Cart" />
                        </Col>
                        <Col xs={6} md={3}>
                            <AdminStatsCard title="Revenue" value={stats.total_revenue ? `${Number(stats.total_revenue).toFixed(2)} MAD` : "—"} icon="MoneyBag" />
                        </Col>
                    </Row>

                    <Row className="g-3 mb-4">
                        <Col xs={6} md={4}>
                            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                                <Card.Body className="d-flex align-items-center gap-3">
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff3cd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                                        ⏳
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: ".8rem" }}>Pending Orders</div>
                                        <div className="fw-bold" style={{ fontSize: "1.3rem" }}>{pendingOrders.length}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={6} md={4}>
                            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                                <Card.Body className="d-flex align-items-center gap-3">
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#d1ecf1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                                        📦
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: ".8rem" }}>To Ship</div>
                                        <div className="fw-bold" style={{ fontSize: "1.3rem" }}>{confirmedOrders.length}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={6} md={4}>
                            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                                <Card.Body className="d-flex align-items-center gap-3">
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#d4edda", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                                        ✅
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: ".8rem" }}>Delivered</div>
                                        <div className="fw-bold" style={{ fontSize: "1.3rem" }}>{stats.delivered_orders ?? 0}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
                                <Card.Body>
                                    <Card.Title className="h6 fw-bold mb-3">Recent Users</Card.Title>
                                    <Table striped bordered hover responsive size="sm" className="align-middle mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.slice(0, 5).map((u) => (
                                                <tr key={u.id}>
                                                    <td>{u.name || "—"}</td>
                                                    <td>{u.email}</td>
                                                    <td>{u.role}</td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr><td colSpan={3} className="text-center text-muted py-2">No users</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Card.Title className="h6 fw-bold mb-0">Recent Orders</Card.Title>
                                        <a href="/admin/orders" className="text-decoration-none" style={{ fontSize: ".8rem", color: "#2d6a4f" }}>View all</a>
                                    </div>
                                    <Table striped bordered hover responsive size="sm" className="align-middle mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Customer</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 5).map((o) => (
                                                <tr
                                                    key={o.id}
                                                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <td className="fw-medium">#{o.id}</td>
                                                    <td>{o.customer?.name || "—"}</td>
                                                    <td>{o.total_amount ? `${Number(o.total_amount).toFixed(2)} MAD` : "—"}</td>
                                                    <td>
                                                        <Badge bg={STATUS_COLORS[o.status] || "secondary"}>{o.status}</Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr><td colSpan={4} className="text-center text-muted py-2">No orders</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}
