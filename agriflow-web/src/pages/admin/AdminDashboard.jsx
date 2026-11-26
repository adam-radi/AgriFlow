import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchStats, fetchUsers, fetchOrders, fetchFarmers } from "../../app/store/slices/admin/adminSlice";
import {
  selectAdminStats,
  selectAdminUsers,
  selectAdminOrders,
  selectAdminFarmers,
  selectAdminLoading,
  selectAdminError,
} from "../../app/store/slices/admin/adminSelectors";
import { selectUser } from "../../features/auth/authSelectors";
import { Badge, EmptyState, LoadingState } from "../../components/common";

/**
 * AdminDashboard — Tableau de bord officiel de supervision AgriFlow (Lot 11)
 * Conçu avec 100% de la même identité visuelle et structure que les Dashboards Agriculteur & Acheteur :
 * Header d'accueil premium, 4 cartes métriques sobres, grilles de suivi en direct et actions rapides.
 */
export default function AdminDashboard() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const stats = useSelector(selectAdminStats) || {};
  const users = useSelector(selectAdminUsers) || [];
  const orders = useSelector(selectAdminOrders) || [];
  const farmers = useSelector(selectAdminFarmers) || [];
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchUsers({ limit: 5 }));
    dispatch(fetchOrders({ limit: 5 }));
    dispatch(fetchFarmers({ limit: 5 }));
  }, [dispatch]);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "delivered" || o.status === "completed");
  
  // Nombre réel de dossiers en attente
  const pendingVerificationsCount =
    stats.pending_farmers ??
    farmers.filter((f) => (f.farmer_status || "pending") === "pending").length;

  const displayName = user?.name || "Administrateur";

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Welcome Section ────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Bonjour, {displayName} 👋</h1>
            <Badge variant="success" size="md">
              Administration Centrale ✓
            </Badge>
          </div>
          <p>
            Supervisez l&apos;ensemble de l&apos;écosystème AgriFlow : exploitants agricoles, acheteurs professionnels, validation légale et flux de commandes.
          </p>
        </div>

        {/* Action Pills */}
        <div className="af-dashboard-actions">
          <Link to="/admin/verifications" className="af-btn-primary-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            Vérifications ({pendingVerificationsCount})
          </Link>

          <Link to="/admin/products" className="af-btn-secondary-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            Modérer le catalogue
          </Link>
        </div>
      </div>

      {/* Alerte d'erreur éventuelle */}
      {error && (
        <div className="alert alert-danger rounded-4 py-2 px-3 small d-flex align-items-center gap-2 mb-0">
          <span>⚠️</span>
          <span>{typeof error === "string" ? error : "Impossible de charger certaines statistiques système."}</span>
        </div>
      )}

      {/* ── 2. Top Stats Row (4 Stat Cards avec bouton flèche ↗) ───────── */}
      <div className="af-stats-row">
        {/* Card 1: Volume d'affaires / Revenue (Featured Dark Green Card) */}
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Volume Financier</span>
            <Link
              to="/admin/orders"
              className="af-stat-arrow-btn"
              aria-label="Voir toutes les commandes"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">
            {stats.total_revenue
              ? `${Number(stats.total_revenue).toLocaleString()} DH`
              : `${stats.total_orders ?? orders.length} Commandes`}
          </div>
          <div className="af-stat-pill">
            <span>{stats.total_orders ?? orders.length}</span> commande{stats.total_orders > 1 ? "s" : ""} au total
          </div>
        </div>

        {/* Card 2: Utilisateurs Inscrits */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Utilisateurs Plateforme</span>
            <Link
              to="/admin/users"
              className="af-stat-arrow-btn"
              aria-label="Gérer les utilisateurs"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">
            {stats.total_users ?? users.length ?? 0}
          </div>
          <div className="af-stat-pill success">
            <span>{stats.total_farmers ?? farmers.length ?? 0}</span> exploitants · <span>{stats.total_customers ?? 0}</span> acheteurs
          </div>
        </div>

        {/* Card 3: Produits en Catalogue */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Produits Référencés</span>
            <Link
              to="/admin/products"
              className="af-stat-arrow-btn"
              aria-label="Voir les produits"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">
            {stats.total_products ?? "—"}
          </div>
          <div className="af-stat-pill neutral">
            <span>{stats.active_harvests ?? 0}</span> récolte{stats.active_harvests > 1 ? "s" : ""} active{stats.active_harvests > 1 ? "s" : ""}
          </div>
        </div>

        {/* Card 4: Commandes en cours */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Flux de Commandes</span>
            <Link
              to="/admin/orders"
              className="af-stat-arrow-btn"
              aria-label="Voir le suivi des commandes"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">
            {stats.delivered_orders ?? completedOrders.length}
          </div>
          <span className="af-stat-subtitle-text">
            {pendingOrders.length} en attente de validation
          </span>
        </div>
      </div>

      {/* ── 3. Main Two-Column Grid: Commandes & Utilisateurs ─────────── */}
      <div className="row g-4">
        {/* Colonne Gauche : Dernières Commandes Plateforme */}
        <div className="col-12 col-lg-7">
          <div className="af-panel-card h-100">
            <div className="af-panel-header">
              <div>
                <h2 className="af-panel-title">Dernières Commandes Plateforme</h2>
                <span className="af-stat-subtitle-text">
                  Flux commercial en direct entre acheteurs et producteurs
                </span>
              </div>
              <Link to="/admin/orders" className="af-pill-link-btn">
                Voir tout ({orders.length})
              </Link>
            </div>

            {loading && orders.length === 0 ? (
              <LoadingState message="Chargement des commandes en cours..." />
            ) : orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle af-dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th>Réf</th>
                      <th>Client</th>
                      <th>Montant</th>
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
                          <div className="fw-semibold">{order.customer?.name || order.client_name || order.user?.name || "Acheteur Pro"}</div>
                          <small className="text-muted">{order.zone || order.city || "Maroc"}</small>
                        </td>
                        <td>
                          <strong style={{ color: "var(--af-primary-forest)" }}>
                            {order.total_amount ? `${Number(order.total_amount).toLocaleString()} DH` : order.total ? `${Number(order.total).toLocaleString()} DH` : "—"}
                          </strong>
                        </td>
                        <td>
                          <Badge
                            variant={
                              order.status === "delivered" || order.status === "completed"
                                ? "success"
                                : order.status === "confirmed" || order.status === "in_delivery"
                                ? "info"
                                : order.status === "cancelled"
                                ? "danger"
                                : "warning"
                            }
                            size="sm"
                          >
                            {order.status === "delivered"
                              ? "Livrée"
                              : order.status === "confirmed"
                              ? "Confirmée"
                              : order.status === "in_delivery"
                              ? "En route"
                              : order.status === "cancelled"
                              ? "Annulée"
                              : order.status === "pending"
                              ? "En attente"
                              : order.status}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                          >
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon="🛒"
                title="Aucune commande enregistrée"
                description="Le flux des commandes passées par les acheteurs professionnels apparaîtra ici."
              />
            )}
          </div>
        </div>

        {/* Colonne Droite : Utilisateurs Récents & Acteurs */}
        <div className="col-12 col-lg-5">
          <div className="af-panel-card h-100">
            <div className="af-panel-header">
              <div>
                <h2 className="af-panel-title">Nouveaux Inscrits</h2>
                <span className="af-stat-subtitle-text">
                  Derniers comptes utilisateurs créés
                </span>
              </div>
              <Link to="/admin/users" className="af-pill-link-btn">
                Gérer ({users.length})
              </Link>
            </div>

            {loading && users.length === 0 ? (
              <LoadingState message="Chargement des utilisateurs..." />
            ) : users.length > 0 ? (
              <div className="af-user-list">
                {users.slice(0, 5).map((u) => {
                  const initials = (u.name || "U")
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join("");

                  return (
                    <div key={u.id} className="af-dashboard-list-item">
                      <div className="af-list-item-avatar" style={{ backgroundColor: "#eaf3ec", color: "#194638" }}>
                        {initials}
                      </div>
                      <div className="af-list-item-content">
                        <div className="af-list-item-title">{u.name}</div>
                        <div className="af-list-item-meta">
                          <span>{u.email}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          u.role === "Farmer"
                            ? "success"
                            : u.role === "Client"
                            ? "info"
                            : u.role === "Admin"
                            ? "primary"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {u.role === "Farmer"
                          ? "Agriculteur"
                          : u.role === "Client"
                          ? "Acheteur Pro"
                          : u.role === "Admin"
                          ? "Admin"
                          : u.role}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon="👥"
                title="Aucun utilisateur"
                description="Aucun utilisateur enregistré dans la base pour le moment."
              />
            )}
          </div>
        </div>
      </div>

      {/* ── 4. Surveillance des Dossiers de Vérification B2B ──────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Vérification & Certification des Exploitations</h2>
            <span className="af-stat-subtitle-text">
              Dossiers légaux soumis par les exploitants et acheteurs en attente de validation
            </span>
          </div>
          <Link to="/admin/verifications" className="af-pill-link-btn primary">
            Accéder aux vérifications →
          </Link>
        </div>

        <div className="d-flex align-items-center justify-content-between p-3 rounded-4 mt-2 flex-wrap gap-3" style={{ backgroundColor: "#f9faf9", border: "1px solid #edf1ee" }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#eaf3ec", display: "grid", placeItems: "center", fontSize: "1.3rem" }}>
              🛡️
            </div>
            <div>
              <div className="fw-bold" style={{ color: "var(--af-primary-forest)" }}>
                {pendingVerificationsCount} dossier(s) en attente d&apos;examen
              </div>
              <div className="small text-muted">
                Validation des attestations d&apos;exploitation, CIN, RC et conformité réglementaire.
              </div>
            </div>
          </div>

          <Link to="/admin/verifications" className="af-btn-primary-pill" style={{ padding: "8px 18px", fontSize: "12.5px" }}>
            Examiner les dossiers
          </Link>
        </div>
      </div>

      {/* ── 5. Actions Rapides Système ───────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header mb-3">
          <h2 className="af-panel-title">Actions Rapides d&apos;Administration</h2>
          <span className="af-stat-subtitle-text">Accès direct aux modules de gestion</span>
        </div>
        <div className="af-quick-actions-grid">
          <Link to="/admin/verifications" className="af-quick-action-card">
            <span className="af-quick-action-icon">🛡️</span>
            <div>
              <div className="af-quick-action-title">Vérifications B2B</div>
              <div className="af-quick-action-sub">Valider les exploitants</div>
            </div>
          </Link>

          <Link to="/admin/users" className="af-quick-action-card">
            <span className="af-quick-action-icon">👥</span>
            <div>
              <div className="af-quick-action-title">Utilisateurs</div>
              <div className="af-quick-action-sub">Rôles et permissions</div>
            </div>
          </Link>

          <Link to="/admin/farmers" className="af-quick-action-card">
            <span className="af-quick-action-icon">🌾</span>
            <div>
              <div className="af-quick-action-title">Agriculteurs</div>
              <div className="af-quick-action-sub">Producteurs référencés</div>
            </div>
          </Link>

          <Link to="/admin/products" className="af-quick-action-card">
            <span className="af-quick-action-icon">📦</span>
            <div>
              <div className="af-quick-action-title">Produits Agricoles</div>
              <div className="af-quick-action-sub">Modérer le catalogue</div>
            </div>
          </Link>

          <Link to="/admin/orders" className="af-quick-action-card">
            <span className="af-quick-action-icon">🛒</span>
            <div>
              <div className="af-quick-action-title">Commandes</div>
              <div className="af-quick-action-sub">Flux des transactions</div>
            </div>
          </Link>

          <Link to="/admin/harvests" className="af-quick-action-card">
            <span className="af-quick-action-icon">🌿</span>
            <div>
              <div className="af-quick-action-title">Récoltes</div>
              <div className="af-quick-action-sub">Prévisions de production</div>
            </div>
          </Link>

          <Link to="/admin/delivery" className="af-quick-action-card">
            <span className="af-quick-action-icon">🚚</span>
            <div>
              <div className="af-quick-action-title">Tournées Logistiques</div>
              <div className="af-quick-action-sub">Expéditions et livreurs</div>
            </div>
          </Link>

          <Link to="/products" className="af-quick-action-card">
            <span className="af-quick-action-icon">🏪</span>
            <div>
              <div className="af-quick-action-title">Catalogue Public</div>
              <div className="af-quick-action-sub">Vue utilisateur final</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
