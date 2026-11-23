import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import { fetchFarmerHarvests, clearHarvestSuccess, clearHarvestError } from "../../../features/harvests/harvestSlice";
import { fetchActiveVerification } from "../../../features/verification/verificationSlice";
import { useVerificationAccess } from "../../../features/verification/useVerificationAccess";
import VerificationBanner from "../../../components/verification/VerificationBanner";
import {
    selectFarmerHarvests,
    selectHarvestLoading,
    selectHarvestError,
    selectHarvestSuccess,
} from "../../../features/harvests/harvestSelectors";
import HarvestCard from "../../../components/harvests/HarvestCard";

export default function FarmerHarvestsPage() {
    const dispatch = useDispatch();
    const harvests = useSelector(selectFarmerHarvests);
    const loading = useSelector(selectHarvestLoading);
    const error = useSelector(selectHarvestError);
    const success = useSelector(selectHarvestSuccess);

    const { status, canPublish, openModal, VerificationModal } = useVerificationAccess({ accountType: "farmer" });

    useEffect(() => {
        dispatch(fetchFarmerHarvests());
        dispatch(fetchActiveVerification());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            const t = setTimeout(() => dispatch(clearHarvestSuccess()), 3500);
            return () => clearTimeout(t);
        }
    }, [success, dispatch]);

    return (
        <div className="container py-4">
            {/* ── Verification Banner (Phase 07) ── */}
            <VerificationBanner status={status} accountType="farmer" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-1">My Harvests</h1>
                    <p className="text-muted mb-0">Manage your harvest schedules</p>
                </div>
                {canPublish ? (
                    <Link to="/farmer/harvests/create" className="btn btn-success">
                        + New Harvest
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => openModal("la publication de récoltes")}
                        title="Vérification requise pour publier"
                    >
                        + New Harvest 🔒
                    </button>
                )}
            </div>

            {success && (
                <Alert variant="success" dismissible onClose={() => dispatch(clearHarvestSuccess())}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearHarvestError())}>
                    {typeof error === "string" ? error : "An error occurred"}
                </Alert>
            )}

            {loading && harvests.length === 0 && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="text-muted mt-2">Loading harvests…</p>
                </div>
            )}

            {!loading && harvests.length === 0 && !error && (
                <div className="text-center py-5">
                    <div style={{ fontSize: "3rem" }}>🌾</div>
                    <h5 className="mt-3">No harvests yet</h5>
                    <p className="text-muted">Create your first harvest schedule.</p>
                    {canPublish ? (
                        <Link to="/farmer/harvests/create" className="btn btn-success">
                            + Create Harvest
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => openModal("la publication de récoltes")}
                        >
                            + Create Harvest 🔒
                        </button>
                    )}
                </div>
            )}

            {harvests.length > 0 && (
                <Row className="g-4">
                    {harvests.map((harvest) => (
                        <Col key={harvest.id} sm={6} lg={4} xl={3}>
                            <HarvestCard harvest={harvest} linkPrefix="/farmer/harvests" />
                        </Col>
                    ))}
                </Row>
            )}

            {/* Verification Modal (Phase 07) */}
            {VerificationModal}
        </div>
    );
}
