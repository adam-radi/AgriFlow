import { Table, Badge, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const statusVariant = {
    planned: "warning",
    active: "success",
    completed: "secondary",
    cancelled: "danger",
};

export default function HarvestTable({ harvests = [], onSearch, searchValue, onFilterStatus, statusValue }) {
    return (
        <>
            <div className="d-flex flex-wrap gap-3 mb-3">
                <InputGroup style={{ maxWidth: "320px" }}>
                    <InputGroup.Text className="bg-white">🔍</InputGroup.Text>
                    <Form.Control
                        placeholder="Search harvests…"
                        value={searchValue || ""}
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </InputGroup>
                <Form.Select
                    style={{ maxWidth: "180px" }}
                    value={statusValue || ""}
                    onChange={(e) => onFilterStatus?.(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </Form.Select>
            </div>

            <Table striped bordered hover responsive className="align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>Harvest</th>
                        <th>Product</th>
                        <th>Farmer</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Est. Qty</th>
                        <th>Remaining</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {harvests.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center text-muted py-4">
                                No harvests found.
                            </td>
                        </tr>
                    ) : (
                        harvests.map((h) => (
                            <tr key={h.id}>
                                <td className="fw-medium">{h.name || `#${h.id}`}</td>
                                <td>{h.product_name || h.product?.name || "—"}</td>
                                <td>{h.farmer_name || h.farmer?.name || "—"}</td>
                                <td>
                                    <Badge bg={statusVariant[h.status] || "light"} className="text-capitalize">
                                        {h.status || "planned"}
                                    </Badge>
                                </td>
                                <td>{h.start_date ? new Date(h.start_date).toLocaleDateString() : "—"}</td>
                                <td>{h.end_date ? new Date(h.end_date).toLocaleDateString() : "—"}</td>
                                <td>{h.estimated_quantity ?? "—"}</td>
                                <td>{h.remaining_capacity ?? "—"}</td>
                                <td>
                                    <Link to={`/admin/harvests/${h.id}`} className="btn btn-outline-success btn-sm">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
}
