import { Link } from "react-router-dom";
import VerificationStatusBadge from "./VerificationStatusBadge";
import { Button } from "../common";

export default function VerificationStatusCard({
    status = "not_submitted",
    activeRequest = null,
    accountType = "farmer",
    onNewSubmissionClick = null,
}) {
    const isApproved = status === "approved";
    const isPending = status === "pending" || status === "under_review";
    const isRejected = status === "rejected";
    const isInfoRequired = status === "additional_information_required";
    const isNotSubmitted = status === "not_submitted";

    const verificationLink = accountType === "farmer" ? "/farmer/verification" : "/client/verification";

    return (
        <div
            className="af-card mb-4"
            style={{
                borderLeft: isApproved
                    ? "4px solid var(--af-success, #247a50)"
                    : isRejected
                    ? "4px solid var(--af-danger, #b64242)"
                    : isPending
                    ? "4px solid var(--af-warning, #a96d17)"
                    : "4px solid var(--af-border-strong, #cbd7ce)",
            }}
        >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div className="d-flex align-items-start gap-3">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                            width: "48px",
                            height: "48px",
                            fontSize: "1.3rem",
                            backgroundColor: isApproved
                                ? "var(--af-success-bg, #e9f5ed)"
                                : isRejected
                                ? "var(--af-danger-bg, #fff0ef)"
                                : isPending
                                ? "var(--af-warning-bg, #fff4df)"
                                : "var(--af-surface-muted, #f0f3ef)",
                            color: isApproved
                                ? "var(--af-success, #247a50)"
                                : isRejected
                                ? "var(--af-danger, #b64242)"
                                : isPending
                                ? "var(--af-warning, #a96d17)"
                                : "var(--af-ink-600, #65736b)",
                        }}
                    >
                        {isApproved ? "✓" : isRejected ? "✕" : isPending ? "⏳" : "🛡"}
                    </div>

                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                            <h3 className="h6 fw-bold m-0" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                Statut de vérification professionnelle
                            </h3>
                            <VerificationStatusBadge status={status} />
                        </div>

                        {isApproved && (
                            <p className="small text-muted m-0">
                                Félicitations ! Votre compte et votre identité professionnelle sont vérifiés. Vous
                                bénéficiez du badge de confiance AgriFlow et d'une visibilité prioritaire sur le réseau.
                            </p>
                        )}

                        {isPending && (
                            <p className="small text-muted m-0">
                                Votre dossier de vérification a bien été reçu le{" "}
                                {activeRequest?.submitted_at
                                    ? new Date(activeRequest.submitted_at).toLocaleDateString("fr-FR", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : "récemment"}
                                . Nos équipes examinent vos pièces sous 24 à 48 heures ouvrées.
                            </p>
                        )}

                        {isRejected && (
                            <div>
                                <p className="small text-danger fw-semibold mb-1">
                                    Motif du refus :{" "}
                                    {activeRequest?.rejection_reason ||
                                        "Documents illisibles ou non conformes aux exigences professionnelles."}
                                </p>
                                <p className="small text-muted m-0">
                                    Vous pouvez soumettre un nouveau dossier avec des justificatifs corrigés.
                                </p>
                            </div>
                        )}

                        {isInfoRequired && (
                            <div>
                                <p className="small text-warning fw-semibold mb-1">
                                    Précision demandée :{" "}
                                    {activeRequest?.requested_information ||
                                        "Veuillez fournir un justificatif complémentaire pour valider votre dossier."}
                                </p>
                                <p className="small text-muted m-0">
                                    Ajoutez les pièces manquantes pour finaliser l'instruction de votre demande.
                                </p>
                            </div>
                        )}

                        {isNotSubmitted && (
                            <p className="small text-muted m-0">
                                Pour assurer des transactions directes fiables et certifiées entre producteurs et acheteurs,
                                la vérification de vos pièces professionnelles (CIN, RC, certificat agricole) est recommandée.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0">
                    {isNotSubmitted && (
                        <Link to={verificationLink} className="text-decoration-none">
                            <Button variant="primary" size="sm">
                                Déposer mes justificatifs →
                            </Button>
                        </Link>
                    )}

                    {isRejected && (
                        onNewSubmissionClick ? (
                            <Button variant="primary" size="sm" onClick={onNewSubmissionClick}>
                                Nouvelle soumission →
                            </Button>
                        ) : (
                            <Link to={verificationLink} className="text-decoration-none">
                                <Button variant="primary" size="sm">
                                    Corriger mon dossier →
                                </Button>
                            </Link>
                        )
                    )}

                    {isPending && (
                        <Link to={verificationLink} className="text-decoration-none">
                            <Button variant="secondary" size="sm">
                                Suivre le dossier
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
