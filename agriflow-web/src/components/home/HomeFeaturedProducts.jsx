import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../features/products/productSlice";
import {
    selectAllProducts,
    selectProductsLoading,
    selectProductsError,
} from "../../features/products/productSelectors";
import ProductCard from "../products/ProductCard";
import {
    SectionHeader,
    Button,
    LoadingState,
    EmptyState,
    ErrorState,
} from "../common";

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
                borderTop: "1px solid var(--af-border, #E2E9E3)",
                borderBottom: "1px solid var(--af-border, #E2E9E3)",
            }}
        >
            <Container>
                {/* Standardized Section Header */}
                <SectionHeader
                    eyebrow="Offre Directe Producteurs"
                    title="Récoltes disponibles en direct"
                    subtitle="Lots et productions vérifiés en provenance directe des exploitations marocaines."
                    action={
                        <Button
                            as={Link}
                            to="/products"
                            variant="secondary"
                            pill
                        >
                            <span>Voir tout le catalogue ({products.length || 0})</span>
                            <span className="ms-1">→</span>
                        </Button>
                    }
                    className="mb-5"
                />

                {/* Error state */}
                {error && !loading && (
                    <div className="mb-4">
                        <ErrorState
                            title="Information catalogue"
                            message="Impossible de synchroniser le catalogue en direct pour le moment."
                            onRetry={() => dispatch(fetchProducts())}
                            retryLabel="Réessayer"
                        />
                    </div>
                )}

                {/* Loading state using shared LoadingState component */}
                {loading && products.length === 0 && (
                    <LoadingState variant="card" count={4} height={215} />
                )}

                {/* Empty state using shared EmptyState component */}
                {!loading && displayProducts.length === 0 && (
                    <EmptyState
                        title="Aucune récolte actuellement listée"
                        description="Les agriculteurs partenaires publient leurs disponibilités au fur et à mesure des récoltes et saisons."
                        action={
                            <Button
                                as={Link}
                                to="/register/farmer"
                                variant="primary"
                                pill
                            >
                                Proposer une récolte en tant que producteur
                            </Button>
                        }
                    />
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
