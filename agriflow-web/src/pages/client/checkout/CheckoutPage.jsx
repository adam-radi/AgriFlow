import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Table, Alert } from "react-bootstrap";
import { createOrder, clearOrderError, clearOrderSuccess } from "../../../features/orders/orderSlice";
import {
    selectCartItems,
    selectCartTotal,
    selectCartTotalWeight,
    selectCartCount,
    selectOrdersLoading,
    selectOrdersError,
} from "../../../features/orders/orderSelectors";
import CartSummary from "../../../components/orders/CartSummary";
import CheckoutForm from "../../../components/orders/CheckoutForm";

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const cartTotalWeight = useSelector(selectCartTotalWeight);
    const cartCount = useSelector(selectCartCount);
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    const [form, setForm] = useState({
        delivery_address: "",
        phone: "",
        notes: "",
    });

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/client/cart");
        }
    }, [cartItems, navigate]);

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
            delivery_address: form.delivery_address,
            phone: form.phone,
            notes: form.notes,
            items: cartItems.map((item) => ({
                product_id: item.productId,
                pack_quantity: item.packQuantity,
            })),
        };

        const result = await dispatch(createOrder(payload));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/client/orders");
        }
    }

    return (
        <div className="container py-4">
            <h1 className="h3 fw-bold mb-4">Checkout</h1>

            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearOrderError())}>
                    {typeof error === "string" ? error : "Failed to place order"}
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
                                        <th>Packs</th>
                                        <th>Weight</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={`${item.productId}-${item.harvestId}`}>
                                            <td className="fw-medium">{item.productName}</td>
                                            <td>{item.packQuantity}</td>
                                            <td>{item.totalWeight} kg</td>
                                            <td>{Number(item.unitPrice).toFixed(2)} MAD/kg</td>
                                            <td className="fw-bold">{Number(item.subtotal || 0).toFixed(2)} MAD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {cartItems[0]?.harvestDate && (
                                <Alert variant="info" className="mb-0">
                                    <small>🗓️ Harvest date: {new Date(cartItems[0].harvestDate).toLocaleDateString()}</small>
                                    {cartItems[0]?.estimatedDeliveryDate && (
                                        <><br /><small>🚚 Est. delivery: {new Date(cartItems[0].estimatedDeliveryDate).toLocaleDateString()}</small></>
                                    )}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0 mt-3" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">Delivery Details</Card.Title>
                            <CheckoutForm form={form} onChange={setForm} onSubmit={handleSubmit} loading={loading} />
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <CartSummary
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        cartTotalWeight={cartTotalWeight}
                        cartCount={cartCount}
                    />
                </Col>
            </Row>
        </div>
    );
}
