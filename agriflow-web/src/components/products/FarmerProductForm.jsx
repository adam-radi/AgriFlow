import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";
import { Button, Badge } from "../common";

/**
 * FarmerProductForm — Formulaire standardisé de création et modification de produit agricole
 * Conçu selon le Design System AgriFlow (Phase 02 / 09) :
 * - Section 1 : Informations Générales de la Récolte / Produit
 * - Section 2 : Conditionnements & Tarification B2B (Quantités & Prix)
 * - Section 3 : Visuel & Photographie
 * - Validation en temps réel, retour d'erreur précis et gestion des états de chargement.
 */
export default function FarmerProductForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  mode = "create", // "create" | "edit"
  serverError = null,
  backUrl = "/farmer/products",
}) {
  const [form, setForm] = useState(() => ({
    name: initialData?.name || "",
    description: initialData?.description || "",
  }));

  const [quantities, setQuantities] = useState(() => {
    if (initialData?.quantities && initialData.quantities.length > 0) {
      return initialData.quantities.map((q) => ({
        label: q.label || "",
        price: q.price !== undefined ? String(q.price) : "",
      }));
    } else if (initialData?.base_price || initialData?.price) {
      return [
        {
          label: "Kg",
          price: String(initialData.base_price || initialData.price || ""),
        },
      ];
    }
    return [{ label: "Caisse de 10 kg", price: "" }];
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(() => initialData?.image || null);
  const [fieldErrors, setFieldErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleQtyChange = (index, field, value) => {
    setQuantities((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    if (fieldErrors[`qty_${index}_${field}`] || fieldErrors.quantities) {
      setFieldErrors((prev) => ({
        ...prev,
        [`qty_${index}_${field}`]: "",
        quantities: "",
      }));
    }
  };

  const addQtyRow = () => {
    setQuantities((prev) => [...prev, { label: "", price: "" }]);
  };

  const removeQtyRow = (index) => {
    if (quantities.length <= 1) return;
    setQuantities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({
        ...prev,
        image: "Le fichier doit être une image valide (JPG, PNG, WebP).",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        image: "La taille de l'image ne doit pas dépasser 2 Mo.",
      }));
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFieldErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Le nom du produit est obligatoire.";
    }

    if (!form.description.trim()) {
      errors.description = "La description du produit est obligatoire.";
    }

    if (!quantities || quantities.length === 0) {
      errors.quantities = "Au moins un format de vente est requis.";
    } else {
      quantities.forEach((q, idx) => {
        if (!q.label.trim()) {
          errors[`qty_${idx}_label`] = "Indiquez le conditionnement (ex: Caisse 10kg).";
        }
        const numericPrice = parseFloat(q.price);
        if (!q.price || isNaN(numericPrice) || numericPrice <= 0) {
          errors[`qty_${idx}_price`] = "Prix invalide (doit être > 0 DH).";
        }
      });
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());

    quantities.forEach((qty, i) => {
      if (qty.label.trim() && qty.price) {
        formData.append(`quantities[${i}][label]`, qty.label.trim());
        formData.append(`quantities[${i}][price]`, parseFloat(qty.price));
      }
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="af-product-form" noValidate>
      {/* Server error alert */}
      {serverError && (
        <Alert
          variant="danger"
          className="rounded-4 mb-4 d-flex align-items-center gap-2"
          style={{ backgroundColor: "#FFF0EF", borderColor: "#FED7AA", color: "#9A3412" }}
        >
          <span style={{ fontSize: "1.2rem" }}>⚠️</span>
          <div>
            <strong>Une erreur est survenue :</strong>
            <div>{typeof serverError === "string" ? serverError : JSON.stringify(serverError)}</div>
          </div>
        </Alert>
      )}

      {/* ── SECTION 1 : Informations Générales ──────────────────────── */}
      <div className="af-panel-card mb-4">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">1. Informations Générales</h2>
            <span className="af-stat-subtitle-text">
              Dénomination, description et caractéristiques de votre production agricole
            </span>
          </div>
          <Badge variant="neutral" size="sm">
            Obligatoire
          </Badge>
        </div>

        <Row className="g-3 mt-1">
          <Col xs={12}>
            <label className="form-label fw-bold small text-dark" htmlFor="product-name">
              Nom du produit agricole <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="product-name"
              name="name"
              className={`form-control rounded-3 py-2 px-3 ${fieldErrors.name ? "is-invalid" : ""}`}
              placeholder="Ex : Tomates Cerises Bio de Chtouka, Olives Picholine Beldi, Oranges Valencia..."
              value={form.name}
              onChange={handleTextChange}
              disabled={isSubmitting}
            />
            {fieldErrors.name && (
              <div className="invalid-feedback d-block small mt-1">{fieldErrors.name}</div>
            )}
            <small className="text-muted">
              Un nom précis et valorisant aide les acheteurs professionnels à identifier immédiatement votre lot.
            </small>
          </Col>

          <Col xs={12}>
            <label className="form-label fw-bold small text-dark" htmlFor="product-description">
              Description détaillée <span className="text-danger">*</span>
            </label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              className={`form-control rounded-3 py-2 px-3 ${fieldErrors.description ? "is-invalid" : ""}`}
              placeholder="Décrivez votre produit : méthode de culture (bio, raisonnée), calibre, fraîcheur, terroir d'origine, conseils de conservation..."
              value={form.description}
              onChange={handleTextChange}
              disabled={isSubmitting}
            />
            {fieldErrors.description && (
              <div className="invalid-feedback d-block small mt-1">{fieldErrors.description}</div>
            )}
          </Col>
        </Row>
      </div>

      {/* ── SECTION 2 : Conditionnements & Tarifs B2B ────────────────── */}
      <div className="af-panel-card mb-4">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">2. Conditionnements & Tarification B2B</h2>
            <span className="af-stat-subtitle-text">
              Définissez vos unités de vente pour les grossistes, épiceries et commerçants
            </span>
          </div>
          <button
            type="button"
            className="af-pill-link-btn primary"
            onClick={addQtyRow}
            disabled={isSubmitting}
          >
            + Ajouter un conditionnement
          </button>
        </div>

        <p className="small text-muted mb-3">
          Vous pouvez proposer plusieurs formats (ex: Caisse de 10 kg, Plateau de 5 kg, Tonne en vrac). Le prix le plus bas sera affiché comme prix d&apos;appel sur le catalogue.
        </p>

        {fieldErrors.quantities && (
          <Alert variant="danger" className="py-2 small rounded-3">
            {fieldErrors.quantities}
          </Alert>
        )}

        <div className="af-quantities-list">
          {quantities.map((qty, idx) => (
            <div
              key={idx}
              className="p-3 rounded-4 mb-3"
              style={{
                backgroundColor: "#f9faf9",
                border: "1px solid #edf1ee",
              }}
            >
              <Row className="g-3 align-items-center">
                <Col xs={12} md={6}>
                  <label className="form-label small fw-semibold text-muted mb-1">
                    Format / Conditionnement #{idx + 1}
                  </label>
                  <input
                    type="text"
                    className={`form-control rounded-3 ${fieldErrors[`qty_${idx}_label`] ? "is-invalid" : ""}`}
                    placeholder="Ex: Caisse 10 kg, Plateau 5 kg, Kg..."
                    value={qty.label}
                    onChange={(e) => handleQtyChange(idx, "label", e.target.value)}
                    disabled={isSubmitting}
                  />
                  {fieldErrors[`qty_${idx}_label`] && (
                    <div className="invalid-feedback d-block small">
                      {fieldErrors[`qty_${idx}_label`]}
                    </div>
                  )}
                </Col>

                <Col xs={10} md={5}>
                  <label className="form-label small fw-semibold text-muted mb-1">
                    Prix producteur (MAD)
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className={`form-control rounded-start-3 ${fieldErrors[`qty_${idx}_price`] ? "is-invalid" : ""}`}
                      placeholder="Ex: 85.00"
                      value={qty.price}
                      onChange={(e) => handleQtyChange(idx, "price", e.target.value)}
                      disabled={isSubmitting}
                    />
                    <span
                      className="input-group-text rounded-end-3 bg-white text-muted fw-bold"
                      style={{ borderColor: "#dee2e6" }}
                    >
                      DH
                    </span>
                  </div>
                  {fieldErrors[`qty_${idx}_price`] && (
                    <div className="invalid-feedback d-block small">
                      {fieldErrors[`qty_${idx}_price`]}
                    </div>
                  )}
                </Col>

                <Col xs={2} md={1} className="text-end pt-md-3">
                  {quantities.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ width: "34px", height: "34px" }}
                      onClick={() => removeQtyRow(idx)}
                      disabled={isSubmitting}
                      title="Supprimer ce conditionnement"
                    >
                      ✕
                    </button>
                  )}
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3 : Photographie du Produit ──────────────────────── */}
      <div className="af-panel-card mb-4">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">3. Photographie & Visuel</h2>
            <span className="af-stat-subtitle-text">
              Une photo nette de votre récolte augmente les commandes de plus de 70%
            </span>
          </div>
          <Badge variant="neutral" size="sm">
            Optionnel
          </Badge>
        </div>

        <div className="mt-2">
          {previewUrl ? (
            <div className="d-flex align-items-center gap-4 flex-wrap p-3 rounded-4" style={{ backgroundColor: "#f9faf9", border: "1px solid #edf1ee" }}>
              <div
                style={{
                  width: "160px",
                  height: "120px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  border: "2px solid #ffffff",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Aperçu produit"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div>
                <div className="fw-bold text-dark mb-1">
                  {imageFile ? imageFile.name : "Image actuelle du produit"}
                </div>
                <small className="text-muted d-block mb-3">
                  {imageFile
                    ? `${(imageFile.size / 1024).toFixed(0)} Ko · Nouvelle photo sélectionnée`
                    : "Cette image est actuellement visible sur le catalogue."}
                </small>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    Changer de photo
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="p-4 text-center rounded-4 cursor-pointer"
              style={{
                backgroundColor: "#f9faf9",
                border: "2px dashed #cbd7ce",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: "2.4rem" }}>📸</div>
              <div className="fw-bold text-dark mt-2">Cliquez pour importer une image</div>
              <p className="text-muted small mb-0 mt-1">
                Formats acceptés : JPG, PNG, WebP (taille maximale : 2 Mo)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            style={{ display: "none" }}
            onChange={handleImageChange}
            disabled={isSubmitting}
          />

          {fieldErrors.image && (
            <div className="text-danger small mt-2">{fieldErrors.image}</div>
          )}
        </div>
      </div>

      {/* ── Sticky Action Footer ──────────────────────────────────────── */}
      <div
        className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-white"
        style={{
          border: "1px solid var(--af-layout-border, #e6ece8)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
        }}
      >
        <Link to={backUrl} className="af-btn-secondary-pill">
          ← Retour aux produits
        </Link>

        <Button
          type="submit"
          variant="primary"
          pill
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === "edit"
              ? "Enregistrement en cours..."
              : "Création en cours..."
            : mode === "edit"
            ? "Mettre à jour le produit ✓"
            : "Publier le produit sur le catalogue →"}
        </Button>
      </div>
    </form>
  );
}
