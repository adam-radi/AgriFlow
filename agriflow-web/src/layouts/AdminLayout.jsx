import { Outlet } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
    return (
        <div className="container-fluid">
            <Row className="g-0" style={{ minHeight: "100vh" }}>
                <Col xs={2} className="bg-light border-end" style={{ minWidth: 220 }}>
                    <AdminSidebar />
                </Col>
                <Col style={{ overflow: "auto", backgroundColor: "#f8f9fa" }}>
                    <Outlet />
                </Col>
            </Row>
        </div>
    );
}

export default AdminLayout;