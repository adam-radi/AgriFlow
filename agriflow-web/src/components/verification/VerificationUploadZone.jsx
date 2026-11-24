import { useState, useRef } from "react";
import { Alert } from "react-bootstrap";
import { Button } from "../common";

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo = 5120 Ko
const MAX_DOCUMENTS = 10;

const DOCUMENT_TYPES = [
    { value: "identity", label: "Pièce d'identité (CIN / Passeport du gérant ou exploitant)" },
    { value: "registration", label: "Registre de Commerce / Attestation Coopérative / Registre Agricole" },
    { value: "professional_certificate", label: "Certificat d'exercice / Carte d'agriculteur / Agrément sanitaire ONSSA" },
    { value: "address_proof", label: "Justificatif de localisation / Bail de l'exploitation ou du local" },
    { value: "other", label: "Autre justificatif professionnel complémentaire" },
];

export default function VerificationUploadZone({
    documents = [],
    onDocumentsChange,
    disabled = false,
}) {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [selectedDocType, setSelectedDocType] = useState("identity");

    const validateFile = (file) => {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            const ext = "." + file.name.split(".").pop().toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                return `Format non supporté pour "${file.name}". Seuls les fichiers PDF, JPG et PNG sont acceptés.`;
            }
        }
        if (file.size > MAX_FILE_SIZE) {
            return `Le fichier "${file.name}" dépasse la taille maximale autorisée de 5 Mo (${(
                file.size /
                (1024 * 1024)
            ).toFixed(1)} Mo).`;
        }
        return null;
    };

    const handleFiles = (incomingFiles) => {
        setUploadError("");
        if (!incomingFiles || incomingFiles.length === 0) return;

        if (documents.length + incomingFiles.length > MAX_DOCUMENTS) {
            setUploadError(`Vous ne pouvez pas joindre plus de ${MAX_DOCUMENTS} documents au total.`);
            return;
        }

        const newDocs = [];
        for (let i = 0; i < incomingFiles.length; i++) {
            const file = incomingFiles[i];
            const error = validateFile(file);
            if (error) {
                setUploadError(error);
                return;
            }
            newDocs.push({
                id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
                file,
                type: selectedDocType,
                name: file.name,
                size: file.size,
                mime: file.type || "application/octet-stream",
            });
        }

        onDocumentsChange([...documents, ...newDocs]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (disabled) return;
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
            e.target.value = "";
        }
    };

    const removeDocument = (id) => {
        onDocumentsChange(documents.filter((d) => d.id !== id));
    };

    const updateDocType = (id, newType) => {
        onDocumentsChange(
            documents.map((d) => (d.id === id ? { ...d, type: newType } : d))
        );
    };

    const formatBytes = (bytes) => {
        if (bytes < 1024) return `${bytes} o`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
    };

    return (
        <div className="mb-4">
            {uploadError && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setUploadError("")}
                    className="py-2 px-3 small mb-3"
                >
                    {uploadError}
                </Alert>
            )}

            {/* Type selector helper */}
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-2">
                <label className="af-label m-0" htmlFor="select-incoming-doc-type">
                    Catégorie du document à ajouter :
                </label>
                <select
                    id="select-incoming-doc-type"
                    className="af-select"
                    style={{ maxWidth: "360px", fontSize: "0.85rem" }}
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    disabled={disabled}
                >
                    {DOCUMENT_TYPES.map((dt) => (
                        <option key={dt.value} value={dt.value}>
                            {dt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Drag & Drop Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={`p-4 text-center rounded-3 position-relative ${
                    dragActive ? "border-success bg-light" : ""
                }`}
                style={{
                    border: "2px dashed var(--af-border-strong, #cbd7ce)",
                    backgroundColor: dragActive
                        ? "var(--af-green-50, #f3f8f4)"
                        : "var(--af-canvas, #f6f8f5)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                    disabled={disabled}
                    id="verification-file-input"
                />

                <div className="mb-2" style={{ fontSize: "2rem" }}>
                    📁
                </div>
                <p className="fw-semibold mb-1" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                    Glissez-déposez vos justificatifs ici, ou{" "}
                    <span style={{ color: "var(--af-green-700, #398565)" }}>parcourez vos fichiers</span>
                </p>
                <p className="small text-muted mb-0">
                    Formats acceptés : PDF, JPG, PNG · Poids maximum : 5 Mo par document · 10 fichiers maximum
                </p>
            </div>

            {/* Selected files table / list */}
            {documents.length > 0 && (
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-bold text-muted text-uppercase">
                            Documents sélectionnés ({documents.length}/{MAX_DOCUMENTS})
                        </span>
                        <span className="small text-muted">
                            Total : {formatBytes(documents.reduce((acc, d) => acc + d.size, 0))}
                        </span>
                    </div>

                    <div className="af-stack gap-2">
                        {documents.map((doc, idx) => (
                            <div
                                key={doc.id || idx}
                                className="d-flex flex-column flex-md-row align-items-md-center justify-content-between p-3 rounded-2 border bg-white gap-2"
                                style={{ borderColor: "var(--af-border, #e2e9e3)" }}
                            >
                                <div className="d-flex align-items-center gap-3 min-w-0">
                                    <div
                                        className="rounded px-2 py-1 small fw-bold"
                                        style={{
                                            backgroundColor: doc.name.endsWith(".pdf")
                                                ? "#ffebee"
                                                : "#e8f5e9",
                                            color: doc.name.endsWith(".pdf") ? "#c62828" : "#2e7d32",
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {doc.name.split(".").pop().toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div
                                            className="fw-semibold text-truncate"
                                            style={{ color: "var(--af-ink-950, #1d2924)", fontSize: "0.9rem" }}
                                            title={doc.name}
                                        >
                                            {doc.name}
                                        </div>
                                        <div className="small text-muted">{formatBytes(doc.size)}</div>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <select
                                        className="af-select"
                                        style={{ fontSize: "0.8rem", maxWidth: "260px" }}
                                        value={doc.type}
                                        onChange={(e) => updateDocType(doc.id, e.target.value)}
                                        disabled={disabled}
                                        aria-label="Type de document"
                                    >
                                        {DOCUMENT_TYPES.map((dt) => (
                                            <option key={dt.value} value={dt.value}>
                                                {dt.label}
                                            </option>
                                        ))}
                                    </select>

                                    {!disabled && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeDocument(doc.id)}
                                            title="Retirer ce document"
                                            style={{ color: "var(--af-danger, #b64242)" }}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
