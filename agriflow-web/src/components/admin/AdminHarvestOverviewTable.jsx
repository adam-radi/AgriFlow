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
                    <th>Est. Total</th>
                    <th>Max Daily</th>
                    <th>Status</th>
                    <th>Start Date</th>
                </tr>
            </thead>
            <tbody>
                {harvests.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="text-center text-muted py-3">No harvests found.</td>
                    </tr>
                ) : (
                    harvests.map((harvest) => (
                        <tr key={harvest.id}>
                            <td className="fw-medium">#{harvest.id}</td>
                            <td>{harvest.product?.name || "—"}</td>
                            <td>{harvest.product?.farmer?.name || harvest.product?.user?.name || "—"}</td>
                            <td>{harvest.estimated_total_qte ?? "—"}</td>
                            <td>{harvest.max_daily_qte ?? "—"}</td>
                            <td>
                                <Badge bg={
                                    harvest.status === "open" ? "success" :
                                    harvest.status === "close" ? "secondary" :
                                    "info"
                                }>
                                    {harvest.status || "—"}
                                </Badge>
                            </td>
                            <td>{harvest.start_date ? new Date(harvest.start_date).toLocaleDateString() : "—"}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}
