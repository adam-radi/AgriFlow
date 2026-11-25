import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";
import { fetchOrders } from "../../../features/orders/orderSlice";
import {
    selectOrders,
    selectOrdersLoading,
    selectOrdersError,
} from "../../../features/orders/orderSelectors";
import OrderCard from "../../../components/orders/OrderCard";
import { LoadingState, EmptyState, Badge, Button } from "../../../components/common";

const FILTER_TABS = [
    { id: "all", label: "Toutes" },
    { id: "active", label: "En cours d'acheminement" },
    { id: "delivered", label: "Réceptionnées" },
    { id: "cancelled", label: "Annulées" },
];

/**
 * OrdersPage — Gestion et suivi des commandes pour l'Acheteur Professionnel (Lot 10)
 */
export default function OrdersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orders = useSelector(selectOrders) || [];
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    // Métriques calculées sur les données réelles
    const totalOrdersCount = orders.length;
    const activeOrdersCount = orders.filter(
        (o) =>
            o.status === "pending" ||
            o.status === "confirmed" ||
            o.status === "processing" ||
            o.status === "preparing" ||
            o.status === "in_delivery" ||
            o.status === "delivering" ||
            o.status === "ready_for_delivery"
    ).length;
    const deliveredOrdersCount = orders.filter(
        (o) => o.status === "delivered" || o.status === "completed"
    ).length;
    const totalSpentMAD = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((acc, curr) => acc + (Number(curr.total_amount || curr.total || 0)), 0);

    // Filtrage dynamique
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            // Filtre par statut d'onglet
            let matchesTab = true;
            if (activeTab === "active") {
                matchesTab =
                    order.status === "pending" ||
                    order.status === "confirmed" ||
                    order.status === "processing" ||
                    order.status === "preparing" ||
                    order.status === "in_delivery" ||
                    order.status === "delivering" ||
                    order.status === "ready_for_delivery";
            } else if (activeTab === "delivered") {
                matchesTab = order.status === "delivered" || order.status === "completed";
            } else if (activeTab === "cancelled") {
                matchesTab = order.status === "cancelled";
            }

            // Filtre par recherche texte (id ou zone)
            let matchesSearch = true;
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase().trim();
                const matchId = String(order.id).toLowerCase().includes(term);
                const matchZone = order.zone ? order.zone.toLowerCase().includes(term) : false;
                matchesSearch = matchId || matchZone;
            }

            return matchesTab && matchesSearch;
        });
    }, [orders, activeTab, searchTerm]);

    return (
        <div className="af-dashboard-container">
            {/* ── 1. En-tête de section ────────────────────────────────────────── */}
            <div className="af-dashboard-header-row">
                <div className="af-dashboard-title-group">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <h1>Mes Commandes d&apos;Approvisionnement</h1>
                        <Badge variant="primary" size="md">
                            {totalOrdersCount} commande{totalOrdersCount > 1 ? "s" : ""}
                        </Badge>
                    </div>
                    <p>
                        Suivez en temps réel la préparation des lots agricoles et la traçabilité de vos expéditions.
                    </p>
                </div>

                <div className="af-dashboard-actions">
                    <Link to="/products" className="af-btn-primary-pill">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        Commander de nouvelles récoltes
                    </Link>
                </div>
            </div>

            {/* ── 2. Indicateurs Clés (KPIs réels) ─────────────────────────────── */}
            <div className="af-stats-row">
                {/* Total */}
                <div className="af-stat-card-featured">
                    <div className="af-stat-card-top">
                        <span className="af-stat-card-label">Volume de Commandes</span>
                        <span className="fs-5">📦</span>
                    </div>
                    <div className="af-stat-value">{totalOrdersCount}</div>
                    <div className="af-stat-pill">
                        <span>{deliveredOrdersCount}</span> livrée{deliveredOrdersCount > 1 ? "s" : ""}
                    </div>
                </div>

                {/* En cours */}
                <div className="af-stat-card-white">
                    <div className="af-stat-card-top">
                        <span className="af-stat-card-label">En Cours d&apos;Acheminement</span>
                        <span className="fs-5">🚚</span>
                    </div>
                    <div className="af-stat-value">{activeOrdersCount}</div>
                    <div className="af-stat-pill success">
                        <span>{activeOrdersCount}</span> lot{activeOrdersCount > 1 ? "s" : ""} actif{activeOrdersCount > 1 ? "s" : ""}
                    </div>
                </div>

                {/* Réceptionnées */}
                <div className="af-stat-card-white">
                    <div className="af-stat-card-top">
                        <span className="af-stat-card-label">Réceptionnées & Validées</span>
                        <span className="fs-5">✅</span>
                    </div>
                    <div className="af-stat-value">{deliveredOrdersCount}</div>
                    <span className="af-stat-subtitle-text">
                        Conformité garantie
                    </span>
                </div>

                {/* Montant total */}
                <div className="af-stat-card-white">
                    <div className="af-stat-card-top">
                        <span className="af-stat-card-label">Total Acheté (MAD)</span>
                        <span className="fs-5">💰</span>
                    </div>
                    <div className="af-stat-value" style={{ fontSize: "22px" }}>
                        {totalSpentMAD.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} DH
                    </div>
                    <span className="af-stat-subtitle-text">
                        Facturation directe producteur
                    </span>
                </div>
            </div>

            {/* ── 3. Barre de filtre et recherche ──────────────────────────────── */}
            <div className="af-panel-card mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    {/* Tabs */}
                    <div className="d-flex gap-2 flex-wrap">
                        {FILTER_TABS.map((tab) => {
                            let count = totalOrdersCount;
                            if (tab.id === "active") count = activeOrdersCount;
                            if (tab.id === "delivered") count = deliveredOrdersCount;
                            if (tab.id === "cancelled") {
                                count = orders.filter((o) => o.status === "cancelled").length;
                            }

                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`btn btn-sm rounded-pill px-3 py-1.5 transition-all ${
                                        isActive
                                            ? "btn-success fw-bold"
                                            : "btn-outline-secondary"
                                    }`}
                                    style={
                                        isActive
                                            ? {
                                                  backgroundColor: "var(--af-primary-forest, #15372F)",
                                                  borderColor: "var(--af-primary-forest, #15372F)",
                                              }
                                            : {}
                                    }
                                >
                                    {tab.label} <span className="opacity-75 ms-1">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div style={{ maxWidth: "320px", width: "100%" }}>
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control form-control-sm rounded-pill ps-4 py-2"
                                placeholder="Rechercher par N° ou Région..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span
                                className="position-absolute top-50 translate-middle-y text-muted"
                                style={{ left: "12px", pointerEvents: "none" }}
                            >
                                🔍
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 4. Alertes éventuelles ───────────────────────────────────────── */}
            {error && (
                <Alert variant="danger" className="rounded-3 shadow-sm mb-4">
                    {typeof error === "string" ? error : error?.message || "Impossible de charger vos commandes"}
                </Alert>
            )}

            {/* ── 5. Liste des Commandes ───────────────────────────────────────── */}
            {loading && orders.length === 0 ? (
                <LoadingState message="Chargement de vos commandes en cours..." />
            ) : filteredOrders.length === 0 ? (
                <EmptyState
                    icon="📦"
                    title={
                        searchTerm || activeTab !== "all"
                            ? "Aucune commande ne correspond aux filtres"
                            : "Vous n'avez pas encore passé de commande"
                    }
                    description={
                        searchTerm || activeTab !== "all"
                            ? "Essayez d'élargir votre recherche ou de sélectionner un autre statut."
                            : "Parcourez notre catalogue agricole pour vous approvisionner directement auprès des coopératives et exploitants marocains."
                    }
                    action={
                        <Button
                            variant="primary"
                            pill
                            onClick={() => {
                                if (searchTerm || activeTab !== "all") {
                                    setSearchTerm("");
                                    setActiveTab("all");
                                } else {
                                    navigate("/products");
                                }
                            }}
                        >
                            {searchTerm || activeTab !== "all"
                                ? "Réinitialiser les filtres"
                                : "Découvrir les récoltes disponibles"}
                        </Button>
                    }
                />
            ) : (
                <Row className="g-4">
                    {filteredOrders.map((order) => (
                        <Col key={order.id} sm={6} lg={4}>
                            <OrderCard
                                order={order}
                                onView={(id) => navigate(`/client/orders/${id}`)}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
