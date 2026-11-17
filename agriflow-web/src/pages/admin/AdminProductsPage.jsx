import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, disableProduct, enableProduct, updateProduct, deleteProduct } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminProducts,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import { Table, Badge, Button, Spinner, Modal, Form, Image } from "react-bootstrap";

export default function AdminProductsPage() {
    const dispatch = useDispatch();
    const products = useSelector(selectAdminProducts);
    const loading = useSelector(selectAdminLoading);

    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    function handleRowClick(p) {
        setEditProduct(p);
        setForm({ name: p.name || "", description: p.description || "" });
        setImageFile(null);
        setImagePreview(null);
    }

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function handleRemoveImage() {
        setImageFile(null);
        setImagePreview(null);
        if (fileRef.current) fileRef.current.value = "";
    }

    function handleSave() {
        if (!editProduct) return;
        setSaving(true);

        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        if (imageFile) fd.append("image", imageFile);

        dispatch(updateProduct({ id: editProduct.id, data: fd })).then(() => {
            setSaving(false);
            setEditProduct(null);
        });
    }

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Products</h1>
                <p className="text-muted mb-0">Monitor and moderate product listings</p>
            </div>

            {loading && products.length === 0 ? (
                <div className="text-center py-4"><Spinner animation="border" variant="success" /></div>
            ) : (
                <Table striped bordered hover responsive className="align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Farmer</th>
                            <th>Zone</th>
                            <th>Prices</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center text-muted py-3">No products found.</td>
                            </tr>
                        ) : (
                            products.map((p) => (
                                <tr
                                    key={p.id}
                                    onClick={() => handleRowClick(p)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td className="fw-medium">#{p.id}</td>
                                    <td>
                                        {p.image ? (
                                            <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td className="fw-semibold" style={{ color: "#2d6a4f" }}>{p.name}</td>
                                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {p.description || "—"}
                                    </td>
                                    <td>{p.farmer?.name || "—"}</td>
                                    <td>{p.farmer?.zone || "—"}</td>
                                    <td>
                                        {p.quantities?.length > 0 ? (
                                            <div style={{ fontSize: ".82rem" }}>
                                                {p.quantities.map((q, i) => (
                                                    <div key={i}>{q.label}: {Number(q.price).toFixed(2)} MAD</div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <Badge bg={p.is_available !== false ? "success" : "danger"}>
                                            {p.is_available !== false ? "Active" : "Disabled"}
                                        </Badge>
                                    </td>
                                    <td style={{ fontSize: ".82rem", whiteSpace: "nowrap" }}>
                                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <div className="d-flex gap-1">
                                            <Button
                                                variant={p.is_available !== false ? "danger" : "success"}
                                                size="sm"
                                                onClick={() => dispatch(p.is_available !== false ? disableProduct(p.id) : enableProduct(p.id))}
                                            >
                                                {p.is_available !== false ? "Disable" : "Enable"}
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    if (window.confirm("Delete this product?")) dispatch(deleteProduct(p.id));
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            <Modal show={!!editProduct} onHide={() => setEditProduct(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product #{editProduct?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                        border: "2px dashed #ccc",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        overflow: "hidden",
                                        background: "#f8f9fa",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => fileRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : editProduct?.image ? (
                                        <img src={editProduct.image} alt={editProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <span className="text-muted" style={{ fontSize: ".75rem" }}>No image</span>
                                    )}
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <Button variant="outline-secondary" size="sm" onClick={() => fileRef.current?.click()}>
                                        {editProduct?.image ? "Change" : "Add"}
                                    </Button>
                                    {(imageFile || editProduct?.image) && (
                                        <Button variant="outline-danger" size="sm" onClick={handleRemoveImage}>
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    className="d-none"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Product name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Product description"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditProduct(null)}>Cancel</Button>
                    <Button variant="success" onClick={handleSave} disabled={saving || !form.name.trim()}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
