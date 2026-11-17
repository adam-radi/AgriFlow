import { Outlet } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Navbar from "../components/layout/Navbar";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <Row className="g-0" style={{ minHeight: "calc(100vh - 73px)" }}>
                    <Col xs={2} className="bg-light border-end" style={{ minWidth: 220 }}>
                        <AdminSidebar />
                    </Col>
                    <Col style={{ overflow: "auto", backgroundColor: "#f8f9fa" }}>
                        <Outlet />
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default AdminLayout;