import { Table, Badge, Spinner } from "react-bootstrap";

export default function AdminHarvestOverviewTable({ harvests = [], loading }) {
    if (loading) {
        return <div className="text-center py-4"><Spinner animation="border" variant="success" /></div>;
    }
    return (
        <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Farmer</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Harvest Date</th>
                </tr>
            </thead>
            <tbody>
                {harvests.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center text-muted py-3">No harvests found.</td>
                    </tr>
                ) : (
                    harvests.map((harvest) => (
                        <tr key={harvest.id}>
                            <td className="fw-medium">#{harvest.id}</td>
                            <td>{harvest.product_name || harvest.product?.name || "—"}</td>
                            <td>{harvest.farmer_name || harvest.farmer?.name || "—"}</td>
                            <td>{harvest.quantity ? `${harvest.quantity} ${harvest.unit || "kg"}` : "—"}</td>
                            <td>
                                <Badge bg={
                                    harvest.status === "available" ? "success" :
                                    harvest.status === "pending" ? "warning" :
                                    harvest.status === "sold" ? "secondary" :
                                    "info"
                                }>
                                    {harvest.status || "—"}
                                </Badge>
                            </td>
                            <td>{harvest.harvest_date ? new Date(harvest.harvest_date).toLocaleDateString() : "—"}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}
