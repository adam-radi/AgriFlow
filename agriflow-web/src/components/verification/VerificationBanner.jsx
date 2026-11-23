import { Link } from "react-router-dom";
import VerificationStatusBadge from "./VerificationStatusBadge";

/**
 * VerificationBanner
 *
 * Bandeau d'état de vérification contextuel affiché en haut des tableaux de bord.
 * Permet à l'utilisateur de comprendre immédiatement son niveau d'accès et d'agir en un clic.
 */
export default function VerificationBanner({
    status = "not_submitted",
    accountType = "farmer",
    className = "",
}) {
    const isApproved = status === "approved";
    const isPending = status === "pending" || status === "under_review";
    const isRejected = status === "rejected" || status === "additional_information_required";
    const verificationUrl =
        accountType === "farmer" ? "/farmer/verification" : "/client/verification";

    if (isApproved) {
        return (
            <div
                className={`d-flex align-items-center justify-content-between p-3 rounded-4 mb-4 ${className}`}
                style={{
                    backgroundColor: "#EAF4EE",
                    border: "1px solid #D5E8DC",
                }}
            >
                <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "1.1rem", color: "#194638" }}>✓</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#15372F" }}>
                        Compte vérifié & certifié AgriFlow — Toutes vos fonctionnalités professionnelles sont actives.
                    </span>
                </div>
                <VerificationStatusBadge status="approved" />
            </div>
        );
    }

    return (
        <div
            className={`d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-3 p-md-3 rounded-4 mb-4 ${className}`}
            style={{
                backgroundColor: isPending ? "#FFFDF5" : isRejected ? "#FFF5F5" : "#F7FAF8",
                border: isPending
                    ? "1px solid #F3E4BA"
                    : isRejected
                    ? "1px solid #FED7D7"
                    : "1px solid #DCE6E0",
                boxShadow: "0 2px 8px rgba(18, 38, 28, 0.03)",
            }}
        >
            <div className="d-flex align-items-center gap-3">
                <div
                    style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        backgroundColor: isPending ? "#FFF0CC" : isRejected ? "#FED7D7" : "#E8EFEA",
                        color: isPending ? "#8C5808" : isRejected ? "#9B2C2C" : "#194638",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                    }}
                >
                    {isPending ? "⏳" : isRejected ? "✕" : "🛡"}
                </div>

                <div>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <span
                            style={{
                                fontSize: "0.92rem",
                                fontWeight: 700,
                                color: isPending ? "#7B4D08" : isRejected ? "#9B2C2C" : "#15372F",
                            }}
                        >
                            {isPending
                                ? "Vérification de profil en cours"
                                : isRejected
                                ? "Vérification requise — Dossier à corriger"
                                : "Profil non vérifié — Accès restreint"}
                        </span>
                        <VerificationStatusBadge status={status} />
                    </div>

                    <p
                        className="m-0"
                        style={{
                            fontSize: "0.82rem",
                            color: "#5C6E64",
                            lineHeight: 1.45,
                        }}
                    >
                        {isPending
                            ? "Votre dossier est en cours de révision par l'administration AgriFlow. Vos outils de vente et publication s'activeront dès approbation."
                            : isRejected
                            ? "Des justificatifs doivent être mis à jour pour autoriser la publication de vos produits et récoltes."
                            : "Soumettez vos justificatifs (CIN, registre agricole ou attestation) pour débloquer la publication de vos produits et la vente directe."}
                    </p>
                </div>
            </div>

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <Link
                    to={verificationUrl}
                    style={{
                        backgroundColor: isRejected ? "#9B2C2C" : "#15372F",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "999px",
                        padding: "7px 16px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                >
                    <span>{isPending ? "Suivre mon dossier" : isRejected ? "Corriger mon dossier" : "Vérifier mon profil"}</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
}
