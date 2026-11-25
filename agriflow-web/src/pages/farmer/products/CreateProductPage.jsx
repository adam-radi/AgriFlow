import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct, clearProductError } from "../../../features/products/productSlice";
import {
  selectProductsLoading,
  selectProductsError,
} from "../../../features/products/productSelectors";
import { FarmerProductForm } from "../../../components/products";
import { Badge } from "../../../components/common";

/**
 * CreateProductPage — Publication d'un nouveau produit agricole (Phase 09)
 * Réutilise FarmerProductForm pour une ergonomie optimale et un code DRY.
 */
export default function CreateProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectProductsLoading);
  const serverError = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(clearProductError());
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    const result = await dispatch(createProduct(formData));
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
            <h1>Publier un Nouveau Produit</h1>
            <Badge variant="success" size="md">
              Vente directe producteur
            </Badge>
          </div>
          <p>
            Renseignez les détails de votre récolte, vos unités de conditionnement et vos tarifs B2B.
          </p>
        </div>
      </div>

      {/* ── Reusable Form ──────────────────────────────────────────── */}
      <FarmerProductForm
        onSubmit={handleSubmit}
        isSubmitting={loading}
        mode="create"
        serverError={serverError}
        backUrl="/farmer/products"
      />
    </div>
  );
}
