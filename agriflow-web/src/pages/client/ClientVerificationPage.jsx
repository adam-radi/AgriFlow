import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Spinner, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
    fetchActiveVerification,
    fetchVerificationHistory,
    submitVerification,
    clearVerificationError,
    clearVerificationSuccess,
} from "../../features/verification/verificationSlice";
import {
    selectActiveVerification,
    selectVerificationHistory,
    selectVerificationStatus,
    selectVerificationLoading,
    selectVerificationSubmitting,
    selectVerificationError,
    selectVerificationSuccess,
} from "../../features/verification/verificationSelectors";

import VerificationStatusBadge from "../../components/verification/VerificationStatusBadge";
import VerificationStatusCard from "../../components/verification/VerificationStatusCard";
import VerificationUploadZone from "../../components/verification/VerificationUploadZone";
import VerificationHistoryTimeline from "../../components/verification/VerificationHistoryTimeline";
import { Button } from "../../components/common";

export default function ClientVerificationPage() {
    const dispatch = useDispatch();

    const activeRequest = useSelector(selectActiveVerification);
    const history = useSelector(selectVerificationHistory);
    const status = useSelector(selectVerificationStatus);
    const loading = useSelector(selectVerificationLoading);
    const submitting = useSelector(selectVerificationSubmitting);
    const error = useSelector(selectVerificationError);
    const success = useSelector(selectVerificationSuccess);

    const [documents, setDocuments] = useState([]);
    const [localError, setLocalError] = useState("");
    const [forceNewSubmission, setForceNewSubmission] = useState(false);

    useEffect(() => {
        dispatch(fetchActiveVerification());
        dispatch(fetchVerificationHistory());
    }, [dispatch]);

    const isApproved = status === "approved";
    const isPending = (status === "pending" || status === "under_review") && !forceNewSubmission;
    const canSubmit = !isApproved && (!isPending || forceNewSubmission);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");
        dispatch(clearVerificationError());
        dispatch(clearVerificationSuccess());

        if (documents.length === 0) {
            setLocalError("Veuillez joindre au moins un justificatif professionnel (ex. Registre de Commerce, CIN du gérant).");
            return;
        }

        const formData = new FormData();
        documents.forEach((doc, idx) => {
            formData.append(`documents[${idx}][type]`, doc.type);
            formData.append(`documents[${idx}][file]`, doc.file);
        });

        const result = await dispatch(
            submitVerification({ accountType: "buyer", formData })
        );

        if (result.type.endsWith("/fulfilled")) {
            setDocuments([]);
            setForceNewSubmission(false);
            dispatch(fetchActiveVerification());
            dispatch(fetchVerificationHistory());
        }
    };

    return (
        <div className="p-3 p-md-4" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* Header de la page */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Link
                            to="/client/profile"
                            className="text-decoration-none small"
                            style={{ color: "var(--af-green-800, #215b46)" }}
                        >
                            ← Retour au profil professionnel
                        </Link>
                    </div>
                    <h1 className="h4 fw-bold m-0" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                        Vérification du compte acheteur professionnel
                    </h1>
                    <p className="text-muted small m-0">
                        Accédez aux tarifs directs exploitation et aux facilités de livraison groupée.
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <VerificationStatusBadge status={status} />
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => dispatch(clearVerificationError())}
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            {localError && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setLocalError("")}
                    className="mb-4"
                >
                    {localError}
                </Alert>
            )}

            {success && (
                <Alert
                    variant="success"
                    dismissible
                    onClose={() => dispatch(clearVerificationSuccess())}
                    className="mb-4"
                >
                    {success}
                </Alert>
            )}

            {/* Statut actuel */}
            <VerificationStatusCard
                status={status}
                activeRequest={activeRequest}
                accountType="buyer"
                onNewSubmissionClick={() => setForceNewSubmission(true)}
            />

            {/* Explications pour l'acheteur professionnel */}
            <div className="af-card mb-4" style={{ backgroundColor: "var(--af-green-50, #f3f8f4)" }}>
                <h2 className="h6 fw-bold mb-3" style={{ color: "var(--af-green-950, #15372f)" }}>
                    Avantages du compte acheteur vérifié
                </h2>

                <Row className="g-3">
                    <Col md={4}>
                        <div className="p-3 rounded-2 bg-white border h-100" style={{ borderColor: "var(--af-border, #e2e9e3)" }}>
                            <div className="fw-bold text-success mb-1">Épiceries & Primeurs</div>
                            <h3 className="h6 fw-semibold mb-1">Tarifs directs champ</h3>
                            <p className="small text-muted m-0">
                                Achetez au prix net producteur sans intermédiaires inutiles, pour des marges et une fraîcheur optimales.
                            </p>
                        </div>
                    </Col>

                    <Col md={4}>
                        <div className="p-3 rounded-2 bg-white border h-100" style={{ borderColor: "var(--af-border, #e2e9e3)" }}>
                            <div className="fw-bold text-success mb-1">Logistique groupée</div>
                            <h3 className="h6 fw-semibold mb-1">Livraison prioritaire</h3>
                            <p className="small text-muted m-0">
                                Regroupez vos commandes par zone urbaine pour réduire les frais de transport et sécuriser les créneaux.
                            </p>
                        </div>
                    </Col>

                    <Col md={4}>
                        <div className="p-3 rounded-2 bg-white border h-100" style={{ borderColor: "var(--af-border, #e2e9e3)" }}>
                            <div className="fw-bold text-success mb-1">Facturation conforme</div>
                            <h3 className="h6 fw-semibold mb-1">Documents conformes ICE</h3>
                            <p className="small text-muted m-0">
                                Factures avec ICE et traçabilité complète des récoltes pour votre comptabilité.
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Zone de soumission */}
            {canSubmit ? (
                <div className="af-card mb-4">
                    <div className="af-card-header">
                        <div>
                            <h2 className="af-card-title h6">Transmission des pièces justificatives</h2>
                            <p className="af-card-description">
                                Fournissez votre Registre de Commerce (RC), Patente ou attestation professionnelle et la CIN du gérant.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <VerificationUploadZone
                            documents={documents}
                            onDocumentsChange={setDocuments}
                            disabled={submitting}
                        />

                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                            <span className="small text-muted">
                                {documents.length} document(s) sélectionné(s).
                            </span>

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={submitting}
                                disabled={documents.length === 0}
                            >
                                Valider et soumettre ma demande →
                            </Button>
                        </div>
                    </form>
                </div>
            ) : isApproved ? (
                <div className="af-card mb-4 text-center py-4">
                    <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: "var(--af-success-bg, #e9f5ed)",
                            color: "var(--af-success, #247a50)",
                            fontSize: "1.8rem",
                        }}
                    >
                        ✓
                    </div>
                    <h2 className="h5 fw-bold" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                        Compte Acheteur Professionnel Certifié
                    </h2>
                    <p className="text-muted small mx-auto mb-3" style={{ maxWidth: "560px" }}>
                        Votre établissement est officiellement vérifié sur AgriFlow. Vous pouvez commander en gros et par palettes directement auprès des coopératives et exploitants partenaires.
                    </p>
                    <Link to="/products">
                        <Button variant="primary" size="sm">
                            Parcourir le catalogue agricole →
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="af-card mb-4 text-center py-4">
                    <div className="mb-2" style={{ fontSize: "2rem" }}>
                        ⏳
                    </div>
                    <h2 className="h5 fw-bold" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                        Dossier en cours d'examen
                    </h2>
                    <p className="text-muted small mx-auto" style={{ maxWidth: "500px" }}>
                        Nos modérateurs examinent actuellement vos pièces justificatives. Vous recevrez une notification par email dès la validation.
                    </p>
                </div>
            )}

            {/* Timeline Historique */}
            {loading ? (
                <div className="text-center py-3">
                    <Spinner animation="border" size="sm" variant="success" />
                </div>
            ) : (
                <VerificationHistoryTimeline history={history} />
            )}
        </div>
    );
}
