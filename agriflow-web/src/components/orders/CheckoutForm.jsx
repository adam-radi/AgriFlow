import { Form, Button, Spinner } from "react-bootstrap";

export default function CheckoutForm({ form, onChange, onSubmit, loading }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...form, [name]: value });
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Delivery Zone *</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    name="delivery_address"
                    value={form.delivery_address || ""}
                    onChange={handleChange}
                    placeholder="Enter your delivery zone/address"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Preferred Delivery Date</Form.Label>
                <Form.Control
                    type="date"
                    name="delivery_date"
                    value={form.delivery_date || ""}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100" disabled={loading}>
                {loading ? <><Spinner size="sm" className="me-1" />Placing Order…</> : "Place Order"}
            </Button>
        </Form>
    );
}
