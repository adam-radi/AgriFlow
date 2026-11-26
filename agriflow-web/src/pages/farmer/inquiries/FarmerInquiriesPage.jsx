import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col, Badge, Card, Spinner, Form } from "react-bootstrap";
import { Button } from "../../../components/common";
import {
    fetchInquiries,
    clearInquiryError,
} from "../../../features/inquiries/inquirySlice";
import {
    selectInquiries,
    selectInquiryLoading,
    selectInquiryError,
} from "../../../features/inquiries/inquirySelectors";

const STATUS_LABELS = {
    pending: { label: "Nouvelle demande", bg: "warning", text: "dark" },
    negotiating: { label: "Négociation en cours", bg: "info", text: "dark" },
    accepted: { label: "Accord de principe", bg: "primary", text: "white" },
    confirmed: { label: "Accord confirmé", bg: "success", text: "white" },
    rejected: { label: "Refusée", bg: "danger", text: "white" },
    cancelled: { label: "Annulée par l'acheteur", bg: "secondary", text: "white" },
    in_delivery: { label: "En cours d'expédition", bg: "info", text: "dark" },
    delivered: { label: "Livrée & Réceptionnée", bg: "success", text: "white" },
};

export default function FarmerInquiriesPage() {
    const dispatch = useDispatch();
    const inquiries = useSelector(selectInquiries);
    const loading = useSelector(selectInquiryLoading);
    const error = useSelector(selectInquiryError);

    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchInquiries());
        return () => {
            dispatch(clearInquiryError());
        };
    }, [dispatch]);

    const filteredInquiries = useMemo(() => {
        return (inquiries || []).filter((inq) => {
            if (filterStatus === "active") {
                if (!["pending", "negotiating", "accepted"].includes(inq.status)) return false;
            } else if (filterStatus !== "all" && inq.status !== filterStatus) {
                return false;
            }
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                const productName = inq.product?.name?.toLowerCase() || "";
                const buyerName = inq.buyer?.name?.toLowerCase() || "";
                return productName.includes(term) || buyerName.includes(term);
            }
            return true;
        });
    }, [inquiries, filterStatus, searchTerm]);

    const pendingCount = useMemo(() => {
        return (inquiries || []).filter((i) => i.status === "pending" || i.status === "negotiating").length;
    }, [inquiries]);

    return (
        <Container fluid className="py-4 px-lg-5">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <span
                        className="text-uppercase fw-bold small"
                        style={{ color: "var(--af-green-700, #398565)", letterSpacing: "0.05em" }}
                    >
                        Espace Producteur · Ventes directes B2B
                    </span>
                    <h2 className="fw-bold mb-1" style={{ color: "var(--af-green-950, #15372F)" }}>
                        Demandes d&apos;Achat & Négociations Reçues
                    </h2>
                    <p className="text-muted small mb-0">
                        Consultez les offres des acheteurs professionnels, proposez vos contre-offres et concluez des accords sans intermédiaire.
                    </p>
                </div>
                {pendingCount > 0 && (
                    <Badge bg="warning" text="dark" className="fs-6 py-2 px-3 rounded-pill">
                        ⚡ {pendingCount} demande(s) à traiter
                    </Badge>
                )}
            </div>

            {/* Filter bar */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-3">
                    <Row className="g-3 align-items-center">
                        <Col xs={12} md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher par produit ou nom d'acheteur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-pill"
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                                {[
                                    { key: "all", label: "Toutes" },
                                    { key: "active", label: "À traiter" },
                                    { key: "confirmed", label: "Confirmées" },
                                    { key: "in_delivery", label: "En expédition" },
                                    { key: "delivered", label: "Livrées" },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setFilterStatus(tab.key)}
                                        className={`btn btn-sm rounded-pill px-3 transition-all ${
                                            filterStatus === tab.key
                                                ? "btn-success text-white fw-bold shadow-sm"
                                                : "btn-light text-muted"
                                        }`}
                                        style={
                                            filterStatus === tab.key
                                                ? { backgroundColor: "var(--af-green-800, #194638)", borderColor: "var(--af-green-800, #194638)" }
                                                : {}
                                        }
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Content */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3 text-muted small">Chargement des demandes d&apos;achat...</p>
                </div>
            ) : error ? (
                <Card className="border-0 shadow-sm rounded-4 text-center p-5">
                    <p className="text-danger mb-3">{error}</p>
                    <div>
                        <Button variant="outline-primary" pill onClick={() => dispatch(fetchInquiries())}>
                            Réessayer
                        </Button>
                    </div>
                </Card>
            ) : filteredInquiries.length === 0 ? (
                <Card className="border-0 shadow-sm rounded-4 text-center p-5">
                    <div className="py-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{ width: "64px", height: "64px", backgroundColor: "var(--af-green-100, #E8F2EC)", color: "var(--af-green-800, #194638)" }}
                        >
                            📦
                        </div>
                        <h4 className="fw-bold" style={{ color: "var(--af-green-950, #15372F)" }}>
                            Aucune demande d&apos;achat reçue
                        </h4>
                        <p className="text-muted small mx-auto mb-0" style={{ maxWidth: "460px" }}>
                            {filterStatus !== "all" || searchTerm
                                ? "Aucune proposition ne correspond à vos filtres actuels."
                                : "Dès qu'un acheteur professionnel consultera vos récoltes et soumettra une offre de volume, elle apparaîtra ici."}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {filteredInquiries.map((inq) => {
                        const statusMeta = STATUS_LABELS[inq.status] || {
                            label: inq.status,
                            bg: "secondary",
                            text: "white",
                        };
                        const totalEst = (Number(inq.current_quantity || 0) * Number(inq.current_price || 0)).toFixed(2);

                        return (
                            <Card
                                key={inq.id}
                                className="border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow"
                            >
                                <Card.Body className="p-4">
                                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                                        {/* Product & Buyer info */}
                                        <div className="d-flex align-items-center gap-3">
                                            <div
                                                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: "56px",
                                                    height: "56px",
                                                    backgroundColor: "var(--af-green-100, #E8F2EC)",
                                                    color: "var(--af-green-800, #194638)",
                                                    fontSize: "1.5rem",
                                                }}
                                            >
                                                🚜
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                                        {inq.product?.name || "Produit"}
                                                    </h5>
                                                    <Badge bg={statusMeta.bg} text={statusMeta.text} className="rounded-pill px-2 py-1">
                                                        {statusMeta.label}
                                                    </Badge>
                                                </div>
                                                <p className="small text-muted mb-0">
                                                    Acheteur : <strong className="text-dark">{inq.buyer?.name || "Client B2B"}</strong> {inq.buyer?.company_name ? `(${inq.buyer.company_name})` : ""} · Lieu : <span className="text-dark">{inq.delivery_zone || "Casablanca"}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantities & Prices */}
                                        <div className="d-flex flex-wrap align-items-center gap-4 text-nowrap">
                                            <div>
                                                <span className="text-muted small d-block">Volume demandé</span>
                                                <strong className="fs-6" style={{ color: "var(--af-green-950, #15372F)" }}>
                                                    {inq.current_quantity} kg
                                                </strong>
                                            </div>
                                            <div>
                                                <span className="text-muted small d-block">Prix proposé</span>
                                                <strong className="fs-6 text-success">
                                                    {inq.current_price} DH/kg
                                                </strong>
                                            </div>
                                            <div>
                                                <span className="text-muted small d-block">Valeur totale</span>
                                                <strong className="fs-6 text-dark">
                                                    {totalEst} DH
                                                </strong>
                                            </div>

                                            {/* CTA */}
                                            <div>
                                                <Button
                                                    as={Link}
                                                    to={`/farmer/inquiries/${inq.id}`}
                                                    variant="primary"
                                                    pill
                                                    size="sm"
                                                >
                                                    Traiter la négociation →
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>
            )}
        </Container>
    );
}
