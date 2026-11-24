import VerificationStatusBadge from "./VerificationStatusBadge";

export default function VerificationHistoryTimeline({ history = [] }) {
    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="af-card mt-4">
            <div className="af-card-header">
                <div>
                    <h3 className="af-card-title h6">Historique des demandes de vérification</h3>
                    <p className="af-card-description">
                        Traçabilité des dossiers soumis et décisions administratives passées.
                    </p>
                </div>
            </div>

            <div className="af-stack gap-3">
                {history.map((item, idx) => (
                    <div
                        key={item.id || idx}
                        className="p-3 rounded-2 border bg-white"
                        style={{ borderColor: "var(--af-border, #e2e9e3)" }}
                    >
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2 flex-wrap">
                            <div>
                                <span className="small fw-bold text-muted me-2">
                                    Dossier #{item.id}
                                </span>
                                <span className="small text-muted">
                                    Soumis le{" "}
                                    {item.submitted_at
                                        ? new Date(item.submitted_at).toLocaleDateString("fr-FR", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "—"}
                                </span>
                            </div>
                            <VerificationStatusBadge status={item.status} />
                        </div>

                        {item.reviewed_at && (
                            <p className="small text-muted mb-1">
                                Décision rendue le{" "}
                                {new Date(item.reviewed_at).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        )}

                        {item.rejection_reason && (
                            <div
                                className="small p-2 rounded mt-2"
                                style={{
                                    backgroundColor: "var(--af-danger-bg, #fff0ef)",
                                    color: "var(--af-danger, #b64242)",
                                }}
                            >
                                <strong>Motif de refus :</strong> {item.rejection_reason}
                            </div>
                        )}

                        {item.requested_information && (
                            <div
                                className="small p-2 rounded mt-2"
                                style={{
                                    backgroundColor: "var(--af-warning-bg, #fff4df)",
                                    color: "var(--af-warning, #a96d17)",
                                }}
                            >
                                <strong>Complément demandé :</strong> {item.requested_information}
                            </div>
                        )}

                        {item.documents && item.documents.length > 0 && (
                            <div className="mt-2 pt-2 border-top">
                                <span className="small text-muted d-block mb-1">
                                    Pièces justificatives jointes ({item.documents.length}) :
                                </span>
                                <div className="d-flex flex-wrap gap-2">
                                    {item.documents.map((doc, docIdx) => (
                                        <span
                                            key={doc.id || docIdx}
                                            className="badge rounded-pill bg-light text-dark border px-2 py-1"
                                            style={{ fontSize: "0.75rem", fontWeight: 500 }}
                                        >
                                            📄 {doc.original_name || doc.document_type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
