import { Button } from "react-bootstrap";

export default function CartItem({ item, onUpdate, onRemove }) {
    return (
        <div className="d-flex align-items-center gap-3 p-3 border rounded-3 mb-2 bg-white">
            <div className="flex-grow-1">
                <h6 className="mb-1 fw-bold">{item.productName}</h6>
                <small className="text-muted">
                    Std: {item.standardQuantity}kg | Unit: {Number(item.unitPrice).toFixed(2)} MAD/kg
                </small>
            </div>
            <div className="d-flex align-items-center gap-2">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onUpdate(item.productId, item.harvestId, Math.max(1, item.packQuantity - 1))}
                >
                    −
                </Button>
                <span className="fw-bold px-2">{item.packQuantity}</span>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onUpdate(item.productId, item.harvestId, item.packQuantity + 1)}
                >
                    +
                </Button>
            </div>
            <div className="text-end" style={{ minWidth: "90px" }}>
                <div className="fw-bold">{Number(item.subtotal || 0).toFixed(2)} MAD</div>
                <small className="text-muted">{item.totalWeight}kg</small>
            </div>
            <Button variant="outline-danger" size="sm" onClick={() => onRemove(item.productId, item.harvestId)}>
                ✕
            </Button>
        </div>
    );
}
