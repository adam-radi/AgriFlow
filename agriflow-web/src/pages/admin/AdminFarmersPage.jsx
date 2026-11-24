import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFarmers, validateFarmer, rejectFarmer, suspendUser } from "../../app/store/slices/admin/adminSlice";
import {
  selectAdminFarmers,
  selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import AdminFarmerValidationTable from "../../components/admin/AdminFarmerValidationTable";
import { Badge } from "../../components/common";

/**
 * AdminFarmersPage — Validation et gestion des exploitants agricoles (Design System AgriFlow)
 */
export default function AdminFarmersPage() {
  const dispatch = useDispatch();
  const farmers = useSelector(selectAdminFarmers) || [];
  const loading = useSelector(selectAdminLoading);

  useEffect(() => {
    dispatch(fetchFarmers({ role: "Farmer" }));
  }, [dispatch]);

  const pendingCount = farmers.filter(
    (f) => (f.farmer_status || "pending") === "pending"
  ).length;

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Exploitants Agricoles</h1>
            <Badge variant="success" size="md">
              {farmers.length} producteurs
            </Badge>
          </div>
          <p>
            Vérifiez, validez ou suspendez les comptes des agriculteurs et producteurs enregistrés sur AgriFlow.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="af-dashboard-actions">
            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                backgroundColor: "#FEF3C7",
                color: "#92400E",
                fontSize: "0.85rem",
                fontWeight: 600,
                border: "1px solid #FDE68A",
              }}
            >
              ⏳ {pendingCount} dossier(s) en attente d&apos;approbation
            </span>
          </div>
        )}
      </div>

      {/* ── 2. Main Validation Table Panel ────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Comptes Agriculteurs</h2>
            <span className="af-stat-subtitle-text">
              Validation des dossiers légaux et conformité des exploitations
            </span>
          </div>
        </div>

        <AdminFarmerValidationTable
          farmers={farmers}
          loading={loading}
          onValidate={(id) => dispatch(validateFarmer(id))}
          onReject={(id) => dispatch(rejectFarmer(id))}
          onSuspend={(id) => dispatch(suspendUser(id))}
        />
      </div>
    </div>
  );
}
