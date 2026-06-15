import { Form, Button, Spinner } from "react-bootstrap";

export default function CheckoutForm({ form, onChange, onSubmit, loading }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...form, [name]: value });
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Delivery Address *</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    name="delivery_address"
                    value={form.delivery_address || ""}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                    type="tel"
                    name="phone"
                    value={form.phone || ""}
                    onChange={handleChange}
                    placeholder="e.g. 06XXXXXXXX"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    name="notes"
                    value={form.notes || ""}
                    onChange={handleChange}
                    placeholder="Any special instructions?"
                />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100" disabled={loading}>
                {loading ? <><Spinner size="sm" className="me-1" />Placing Order…</> : "Place Order"}
            </Button>
        </Form>
    );
}
