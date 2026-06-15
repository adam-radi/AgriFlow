import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { fetchDeliveryGroups } from "../../features/delivery/deliverySlice";
import {
    selectAllDeliveryGroups,
    selectDeliveryLoading,
} from "../../features/delivery/deliverySelectors";
import DeliveryStatusBadge from "../../components/delivery/DeliveryStatusBadge";
import DeliveryGroupList from "../../components/delivery/DeliveryGroupList";

export default function DeliveryDashboard() {
    const dispatch = useDispatch();
    const groups = useSelector(selectAllDeliveryGroups);
    const loading = useSelector(selectDeliveryLoading);

    const statusCounts = {
        pending: groups.filter((g) => g.status === "pending").length,
        planned: groups.filter((g) => g.status === "planned").length,
        assigned: groups.filter((g) => g.status === "assigned").length,
        in_progress: groups.filter((g) => g.status === "in_progress").length,
        delivered: groups.filter((g) => g.status === "delivered").length,
    };

    useEffect(() => {
        dispatch(fetchDeliveryGroups());
    }, [dispatch]);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-1">Delivery Dashboard</h1>
                    <p className="text-muted mb-0">Monitor and manage delivery groups</p>
                </div>
                <Link to="/delivery/groups" className="btn btn-success">View All Groups</Link>
            </div>

            {loading && groups.length === 0 ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                </div>
            ) : (
                <>
                    <Row className="g-3 mb-4">
                        <Col xs={6} md={4} lg={2}>
                            <Card className="shadow-sm border-0 text-center p-3 h-100" style={{ borderRadius: "12px" }}>
                                <div className="fs-3 fw-bold">{groups.length}</div>
                                <small className="text-muted">Total Groups</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="shadow-sm border-0 text-center p-3 h-100" style={{ borderRadius: "12px" }}>
                                <div className="fs-3 fw-bold text-secondary">{statusCounts.pending}</div>
                                <small className="text-muted"><DeliveryStatusBadge status="pending" /></small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="shadow-sm border-0 text-center p-3 h-100" style={{ borderRadius: "12px" }}>
                                <div className="fs-3 fw-bold text-info">{statusCounts.planned}</div>
                                <small className="text-muted"><DeliveryStatusBadge status="planned" /></small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="shadow-sm border-0 text-center p-3 h-100" style={{ borderRadius: "12px" }}>
                                <div className="fs-3 fw-bold text-primary">{statusCounts.assigned}</div>
                                <small className="text-muted"><DeliveryStatusBadge status="assigned" /></small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="shadow-sm border-0 text-center p-3 h-100" style={{ borderRadius: "12px" }}>
                                <div className="fs-3 fw-bold text-warning">{statusCounts.in_progress}</div>
                                <small className="text-muted"><DeliveryStatusBadge status="in_progress" /></small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="shadow-sm border-0 text-center p-3 h-100" style={{ borderRadius: "12px" }}>
                                <div className="fs-3 fw-bold text-success">{statusCounts.delivered}</div>
                                <small className="text-muted"><DeliveryStatusBadge status="delivered" /></small>
                            </Card>
                        </Col>
                    </Row>

                    <h5 className="fw-bold mb-3">Recent Groups</h5>
                    <DeliveryGroupList
                        groups={groups.slice(0, 8)}
                        linkPrefix="/delivery/groups"
                    />
                </>
            )}
        </div>
    );
}
