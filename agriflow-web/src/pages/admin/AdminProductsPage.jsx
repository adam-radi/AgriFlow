import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Alert } from "react-bootstrap";
import {
  fetchProducts,
  disableProduct,
  enableProduct,
  updateProduct,
  deleteProduct,
} from "../../app/store/slices/admin/adminSlice";
import {
  selectAdminProducts,
  selectAdminLoading,
  selectAdminError,
} from "../../app/store/slices/admin/adminSelectors";
import { Badge, EmptyState, LoadingState, Button } from "../../components/common";

/**
 * AdminProductsPage — Modération et gestion du catalogue agricole (Lot 11)
 */
export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const rawProducts = useSelector(selectAdminProducts);
  const products = useMemo(() => rawProducts || [], [rawProducts]);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [inspectProduct, setInspectProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const [form, setForm] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenEdit = (p) => {
    setInspectProduct(null);
    setEditProduct(p);
    setForm({ name: p.name || "", description: p.description || "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!editProduct) return;
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    if (imageFile) fd.append("image", imageFile);

    const res = await dispatch(updateProduct({ id: editProduct.id, data: fd }));
    setSaving(false);
    if (res.meta?.requestStatus === "fulfilled") {
      setFeedbackMsg({ type: "success", text: `Le produit #${editProduct.id} a été mis à jour avec succès.` });
      setEditProduct(null);
      dispatch(fetchProducts());
    } else {
      setFeedbackMsg({ type: "danger", text: "Impossible de mettre à jour le produit." });
    }
  };

  const handleToggle = async (e, p) => {
    e.stopPropagation();
    const isCurrentlyActive = p.is_available !== false && p.is_active !== false;
    let res;
    if (isCurrentlyActive) {
      res = await dispatch(disableProduct(p.id));
      if (res.meta?.requestStatus === "fulfilled") {
        setFeedbackMsg({ type: "info", text: `Le produit "${p.name}" a été désactivé du catalogue public.` });
      }
    } else {
      res = await dispatch(enableProduct(p.id));
      if (res.meta?.requestStatus === "fulfilled") {
        setFeedbackMsg({ type: "success", text: `Le produit "${p.name}" est à nouveau disponible en vente.` });
      }
    }
    dispatch(fetchProducts());
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const res = await dispatch(deleteProduct(productToDelete.id));
    if (res.meta?.requestStatus === "fulfilled") {
      setFeedbackMsg({ type: "success", text: `Le produit #${productToDelete.id} a été retiré définitivement du catalogue.` });
      dispatch(fetchProducts());
    } else {
      setFeedbackMsg({ type: "danger", text: "Échec de la suppression du produit." });
    }
    setProductToDelete(null);
  };

  const activeProductsCount = products.filter(
    (p) => p.is_available !== false && p.is_active !== false
  ).length;
  const disabledProductsCount = products.filter(
    (p) => p.is_available === false || p.is_active === false
  ).length;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm.trim() ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase?.().includes(searchTerm.toLowerCase()) ||
        p.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const isAvailable = p.is_available !== false && p.is_active !== false;
      const matchesAvail =
        filterAvailability === "all" ||
        (filterAvailability === "active" && isAvailable) ||
        (filterAvailability === "inactive" && !isAvailable);

      return matchesSearch && matchesAvail;
    });
  }, [products, searchTerm, filterAvailability]);

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Catalogue & Produits Agricoles</h1>
            <Badge variant="primary" size="md">
              {products.length} références
            </Badge>
          </div>
          <p>
            Modération du catalogue : vérification de la disponibilité, contrôle des prix producteurs et conformité des fiches.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {feedbackMsg && (
        <Alert
          variant={feedbackMsg.type}
          dismissible
          onClose={() => setFeedbackMsg(null)}
          className="rounded-3 shadow-sm mb-4"
        >
          {feedbackMsg.text}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="rounded-3 shadow-sm mb-4">
          {typeof error === "string" ? error : "Erreur de chargement des produits."}
        </Alert>
      )}

      {/* ── 2. Top Stats Overview ─────────────────────────────────────── */}
      <div className="af-stats-row">
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Produits</span>
            <span className="fs-5">📦</span>
          </div>
          <div className="af-stat-value">{products.length}</div>
          <div className="af-stat-pill">Fiches enregistrées</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Actifs en Vente</span>
            <span className="fs-5">✅</span>
          </div>
          <div className="af-stat-value" style={{ color: "var(--af-success, #247a50)" }}>
            {activeProductsCount}
          </div>
          <div className="af-stat-pill success">Visibles au catalogue</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Désactivés / Hors Ligne</span>
            <span className="fs-5">⏸️</span>
          </div>
          <div className="af-stat-value">
            {disabledProductsCount}
          </div>
          <span className="af-stat-subtitle-text">Modération ou rupture</span>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Traçabilité</span>
            <span className="fs-5">🌱</span>
          </div>
          <div className="af-stat-value" style={{ fontSize: "20px", marginTop: "4px" }}>
            100% Terroir
          </div>
          <span className="af-stat-subtitle-text">Direct producteur certifié</span>
        </div>
      </div>

      {/* ── 3. Filters & Search Bar ───────────────────────────────────── */}
      <div className="af-panel-card p-3 mb-4">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="af-buyer-search-input-wrap" style={{ maxWidth: 380 }}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="af-search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="af-buyer-search-input"
              placeholder="Rechercher par produit, catégorie, exploitant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="af-category-chips-row">
            {[
              { id: "all", label: `Tous (${products.length})` },
              { id: "active", label: `✓ En vente (${activeProductsCount})` },
              { id: "inactive", label: `✗ Désactivés (${disabledProductsCount})` },
            ].map((chip) => {
              const isActive = filterAvailability === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  className={`af-category-chip ${isActive ? "active" : ""}`}
                  style={{
                    backgroundColor: isActive ? "var(--af-primary-forest, #15372F)" : "#ffffff",
                    color: isActive ? "#ffffff" : "var(--af-ink-900, #1D2924)",
                    border: isActive
                      ? "1px solid var(--af-primary-forest, #15372F)"
                      : "1px solid var(--af-border, #E2E9E3)",
                  }}
                  onClick={() => setFilterAvailability(chip.id)}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. Main Products Table ────────────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Fiches Produits Agricoles</h2>
            <span className="af-stat-subtitle-text">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} affiché{filteredProducts.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <LoadingState message="Chargement des produits..." />
        ) : filteredProducts.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle af-dashboard-table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produit & Catégorie</th>
                  <th>Exploitant</th>
                  <th>Région</th>
                  <th>Prix de base</th>
                  <th>Disponibilité</th>
                  <th className="text-end">Modération</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isActive = p.is_active !== false && p.is_available !== false;
                  const displayImage = p.image || p.image_url;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setInspectProduct(p)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="fw-bold text-muted">#{p.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="af-list-item-avatar d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: "#f4f7f5",
                              border: "1px solid #e1e9e3",
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              overflow: "hidden",
                            }}
                          >
                            {displayImage ? (
                              <img
                                src={displayImage}
                                alt={p.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <span style={{ fontSize: "1.2rem" }}>🌾</span>
                            )}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{p.name}</div>
                            <small className="text-muted">
                              {p.category?.name || p.category || "Produit agricole"}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">{p.farmer?.name || p.user?.name || "Exploitant"}</div>
                      </td>
                      <td>
                        <small className="text-muted">📍 {p.farmer?.zone || p.zone || "Maroc"}</small>
                      </td>
                      <td>
                        <strong style={{ color: "var(--af-primary-forest, #15372F)" }}>
                          {p.base_price ? `${Number(p.base_price).toFixed(2)} DH` : p.price ? `${Number(p.price).toFixed(2)} DH` : "Sur devis"}
                        </strong>
                      </td>
                      <td>
                        <Badge variant={isActive ? "success" : "neutral"} size="sm">
                          {isActive ? "En vente ✓" : "Désactivé"}
                        </Badge>
                      </td>
                      <td className="text-end" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              isActive ? "btn-outline-warning" : "btn-outline-success"
                            } rounded-pill px-3 py-1`}
                            style={{ fontSize: "0.78rem" }}
                            onClick={(e) => handleToggle(e, p)}
                          >
                            {isActive ? "Désactiver" : "Activer"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                            style={{ fontSize: "0.78rem" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(p);
                            }}
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                            style={{ fontSize: "0.78rem" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductToDelete(p);
                            }}
                            title="Supprimer du catalogue"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🌿"
            title="Aucun produit trouvé"
            description="Aucun produit ne correspond à vos filtres actuels."
          />
        )}
      </div>

      {/* ── 5. Modal Inspection Produit ────────────────────────────────── */}
      <Modal show={!!inspectProduct} onHide={() => setInspectProduct(null)} centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #edf2ee" }}>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--af-primary-forest)" }}>
            Fiche Produit #{inspectProduct?.id} — {inspectProduct?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {inspectProduct && (
            <div className="d-flex flex-column gap-3 small">
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: "#f4f7f5",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {inspectProduct.image || inspectProduct.image_url ? (
                    <img
                      src={inspectProduct.image || inspectProduct.image_url}
                      alt={inspectProduct.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "1.8rem" }}>🌾</span>
                  )}
                </div>
                <div>
                  <h3 className="h6 fw-bold mb-1" style={{ color: "var(--af-green-950, #15372F)" }}>
                    {inspectProduct.name}
                  </h3>
                  <Badge variant={inspectProduct.is_available !== false ? "success" : "neutral"} size="sm">
                    {inspectProduct.is_available !== false ? "Disponible au catalogue" : "Désactivé"}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-muted d-block">Description :</span>
                <p className="mb-0 text-dark">
                  {inspectProduct.description || "Aucune description renseignée par le producteur."}
                </p>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted d-block">Exploitant propriétaire :</span>
                  <strong>{inspectProduct.farmer?.name || inspectProduct.user?.name || "Producteur"}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Zone de récolte :</span>
                  <span>📍 {inspectProduct.farmer?.zone || inspectProduct.zone || "Maroc"}</span>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted d-block">Prix unitaire indicatif :</span>
                  <strong style={{ color: "var(--af-primary-forest)" }}>
                    {inspectProduct.base_price ? `${Number(inspectProduct.base_price).toFixed(2)} DH` : "Sur devis"}
                  </strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Conditionnements :</span>
                  <span>{inspectProduct.quantities?.length || 0} format(s)</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #edf2ee" }}>
          <Button
            variant="outline"
            pill
            onClick={() => {
              const p = inspectProduct;
              handleOpenEdit(p);
            }}
          >
            ✏️ Modifier la fiche
          </Button>
          <Button variant="secondary" pill onClick={() => setInspectProduct(null)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── 6. Modal Modification Produit ──────────────────────────────── */}
      <Modal show={!!editProduct} onHide={() => setEditProduct(null)} centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #edf2ee" }}>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--af-primary-forest)" }}>
            Modifier le Produit #{editProduct?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Nom du produit *</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nom du produit"
                className="rounded-3"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description du produit et spécificités agronomiques"
                className="rounded-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Image produit</Form.Label>
              <Form.Control
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="rounded-3"
              />
              {imagePreview && (
                <div className="mt-2 text-center">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    style={{ maxHeight: 120, borderRadius: 8 }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #edf2ee" }}>
          <Button variant="outline" pill onClick={() => setEditProduct(null)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            pill
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── 7. Modal Confirmation Suppression ─────────────────────────── */}
      <Modal show={!!productToDelete} onHide={() => setProductToDelete(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold text-danger">
            Supprimer le produit du catalogue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Êtes-vous certain de vouloir supprimer définitivement{" "}
            <strong>{productToDelete?.name}</strong> (#{productToDelete?.id}) ?
            Cette action est irréversible et supprimera la fiche du catalogue public.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" pill onClick={() => setProductToDelete(null)}>
            Annuler
          </Button>
          <Button variant="danger" pill onClick={handleConfirmDelete}>
            Confirmer la suppression
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
