import { useState } from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import VerificationStatusBadge from "../verification/VerificationStatusBadge";
import { Button } from "../common";

export default function AdminFarmerValidationTable({
    farmers = [],
    loading,
    onValidate,
    onReject,
    onSuspend,
}) {
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [actionType, setActionType] = useState(null); // 'reject' | 'details'
    const [rejectionReason, setRejectionReason] = useState("");

    const handleConfirmReject = () => {
        if (selectedFarmer) {
            onReject?.(selectedFarmer.id, rejectionReason);
            setSelectedFarmer(null);
            setActionType(null);
            setRejectionReason("");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="small text-muted mt-2">Chargement des comptes exploitants...</p>
            </div>
        );
    }

    return (
        <>
            <div className="af-table-wrap">
                <table className="af-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Exploitant</th>
                            <th>Contact</th>
                            <th>Zone</th>
                            <th>Statut Vérification</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {farmers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    Aucun exploitant agricole trouvé.
                                </td>
                            </tr>
                        ) : (
                            farmers.map((farmer) => {
                                const status = farmer.farmer_status || "pending";
                                return (
                                    <tr key={farmer.id}>
                                        <td className="fw-mono text-muted">#{farmer.id}</td>
                                        <td>
                                            <div className="fw-bold" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                                {farmer.name || "—"}
                                            </div>
                                            <div className="small text-muted">{farmer.email}</div>
                                        </td>
                                        <td>
                                            <span className="small">{farmer.phone || "—"}</span>
                                        </td>
                                        <td>
                                            <span className="small">{farmer.zone || "—"}</span>
                                        </td>
                                        <td>
                                            <VerificationStatusBadge status={status} />
                                        </td>
                                        <td className="text-end">
                                            <div className="d-inline-flex gap-1">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedFarmer(farmer);
                                                        setActionType("details");
                                                    }}
                                                >
                                                    Détails
                                                </Button>

                                                {status !== "approved" && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => onValidate?.(farmer.id)}
                                                    >
                                                        ✓ Approuver
                                                    </Button>
                                                )}

                                                {status !== "rejected" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        style={{ color: "var(--af-danger, #b64242)" }}
                                                        onClick={() => {
                                                            setSelectedFarmer(farmer);
                                                            setActionType("reject");
                                                        }}
                                                    >
                                                        ✕ Refuser
                                                    </Button>
                                                )}

                                                {onSuspend && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        style={{ color: "var(--af-warning, #a96d17)" }}
                                                        onClick={() => onSuspend?.(farmer.id)}
                                                    >
                                                        Suspendre
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Détails */}
            <Modal
                show={actionType === "details"}
                onHide={() => {
                    setSelectedFarmer(null);
                    setActionType(null);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="h6 fw-bold">
                        Dossier Exploitante #{selectedFarmer?.id} — {selectedFarmer?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFarmer && (
                        <div className="af-stack gap-2 small">
                            <div>
                                <span className="text-muted d-block">Nom :</span>
                                <strong className="fs-6">{selectedFarmer.name}</strong>
                            </div>
                            <div>
                                <span className="text-muted d-block">Email :</span>
                                <span>{selectedFarmer.email}</span>
                            </div>
                            <div>
                                <span className="text-muted d-block">Téléphone :</span>
                                <span>{selectedFarmer.phone || "Non renseigné"}</span>
                            </div>
                            <div>
                                <span className="text-muted d-block">Zone de production :</span>
                                <span>{selectedFarmer.zone || "Non renseignée"}</span>
                            </div>
                            <div>
                                <span className="text-muted d-block">Statut actuel :</span>
                                <VerificationStatusBadge status={selectedFarmer.farmer_status || "pending"} />
                            </div>
                            <div>
                                <span className="text-muted d-block">Date d'inscription :</span>
                                <span>
                                    {selectedFarmer.created_at
                                        ? new Date(selectedFarmer.created_at).toLocaleDateString("fr-FR", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setSelectedFarmer(null);
                            setActionType(null);
                        }}
                    >
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Refus avec Motif */}
            <Modal
                show={actionType === "reject"}
                onHide={() => {
                    setSelectedFarmer(null);
                    setActionType(null);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="h6 fw-bold text-danger">
                        Refuser le dossier #{selectedFarmer?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="small text-muted mb-3">
                        Veuillez préciser la raison du refus pour permettre à l'exploitant de corriger ses informations
                        ou de téléverser des justificatifs valides.
                    </p>
                    <Form.Group>
                        <Form.Label className="small fw-semibold">Motif du refus</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="ex. Pièce d'identité expirée ou attestation d'inscription agricole illisible."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setSelectedFarmer(null);
                            setActionType(null);
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleConfirmReject}
                    >
                        Confirmer le refus
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
