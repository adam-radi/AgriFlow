import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../app/store/slices/admin/adminSlice";
import {
  selectAdminOrders,
  selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import { Badge, EmptyState, LoadingState } from "../../components/common";

/**
 * AdminOrdersPage — Gestion globale des commandes (Design System AgriFlow)
 */
export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectAdminOrders) || [];
  const loading = useSelector(selectAdminLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchTerm ||
      o.id.toString().includes(searchTerm) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.client_name && o.client_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || o.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const inDeliveryCount = orders.filter((o) => o.status === "in_delivery" || o.status === "confirmed").length;
  const completedCount = orders.filter((o) => o.status === "delivered" || o.status === "completed").length;

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Commandes & Flux Commercial</h1>
            <Badge variant="primary" size="md">
              {orders.length} commandes
            </Badge>
          </div>
          <p>
            Suivi en temps réel des transactions passées entre les acheteurs professionnels et les producteurs agricoles.
          </p>
        </div>
      </div>

      {/* ── 2. Top Stats Overview ─────────────────────────────────────── */}
      <div className="af-stats-row">
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Commandes</span>
          </div>
          <div className="af-stat-value">{orders.length}</div>
          <div className="af-stat-pill">Flux plateforme</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">En Attente</span>
          </div>
          <div className="af-stat-value">{pendingCount}</div>
          <div className="af-stat-pill warning">À valider</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">En Préparation / Livraison</span>
          </div>
          <div className="af-stat-value">{inDeliveryCount}</div>
          <div className="af-stat-pill success">En cours d&apos;acheminement</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Livrées & Clôturées</span>
          </div>
          <div className="af-stat-value">{completedCount}</div>
          <span className="af-stat-subtitle-text">Finalisées avec succès</span>
        </div>
      </div>

      {/* ── 3. Filters & Search ───────────────────────────────────────── */}
      <div className="af-panel-card p-3">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="af-buyer-search-input-wrap" style={{ maxWidth: 380 }}>
            <svg
              width="17"
              height="17"
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
              placeholder="Rechercher par n° commande, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="af-category-chips-row">
            {[
              { id: "all", label: "Toutes" },
              { id: "pending", label: "⏳ En attente" },
              { id: "confirmed", label: "📦 Confirmées" },
              { id: "in_delivery", label: "🚚 En livraison" },
              { id: "delivered", label: "✓ Livrées" },
              { id: "cancelled", label: "✗ Annulées" },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`af-category-chip ${
                  selectedStatus === chip.id ? "active" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedStatus === chip.id ? "#15372F" : "#ffffff",
                  color: selectedStatus === chip.id ? "#ffffff" : "#3b4e43",
                  border:
                    selectedStatus === chip.id
                      ? "1px solid #15372F"
                      : "1px solid #dce5df",
                }}
                onClick={() => setSelectedStatus(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Main Orders Table ──────────────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Toutes les Commandes</h2>
            <span className="af-stat-subtitle-text">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""} trouvée{filteredOrders.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <LoadingState message="Chargement des commandes..." />
        ) : filteredOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle af-dashboard-table mb-0">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Client / Établissement</th>
                  <th>Articles</th>
                  <th>Montant Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <strong className="text-dark">#{order.id}</strong>
                    </td>
                    <td>
                      <div className="fw-semibold">
                        {order.customer?.name || order.client_name || "Acheteur Pro"}
                      </div>
                      <small className="text-muted">{order.city || "Maroc"}</small>
                    </td>
                    <td>{order.items?.length ?? 1} article(s)</td>
                    <td>
                      <strong style={{ color: "var(--af-primary-forest)" }}>
                        {order.total_amount || order.total
                          ? `${Number(order.total_amount || order.total).toLocaleString()} DH`
                          : "—"}
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
                          ? "Livrée ✓"
                          : order.status === "confirmed"
                          ? "Confirmée"
                          : order.status === "in_delivery"
                          ? "En livraison"
                          : order.status === "cancelled"
                          ? "Annulée"
                          : order.status === "pending"
                          ? "En attente"
                          : order.status}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-muted">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </small>
                    </td>
                    <td className="text-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                        style={{ fontSize: "0.78rem" }}
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        Détails →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🛒"
            title="Aucune commande trouvée"
            description="Aucune commande ne correspond aux filtres sélectionnés."
          />
        )}
      </div>
    </div>
  );
}
