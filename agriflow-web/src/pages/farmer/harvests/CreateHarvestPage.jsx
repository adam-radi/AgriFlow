import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Card } from "react-bootstrap";
import { createHarvest, clearHarvestError } from "../../../features/harvests/harvestSlice";
import { selectHarvestLoading, selectHarvestError } from "../../../features/harvests/harvestSelectors";
import { fetchFarmerProducts } from "../../../features/products/productSlice";
import { selectFarmerProducts } from "../../../features/products/productSelectors";
import HarvestForm from "../../../components/harvests/HarvestForm";

export default function CreateHarvestPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectHarvestLoading);
    const error = useSelector(selectHarvestError);
    const products = useSelector(selectFarmerProducts);

    const [form, setForm] = useState({
        product_id: "",
        start_date: "",
        end_date: "",
        estimated_total_qte: "",
        max_daily_qte: "",
    });

    useEffect(() => {
        dispatch(fetchFarmerProducts());
    }, [dispatch]);

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(clearHarvestError());

        const payload = {
            product_id: Number(form.product_id),
            start_date: form.start_date,
            end_date: form.end_date || null,
            estimated_total_qte: Number(form.estimated_total_qte),
            max_daily_qte: form.max_daily_qte ? Number(form.max_daily_qte) : null,
        };

        const result = await dispatch(createHarvest(payload));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/farmer/harvests");
        }
    }

    return (
        <div className="container py-4">
            <div className="mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h1 className="h3 fw-bold mt-2 mb-1">Create Harvest</h1>
                <p className="text-muted mb-0">Schedule a new harvest period for your product</p>
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
                    />
                </Card.Body>
            </Card>
        </div>
    );
}
