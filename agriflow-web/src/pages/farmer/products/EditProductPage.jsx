import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchProductById,
  updateProduct,
  clearProductError,
  clearSelectedProduct,
} from "../../../features/products/productSlice";
import {
  selectSelectedProduct,
  selectProductsLoading,
  selectProductsError,
} from "../../../features/products/productSelectors";
import { FarmerProductForm } from "../../../components/products";
import { Badge, LoadingState, ErrorState } from "../../../components/common";

/**
 * EditProductPage — Modification d'un produit existant (Phase 09)
 * Réutilise FarmerProductForm avec pré-remplissage des données et gestion des images.
 */
export default function EditProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductsLoading);
  const serverError = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(clearProductError());
    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleSubmit = async (formData) => {
    const result = await dispatch(updateProduct({ id, formData }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/farmer/products");
    }
  };

  return (
    <div className="af-dashboard-container">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="af-dashboard-header-row mb-2">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Modifier le Produit #{id}</h1>
            {product && (
              <Badge variant="primary" size="md">
                {product.name}
              </Badge>
            )}
          </div>
          <p>
            Mettez à jour les caractéristiques, les prix ou les conditionnements de votre lot agricole.
          </p>
        </div>
      </div>

      {/* ── Content States ─────────────────────────────────────────── */}
      {loading && !product ? (
        <LoadingState message="Chargement des informations du produit..." />
      ) : !product && serverError ? (
        <ErrorState
          title="Produit introuvable"
          message="Impossible de charger les données de ce produit ou vous n'avez pas l'autorisation de le modifier."
          action={
            <Link to="/farmer/products" className="af-btn-primary-pill">
              Retour à mes produits
            </Link>
          }
        />
      ) : (
        <FarmerProductForm
          key={product.id}
          initialData={product}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          mode="edit"
          serverError={serverError}
          backUrl="/farmer/products"
        />
      )}
    </div>
  );
}
