import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    selectVerificationStatus,
    selectCanPublish,
} from "../../features/verification/verificationSelectors";
import VerificationStatusBadge from "../verification/VerificationStatusBadge";

/**
 * RequireVerificationRoute
 *
 * Garde de route pour les écrans de création sensibles (ex: création de produit).
 * Si l'agriculteur n'est pas approuvé, affiche un écran d'explication premium
 * avec redirection vers la page de vérification.
 */
export default function RequireVerificationRoute({
    children,
    accountType = "farmer",
    featureTitle = "Publication de récoltes et produits",
    backUrl = "/farmer/dashboard",
}) {
    const isVerified = useSelector(selectCanPublish);
    const status = useSelector(selectVerificationStatus);

    if (isVerified) {
        return children;
    }

    const verificationUrl =
        accountType === "farmer" ? "/farmer/verification" : "/client/verification";
    const isPending = status === "pending" || status === "under_review";
    const isRejected = status === "rejected" || status === "additional_information_required";

    return (
        <div className="py-5 px-3 d-flex justify-content-center">
            <div
                className="bg-white rounded-4 p-4 p-md-5 text-center shadow-sm"
                style={{
                    maxWidth: "580px",
                    border: "1px solid var(--af-border, #E2ECE5)",
                }}
            >
                <div
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{
                        width: "64px",
                        height: "64px",
                        fontSize: "1.8rem",
                        backgroundColor: isPending ? "#FFF4DF" : isRejected ? "#FFF0EF" : "#EAF4EE",
                        color: isPending ? "#A96D17" : isRejected ? "#B64242" : "#194638",
                    }}
                >
                    {isPending ? "⏳" : isRejected ? "✕" : "🛡"}
                </div>

                <div className="mb-3">
                    <VerificationStatusBadge status={status} />
                </div>

                <h1
                    style={{
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        color: "#15372F",
                        marginBottom: "12px",
                    }}
                >
                    Vérification requise : {featureTitle}
                </h1>

                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "#55675D",
                        lineHeight: 1.6,
                        marginBottom: "24px",
                    }}
                >
                    {isPending ? (
                        <>
                            Votre dossier de vérification a bien été transmis et est <strong>en cours de revue</strong> par notre équipe. Dès son approbation, cette interface vous sera automatiquement accessible.
                        </>
                    ) : isRejected ? (
                        <>
                            Votre demande de vérification précédente nécessite des corrections. Veuillez mettre à jour vos pièces justificatives pour débloquer la création de vos annonces.
                        </>
                    ) : (
                        <>
                            Pour garantir la traçabilité et la qualité sur AgriFlow, la publication de nouveaux produits et récoltes est réservée aux <strong>profils professionnels vérifiés</strong>.
                        </>
                    )}
                </p>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Link
                        to={verificationUrl}
                        className="btn fw-semibold px-4 py-2 rounded-pill text-white"
                        style={{
                            backgroundColor: "#15372F",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(21, 55, 47, 0.2)",
                        }}
                    >
                        {isPending ? "Suivre mon dossier" : "Vérifier mon profil maintenant"} →
                    </Link>

                    <Link
                        to={backUrl}
                        className="btn fw-semibold px-4 py-2 rounded-pill"
                        style={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #D2DDD6",
                            color: "#55675D",
                        }}
                    >
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        </div>
    );
}
