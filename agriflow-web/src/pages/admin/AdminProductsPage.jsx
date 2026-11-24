import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form } from "react-bootstrap";
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
} from "../../app/store/slices/admin/adminSelectors";
import { Badge, EmptyState, LoadingState } from "../../components/common";

/**
 * AdminProductsPage — Modération et gestion du catalogue (Design System AgriFlow)
 */
export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts) || [];
  const loading = useSelector(selectAdminLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleRowClick = (p) => {
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

  const handleSave = () => {
    if (!editProduct) return;
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    if (imageFile) fd.append("image", imageFile);

    dispatch(updateProduct({ id: editProduct.id, data: fd })).then(() => {
      setSaving(false);
      setEditProduct(null);
      dispatch(fetchProducts());
    });
  };

  const handleToggle = (e, p) => {
    e.stopPropagation();
    if (p.is_active || p.is_available) {
      dispatch(disableProduct(p.id));
    } else {
      dispatch(enableProduct(p.id));
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Voulez-vous vraiment supprimer ce produit du catalogue ?")) {
      dispatch(deleteProduct(id));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const isAvailable = p.is_available !== false && p.is_active !== false;
    const matchesAvail =
      filterAvailability === "all" ||
      (filterAvailability === "active" && isAvailable) ||
      (filterAvailability === "inactive" && !isAvailable);

    return matchesSearch && matchesAvail;
  });

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
            Modération du catalogue public : vérification des prix producteurs, qualité des fiches et disponibilité.
          </p>
        </div>
      </div>

      {/* ── 2. Top Stats Overview ─────────────────────────────────────── */}
      <div className="af-stats-row">
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Produits</span>
          </div>
          <div className="af-stat-value">{products.length}</div>
          <div className="af-stat-pill">En base de données</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Actifs en Ligne</span>
          </div>
          <div className="af-stat-value">
            {products.filter((p) => p.is_available !== false && p.is_active !== false).length}
          </div>
          <div className="af-stat-pill success">Visibles aux acheteurs</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Suspendus / Épuisés</span>
          </div>
          <div className="af-stat-value">
            {products.filter((p) => p.is_available === false || p.is_active === false).length}
          </div>
          <span className="af-stat-subtitle-text">Désactivés ou hors stock</span>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Prix Moyen / Unité</span>
          </div>
          <div className="af-stat-value" style={{ fontSize: "20px" }}>
            Direct Producteur
          </div>
          <span className="af-stat-subtitle-text">Circuit court sans marge intermédiaire</span>
        </div>
      </div>

      {/* ── 3. Filters & Search Bar ───────────────────────────────────── */}
      <div className="af-panel-card p-3">
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
              placeholder="Rechercher par nom de produit, catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="af-category-chips-row">
            {[
              { id: "all", label: "Tous les produits" },
              { id: "active", label: "✓ En stock & actifs" },
              { id: "inactive", label: "✗ Épuisés / Inactifs" },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`af-category-chip ${
                  filterAvailability === chip.id ? "active" : ""
                }`}
                style={{
                  backgroundColor:
                    filterAvailability === chip.id ? "#15372F" : "#ffffff",
                  color: filterAvailability === chip.id ? "#ffffff" : "#3b4e43",
                  border:
                    filterAvailability === chip.id
                      ? "1px solid #15372F"
                      : "1px solid #dce5df",
                }}
                onClick={() => setFilterAvailability(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Main Products Table ────────────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Fiches Produits</h2>
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
                  <th>Produit</th>
                  <th>Exploitant</th>
                  <th>Région</th>
                  <th>Prix Producteur</th>
                  <th>Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isActive = p.is_active !== false && p.is_available !== false;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleRowClick(p)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="fw-bold text-muted">#{p.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="af-list-item-avatar"
                            style={{
                              backgroundColor: "#f4f7f5",
                              border: "1px solid #e1e9e3",
                            }}
                          >
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                              />
                            ) : (
                              <span>🌿</span>
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
                        <div className="fw-medium">{p.farmer?.name || p.user?.name || "Agriculteur"}</div>
                      </td>
                      <td>
                        <small className="text-muted">{p.zone || p.region || "Maroc"}</small>
                      </td>
                      <td>
                        <strong style={{ color: "var(--af-primary-forest)" }}>
                          {p.price ? `${p.price} DH / ${p.unit || "kg"}` : "Sur devis"}
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
                            className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                            style={{ fontSize: "0.78rem" }}
                            onClick={(e) => handleDelete(e, p.id)}
                            title="Supprimer"
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

      {/* ── 5. Modal Modification Produit ──────────────────────────────── */}
      <Modal show={!!editProduct} onHide={() => setEditProduct(null)} centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #edf2ee" }}>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--af-primary-forest)" }}>
            Modifier le Produit #{editProduct?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Nom du produit</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nom du produit"
                className="rounded-3"
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
                placeholder="Description du produit et spécificités"
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
          <button
            type="button"
            className="af-btn-secondary-pill"
            onClick={() => setEditProduct(null)}
          >
            Annuler
          </button>
          <button
            type="button"
            className="af-btn-primary-pill"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
