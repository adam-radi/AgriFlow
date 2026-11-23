import { Badge } from "../common";

const STATUS_CONFIG = {
    not_submitted: {
        label: "Non vérifié",
        variant: "neutral",
        icon: "⚪",
        desc: "Dossier de vérification non encore soumis.",
    },
    pending: {
        label: "En attente de vérification",
        variant: "warning",
        icon: "⏳",
        desc: "Votre dossier est en cours de traitement par nos équipes.",
    },
    under_review: {
        label: "En cours d'examen",
        variant: "info",
        icon: "🔍",
        desc: "Un modérateur vérifie actuellement vos justificatifs.",
    },
    approved: {
        label: "Compte Vérifié",
        variant: "success",
        icon: "✓",
        desc: "Votre compte est certifié et pleinement opérationnel.",
    },
    rejected: {
        label: "Dossier refusé",
        variant: "danger",
        icon: "✕",
        desc: "Votre demande a été refusée. Veuillez corriger les pièces.",
    },
    additional_information_required: {
        label: "Complément requis",
        variant: "warning",
        icon: "⚠",
        desc: "Des informations complémentaires sont demandées pour valider votre compte.",
    },
};

export default function VerificationStatusBadge({ status = "not_submitted", className = "" }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_submitted;

    return (
        <Badge
            variant={config.variant}
            className={`d-inline-flex align-items-center gap-1 px-2 py-1 ${className}`}
            title={config.desc}
        >
            <span style={{ fontSize: "0.85em" }}>{config.icon}</span>
            <span>{config.label}</span>
        </Badge>
    );
}

export { STATUS_CONFIG };
