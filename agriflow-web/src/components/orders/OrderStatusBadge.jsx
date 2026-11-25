import { Badge } from "../common";

const STATUS_MAP = {
    pending: { variant: "warning", label: "En attente" },
    confirmed: { variant: "info", label: "Confirmée" },
    processing: { variant: "primary", label: "En préparation" },
    preparing: { variant: "primary", label: "En préparation" },
    harvesting: { variant: "secondary", label: "En récolte" },
    ready_for_delivery: { variant: "info", label: "Prête à expédier" },
    in_delivery: { variant: "info", label: "En livraison" },
    delivering: { variant: "info", label: "En livraison" },
    delivered: { variant: "success", label: "Livrée" },
    completed: { variant: "success", label: "Terminée" },
    cancelled: { variant: "danger", label: "Annulée" },
};

/**
 * OrderStatusBadge — Badge de statut normalisé pour l'écosystème AgriFlow
 */
export default function OrderStatusBadge({ status, size = "sm" }) {
    const normalized = (status || "").toLowerCase();
    const config = STATUS_MAP[normalized] || { variant: "neutral", label: status || "Inconnu" };

    return (
        <Badge variant={config.variant} size={size}>
            {config.label}
        </Badge>
    );
}
