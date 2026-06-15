import { Table, Badge, Button, Spinner } from "react-bootstrap";

export default function AdminUserTable({ users = [], loading, onSuspend }) {
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
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center text-muted py-3">No users found.</td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td className="fw-medium">#{user.id}</td>
                            <td>{user.name || `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "—"}</td>
                            <td>{user.email}</td>
                            <td><Badge bg="secondary">{user.role}</Badge></td>
                            <td>
                                <Badge bg={user.is_active ? "success" : "danger"}>
                                    {user.is_active ? "Active" : "Suspended"}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant={user.is_active ? "warning" : "success"}
                                    size="sm"
                                    onClick={() => onSuspend?.(user.id)}
                                >
                                    {user.is_active ? "Suspend" : "Activate"}
                                </Button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}
