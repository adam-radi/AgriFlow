import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-bootstrap";
import { fetchFarmers, validateFarmer, rejectFarmer, suspendUser } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminFarmers,
    selectAdminLoading,
    selectAdminError,
} from "../../app/store/slices/admin/adminSelectors";
import AdminFarmerValidationTable from "../../components/admin/AdminFarmerValidationTable";

export default function AdminVerificationsPage() {
    const dispatch = useDispatch();
    const farmers = useSelector(selectAdminFarmers);
    const loading = useSelector(selectAdminLoading);
    const error = useSelector(selectAdminError);
    const [localSuccess, setLocalSuccess] = useState("");

    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        dispatch(fetchFarmers({ role: "Farmer" }));
    }, [dispatch]);

    const handleValidate = async (id) => {
        const res = await dispatch(validateFarmer(id));
        if (res.type.endsWith("/fulfilled")) {
            setLocalSuccess(`Compte exploitant #${id} approuvé avec succès.`);
        }
    };

    const handleReject = async (id, reason) => {
        const res = await dispatch(rejectFarmer(id));
        if (res.type.endsWith("/fulfilled")) {
            setLocalSuccess(`Dossier #${id} refusé.${reason ? ` Motif : ${reason}` : ""}`);
        }
    };

    const handleSuspend = async (id) => {
        const res = await dispatch(suspendUser(id));
        if (res.type.endsWith("/fulfilled")) {
            setLocalSuccess(`Utilisateur #${id} suspendu.`);
        }
    };

    const filteredFarmers = farmers.filter((f) => {
        if (filterStatus === "all") return true;
        return (f.farmer_status || "pending") === filterStatus;
    });

    const pendingCount = farmers.filter((f) => (f.farmer_status || "pending") === "pending").length;
    const approvedCount = farmers.filter((f) => f.farmer_status === "approved").length;
    const rejectedCount = farmers.filter((f) => f.farmer_status === "rejected").length;

    return (
        <div className="p-4" style={{ maxWidth: "1300px", margin: "0 auto" }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="h4 fw-bold m-0" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                        Gestion des vérifications de comptes
                    </h1>
                    <p className="text-muted small m-0">
                        Modération et validation des dossiers professionnels des exploitants et acheteurs.
                    </p>
                </div>
            </div>

            {error && <Alert variant="danger" dismissible className="mb-3">{error}</Alert>}
            {localSuccess && (
                <Alert variant="success" dismissible onClose={() => setLocalSuccess("")} className="mb-3">
                    {localSuccess}
                </Alert>
            )}

            {/* Statistiques rapides */}
            <div className="row g-3 mb-4">
                <div className="col-sm-6 col-md-3">
                    <div
                        className={`af-stat-card cursor-pointer ${filterStatus === "all" ? "border-success" : ""}`}
                        onClick={() => setFilterStatus("all")}
                        style={{ cursor: "pointer" }}
                    >
                        <span className="af-stat-label">Total dossiers</span>
                        <span className="af-stat-value">{farmers.length}</span>
                        <span className="af-stat-meta">Tous les exploitants inscrits</span>
                    </div>
                </div>

                <div className="col-sm-6 col-md-3">
                    <div
                        className={`af-stat-card cursor-pointer ${filterStatus === "pending" ? "border-warning" : ""}`}
                        onClick={() => setFilterStatus("pending")}
                        style={{ cursor: "pointer" }}
                    >
                        <span className="af-stat-label">En attente</span>
                        <span className="af-stat-value" style={{ color: "var(--af-warning, #a96d17)" }}>
                            {pendingCount}
                        </span>
                        <span className="af-stat-meta">Dossiers à instruire</span>
                    </div>
                </div>

                <div className="col-sm-6 col-md-3">
                    <div
                        className={`af-stat-card cursor-pointer ${filterStatus === "approved" ? "border-success" : ""}`}
                        onClick={() => setFilterStatus("approved")}
                        style={{ cursor: "pointer" }}
                    >
                        <span className="af-stat-label">Approuvés</span>
                        <span className="af-stat-value" style={{ color: "var(--af-success, #247a50)" }}>
                            {approvedCount}
                        </span>
                        <span className="af-stat-meta">Comptes certifiés</span>
                    </div>
                </div>

                <div className="col-sm-6 col-md-3">
                    <div
                        className={`af-stat-card cursor-pointer ${filterStatus === "rejected" ? "border-danger" : ""}`}
                        onClick={() => setFilterStatus("rejected")}
                        style={{ cursor: "pointer" }}
                    >
                        <span className="af-stat-label">Refusés</span>
                        <span className="af-stat-value" style={{ color: "var(--af-danger, #b64242)" }}>
                            {rejectedCount}
                        </span>
                        <span className="af-stat-meta">Pièces non conformes</span>
                    </div>
                </div>
            </div>

            {/* Tableau de validation */}
            <AdminFarmerValidationTable
                farmers={filteredFarmers}
                loading={loading}
                onValidate={handleValidate}
                onReject={handleReject}
                onSuspend={handleSuspend}
            />
        </div>
    );
}
