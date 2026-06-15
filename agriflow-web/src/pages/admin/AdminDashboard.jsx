import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Spinner, Card, Table } from "react-bootstrap";
import { fetchStats, fetchUsers, fetchOrders } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminStats,
    selectAdminUsers,
    selectAdminOrders,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import AdminStatsCard from "../../components/admin/AdminStatsCard";

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const stats = useSelector(selectAdminStats);
    const users = useSelector(selectAdminUsers);
    const orders = useSelector(selectAdminOrders);
    const loading = useSelector(selectAdminLoading);

    useEffect(() => {
        dispatch(fetchStats());
        dispatch(fetchUsers({ limit: 5 }));
        dispatch(fetchOrders({ limit: 5 }));
    }, [dispatch]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Admin Dashboard</h1>
                <p className="text-muted mb-0">System overview and monitoring</p>
            </div>

            {loading && Object.keys(stats).length === 0 ? (
                <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
            ) : (
                <>
                    <Row className="g-3 mb-4">
                        <Col xs={6} md={3}>
                            <AdminStatsCard title="Users" value={stats.total_users ?? "—"} icon="👥" />
                        </Col>
                        <Col xs={6} md={3}>
                            <AdminStatsCard title="Products" value={stats.total_products ?? "—"} icon="📦" />
                        </Col>
                        <Col xs={6} md={3}>
                            <AdminStatsCard title="Orders" value={stats.total_orders ?? "—"} icon="🛒" />
                        </Col>
                        <Col xs={6} md={3}>
                            <AdminStatsCard title="Revenue" value={stats.total_revenue ? `${Number(stats.total_revenue).toFixed(2)} MAD` : "—"} icon="💰" />
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
                                                    <td>{u.name || `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "—"}</td>
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
                                    <Card.Title className="h6 fw-bold mb-3">Recent Orders</Card.Title>
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
                                                <tr key={o.id}>
                                                    <td className="fw-medium">#{o.id}</td>
                                                    <td>{o.customer_name || o.customer?.name || "—"}</td>
                                                    <td>{o.total_amount ? `${Number(o.total_amount).toFixed(2)} MAD` : "—"}</td>
                                                    <td>{o.status}</td>
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
