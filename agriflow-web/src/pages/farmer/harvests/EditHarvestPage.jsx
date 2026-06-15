import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Card, Spinner } from "react-bootstrap";
import {
    fetchHarvestById,
    updateHarvest,
    clearHarvestError,
    clearSelectedHarvest,
} from "../../../features/harvests/harvestSlice";
import {
    selectSelectedHarvest,
    selectHarvestLoading,
    selectHarvestError,
} from "../../../features/harvests/harvestSelectors";
import { fetchFarmerProducts } from "../../../features/products/productSlice";
import { selectFarmerProducts } from "../../../features/products/productSelectors";
import HarvestForm from "../../../components/harvests/HarvestForm";

function mapHarvestToForm(harvest) {
    if (!harvest) return null;
    return {
        product_id: harvest.product_id || harvest.product?.id || "",
        start_date: harvest.start_date ? harvest.start_date.split("T")[0] : "",
        end_date: harvest.end_date ? harvest.end_date.split("T")[0] : "",
        estimated_quantity: harvest.estimated_quantity || "",
        max_quantity_per_day: harvest.max_quantity_per_day || "",
    };
}

export default function EditHarvestPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const harvest = useSelector(selectSelectedHarvest);
    const loading = useSelector(selectHarvestLoading);
    const error = useSelector(selectHarvestError);
    const products = useSelector(selectFarmerProducts);

    const [form, setForm] = useState(null);

    useEffect(() => {
        dispatch(fetchHarvestById(id));
        dispatch(fetchFarmerProducts());
        return () => dispatch(clearSelectedHarvest());
    }, [dispatch, id]);

    useEffect(() => {
        if (harvest) {
            setForm(mapHarvestToForm(harvest));
        }
    }, [harvest]);

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(clearHarvestError());

        const payload = {
            product_id: Number(form.product_id),
            start_date: form.start_date,
            end_date: form.end_date,
            estimated_quantity: Number(form.estimated_quantity),
            max_quantity_per_day: form.max_quantity_per_day ? Number(form.max_quantity_per_day) : undefined,
        };

        const result = await dispatch(updateHarvest({ id, data: payload }));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/farmer/harvests");
        }
    }

    if (!form) return (
        <div className="container py-5 text-center">
            <Spinner animation="border" variant="success" />
            <p className="text-muted mt-2">Loading harvest…</p>
        </div>
    );

    return (
        <div className="container py-4">
            <div className="mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h1 className="h3 fw-bold mt-2 mb-1">Edit Harvest</h1>
                <p className="text-muted mb-0">Update harvest schedule details</p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearHarvestError())}>
                    {typeof error === "string" ? error : JSON.stringify(error)}
                </Alert>
            )}

            <Card className="shadow-sm border-0" style={{ borderRadius: "12px", maxWidth: "680px" }}>
                <Card.Body className="p-4">
                    <HarvestForm
                        form={form}
                        products={products}
                        onChange={setForm}
                        onSubmit={handleSubmit}
                        loading={loading}
                        isEdit
                    />
                </Card.Body>
            </Card>
        </div>
    );
}
