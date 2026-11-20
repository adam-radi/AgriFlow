import { Table, Badge, Button, Spinner } from "react-bootstrap";

export default function AdminFarmerValidationTable({ farmers = [], loading, onValidate, onReject, onSuspend }) {
    if (loading) {
        return <div className="text-center py-4"><Spinner animation="border" variant="success" /></div>;
    }
    return (
        <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {farmers.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center text-muted py-3">No farmers found.</td>
                    </tr>
                ) : (
                    farmers.map((farmer) => (
                        <tr key={farmer.id}>
                            <td className="fw-medium">#{farmer.id}</td>
                            <td>{farmer.name || "—"}</td>
                            <td>{farmer.email}</td>
                            <td>
                                <Badge bg={
                                    farmer.farmer_status === "approved" ? "success" :
                                    farmer.farmer_status === "rejected" ? "danger" :
                                    farmer.farmer_status === "pending" ? "warning" :
                                    "secondary"
                                }>
                                    {farmer.farmer_status || "unknown"}
                                </Badge>
                            </td>
                            <td>
                                <div className="d-flex gap-1">
                                    {farmer.farmer_status !== "approved" && (
                                        <Button variant="success" size="sm" onClick={() => onValidate?.(farmer.id)}>
                                            Validate
                                        </Button>
                                    )}
                                    {farmer.farmer_status !== "rejected" && (
                                        <Button variant="danger" size="sm" onClick={() => onReject?.(farmer.id)}>
                                            Reject
                                        </Button>
                                    )}
                                    <Button variant="warning" size="sm" onClick={() => onSuspend?.(farmer.id)}>
                                        Suspend
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}
