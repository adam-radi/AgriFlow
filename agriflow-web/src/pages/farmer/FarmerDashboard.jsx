import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFarmerProducts } from "../../features/products/productSlice";
import { fetchFarmerHarvests } from "../../features/harvests/harvestSlice";
import { fetchFarmerOrders } from "../../features/orders/orderSlice";
import { fetchActiveVerification } from "../../features/verification/verificationSlice";
import { selectFarmerProducts } from "../../features/products/productSelectors";
import { selectFarmerHarvests } from "../../features/harvests/harvestSelectors";
import { selectOrders } from "../../features/orders/orderSelectors";
import { useVerificationAccess } from "../../features/verification/useVerificationAccess";
import VerificationBanner from "../../components/verification/VerificationBanner";

export default function FarmerDashboard() {
  const dispatch = useDispatch();
  const products = useSelector(selectFarmerProducts);
  const harvests = useSelector(selectFarmerHarvests);
  const orders = useSelector(selectOrders);

  const { status, canPublish, openModal, VerificationModal } = useVerificationAccess({ accountType: "farmer" });

  // Time tracker interactive state (matching Time Tracker widget)
  const [seconds, setSeconds] = useState(5048); // 01:24:08
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    dispatch(fetchFarmerProducts());
    dispatch(fetchFarmerHarvests());
    dispatch(fetchFarmerOrders());
    dispatch(fetchActiveVerification());
  }, [dispatch]);

  // Digital clock timer tick
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Metrics (computed from real store, fallback to visually rich values)
  const totalHarvestsCount = harvests.length > 0 ? harvests.length : 24;
  const completedOrdersCount =
    orders.filter((o) => o.status === "completed" || o.status === "delivered")
      .length || 10;
  const runningHarvestsCount =
    harvests.filter((h) => h.status === "in_progress" || h.status === "ready")
      .length || 12;
  const pendingOrdersCount =
    orders.filter((o) => o.status === "pending").length || 2;

  // Recent products list (uses real products if available, fallback to rich defaults)
  const recentProductsList =
    products.length > 0
      ? products.slice(0, 5).map((p, idx) => ({
          id: p.id || `p-${idx}`,
          name: p.name || `Produit #${idx + 1}`,
          date: p.is_available !== false ? "En stock" : "Épuisé",
          badge: `${p.price || 45} DH / kg`,
          icon: idx % 2 === 0 ? "🍅" : "🫒",
          color: idx % 2 === 0 ? "#fee2e2" : "#e8f5e9",
        }))
      : [
          {
            id: "p-1",
            name: "Tomates Cerises Bio",
            date: "Échéance : 26 Nov 2024",
            badge: "120 caisses",
            icon: "🍅",
            color: "#fee2e2",
          },
          {
            id: "p-2",
            name: "Olives Picholine",
            date: "Échéance : 28 Nov 2024",
            badge: "500 kg",
            icon: "🫒",
            color: "#e8f5e9",
          },
          {
            id: "p-3",
            name: "Oranges Valencia",
            date: "Échéance : 30 Nov 2024",
            badge: "300 caisses",
            icon: "🍊",
            color: "#ffedd5",
          },
          {
            id: "p-4",
            name: "Pommes de Terre Spunta",
            date: "Échéance : 05 Déc 2024",
            badge: "1.2 Tonnes",
            icon: "🥔",
            color: "#fef3c7",
          },
          {
            id: "p-5",
            name: "Menthe & Aromatiques",
            date: "Échéance : 06 Déc 2024",
            badge: "Prêt",
            icon: "🌿",
            color: "#ccfbf1",
          },
        ];

  // Collaborations / Buyer orders
  const buyerOrdersList = [
    {
      id: "b-1",
      buyer: "Alexandra Deff — Épicerie Bab Doukkala",
      task: "Commande #ORD-1042 · 40 caisses Tomates",
      status: "completed",
      statusLabel: "Livré",
      avatarBg: "#2563eb",
      initials: "AD",
    },
    {
      id: "b-2",
      buyer: "Edwin Adenike — Marché Central Marrakech",
      task: "Commande #ORD-1043 · 150 kg Olives vertes",
      status: "progress",
      statusLabel: "En cours",
      avatarBg: "#16a34a",
      initials: "EA",
    },
    {
      id: "b-3",
      buyer: "Isaac Oluwatemilorun — Superette Al Amal",
      task: "Commande #ORD-1044 · 80 caisses Oranges",
      status: "pending",
      statusLabel: "En attente",
      avatarBg: "#ea580c",
      initials: "IO",
    },
    {
      id: "b-4",
      buyer: "David Oshodi — Hôtel & Riad Fès",
      task: "Commande #ORD-1045 · 25 L Huile d'olive extra",
      status: "progress",
      statusLabel: "En cours",
      avatarBg: "#0d9488",
      initials: "DO",
    },
  ];

  return (
    <div className="af-dashboard-container">
      {/* 1. Header Row (Dashboard Title + Action Pills) */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <h1>Tableau de bord</h1>
          <p>
            Suivez, planifiez et gérez vos récoltes et commandes agricoles en toute simplicité.
          </p>
        </div>

        <div className="af-dashboard-actions">
          {canPublish ? (
            <Link to="/farmer/harvests/create" className="af-btn-primary-pill">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nouvelle récolte
            </Link>
          ) : (
            <button
              type="button"
              className="af-btn-primary-pill"
              onClick={() => openModal("la création et publication de récoltes")}
              title="Vérification requise pour publier"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nouvelle récolte
              <span style={{ fontSize: "0.85em", marginLeft: "4px" }}>🔒</span>
            </button>
          )}

          <button
            type="button"
            className="af-btn-secondary-pill"
            onClick={() => alert("Exportation des données agricoles en cours...")}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exporter rapport
          </button>
        </div>
      </div>

      {/* Verification Status Indicator Banner (Phase 07) */}
      <VerificationBanner status={status} accountType="farmer" />

      {/* 2. Top Stats Row (4 Stat Cards with circular ↗ button) */}
      <div className="af-stats-row">
        {/* Card 1: Featured Dark Green Card */}
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Récoltes</span>
            <Link
              to="/farmer/harvests"
              className="af-stat-arrow-btn"
              aria-label="Voir toutes les récoltes"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{totalHarvestsCount}</div>
          <div className="af-stat-pill">
            <span>5 ↑</span> +18% ce mois-ci
          </div>
        </div>

        {/* Card 2: Ended / Completed Projects */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Commandes Livrées</span>
            <Link
              to="/farmer/orders"
              className="af-stat-arrow-btn"
              aria-label="Voir les commandes livrées"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{completedOrdersCount}</div>
          <div className="af-stat-pill success">
            <span>6 ↑</span> +12% ce mois-ci
          </div>
        </div>

        {/* Card 3: Running Projects */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Récoltes En Cours</span>
            <Link
              to="/farmer/harvests"
              className="af-stat-arrow-btn"
              aria-label="Voir les récoltes en cours"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{runningHarvestsCount}</div>
          <div className="af-stat-pill neutral">
            <span>2 ↑</span> 4 prêtes à cueillir
          </div>
        </div>

        {/* Card 4: Pending Projects */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">En Négociation</span>
            <Link
              to="/farmer/orders"
              className="af-stat-arrow-btn"
              aria-label="Voir les négociations"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{pendingOrdersCount}</div>
          <span className="af-stat-subtitle-text">En attente acheteur</span>
        </div>
      </div>

      {/* 3. Middle Grid (Analytics Bar Chart + Reminders + Recent Products) */}
      <div className="af-grid-3cols">
        {/* Column 1: Project Analytics (Pill Bar Chart with stripes & 74% chip) */}
        <div className="af-panel-card">
          <div className="af-panel-header">
            <h2 className="af-panel-title">Analyses d&apos;Activité</h2>
            <span className="af-stat-subtitle-text">Volume / Jour</span>
          </div>

          <div className="af-barchart-container">
            <div className="af-barchart-bars">
              {/* Sun (Striped) */}
              <div className="af-bar-col">
                <div
                  className="af-bar-pill af-bar-striped"
                  style={{ height: "42%" }}
                />
                <span className="af-bar-label">D</span>
              </div>

              {/* Mon (Deep Green) */}
              <div className="af-bar-col">
                <div
                  className="af-bar-pill af-bar-solid-deep"
                  style={{ height: "68%" }}
                />
                <span className="af-bar-label">L</span>
              </div>

              {/* Tue (Agri Green + Tooltip chip) */}
              <div className="af-bar-col">
                <span className="af-bar-tooltip-chip">74%</span>
                <div
                  className="af-bar-pill af-bar-solid-agri"
                  style={{ height: "86%" }}
                />
                <span className="af-bar-label">M</span>
              </div>

              {/* Wed (Solid Deep Green Peak) */}
              <div className="af-bar-col">
                <div
                  className="af-bar-pill af-bar-solid-deep"
                  style={{ height: "94%" }}
                />
                <span className="af-bar-label">M</span>
              </div>

              {/* Thu (Striped) */}
              <div className="af-bar-col">
                <div
                  className="af-bar-pill af-bar-striped"
                  style={{ height: "52%" }}
                />
                <span className="af-bar-label">J</span>
              </div>

              {/* Fri (Striped) */}
              <div className="af-bar-col">
                <div
                  className="af-bar-pill af-bar-striped"
                  style={{ height: "40%" }}
                />
                <span className="af-bar-label">V</span>
              </div>

              {/* Sat (Striped) */}
              <div className="af-bar-col">
                <div
                  className="af-bar-pill af-bar-striped"
                  style={{ height: "64%" }}
                />
                <span className="af-bar-label">S</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Reminders Card */}
        <div className="af-panel-card">
          <div className="af-panel-header">
            <h2 className="af-panel-title">Rappels & Livraisons</h2>
          </div>

          <div className="af-reminder-box">
            <div>
              <h3 className="af-reminder-event-title">
                Livraison Coopérative Souss
              </h3>
              <p className="af-reminder-time">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Aujourd&apos;hui : 14h00 – 16h00
              </p>
            </div>

            <button
              type="button"
              className="af-btn-reminder-action"
              onClick={() => alert("Ouverture du suivi logistique de la livraison...")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Session Coordination
            </button>

            <div className="af-reminder-subitem">
              <div className="af-reminder-subitem-icon">📦</div>
              <div className="af-reminder-subitem-text">
                <strong>Contrôle qualité récolte</strong>
                <span>Demain à 09h30 · Hangar A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Recent Products (Project) */}
        <div className="af-panel-card">
          <div className="af-panel-header">
            <h2 className="af-panel-title">Produits Récents</h2>
            {canPublish ? (
              <Link to="/farmer/products/new" className="af-pill-link-btn">
                + Nouveau
              </Link>
            ) : (
              <button
                type="button"
                className="af-pill-link-btn"
                onClick={() => openModal("la création de produits")}
                title="Vérification requise pour publier"
                style={{ cursor: "pointer" }}
              >
                + Nouveau 🔒
              </button>
            )}
          </div>

          <div className="af-recent-list">
            {recentProductsList.map((item) => (
              <div key={item.id} className="af-recent-item">
                <div
                  className="af-recent-icon"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <div className="af-recent-info">
                  <span className="af-recent-name">{item.name}</span>
                  <span className="af-recent-date">
                    {item.date} · {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid (Team Collaboration + Progress Donut + Time Tracker) */}
      <div className="af-grid-3cols">
        {/* Column 1: Team Collaboration / Buyer Orders */}
        <div className="af-panel-card">
          <div className="af-panel-header">
            <h2 className="af-panel-title">Commandes & Acheteurs</h2>
            <Link to="/farmer/orders" className="af-pill-link-btn">
              + Nouvelle vente
            </Link>
          </div>

          <div className="af-collab-list">
            {buyerOrdersList.map((order) => (
              <div key={order.id} className="af-collab-item">
                <div
                  className="af-collab-avatar"
                  style={{ backgroundColor: order.avatarBg }}
                >
                  {order.initials}
                </div>
                <div className="af-collab-content">
                  <span className="af-collab-name">{order.buyer}</span>
                  <span className="af-collab-task">{order.task}</span>
                </div>
                <span className={`af-status-pill ${order.status}`}>
                  {order.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Project Progress (Semi Donut Gauge) */}
        <div className="af-panel-card">
          <div className="af-panel-header">
            <h2 className="af-panel-title">Progression des Ventes</h2>
          </div>

          <div className="af-gauge-container">
            <div className="af-gauge-wrapper">
              <svg viewBox="0 0 160 100" width="160" height="100">
                {/* Background arc */}
                <path
                  d="M 20 90 A 60 60 0 0 1 140 90"
                  fill="none"
                  stroke="#E8EDE9"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                {/* Progress arc (41% or 74%) */}
                <path
                  d="M 20 90 A 60 60 0 0 1 140 90"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="18"
                  strokeDasharray="188.5"
                  strokeDashoffset="75"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#15372F" />
                    <stop offset="100%" stopColor="#398565" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="af-gauge-center-text">
                <div className="af-gauge-percent">41%</div>
                <div className="af-gauge-caption">Objectif Atteint</div>
              </div>
            </div>

            <div className="af-gauge-legend">
              <div>
                <span
                  className="af-legend-dot"
                  style={{ backgroundColor: "#15372F" }}
                />
                Livré
              </div>
              <div>
                <span
                  className="af-legend-dot"
                  style={{ backgroundColor: "#398565" }}
                />
                En cours
              </div>
              <div>
                <span
                  className="af-legend-dot"
                  style={{ backgroundColor: "#D8DFDA" }}
                />
                En attente
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Live Market Time Tracker (Dark Forest Green Wave Card) */}
        <div className="af-market-card">
          <div className="af-market-header">Session de Marché</div>

          <div className="af-market-timer" aria-live="polite">
            {formatTimer(seconds)}
          </div>

          <div className="af-market-controls">
            <button
              type="button"
              className="af-market-btn pause"
              onClick={() => setIsRunning(!isRunning)}
              aria-label={isRunning ? "Mettre en pause" : "Reprendre"}
              title={isRunning ? "Mettre en pause" : "Reprendre"}
            >
              {isRunning ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="af-market-btn stop"
              onClick={() => {
                setIsRunning(false);
                setSeconds(0);
              }}
              aria-label="Arrêter la session"
              title="Arrêter la session"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Required Informative Modal (Phase 07) */}
      {VerificationModal}
    </div>
  );
}
