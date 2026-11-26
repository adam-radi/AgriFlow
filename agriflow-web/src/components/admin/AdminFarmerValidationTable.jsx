import { useState } from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import VerificationStatusBadge from "../verification/VerificationStatusBadge";
import { Button } from "../common";

const COMMON_REJECTION_REASONS = [
    "Attestation d'inscription agricole ou certificat d'exploitation illisible",
    "Pièce d'identité (CIN/Passeport) expirée ou non conforme",
    "Incohérence entre l'identité déclarée et les justificatifs fournis",
    "Coordonnées de l'exploitation ou zone géographique incomplètes",
];

/**
 * AdminFarmerValidationTable — Table d'instruction des dossiers de vérification exploitants
 */
export default function AdminFarmerValidationTable({
    farmers = [],
    loading,
    onValidate,
    onReject,
}) {
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [actionType, setActionType] = useState(null); // 'reject' | 'details' | 'approve'
    const [rejectionReason, setRejectionReason] = useState("");

    const handleConfirmReject = () => {
        if (selectedFarmer) {
            onReject?.(selectedFarmer.id, rejectionReason);
            setSelectedFarmer(null);
            setActionType(null);
            setRejectionReason("");
        }
    };

    const handleConfirmApprove = () => {
        if (selectedFarmer) {
            onValidate?.(selectedFarmer.id);
            setSelectedFarmer(null);
            setActionType(null);
        }
    };

    if (loading && farmers.length === 0) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="small text-muted mt-2">Chargement des dossiers en cours...</p>
            </div>
        );
    }

    return (
        <>
            <div className="table-responsive">
                <table className="table align-middle af-dashboard-table mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Exploitant & Exploitation</th>
                            <th>Coordonnées</th>
                            <th>Zone Agricole</th>
                            <th>Statut Réglementaire</th>
                            <th className="text-end">Actions Administratives</th>
                        </tr>
                    </thead>
                    <tbody>
                        {farmers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-5">
                                    <div className="fs-3 mb-2">🛡️</div>
                                    <div className="fw-semibold">Aucun dossier à afficher</div>
                                    <small className="text-muted">Aucun exploitant ne correspond aux critères sélectionnés.</small>
                                </td>
                            </tr>
                        ) : (
                            farmers.map((farmer) => {
                                const status = farmer.farmer_status || "pending";
                                const initials = (farmer.name || "A")
                                    .trim()
                                    .split(/\s+/)
                                    .slice(0, 2)
                                    .map((part) => part.charAt(0).toUpperCase())
                                    .join("");

                                return (
                                    <tr key={farmer.id}>
                                        <td className="fw-mono text-muted">#{farmer.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div
                                                    className="af-list-item-avatar"
                                                    style={{
                                                        backgroundColor: "#eaf3ec",
                                                        color: "#194638",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div className="fw-bold" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                                        {farmer.name || "—"}
                                                    </div>
                                                    <div className="small text-muted">{farmer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small fw-semibold">{farmer.phone || "Non renseigné"}</div>
                                        </td>
                                        <td>
                                            <span className="small">📍 {farmer.zone || "Maroc"}</span>
                                        </td>
                                        <td>
                                            <VerificationStatusBadge status={status} />
                                        </td>
                                        <td className="text-end">
                                            <div className="d-inline-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                                                    style={{ fontSize: "0.8rem" }}
                                                    onClick={() => {
                                                        setSelectedFarmer(farmer);
                                                        setActionType("details");
                                                    }}
                                                >
                                                    Examiner
                                                </button>

                                                {status !== "approved" && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success rounded-pill px-3 py-1"
                                                        style={{ fontSize: "0.8rem", backgroundColor: "var(--af-primary-forest, #15372F)", borderColor: "var(--af-primary-forest, #15372F)" }}
                                                        onClick={() => {
                                                            setSelectedFarmer(farmer);
                                                            setActionType("approve");
                                                        }}
                                                    >
                                                        ✓ Valider
                                                    </button>
                                                )}

                                                {status !== "rejected" && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1"
                                                        style={{ fontSize: "0.8rem" }}
                                                        onClick={() => {
                                                            setSelectedFarmer(farmer);
                                                            setActionType("reject");
                                                        }}
                                                    >
                                                        ✕ Refuser
                                                    </button>
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

            {/* Modal Examen Détails Dossier */}
            <Modal
                show={actionType === "details"}
                onHide={() => {
                    setSelectedFarmer(null);
                    setActionType(null);
                }}
                centered
            >
                <Modal.Header closeButton style={{ borderBottom: "1px solid #edf2ee" }}>
                    <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--af-primary-forest)" }}>
                        Dossier Exploitant #{selectedFarmer?.id} — {selectedFarmer?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedFarmer && (
                        <div className="d-flex flex-column gap-3 small">
                            <div>
                                <span className="text-muted d-block">Nom de l&apos;exploitant :</span>
                                <strong className="fs-6" style={{ color: "var(--af-green-950, #15372F)" }}>
                                    {selectedFarmer.name}
                                </strong>
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <span className="text-muted d-block">Email professionnel :</span>
                                    <span>{selectedFarmer.email}</span>
                                </div>
                                <div className="col-6">
                                    <span className="text-muted d-block">Téléphone :</span>
                                    <span>{selectedFarmer.phone || "Non renseigné"}</span>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <span className="text-muted d-block">Bassin agricole :</span>
                                    <span>📍 {selectedFarmer.zone || "Région Maroc"}</span>
                                </div>
                                <div className="col-6">
                                    <span className="text-muted d-block">Statut de conformité :</span>
                                    <VerificationStatusBadge status={selectedFarmer.farmer_status || "pending"} />
                                </div>
                            </div>

                            {/* Section Confidentialité des documents */}
                            <div className="p-3 rounded-3 mt-2" style={{ backgroundColor: "var(--af-canvas, #F6F8F5)", border: "1px solid var(--af-border, #E2E9E3)" }}>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <span>🔒</span>
                                    <strong style={{ color: "var(--af-green-900, #194638)" }}>Pièces justificatives privées</strong>
                                </div>
                                <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>
                                    Conformément aux règles de sécurité AgriFlow, les attestations légales (CIN, Registre Agricole) sont stockées de façon sécurisée et privée.
                                </p>
                            </div>

                            <div>
                                <span className="text-muted d-block">Date de soumission :</span>
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
                <Modal.Footer style={{ borderTop: "1px solid #edf2ee" }}>
                    <Button
                        variant="secondary"
                        pill
                        onClick={() => {
                            setSelectedFarmer(null);
                            setActionType(null);
                        }}
                    >
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Confirmation Validation */}
            <Modal
                show={actionType === "approve"}
                onHide={() => {
                    setSelectedFarmer(null);
                    setActionType(null);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="h6 fw-bold text-success">
                        Valider l&apos;accréditation de l&apos;exploitant
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-0">
                        Voulez-vous approuver le dossier de <strong>{selectedFarmer?.name}</strong> (#{selectedFarmer?.id}) ?
                        L&apos;exploitant recevra immédiatement le statut <strong>Certifié ✓</strong> et pourra publier ses récoltes sur la marketplace.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline" pill onClick={() => { setSelectedFarmer(null); setActionType(null); }}>
                        Annuler
                    </Button>
                    <Button variant="primary" pill onClick={handleConfirmApprove}>
                        Confirmer l&apos;approbation
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Refus avec Motif */}
            <Modal
                show={actionType === "reject"}
                onHide={() => {
                    setSelectedFarmer(null);
                    setActionType(null);
                    setRejectionReason("");
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
                        Veuillez préciser la raison du refus pour permettre à l&apos;exploitant de corriger ses informations et de renouveler sa soumission.
                    </p>

                    <div className="mb-3">
                        <label className="small fw-semibold text-muted mb-2 d-block">
                            Motifs fréquents de non-conformité :
                        </label>
                        <div className="d-flex flex-column gap-1">
                            {COMMON_REJECTION_REASONS.map((r, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary text-start rounded-3 py-1 px-2"
                                    style={{ fontSize: "0.8rem" }}
                                    onClick={() => setRejectionReason(r)}
                                >
                                    • {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Form.Group>
                        <Form.Label className="small fw-semibold">Motif explicatif personnalisé *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Précisez les pièces manquantes ou illisibles..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        pill
                        onClick={() => {
                            setSelectedFarmer(null);
                            setActionType(null);
                            setRejectionReason("");
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        pill
                        disabled={!rejectionReason.trim()}
                        onClick={handleConfirmReject}
                    >
                        Confirmer le refus
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
