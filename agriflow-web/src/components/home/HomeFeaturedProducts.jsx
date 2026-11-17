import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../features/products/productSlice";
import {
    selectAllProducts,
    selectProductsLoading,
    selectProductsError,
} from "../../features/products/productSelectors";
import ProductCard from "../products/ProductCard";

function ProductSkeleton() {
    return (
        <div
            className="h-100 d-flex flex-column"
            style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                border: "1px solid #E2E9E3",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    height: "210px",
                    backgroundColor: "#F0F3EF",
                    animation: "pulse 1.5s infinite ease-in-out",
                }}
            />
            <div className="p-3">
                <div
                    style={{
                        height: 20,
                        width: "65%",
                        backgroundColor: "#F0F3EF",
                        borderRadius: 6,
                        marginBottom: 10,
                    }}
                />
                <div
                    style={{
                        height: 14,
                        width: "90%",
                        backgroundColor: "#F0F3EF",
                        borderRadius: 4,
                        marginBottom: 6,
                    }}
                />
                <div
                    style={{
                        height: 14,
                        width: "45%",
                        backgroundColor: "#F0F3EF",
                        borderRadius: 4,
                        marginBottom: 18,
                    }}
                />
                <div
                    style={{
                        height: 24,
                        width: "40%",
                        backgroundColor: "#F0F3EF",
                        borderRadius: 6,
                    }}
                />
            </div>
        </div>
    );
}

export default function HomeFeaturedProducts() {
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);

    useEffect(() => {
        if (!products || products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products]);

    const displayProducts = Array.isArray(products) ? products.slice(0, 4) : [];

    return (
        <section
            id="products"
            style={{
                backgroundColor: "#FFFFFF",
                padding: "80px 0",
                borderTop: "1px solid #E2E9E3",
                borderBottom: "1px solid #E2E9E3",
            }}
        >
            <Container>
                {/* Section Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-5">
                    <div>
                        <div
                            className="text-uppercase fw-bold mb-2"
                            style={{
                                color: "#398565",
                                fontSize: "0.78rem",
                                letterSpacing: "0.08em",
                            }}
                        >
                            Offre Directe Producteurs
                        </div>
                        <h2
                            className="fw-bold mb-1"
                            style={{
                                color: "#15372F",
                                letterSpacing: "-0.03em",
                                fontSize: "clamp(1.75rem, 3.2vw, 2.4rem)",
                            }}
                        >
                            Récoltes disponibles en direct
                        </h2>
                        <p className="mb-0" style={{ color: "#68756E", fontSize: "1rem" }}>
                            Lots et productions vérifiés en provenance des exploitations marocaines.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="text-decoration-none d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2"
                        style={{
                            backgroundColor: "#F6F8F5",
                            color: "#15372F",
                            border: "1px solid #CBD7CE",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            alignSelf: "flex-start",
                            transition: "all 150ms ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#E8F2EC";
                            e.currentTarget.style.borderColor = "#194638";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#F6F8F5";
                            e.currentTarget.style.borderColor = "#CBD7CE";
                        }}
                    >
                        <span>Voir tout le catalogue ({products.length || 0})</span>
                        <span>→</span>
                    </Link>
                </div>

                {/* Error handling */}
                {error && !loading && (
                    <Alert
                        variant="light"
                        className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"
                        style={{
                            backgroundColor: "#FFF8F0",
                            border: "1px solid #FED7AA",
                            color: "#9A3412",
                            borderRadius: "14px",
                        }}
                    >
                        <span>Information : impossible de synchroniser le catalogue en direct pour le moment.</span>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-dark rounded-pill"
                            onClick={() => dispatch(fetchProducts())}
                        >
                            Réessayer
                        </button>
                    </Alert>
                )}

                {/* Loading state */}
                {loading && products.length === 0 && (
                    <Row className="g-4">
                        {[1, 2, 3, 4].map((idx) => (
                            <Col key={idx} xs={12} sm={6} lg={3}>
                                <ProductSkeleton />
                            </Col>
                        ))}
                    </Row>
                )}

                {/* Empty state */}
                {!loading && displayProducts.length === 0 && (
                    <div
                        className="text-center py-5 px-4 rounded-4"
                        style={{
                            backgroundColor: "#F6F8F5",
                            border: "1px dashed #CBD7CE",
                        }}
                    >
                        <h4 className="fw-bold mb-2" style={{ color: "#15372F" }}>
                            Aucune récolte actuellement listée
                        </h4>
                        <p style={{ color: "#68756E", maxWidth: "460px", margin: "0 auto 20px" }}>
                            Les agriculteurs publient leurs disponibilités au fur et à mesure des récoltes et saisons.
                        </p>
                        <Link
                            to="/register/farmer"
                            className="btn rounded-pill px-4 py-2"
                            style={{
                                backgroundColor: "#194638",
                                color: "#ffffff",
                                fontWeight: 600,
                            }}
                        >
                            Proposer une récolte en tant que producteur
                        </Link>
                    </div>
                )}

                {/* Products Grid */}
                {displayProducts.length > 0 && (
                    <Row className="g-4">
                        {displayProducts.map((product) => (
                            <Col key={product.id} xs={12} sm={6} lg={3}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </section>
    );
}
