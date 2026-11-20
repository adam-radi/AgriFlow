import { Button } from "react-bootstrap";

export default function CartItem({ item, onUpdate, onRemove }) {
    return (
        <div className="d-flex align-items-center gap-3 p-3 border rounded-3 mb-2 bg-white">
            <div className="flex-grow-1">
                <h6 className="mb-1 fw-bold">{item.harvest?.product?.name || `Product #${item.harvest?.product_id}`}</h6>
                <small className="text-muted">
                    Pack: {item.quantity_standard?.label || "Standard"} | {Number(item.unit_price).toFixed(2)} MAD/pack
                </small>
            </div>
            <div className="d-flex align-items-center gap-2">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onUpdate(item.id, Math.max(1, item.quantity - 1))}
                >
                    −
                </Button>
                <span className="fw-bold px-2">{item.quantity}</span>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onUpdate(item.id, item.quantity + 1)}
                >
                    +
                </Button>
            </div>
            <div className="text-end" style={{ minWidth: "90px" }}>
                <div className="fw-bold">{Number(item.subtotal || 0).toFixed(2)} MAD</div>
            </div>
            <Button variant="outline-danger" size="sm" onClick={() => onRemove(item.id)}>
                ✕
            </Button>
        </div>
    );
}
