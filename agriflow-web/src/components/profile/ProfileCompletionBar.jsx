import { ProgressBar } from "react-bootstrap";

export default function ProfileCompletionBar({ completion }) {
    if (!completion) return null;

    const { percentage = 0, missingFields = [], isComplete = false } = completion;

    const barVariant =
        percentage >= 100
            ? "success"
            : percentage >= 60
            ? "info"
            : "warning";

    return (
        <div className="af-card mb-4" style={{ backgroundColor: "var(--af-surface, #ffffff)" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold text-uppercase" style={{ color: "var(--af-ink-700, #4b5a52)" }}>
                    Niveau de complétion du profil
                </span>
                <span className="small fw-bold" style={{ color: "var(--af-green-800, #215b46)" }}>
                    {percentage}%
                </span>
            </div>

            <ProgressBar
                now={percentage}
                variant={barVariant}
                style={{ height: "8px", borderRadius: "999px" }}
                className="mb-2"
            />

            {isComplete ? (
                <p className="small text-success m-0 fw-medium">
                    ✓ Votre profil professionnel est 100% complet. Vos informations sont prêtes pour vos partenaires.
                </p>
            ) : (
                <div className="small text-muted m-0">
                    <span>Complétez les informations suivantes pour valoriser votre profil : </span>
                    <strong style={{ color: "var(--af-ink-800, #34413a)" }}>
                        {missingFields.join(", ")}
                    </strong>
                </div>
            )}
        </div>
    );
}
