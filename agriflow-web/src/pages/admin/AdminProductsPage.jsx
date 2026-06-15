import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, disableProduct } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminProducts,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import { Table, Badge, Button, Spinner } from "react-bootstrap";

export default function AdminProductsPage() {
    const dispatch = useDispatch();
    const products = useSelector(selectAdminProducts);
    const loading = useSelector(selectAdminLoading);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

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
                            <th>Name</th>
                            <th>Farmer</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-3">No products found.</td>
                            </tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p.id}>
                                    <td className="fw-medium">#{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>{p.farmer_name || p.farmer?.name || "—"}</td>
                                    <td>{p.price ? `${Number(p.price).toFixed(2)} MAD` : "—"}</td>
                                    <td>
                                        <Badge bg={p.is_active !== false ? "success" : "danger"}>
                                            {p.is_active !== false ? "Active" : "Disabled"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            variant={p.is_active !== false ? "danger" : "success"}
                                            size="sm"
                                            onClick={() => dispatch(disableProduct(p.id))}
                                        >
                                            {p.is_active !== false ? "Disable" : "Enable"}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
