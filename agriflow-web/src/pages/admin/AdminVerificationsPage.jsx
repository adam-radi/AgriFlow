import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-bootstrap";
import { fetchFarmers, validateFarmer, rejectFarmer, suspendUser } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminFarmers,
    selectAdminLoading,
    selectAdminError,
} from "../../app/store/slices/admin/adminSelectors";
import AdminFarmerValidationTable from "../../components/admin/AdminFarmerValidationTable";
import { Badge } from "../../components/common";

/**
 * AdminVerificationsPage — Modération et validation des dossiers légaux des exploitants (Lot 11)
 */
export default function AdminVerificationsPage() {
    const dispatch = useDispatch();
    const rawFarmers = useSelector(selectAdminFarmers);
    const farmers = useMemo(() => rawFarmers || [], [rawFarmers]);
    const loading = useSelector(selectAdminLoading);
    const error = useSelector(selectAdminError);
    const [localSuccess, setLocalSuccess] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchFarmers({ role: "Farmer" }));
    }, [dispatch]);

    const handleValidate = async (id) => {
        const res = await dispatch(validateFarmer(id));
        if (res.meta?.requestStatus === "fulfilled" || res.type?.endsWith("/fulfilled")) {
            setLocalSuccess(`Le dossier exploitant #${id} a été validé et accrédité avec succès.`);
            dispatch(fetchFarmers({ role: "Farmer" }));
        }
    };

    const handleReject = async (id, reason) => {
        const res = await dispatch(rejectFarmer(id));
        if (res.meta?.requestStatus === "fulfilled" || res.type?.endsWith("/fulfilled")) {
            setLocalSuccess(`Le dossier exploitant #${id} a été refusé.${reason ? ` Motif : ${reason}` : ""}`);
            dispatch(fetchFarmers({ role: "Farmer" }));
        }
    };

    const handleSuspend = async (id) => {
        const res = await dispatch(suspendUser(id));
        if (res.meta?.requestStatus === "fulfilled" || res.type?.endsWith("/fulfilled")) {
            setLocalSuccess(`Le compte #${id} a été suspendu.`);
            dispatch(fetchFarmers({ role: "Farmer" }));
        }
    };

    const pendingCount = farmers.filter((f) => (f.farmer_status || "pending") === "pending").length;
    const approvedCount = farmers.filter((f) => f.farmer_status === "approved").length;
    const rejectedCount = farmers.filter((f) => f.farmer_status === "rejected").length;

    const filteredFarmers = useMemo(() => {
        return farmers.filter((f) => {
            const matchesStatus =
                filterStatus === "all" || (f.farmer_status || "pending") === filterStatus;

            const matchesSearch =
                !searchTerm.trim() ||
                (f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (f.email && f.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (f.phone && f.phone.includes(searchTerm)) ||
                (f.zone && f.zone.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesStatus && matchesSearch;
        });
    }, [farmers, filterStatus, searchTerm]);

    return (
        <div className="af-dashboard-container">
            {/* ── 1. Page Header ────────────────────────────────────────────── */}
            <div className="af-dashboard-header-row">
                <div className="af-dashboard-title-group">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <h1>Vérification & Certification des Comptes</h1>
                        <Badge variant="primary" size="md">
                            {farmers.length} dossiers
                        </Badge>
                    </div>
                    <p>
                        Examinez la conformité des exploitants agricoles pour activer leurs accès à la vente directe en circuit court.
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
                            ⏳ {pendingCount} dossier(s) en attente d&apos;instruction
                        </span>
                    </div>
                )}
            </div>

            {/* Notifications */}
            {error && <Alert variant="danger" dismissible className="mb-4 rounded-3 shadow-sm">{error}</Alert>}
            {localSuccess && (
                <Alert variant="success" dismissible onClose={() => setLocalSuccess("")} className="mb-4 rounded-3 shadow-sm">
                    {localSuccess}
                </Alert>
            )}

            {/* ── 2. Top Stats Overview ─────────────────────────────────────── */}
            <div className="af-stats-row">
                {/* Total */}
                <div
                    className={`af-stat-card-featured transition-all ${filterStatus === "all" ? "border-2 border-white" : ""}`}
                    onClick={() => setFilterStatus("all")}
                    style={{ cursor: "pointer" }}
                >
                    <div className="af-stat-card-top">
                        <span className="af-stat-card-label">Total Dossiers</span>
                        <span className="fs-5">📋</span>
                    </div>
                    <div className="af-stat-value">{farmers.length}</div>
                    <div className="af-stat-pill">Tous les exploitants</div>
                </div>

                {/* En attente */}
                <div
                    className={`af-stat-card-white transition-all ${filterStatus === "pending" ? "border-2 border-warning" : ""}`}
                    onClick={() => setFilterStatus("pending")}
                    style={{ cursor: "pointer" }}
                >
                    <div className="af-stat-card-top">
                        <span className="af-stat-card-label">En Attente d&apos;Examen</span>
                        <span className="fs-5">⏳</span>
                    </div>
                    <div className="af-stat-value" style={{ color: "var(--af-warning, #a96d17)" }}>
                        {pendingCount}
                    </div>
                    <div className="af-stat-pill warning">Dossiers prioritaires</div>
                </div>

                {/* Approuvés */}
                <div
                    className={`af-stat-card-white transition-all ${filterStatus === "approved" ? "border-2 border-success" : ""}`}
                    onClick={() => setFilterStatus("approved")}
                    style={{ cursor: "pointer" }}
                >
                    <div className="af-stat-card-top">
                        <span className="af-stat-card-label">Comptes Certifiés</span>
                        <span className="fs-5">✅</span>
                    </div>
                    <div className="af-stat-value" style={{ color: "var(--af-success, #247a50)" }}>
                        {approvedCount}
                    </div>
                    <div className="af-stat-pill success">Autorisés à vendre</div>
                </div>

                {/* Refusés */}
                <div
                    className={`af-stat-card-white transition-all ${filterStatus === "rejected" ? "border-2 border-danger" : ""}`}
                    onClick={() => setFilterStatus("rejected")}
                    style={{ cursor: "pointer" }}
                >
                    <div className="af-stat-card-top">
                        <span className="af-stat-card-label">Dossiers Refusés</span>
                        <span className="fs-5">⚠️</span>
                    </div>
                    <div className="af-stat-value" style={{ color: "var(--af-danger, #b64242)" }}>
                        {rejectedCount}
                    </div>
                    <span className="af-stat-subtitle-text">Justificatifs non conformes</span>
                </div>
            </div>

            {/* ── 3. Barre de recherche et filtres ──────────────────────────── */}
            <div className="af-panel-card p-3 mb-4">
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
                            placeholder="Rechercher par nom, email, région..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="af-category-chips-row">
                        {[
                            { id: "all", label: `Tous (${farmers.length})` },
                            { id: "pending", label: `⏳ En attente (${pendingCount})` },
                            { id: "approved", label: `✓ Certifiés (${approvedCount})` },
                            { id: "rejected", label: `✗ Refusés (${rejectedCount})` },
                        ].map((chip) => {
                            const isActive = filterStatus === chip.id;
                            return (
                                <button
                                    key={chip.id}
                                    type="button"
                                    className={`af-category-chip ${isActive ? "active" : ""}`}
                                    style={{
                                        backgroundColor: isActive ? "var(--af-primary-forest, #15372F)" : "#ffffff",
                                        color: isActive ? "#ffffff" : "var(--af-ink-900, #1D2924)",
                                        border: isActive
                                            ? "1px solid var(--af-primary-forest, #15372F)"
                                            : "1px solid var(--af-border, #E2E9E3)",
                                    }}
                                    onClick={() => setFilterStatus(chip.id)}
                                >
                                    {chip.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── 4. Tableau de modération ──────────────────────────────────── */}
            <div className="af-panel-card">
                <div className="af-panel-header">
                    <div>
                        <h2 className="af-panel-title">Dossiers d&apos;Exploitations Agricoles</h2>
                        <span className="af-stat-subtitle-text">
                            {filteredFarmers.length} dossier{filteredFarmers.length > 1 ? "s" : ""} affiché{filteredFarmers.length > 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                <AdminFarmerValidationTable
                    farmers={filteredFarmers}
                    loading={loading}
                    onValidate={handleValidate}
                    onReject={handleReject}
                    onSuspend={handleSuspend}
                />
            </div>
        </div>
    );
}
