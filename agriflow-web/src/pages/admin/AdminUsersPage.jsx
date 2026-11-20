import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";
import { fetchUsers, suspendUser, createDeliveryUser } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminUsers,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import AdminUserTable from "../../components/admin/AdminUserTable";

export default function AdminUsersPage() {
    const dispatch = useDispatch();
    const users = useSelector(selectAdminUsers);
    const loading = useSelector(selectAdminLoading);

    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", zone: "" });

    function handleSuspend(id) {
        dispatch(suspendUser(id));
    }

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit() {
        dispatch(createDeliveryUser(form)).then(() => {
            setShow(false);
            setForm({ name: "", email: "", password: "", phone: "", zone: "" });
            dispatch(fetchUsers());
        });
    }

    return (
        <div className="p-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 fw-bold mb-1">Users</h1>
                    <p className="text-muted mb-0">Manage all platform users</p>
                </div>
                <Button variant="success" onClick={() => setShow(true)}>+ Create Livreur</Button>
            </div>

            <AdminUserTable users={users} loading={loading} onSuspend={handleSuspend} />

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Delivery User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" type="email" value={form.email} onChange={handleChange} placeholder="livreur@example.com" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control name="phone" value={form.phone} onChange={handleChange} placeholder="+212 6XX XXXXXX" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Zone</Form.Label>
                            <Form.Control name="zone" value={form.zone} onChange={handleChange} placeholder="e.g. Zone A, Marrakech" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleSubmit} disabled={!form.name || !form.email || !form.password}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
