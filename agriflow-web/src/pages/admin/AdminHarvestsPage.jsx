import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHarvests } from "../../app/store/slices/admin/adminSlice";
import {
  selectAdminHarvests,
  selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import { Badge, EmptyState, LoadingState } from "../../components/common";

/**
 * AdminHarvestsPage — Supervision des récoltes déclarées (Design System AgriFlow)
 */
export default function AdminHarvestsPage() {
  const dispatch = useDispatch();
  const harvests = useSelector(selectAdminHarvests) || [];
  const loading = useSelector(selectAdminLoading);

  useEffect(() => {
    dispatch(fetchHarvests());
  }, [dispatch]);

  const inProgressCount = harvests.filter(
    (h) => h.status === "in_progress" || h.status === "open"
  ).length;
  const readyCount = harvests.filter((h) => h.status === "ready").length;

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Calendrier des Récoltes</h1>
            <Badge variant="success" size="md">
              {harvests.length} récoltes déclarées
            </Badge>
          </div>
          <p>
            Suivi des prévisions de récolte et de disponibilité des productions agricoles déclarées par les agriculteurs.
          </p>
        </div>
      </div>

      {/* ── 2. Top Stats Overview ─────────────────────────────────────── */}
      <div className="af-stats-row">
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Récoltes</span>
          </div>
          <div className="af-stat-value">{harvests.length}</div>
          <div className="af-stat-pill">Cycles enregistrés</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">En Cours de Culture</span>
          </div>
          <div className="af-stat-value">{inProgressCount}</div>
          <div className="af-stat-pill success">Maturité progressive</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Prêtes à Cueillir</span>
          </div>
          <div className="af-stat-value">{readyCount}</div>
          <span className="af-stat-subtitle-text">Prêtes pour expédition</span>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Planification</span>
          </div>
          <div className="af-stat-value" style={{ fontSize: "20px" }}>
            Prévisionnel
          </div>
          <span className="af-stat-subtitle-text">Information acheteurs en amont</span>
        </div>
      </div>

      {/* ── 3. Main Harvests Table Panel ──────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Toutes les Récoltes Déclarées</h2>
            <span className="af-stat-subtitle-text">
              Liste détaillée des productions prévisionnelles
            </span>
          </div>
        </div>

        {loading && harvests.length === 0 ? (
          <LoadingState message="Chargement des récoltes..." />
        ) : harvests.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle af-dashboard-table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produit / Culture</th>
                  <th>Exploitant</th>
                  <th>Quantité Estimée</th>
                  <th>Max Journalier</th>
                  <th>Statut</th>
                  <th>Date Début</th>
                </tr>
              </thead>
              <tbody>
                {harvests.map((h) => (
                  <tr key={h.id}>
                    <td className="fw-bold text-muted">#{h.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: "1.2rem" }}>🌾</span>
                        <div className="fw-semibold text-dark">
                          {h.product?.name || h.product_name || `Récolte #${h.id}`}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">
                        {h.product?.farmer?.name || h.product?.user?.name || "Agriculteur"}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: "var(--af-primary-forest)" }}>
                        {h.estimated_total_qte ?? h.estimated_quantity ?? "—"} {h.unit || "kg"}
                      </strong>
                    </td>
                    <td>
                      <span className="text-muted">
                        {h.max_daily_qte ? `${h.max_daily_qte} ${h.unit || "kg"}/j` : "—"}
                      </span>
                    </td>
                    <td>
                      <Badge
                        variant={
                          h.status === "open" || h.status === "ready"
                            ? "success"
                            : h.status === "in_progress"
                            ? "info"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {h.status === "open"
                          ? "Ouverte"
                          : h.status === "ready"
                          ? "Prête"
                          : h.status === "in_progress"
                          ? "En cours"
                          : h.status || "Planifiée"}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-muted">
                        {h.start_date || h.harvest_date
                          ? new Date(h.start_date || h.harvest_date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🌾"
            title="Aucune récolte enregistrée"
            description="Les cycles de récolte planifiés par les producteurs s'afficheront ici."
          />
        )}
      </div>
    </div>
  );
}
