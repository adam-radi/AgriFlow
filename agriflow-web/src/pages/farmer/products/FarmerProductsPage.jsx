import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import {
  fetchFarmerProducts,
  deleteProduct,
  clearProductSuccess,
  clearProductError,
} from "../../../features/products/productSlice";
import { fetchActiveVerification } from "../../../features/verification/verificationSlice";
import { useVerificationAccess } from "../../../features/verification/useVerificationAccess";
import VerificationBanner from "../../../components/verification/VerificationBanner";
import {
  selectFarmerProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsSuccess,
} from "../../../features/products/productSelectors";
import { Badge, EmptyState, LoadingState, Button } from "../../../components/common";

const DEFAULT_PRODUCT_IMG =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80";

/**
 * FarmerProductsPage — Gestion du catalogue des produits de l'agriculteur (Phase 09)
 * Conçu selon le Design System AgriFlow :
 * - Liste des produits appartenant exclusivement à l'agriculteur connecté.
 * - Statistiques réelles de stock et de conditionnements.
 * - Recherche et filtrage en temps réel.
 * - Cartes produits riches avec détails des formats de vente et prix producteurs.
 * - Modal de confirmation avant suppression.
 * - Intégration du gardien de vérification Phase 07.
 */
export default function FarmerProductsPage() {
  const dispatch = useDispatch();

  const products = useSelector(selectFarmerProducts) || [];
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const success = useSelector(selectProductsSuccess);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { status, canPublish, openModal, VerificationModal, isApproved } =
    useVerificationAccess({ accountType: "farmer" });

  useEffect(() => {
    dispatch(fetchFarmerProducts());
    dispatch(fetchActiveVerification());
  }, [dispatch]);

  // Auto-dismiss success toast
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearProductSuccess());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const confirmDelete = (product) => {
    setProductToDelete(product);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    await dispatch(deleteProduct(productToDelete.id));
    setIsDeleting(false);
    setProductToDelete(null);
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.quantities?.some((q) =>
        q.label?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const isAvailable = p.is_available !== false && p.is_active !== false;
    const matchesFilter =
      filterAvailability === "all" ||
      (filterAvailability === "available" && isAvailable) ||
      (filterAvailability === "unavailable" && !isAvailable);

    return matchesSearch && matchesFilter;
  });

  const availableCount = products.filter(
    (p) => p.is_available !== false && p.is_active !== false
  ).length;

  const totalPackagingTiers = products.reduce(
    (acc, p) => acc + (p.quantities?.length || 1),
    0
  );

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Mes Produits Agricoles</h1>
            <Badge variant="primary" size="md">
              {products.length} lot{products.length > 1 ? "s" : ""}
            </Badge>
          </div>
          <p>
            Gérez votre catalogue de vente directe, vos formats de conditionnement et vos tarifs producteurs.
          </p>
        </div>

        {/* Action Button */}
        <div className="af-dashboard-actions">
          {canPublish ? (
            <Link
              to="/farmer/products/new"
              className="af-btn-primary-pill"
              id="add-product-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Ajouter un produit
            </Link>
          ) : (
            <button
              type="button"
              className="af-btn-primary-pill"
              id="add-product-btn"
              onClick={() => openModal("l'ajout et la publication de nouveaux produits")}
              title="Vérification requise pour publier"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Ajouter un produit
              <span style={{ fontSize: "0.85em", marginLeft: "4px" }}>🔒</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Verification Banner (Phase 07) ─────────────────────────── */}
      <VerificationBanner status={status} accountType="farmer" />

      {/* ── 3. Success / Error Feedback ───────────────────────────────── */}
      {success && (
        <div
          className="alert alert-success rounded-4 py-2 px-3 small d-flex align-items-center justify-content-between mb-0"
          style={{ backgroundColor: "#eaf3ec", borderColor: "#c8dfcf", color: "#194638" }}
        >
          <div className="d-flex align-items-center gap-2">
            <span>✅</span>
            <strong>{success}</strong>
          </div>
          <button
            type="button"
            className="btn-close btn-sm"
            onClick={() => dispatch(clearProductSuccess())}
            aria-label="Fermer"
          />
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger rounded-4 py-2 px-3 small d-flex align-items-center justify-content-between mb-0"
          style={{ backgroundColor: "#FFF0EF", borderColor: "#FED7AA", color: "#9A3412" }}
        >
          <div className="d-flex align-items-center gap-2">
            <span>⚠️</span>
            <span>{typeof error === "string" ? error : JSON.stringify(error)}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-sm"
            onClick={() => dispatch(clearProductError())}
            aria-label="Fermer"
          />
        </div>
      )}

      {/* ── 4. Stats Row ──────────────────────────────────────────────── */}
      <div className="af-stats-row">
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Produits</span>
          </div>
          <div className="af-stat-value">{products.length}</div>
          <div className="af-stat-pill">Catalogue exploitation</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Disponibles en Ligne</span>
          </div>
          <div className="af-stat-value">{availableCount}</div>
          <div className="af-stat-pill success">Prêts pour commande</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Offres de Conditionnement</span>
          </div>
          <div className="af-stat-value">{totalPackagingTiers}</div>
          <span className="af-stat-subtitle-text">Formats de vente actifs</span>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Statut Publication</span>
          </div>
          <div className="af-stat-value" style={{ fontSize: "19px", marginTop: "4px" }}>
            {isApproved ? "Certifiée ✓" : "Restreinte 🔒"}
          </div>
          <span className="af-stat-subtitle-text">
            {isApproved ? "Vente directe sans intermédiaire" : "Dossier légal en cours"}
          </span>
        </div>
      </div>

      {/* ── 5. Search & Filters Bar ───────────────────────────────────── */}
      <div className="af-panel-card p-3">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="af-buyer-search-input-wrap" style={{ maxWidth: 400 }}>
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
              placeholder="Rechercher par nom, variété, conditionnement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="af-category-chips-row">
            {[
              { id: "all", label: "Tous les produits" },
              { id: "available", label: "✓ En stock & actifs" },
              { id: "unavailable", label: "✗ Épuisés / Masqués" },
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

      {/* ── 6. Main Products Grid ─────────────────────────────────────── */}
      {loading && products.length === 0 ? (
        <LoadingState message="Chargement de vos produits en cours..." />
      ) : filteredProducts.length > 0 ? (
        <div className="row g-4">
          {filteredProducts.map((product) => {
            const isAvailable = product.is_available !== false && product.is_active !== false;
            const startingPrice = product.base_price || product.price || 0;
            const quantities = product.quantities || product.product_quantities || [];

            return (
              <div key={product.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="af-panel-card h-100 d-flex flex-direction-column p-0 overflow-hidden"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.25s ease",
                  }}
                >
                  {/* Product Image Header */}
                  <div
                    style={{
                      height: "190px",
                      position: "relative",
                      backgroundColor: "#eaf3ec",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={product.image || product.image_url || DEFAULT_PRODUCT_IMG}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = DEFAULT_PRODUCT_IMG;
                      }}
                    />

                    {/* Status Badge Overlay */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                      }}
                    >
                      <Badge variant={isAvailable ? "success" : "neutral"} size="sm">
                        {isAvailable ? "En stock ✓" : "Épuisé"}
                      </Badge>
                    </div>

                    {/* Price Tag Overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        backgroundColor: "rgba(21, 55, 47, 0.92)",
                        color: "#ffffff",
                        padding: "5px 12px",
                        borderRadius: "999px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Dès {Number(startingPrice).toFixed(2)} DH
                    </div>
                  </div>

                  {/* Product Details Body */}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="mb-2">
                      <h3
                        className="fw-bold mb-1 text-dark"
                        style={{ fontSize: "1.1rem", lineHeight: 1.3 }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-muted small mb-0"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {product.description || "Aucune description fournie."}
                      </p>
                    </div>

                    {/* Packaging Tiers Chips */}
                    <div className="mt-auto pt-3">
                      <span className="text-muted small fw-semibold d-block mb-2">
                        Formats de vente :
                      </span>
                      <div className="d-flex flex-wrap gap-2">
                        {quantities.length > 0 ? (
                          quantities.map((q, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-pill small"
                              style={{
                                backgroundColor: "#f2f6f3",
                                color: "var(--af-primary-forest)",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                border: "1px solid #e0eae3",
                              }}
                            >
                              {q.label} : <strong>{q.price} DH</strong>
                            </span>
                          ))
                        ) : (
                          <span className="text-muted small fst-italic">
                            Prix au kg standard
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div
                      className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top"
                      style={{ borderColor: "#edf2ee" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        {canPublish ? (
                          <Link
                            to={`/farmer/products/${product.id}/edit`}
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                            style={{ fontSize: "0.82rem", fontWeight: 600 }}
                          >
                            Modifier
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                            style={{ fontSize: "0.82rem", fontWeight: 600 }}
                            onClick={() => openModal("la modification de produits")}
                          >
                            Modifier 🔒
                          </button>
                        )}

                        <Link
                          to={`/products/${product.id}`}
                          className="btn btn-sm btn-outline-success rounded-pill px-2 py-1"
                          style={{ fontSize: "0.82rem" }}
                          title="Aperçu public sur le catalogue"
                        >
                          👁️ Aperçu
                        </Link>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                        style={{ fontSize: "0.82rem" }}
                        onClick={() => confirmDelete(product)}
                        title="Supprimer ce produit"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="Votre catalogue est vide"
          description="Vous n'avez pas encore publié de produits agricoles. Ajoutez votre première récolte pour recevoir des commandes directes d'acheteurs professionnels."
          action={
            canPublish ? (
              <Link to="/farmer/products/new" className="af-btn-primary-pill">
                Ajouter mon premier produit
              </Link>
            ) : (
              <button
                type="button"
                className="af-btn-primary-pill"
                onClick={() => openModal("la publication de votre premier produit")}
              >
                Ajouter mon premier produit 🔒
              </button>
            )
          }
        />
      ) : (
        <EmptyState
          icon="🔍"
          title="Aucun produit ne correspond à votre recherche"
          description="Essayez de modifier vos critères de recherche ou réinitialisez les filtres."
          action={
            <button
              type="button"
              className="af-btn-secondary-pill"
              onClick={() => {
                setSearchTerm("");
                setFilterAvailability("all");
              }}
            >
              Réinitialiser les filtres
            </button>
          }
        />
      )}

      {/* ── 7. Modal Confirmation de Suppression ──────────────────────── */}
      <Modal
        show={!!productToDelete}
        onHide={() => !isDeleting && setProductToDelete(null)}
        centered
      >
        <Modal.Header closeButton style={{ borderBottom: "1px solid #edf2ee" }}>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700, color: "#991B1B" }}>
            Confirmer la suppression
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="mb-2">
            Êtes-vous sûr de vouloir retirer définitivement ce produit de votre catalogue ?
          </p>
          <div
            className="p-3 rounded-3 my-2"
            style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}
          >
            <strong>{productToDelete?.name}</strong>
            <div className="small text-muted mt-1">
              Réf : #{productToDelete?.id}
            </div>
          </div>
          <small className="text-muted">
            Cette action est irréversible et supprimera également les formats de conditionnement associés.
          </small>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #edf2ee" }}>
          <button
            type="button"
            className="af-btn-secondary-pill"
            onClick={() => setProductToDelete(null)}
            disabled={isDeleting}
          >
            Annuler
          </button>
          <Button
            type="button"
            variant="danger"
            pill
            isLoading={isDeleting}
            disabled={isDeleting}
            onClick={executeDelete}
          >
            {isDeleting ? "Suppression en cours..." : "Oui, supprimer définitivement"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── 8. Verification Required Modal (Phase 07) ─────────────────── */}
      {VerificationModal}
    </div>
  );
}
