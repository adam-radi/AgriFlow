import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { fetchCart, removeFromCart, updateCartItem, clearCart } from "../../../features/orders/cartSlice";
import {
    selectCartItems,
    selectCartCount,
    selectCartTotal,
} from "../../../features/orders/orderSelectors";
import CartItem from "../../../components/orders/CartItem";
import CartSummary from "../../../components/orders/CartSummary";

export default function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartCount = useSelector(selectCartCount);
    const cartTotal = useSelector(selectCartTotal);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    function handleUpdate(itemId, quantity) {
        dispatch(updateCartItem({ itemId, quantity }));
    }

    function handleRemove(itemId) {
        dispatch(removeFromCart(itemId));
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
                                key={item.id}
                                item={item}
                                onUpdate={handleUpdate}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                    <div className="col-lg-4">
                        <CartSummary
                            cartItems={cartItems}
                            cartTotal={cartTotal}
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
