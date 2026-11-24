import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchOrders } from "../../features/orders/orderSlice";
import { fetchCart } from "../../features/orders/cartSlice";
import { fetchActiveVerification } from "../../features/verification/verificationSlice";
import {
  selectOrders,
  selectOrdersLoading,
  selectCartCount,
  selectCartTotal,
} from "../../features/orders/orderSelectors";
import { selectUser } from "../../features/auth/authSelectors";
import { useVerificationAccess } from "../../features/verification/useVerificationAccess";
import VerificationBanner from "../../components/verification/VerificationBanner";
import { EmptyState, LoadingState, Badge } from "../../components/common";

const POPULAR_CATEGORIES = [
  { id: "legumes", name: "Légumes frais", icon: "🍅", query: "légumes" },
  { id: "fruits", name: "Fruits de saison", icon: "🍊", query: "fruits" },
  { id: "cereales", name: "Céréales & Grains", icon: "🌾", query: "céréales" },
  { id: "huiles", name: "Huiles & Terroir", icon: "🫒", query: "huile" },
  { id: "aromates", name: "Herbes & Aromates", icon: "🌿", query: "menthe" },
];

/**
 * ClientDashboard — Espace officiel de sourcing et d'achats pour l'Acheteur Professionnel (Phase 08)
 * Conçu pour les épiceries, primeurs, restaurateurs et coopératives.
 * Connecté aux données réelles : commandes réelles, panier réel, statut de vérification et recherche catalogue.
 */
export default function ClientDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders) || [];
  const ordersLoading = useSelector(selectOrdersLoading);
  const cartCount = useSelector(selectCartCount) || 0;
  const cartTotal = useSelector(selectCartTotal) || 0;

  const [searchKeyword, setSearchKeyword] = useState("");

  const { status, isApproved, isPending, isRejected } = useVerificationAccess({
    accountType: "client",
  });

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchCart());
    dispatch(fetchActiveVerification());
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchKeyword.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
    } else {
      navigate("/products");
    }
  };

  // Real metrics computed from store
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(
    (o) =>
      o.status === "pending" ||
      o.status === "processing" ||
      o.status === "in_delivery"
  ).length;
  const deliveredOrdersCount = orders.filter(
    (o) => o.status === "delivered" || o.status === "completed"
  ).length;

  const displayName = user?.name || "Acheteur Professionnel";

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Welcome Section ────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Bienvenue, {displayName} 👋</h1>
            {isApproved ? (
              <Badge variant="success" size="md">
                Entreprise certifiée B2B ✓
              </Badge>
            ) : isPending ? (
              <Badge variant="warning" size="md">
                Dossier en cours d&apos;examen ⏳
              </Badge>
            ) : isRejected ? (
              <Badge variant="danger" size="md">
                Dossier à réviser ⚠️
              </Badge>
            ) : (
              <Badge variant="neutral" size="md">
                Compte B2B standard
              </Badge>
            )}
          </div>
          <p>
            Approvisionnez votre établissement directement auprès des producteurs agricoles marocains en circuit court garanti.
          </p>
        </div>

        {/* Action Pills */}
        <div className="af-dashboard-actions">
          <Link to="/products" className="af-btn-primary-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Explorer le catalogue
          </Link>

          <Link to="/client/cart" className="af-btn-secondary-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Mon panier ({cartCount})
          </Link>
        </div>
      </div>

      {/* ── 2. Verification Status Banner (Phase 07) ─────────────────── */}
      <VerificationBanner status={status} accountType="client" />

      {/* ── 3. Real Store Metrics ────────────────────────────────────── */}
      <div className="af-stats-row">
        {/* Card 1: Commandes Totales */}
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Mes Commandes</span>
            <Link
              to="/client/orders"
              className="af-stat-arrow-btn"
              aria-label="Voir toutes les commandes"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{totalOrdersCount}</div>
          <div className="af-stat-pill">
            <span>{deliveredOrdersCount}</span> réceptionnée{deliveredOrdersCount > 1 ? "s" : ""}
          </div>
        </div>

        {/* Card 2: Commandes en cours */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">En Préparation / Livraison</span>
            <Link
              to="/client/orders"
              className="af-stat-arrow-btn"
              aria-label="Voir les commandes en cours"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{activeOrdersCount}</div>
          <div className="af-stat-pill success">
            <span>{activeOrdersCount}</span> expédition{activeOrdersCount > 1 ? "s" : ""} active{activeOrdersCount > 1 ? "s" : ""}
          </div>
        </div>

        {/* Card 3: Panier en cours */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Panier en cours</span>
            <Link
              to="/client/cart"
              className="af-stat-arrow-btn"
              aria-label="Voir le panier"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{cartCount}</div>
          <div className="af-stat-pill neutral">
            Total : {Number(cartTotal).toLocaleString()} DH
          </div>
        </div>

        {/* Card 4: Statut du profil B2B */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Profil Entreprise</span>
            <Link
              to="/client/verification"
              className="af-stat-arrow-btn"
              aria-label="Voir le statut de vérification"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value" style={{ fontSize: "20px", marginTop: "4px" }}>
            {isApproved
              ? "Certifié B2B"
              : isPending
              ? "En examen"
              : isRejected
              ? "À corriger"
              : "Standard"}
          </div>
          <span className="af-stat-subtitle-text">
            {isApproved
              ? "Tarifs grossistes activés"
              : "Vérification RC / ICE"}
          </span>
        </div>
      </div>

      {/* ── 4. Sourcing & Recherche de Produits ───────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Sourcing Direct & Approvisionnement</h2>
            <span className="af-stat-subtitle-text">
              Recherchez des récoltes et productions disponibles auprès des producteurs
            </span>
          </div>
          <Link to="/products" className="af-pill-link-btn">
            Catalogue complet →
          </Link>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="af-buyer-search-form mt-2">
          <div className="af-buyer-search-input-wrap">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="af-search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="af-buyer-search-input"
              placeholder="Que cherchez-vous ? (ex: Tomates Souss, Olives Picholine, Oranges Valencia...)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="af-btn-primary-pill" style={{ padding: "12px 24px" }}>
            Rechercher
          </button>
        </form>

        {/* Quick Category Chips */}
        <div className="af-category-chips-row mt-3">
          <span className="text-muted small fw-semibold me-2 align-self-center">
            Filières :
          </span>
          {POPULAR_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?search=${encodeURIComponent(cat.query)}`}
              className="af-category-chip"
            >
              <span className="af-category-chip-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 5. Commandes Récentes & Suivi Logistique ───────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Mes Dernières Commandes</h2>
            <span className="af-stat-subtitle-text">
              Suivi en temps réel de vos approvisionnements ({totalOrdersCount} commande{totalOrdersCount > 1 ? "s" : ""})
            </span>
          </div>
          {totalOrdersCount > 0 && (
            <Link to="/client/orders" className="af-pill-link-btn">
              Voir tout l&apos;historique
            </Link>
          )}
        </div>

        {ordersLoading && orders.length === 0 ? (
          <LoadingState message="Chargement de vos commandes..." />
        ) : orders.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle af-dashboard-table mb-0">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Date</th>
                  <th>Articles</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th className="text-end">Détails</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Récente"}
                    </td>
                    <td>{order.items?.length || 1} article(s)</td>
                    <td>
                      <strong style={{ color: "var(--af-primary-forest)" }}>
                        {order.total ? `${Number(order.total).toLocaleString()} DH` : "—"}
                      </strong>
                    </td>
                    <td>
                      <Badge
                        variant={
                          order.status === "delivered" || order.status === "completed"
                            ? "success"
                            : order.status === "in_delivery" || order.status === "processing"
                            ? "info"
                            : "warning"
                        }
                        size="sm"
                      >
                        {order.status === "delivered"
                          ? "Livrée"
                          : order.status === "in_delivery"
                          ? "En cours de livraison"
                          : order.status === "processing"
                          ? "En préparation"
                          : order.status === "pending"
                          ? "En attente"
                          : order.status}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/client/orders/${order.id}`}
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                      >
                        Consulter
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🛍️"
            title="Aucune commande passée pour le moment"
            description="Vous n'avez pas encore passé de commande d'approvisionnement. Parcourez les lots agricoles en direct des producteurs pour votre commerce."
            action={
              <Link to="/products" className="af-btn-primary-pill">
                Découvrir le catalogue agricole
              </Link>
            }
          />
        )}
      </div>

      {/* ── 6. Panier d'Achat Actif (si articles présents) ─────────────── */}
      {cartCount > 0 && (
        <div className="af-panel-card" style={{ borderColor: "var(--af-primary-agri)" }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "1.4rem" }}>🛒</span>
                <h3 className="af-panel-title mb-0">Vous avez {cartCount} article(s) dans votre panier</h3>
              </div>
              <p className="text-muted small mb-0 mt-1">
                Total estimé : <strong style={{ color: "var(--af-primary-forest)", fontSize: "1.05rem" }}>{Number(cartTotal).toLocaleString()} DH</strong>.
                Finalisez votre commande pour réserver les lots auprès des agriculteurs.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Link to="/client/cart" className="af-btn-primary-pill">
                Valider mon panier →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Actions Rapides ────────────────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header mb-3">
          <h2 className="af-panel-title">Actions Rapides</h2>
          <span className="af-stat-subtitle-text">Accès direct aux fonctionnalités d&apos;achat</span>
        </div>
        <div className="af-quick-actions-grid">
          <Link to="/products" className="af-quick-action-card">
            <span className="af-quick-action-icon">🏪</span>
            <div>
              <div className="af-quick-action-title">Catalogue Agricole</div>
              <div className="af-quick-action-sub">Explorer les offres des producteurs</div>
            </div>
          </Link>

          <Link to="/client/cart" className="af-quick-action-card">
            <span className="af-quick-action-icon">🛒</span>
            <div>
              <div className="af-quick-action-title">Mon Panier Pro</div>
              <div className="af-quick-action-sub">{cartCount} produit(s) en attente</div>
            </div>
          </Link>

          <Link to="/client/orders" className="af-quick-action-card">
            <span className="af-quick-action-icon">🚚</span>
            <div>
              <div className="af-quick-action-title">Mes Commandes</div>
              <div className="af-quick-action-sub">Suivre mes expéditions</div>
            </div>
          </Link>

          <Link to="/client/verification" className="af-quick-action-card">
            <span className="af-quick-action-icon">🛡️</span>
            <div>
              <div className="af-quick-action-title">Vérification B2B</div>
              <div className="af-quick-action-sub">Certifier mon entreprise</div>
            </div>
          </Link>

          <Link to="/client/profile" className="af-quick-action-card">
            <span className="af-quick-action-icon">🏢</span>
            <div>
              <div className="af-quick-action-title">Profil Entreprise</div>
              <div className="af-quick-action-sub">Coordonnées et adresses</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
