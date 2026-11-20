import { Badge } from "react-bootstrap";

const STATUS_MAP = {
    pending: { bg: "secondary", text: "Pending" },
    planned: { bg: "info", text: "Planned" },
    assigned: { bg: "primary", text: "Assigned" },
    in_progress: { bg: "warning", text: "In Progress" },
    delivered: { bg: "success", text: "Delivered" },
    failed: { bg: "danger", text: "Failed" },
};

export default function DeliveryStatusBadge({ status }) {
    const config = STATUS_MAP[status] || { bg: "light", text: status || "Unknown" };
    return <Badge bg={config.bg} className="text-capitalize">{config.text}</Badge>;
}
