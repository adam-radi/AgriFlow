import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Table, Alert, Button, Spinner } from "react-bootstrap";
import { createOrder, clearOrderError, clearOrderSuccess } from "../../../features/orders/orderSlice";
import { fetchCart, clearCart } from "../../../features/orders/cartSlice";
import {
    selectCartItems,
    selectCartTotal,
    selectCartCount,
    selectCartLoading,
    selectCartError,
} from "../../../features/orders/orderSelectors";

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const cartCount = useSelector(selectCartCount);
    const cartLoading = useSelector(selectCartLoading);
    const orderLoading = useSelector((state) => state.orders.loading);
    const error = useSelector((state) => state.orders.error);
    const cartFetched = useRef(false);

    useEffect(() => {
        dispatch(fetchCart()).then(() => { cartFetched.current = true; });
    }, [dispatch]);

    useEffect(() => {
        if (cartFetched.current && !cartLoading && cartItems.length === 0) {
            navigate("/client/cart");
        }
    }, [cartFetched.current, cartLoading, cartItems, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearOrderError());
            dispatch(clearOrderSuccess());
        };
    }, [dispatch]);

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(clearOrderError());

        const payload = {
            zone: cartItems[0]?.harvest?.product?.farmer?.zone || "",
            items: cartItems.map((item) => ({
                harvest_id: item.harvest_id,
                quantity_standard_id: item.quantity_standard_id,
                quantity: item.quantity,
                scheduled_harvest_date: item.harvest?.start_date || null,
            })),
        };

        const result = await dispatch(createOrder(payload));
        if (result.meta.requestStatus === "fulfilled") {
            dispatch(clearCart());
            navigate("/client/orders");
        }
    }

    if (cartLoading && cartItems.length === 0) {
        return (
            <div className="container py-5 text-center">
                <Spinner animation="border" variant="success" />
                <p className="text-muted mt-2">Loading cart…</p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h1 className="h3 fw-bold mb-4">Checkout</h1>

            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearOrderError())}>
                    {typeof error === "string" ? error : (error?.message || JSON.stringify(error) || "Failed to place order")}
                </Alert>
            )}

            <Row className="g-4">
                <Col lg={7}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">Order Items</Card.Title>
                            <Table borderless className="align-middle mb-4">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Pack</th>
                                        <th>Packs</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className="fw-medium">{item.harvest?.product?.name || "—"}</td>
                                            <td>{item.quantity_standard?.label || "Standard"}</td>
                                            <td>{item.quantity}</td>
                                            <td>{Number(item.unit_price).toFixed(2)} MAD</td>
                                            <td className="fw-bold">{Number(item.subtotal || 0).toFixed(2)} MAD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0 mt-3" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">Delivery Details</Card.Title>
                            <Button variant="success" className="w-100" onClick={handleSubmit} disabled={orderLoading || cartItems.length === 0}>
                                {orderLoading ? "Placing Order…" : "Place Order"}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h6 fw-bold mb-3">Cart Summary</Card.Title>
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Total Packs</span>
                                    <span className="fw-bold">{cartCount}</span>
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
                </Col>
            </Row>
        </div>
    );
}
