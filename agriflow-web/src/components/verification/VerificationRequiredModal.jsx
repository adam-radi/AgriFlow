import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import VerificationStatusBadge from "./VerificationStatusBadge";

/**
 * VerificationRequiredModal
 *
 * Modale informative et professionnelle affichée lorsqu'un utilisateur
 * non vérifié tente d'effectuer une action restreinte (ex: publier un produit/récolte).
 *
 * Évite les alertes génériques et guide directement l'utilisateur vers son dossier.
 */
export default function VerificationRequiredModal({
    show = false,
    onHide,
    status = "not_submitted",
    accountType = "farmer",
    featureName = "la publication de produits",
}) {
    const verificationUrl =
        accountType === "farmer" ? "/farmer/verification" : "/client/verification";

    const isPending = status === "pending" || status === "under_review";
    const isRejected = status === "rejected" || status === "additional_information_required";

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" keyboard>
            <div
                style={{
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "none",
                    boxShadow: "0 20px 40px rgba(21, 55, 47, 0.16)",
                }}
            >
                <div
                    style={{
                        padding: "24px 28px 18px",
                        backgroundColor: "#FFFFFF",
                        borderBottom: "1px solid #EAEFEA",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "12px",
                                backgroundColor: isPending ? "#FFF4DF" : isRejected ? "#FFF0EF" : "#EAF4ED",
                                color: isPending ? "#A96D17" : isRejected ? "#B64242" : "#194638",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                            }}
                        >
                            {isPending ? "⏳" : isRejected ? "✕" : "🛡"}
                        </div>

                        <VerificationStatusBadge status={status} />
                    </div>

                    <h2
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 750,
                            color: "#15372F",
                            marginBottom: "8px",
                        }}
                    >
                        Vérification requise
                    </h2>

                    <p
                        style={{
                            fontSize: "0.92rem",
                            color: "#55675D",
                            lineHeight: 1.55,
                            margin: 0,
                        }}
                    >
                        {isPending ? (
                            <>
                                Votre dossier de vérification est <strong>actuellement en cours d&apos;examen</strong> par notre équipe. L&apos;accès à {featureName} s&apos;activera automatiquement dès l&apos;approbation de votre profil.
                            </>
                        ) : isRejected ? (
                            <>
                                Votre demande de vérification précédente n&apos;a pas été validée. Pour débloquer {featureName}, veuillez corriger les pièces justificatives demandées.
                            </>
                        ) : (
                            <>
                                Pour garantir la confiance et la qualité des échanges sur AgriFlow, <strong>votre profil professionnel doit être vérifié</strong> avant de pouvoir utiliser {featureName}.
                            </>
                        )}
                    </p>
                </div>

                <div
                    style={{
                        padding: "16px 28px",
                        backgroundColor: "#F8FAF8",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <button
                        type="button"
                        onClick={onHide}
                        style={{
                            background: "transparent",
                            border: "1px solid #D2DDD6",
                            borderRadius: "999px",
                            padding: "8px 18px",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            color: "#55675D",
                            cursor: "pointer",
                        }}
                    >
                        Fermer
                    </button>

                    <Link
                        to={verificationUrl}
                        onClick={onHide}
                        style={{
                            backgroundColor: "#15372F",
                            color: "#FFFFFF",
                            borderRadius: "999px",
                            padding: "8px 20px",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 12px rgba(21, 55, 47, 0.16)",
                        }}
                    >
                        <span>{isPending ? "Consulter mon dossier" : "Compléter ma vérification"}</span>
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </Modal>
    );
}
