import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import { removeFromCart, updatePackQuantity, clearCart } from "../../../features/orders/orderSlice";
import {
    selectCartItems,
    selectCartCount,
    selectCartTotal,
    selectCartTotalWeight,
} from "../../../features/orders/orderSelectors";
import CartItem from "../../../components/orders/CartItem";
import CartSummary from "../../../components/orders/CartSummary";

export default function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartCount = useSelector(selectCartCount);
    const cartTotal = useSelector(selectCartTotal);
    const cartTotalWeight = useSelector(selectCartTotalWeight);

    function handleUpdate(productId, harvestId, packQuantity) {
        dispatch(updatePackQuantity({ productId, harvestId, packQuantity }));
    }

    function handleRemove(productId, harvestId) {
        dispatch(removeFromCart({ productId, harvestId }));
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-1">Shopping Cart</h1>
                    <p className="text-muted mb-0">{cartItems.length} item(s) in your cart</p>
                </div>
                {cartItems.length > 0 && (
                    <Button variant="outline-danger" size="sm" onClick={() => dispatch(clearCart())}>
                        Clear Cart
                    </Button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-5">
                    <div style={{ fontSize: "3rem" }}>🛒</div>
                    <h5 className="mt-3">Your cart is empty</h5>
                    <p className="text-muted">Browse products and add them to your cart.</p>
                    <Button variant="success" onClick={() => navigate("/products")}>
                        Browse Products
                    </Button>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-8">
                        {cartItems.map((item) => (
                            <CartItem
                                key={`${item.productId}-${item.harvestId}`}
                                item={item}
                                onUpdate={handleUpdate}
                                onRemove={handleRemove}
                            />
                        ))}
                        {cartItems.some((i) => i.harvestDate) && (
                            <Alert variant="info" className="mt-3 mb-0">
                                <small>🚚 Estimated delivery dates will be confirmed at checkout based on harvest schedules.</small>
                            </Alert>
                        )}
                    </div>
                    <div className="col-lg-4">
                        <CartSummary
                            cartItems={cartItems}
                            cartTotal={cartTotal}
                            cartTotalWeight={cartTotalWeight}
                            cartCount={cartCount}
                        />
                        <Button
                            variant="success"
                            className="w-100 mt-3"
                            onClick={() => navigate("/client/checkout")}
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
