import { Badge } from "react-bootstrap";

const STATUS_MAP = {
    pending: { bg: "warning", text: "Pending" },
    confirmed: { bg: "info", text: "Confirmed" },
    preparing: { bg: "primary", text: "Preparing" },
    harvesting: { bg: "secondary", text: "Harvesting" },
    ready_for_delivery: { bg: "success", text: "Ready for Delivery" },
    delivering: { bg: "dark", text: "Delivering" },
    delivered: { bg: "success", text: "Delivered" },
    cancelled: { bg: "danger", text: "Cancelled" },
};

export default function OrderStatusBadge({ status }) {
    const config = STATUS_MAP[status] || { bg: "light", text: status || "Unknown" };
    return <Badge bg={config.bg} className="text-capitalize">{config.text}</Badge>;
}
