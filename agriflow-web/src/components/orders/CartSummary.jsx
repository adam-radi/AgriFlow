import { Card } from "react-bootstrap";

export default function CartSummary({ cartItems = [], cartTotal = 0, cartTotalWeight = 0, cartCount = 0 }) {
    return (
        <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <Card.Body>
                <Card.Title className="h6 fw-bold mb-3">Cart Summary</Card.Title>
                <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between">
                        <span className="text-muted">Total Packs</span>
                        <span className="fw-bold">{cartCount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="text-muted">Total Weight</span>
                        <span className="fw-bold">{cartTotalWeight} kg</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <span className="text-muted">Items</span>
                        <span className="fw-bold">{cartItems.length}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="fs-5 fw-bold text-success">{cartTotal.toFixed(2)} MAD</span>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
