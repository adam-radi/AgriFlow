import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchFarmerProducts } from "../../features/products/productSlice";
import { fetchFarmerHarvests } from "../../features/harvests/harvestSlice";
import { fetchFarmerOrders } from "../../features/orders/orderSlice";
import { selectFarmerProducts, selectProductsLoading } from "../../features/products/productSelectors";
import { selectFarmerHarvests, selectHarvestLoading } from "../../features/harvests/harvestSelectors";
import { selectOrders, selectOrdersLoading } from "../../features/orders/orderSelectors";
import FarmerStatsCard from "../../components/farmer/FarmerStatsCard";

export default function FarmerDashboard() {
    const dispatch = useDispatch();
    const products = useSelector(selectFarmerProducts);
    const harvests = useSelector(selectFarmerHarvests);
    const orders = useSelector(selectOrders);
    const productsLoading = useSelector(selectProductsLoading);
    const harvestLoading = useSelector(selectHarvestLoading);
    const ordersLoading = useSelector(selectOrdersLoading);
    const loading = productsLoading || harvestLoading || ordersLoading;

    useEffect(() => {
        dispatch(fetchFarmerProducts());
        dispatch(fetchFarmerHarvests());
        dispatch(fetchFarmerOrders());
    }, [dispatch]);

    const stats = {
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.is_available !== false).length,
        outOfStock: products.filter((p) => p.is_available === false || p.status === "out_of_stock").length,
        totalHarvests: harvests.length,
        totalOrders: orders.length,
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Farmer Dashboard</h1>
                <p className="text-muted mb-0">Overview of your farm activities</p>
            </div>

            {loading && products.length === 0 ? (
                <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
            ) : (
                <>
                    <Row className="g-3 mb-4">
                        <Col xs={6} md={4} lg={2}>
                            <FarmerStatsCard title="Total Products" value={stats.totalProducts} icon="📦" color="#e8f5e9" />
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <FarmerStatsCard title="Active" value={stats.activeProducts} icon="✅" color="#d1fae5" />
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <FarmerStatsCard title="Out of Stock" value={stats.outOfStock} icon="⚠️" color="#fee2e2" />
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <FarmerStatsCard title="Harvests" value={stats.totalHarvests} icon="🌱" color="#dbeafe" />
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <FarmerStatsCard title="Orders" value={stats.totalOrders} icon="🛒" color="#fef3c7" />
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={6}>
                            <div className="p-4" style={{ borderRadius: "12px", backgroundColor: "#fff", boxShadow: "var(--shadow-md)" }}>
                                <h6 className="fw-bold mb-3">Recent Products</h6>
                                {products.slice(0, 5).map((p) => (
                                    <div key={p.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <span className="fw-medium" style={{ color: "var(--text-dark)" }}>{p.name}</span>
                                        <span className="small" style={{ color: p.is_available !== false ? "var(--agri-green)" : "#dc2626" }}>
                                            {p.is_available !== false ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                ))}
                                <Link to="/farmer/products" className="btn btn-outline-success btn-sm mt-3 w-100">Manage Products →</Link>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="p-4" style={{ borderRadius: "12px", backgroundColor: "#fff", boxShadow: "var(--shadow-md)" }}>
                                <h6 className="fw-bold mb-3">Recent Harvests</h6>
                                {harvests.slice(0, 5).map((h) => (
                                    <div key={h.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <span className="fw-medium" style={{ color: "var(--text-dark)" }}>
                                            {h.product_name || h.product?.name || `Harvest #${h.id}`}
                                        </span>
                                        <span className="small text-muted">{h.status}</span>
                                    </div>
                                ))}
                                <Link to="/farmer/harvests" className="btn btn-outline-success btn-sm mt-3 w-100">Manage Harvests →</Link>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}
