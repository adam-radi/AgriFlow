import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDeliveryGroups } from "../../features/delivery/deliverySlice";
import {
  selectAllDeliveryGroups,
  selectDeliveryLoading,
  selectDeliveryByStatus,
} from "../../features/delivery/deliverySelectors";
import { Badge, EmptyState, LoadingState } from "../../components/common";

/**
 * DeliveryDashboard — Supervision des tournées logistiques et livraisons (Design System AgriFlow)
 */
export default function DeliveryDashboard() {
  const dispatch = useDispatch();
  const groups = useSelector(selectAllDeliveryGroups) || [];
  const loading = useSelector(selectDeliveryLoading);
  const assignedGroups = useSelector((s) => selectDeliveryByStatus(s, "assigned")) || [];
  const inProgressGroups = useSelector((s) => selectDeliveryByStatus(s, "in_progress")) || [];

  const statusCounts = {
    pending: groups.filter((g) => g.status === "pending").length,
    planned: groups.filter((g) => g.status === "planned").length,
    assigned: assignedGroups.length,
    in_progress: inProgressGroups.length,
    delivered: groups.filter((g) => g.status === "delivered").length,
  };

  useEffect(() => {
    dispatch(fetchDeliveryGroups());
  }, [dispatch]);

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Tournées Logistiques & Livraison</h1>
            <Badge variant="primary" size="md">
              {groups.length} expéditions
            </Badge>
          </div>
          <p>
            Supervision de la logistique du dernier kilomètre : regroupement de lots agricoles, tournées régionales et livreurs.
          </p>
        </div>

        <div className="af-dashboard-actions">
          <Link to="/admin/delivery/groups" className="af-btn-primary-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            </svg>
            Tous les Groupes
          </Link>
        </div>
      </div>

      {/* ── 2. Top Stats Overview ─────────────────────────────────────── */}
      <div className="af-stats-row">
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Expéditions</span>
          </div>
          <div className="af-stat-value">{groups.length}</div>
          <div className="af-stat-pill">Lots groupés</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">En Attente / Planifiées</span>
          </div>
          <div className="af-stat-value">{statusCounts.pending + statusCounts.planned}</div>
          <div className="af-stat-pill warning">À assigner</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">En Cours de Tournée</span>
          </div>
          <div className="af-stat-value">{statusCounts.in_progress}</div>
          <div className="af-stat-pill success">Sur la route</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Livrées aux Clients</span>
          </div>
          <div className="af-stat-value">{statusCounts.delivered}</div>
          <span className="af-stat-subtitle-text">Réceptionnées avec succès</span>
        </div>
      </div>

      {/* ── 3. Main Groups Table ──────────────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Groupes d&apos;Expédition Actifs</h2>
            <span className="af-stat-subtitle-text">
              Suivi des livraisons en cours et des transporteurs assignés
            </span>
          </div>
          <Link to="/admin/delivery/groups" className="af-pill-link-btn">
            Voir tout l&apos;historique
          </Link>
        </div>

        {loading && groups.length === 0 ? (
          <LoadingState message="Chargement des tournées logistiques..." />
        ) : groups.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle af-dashboard-table mb-0">
              <thead>
                <tr>
                  <th>Groupe ID</th>
                  <th>Zone / Région</th>
                  <th>Livreur Assigné</th>
                  <th>Commandes Incluses</th>
                  <th>Statut</th>
                  <th>Date Prévue</th>
                  <th className="text-end">Détails</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id}>
                    <td>
                      <strong className="text-dark">#GRP-{group.id}</strong>
                    </td>
                    <td>
                      <div className="fw-semibold">{group.zone || "Région Agricole"}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span>🚚</span>
                        <span className="fw-medium">
                          {group.delivery_user?.name || group.transporter_name || "Non assigné"}
                        </span>
                      </div>
                    </td>
                    <td>{group.orders?.length || group.orders_count || 1} commande(s)</td>
                    <td>
                      <Badge
                        variant={
                          group.status === "delivered"
                            ? "success"
                            : group.status === "in_progress"
                            ? "info"
                            : group.status === "assigned"
                            ? "primary"
                            : "warning"
                        }
                        size="sm"
                      >
                        {group.status === "delivered"
                          ? "Livré ✓"
                          : group.status === "in_progress"
                          ? "En tournée"
                          : group.status === "assigned"
                          ? "Assigné"
                          : group.status === "planned"
                          ? "Planifié"
                          : "En attente"}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-muted">
                        {group.delivery_date
                          ? new Date(group.delivery_date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })
                          : "Aujourd'hui"}
                      </small>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/admin/delivery/groups/${group.id}`}
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                        style={{ fontSize: "0.78rem" }}
                      >
                        Suivre →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🚚"
            title="Aucune expédition en cours"
            description="Les tournées de livraison et groupes de commandes apparaîtront ici dès leur planification."
          />
        )}
      </div>
    </div>
  );
}
