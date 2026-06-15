import { Form, Button, Row, Col, Spinner } from "react-bootstrap";

export default function HarvestForm({
    form = {},
    products = [],
    onChange,
    onSubmit,
    loading = false,
    isEdit = false,
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...form, [name]: value });
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Product *</Form.Label>
                <Form.Select name="product_id" value={form.product_id || ""} onChange={handleChange} required>
                    <option value="">Select a product…</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date *</Form.Label>
                        <Form.Control
                            type="date"
                            name="start_date"
                            value={form.start_date || ""}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date *</Form.Label>
                        <Form.Control
                            type="date"
                            name="end_date"
                            value={form.end_date || ""}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Estimated Quantity *</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            name="estimated_quantity"
                            value={form.estimated_quantity || ""}
                            onChange={handleChange}
                            placeholder="e.g. 1000"
                            required
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Max Quantity Per Day</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            name="max_quantity_per_day"
                            value={form.max_quantity_per_day || ""}
                            onChange={handleChange}
                            placeholder="e.g. 100"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" type="button" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button variant="success" type="submit" disabled={loading}>
                    {loading ? <><Spinner size="sm" className="me-1" />{isEdit ? "Saving…" : "Creating…"}</> : (isEdit ? "Update Harvest" : "Create Harvest")}
                </Button>
            </div>
        </Form>
    );
}
