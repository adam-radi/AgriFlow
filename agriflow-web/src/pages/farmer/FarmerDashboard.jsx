import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFarmerProducts } from "../../features/products/productSlice";
import { fetchFarmerHarvests } from "../../features/harvests/harvestSlice";
import { fetchFarmerOrders } from "../../features/orders/orderSlice";
import { fetchActiveVerification } from "../../features/verification/verificationSlice";
import { selectFarmerProducts, selectProductsLoading } from "../../features/products/productSelectors";
import { selectFarmerHarvests, selectHarvestLoading } from "../../features/harvests/harvestSelectors";
import { selectOrders, selectOrdersLoading } from "../../features/orders/orderSelectors";
import { selectUser } from "../../features/auth/authSelectors";
import { useVerificationAccess } from "../../features/verification/useVerificationAccess";
import VerificationBanner from "../../components/verification/VerificationBanner";
import { EmptyState, LoadingState, Badge } from "../../components/common";

/**
 * FarmerDashboard — Espace officiel de pilotage de l'agriculteur (Phase 08)
 * Connecté strictement aux données réelles de l'exploitation : produits, récoltes, commandes et vérification.
 * Respecte les permissions de la Phase 07 et ne contient aucune statistique fictive.
 */
export default function FarmerDashboard() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const products = useSelector(selectFarmerProducts) || [];
  const harvests = useSelector(selectFarmerHarvests) || [];
  const orders = useSelector(selectOrders) || [];

  const productsLoading = useSelector(selectProductsLoading);
  const harvestsLoading = useSelector(selectHarvestLoading);
  const ordersLoading = useSelector(selectOrdersLoading);

  const { status, canPublish, openModal, VerificationModal, isApproved } =
    useVerificationAccess({ accountType: "farmer" });

  useEffect(() => {
    dispatch(fetchFarmerProducts());
    dispatch(fetchFarmerHarvests());
    dispatch(fetchFarmerOrders());
    dispatch(fetchActiveVerification());
  }, [dispatch]);

  // Derived real metrics
  const totalProductsCount = products.length;
  const availableProductsCount = products.filter(
    (p) => p.is_available !== false
  ).length;
  const totalHarvestsCount = harvests.length;
  const activeHarvestsCount = harvests.filter(
    (h) => h.status === "in_progress" || h.status === "ready"
  ).length;
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter(
    (o) => o.status === "completed" || o.status === "delivered"
  ).length;

  const displayName = user?.name || "Agriculteur";

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Welcome Section ────────────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Bonjour, {displayName} 👋</h1>
            {isApproved ? (
              <Badge variant="success" size="md">
                Exploitation vérifiée ✓
              </Badge>
            ) : status === "pending" ? (
              <Badge variant="warning" size="md">
                Vérification en attente ⏳
              </Badge>
            ) : (
              <Badge variant="neutral" size="md">
                Compte non certifié
              </Badge>
            )}
          </div>
          <p>
            Pilotez vos productions agricoles, vos récoltes prévisionnelles et vos ventes directes aux acheteurs professionnels.
          </p>
        </div>

        {/* Action Pills */}
        <div className="af-dashboard-actions">
          {canPublish ? (
            <Link to="/farmer/products/new" className="af-btn-primary-pill">
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
              onClick={() => openModal("l'ajout et la publication de produits agricoles")}
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

          {canPublish ? (
            <Link to="/farmer/harvests/create" className="af-btn-secondary-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Planifier une récolte
            </Link>
          ) : (
            <button
              type="button"
              className="af-btn-secondary-pill"
              onClick={() => openModal("la planification de récoltes")}
              title="Vérification requise pour planifier"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Planifier une récolte
              <span style={{ fontSize: "0.85em", marginLeft: "4px" }}>🔒</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Verification Status Banner (Phase 07) ─────────────────── */}
      <VerificationBanner status={status} accountType="farmer" />

      {/* ── 3. Overview Real Metrics ─────────────────────────────────── */}
      <div className="af-stats-row">
        {/* Card 1: Total Produits */}
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Produits</span>
            <Link
              to="/farmer/products"
              className="af-stat-arrow-btn"
              aria-label="Voir mes produits"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{totalProductsCount}</div>
          <div className="af-stat-pill">
            <span>{availableProductsCount}</span> actifs en catalogue
          </div>
        </div>

        {/* Card 2: Récoltes enregistrées */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Mes Récoltes</span>
            <Link
              to="/farmer/harvests"
              className="af-stat-arrow-btn"
              aria-label="Voir mes récoltes"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{totalHarvestsCount}</div>
          <div className="af-stat-pill success">
            <span>{activeHarvestsCount}</span> en cours ou prêtes
          </div>
        </div>

        {/* Card 3: Commandes reçues */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Commandes Reçues</span>
            <Link
              to="/farmer/orders"
              className="af-stat-arrow-btn"
              aria-label="Voir les commandes"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value">{totalOrdersCount}</div>
          <div className="af-stat-pill neutral">
            <span>{completedOrdersCount}</span> livrées avec succès
          </div>
        </div>

        {/* Card 4: Statut du dossier */}
        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Dossier B2B</span>
            <Link
              to="/farmer/verification"
              className="af-stat-arrow-btn"
              aria-label="Consulter ma vérification"
            >
              ↗
            </Link>
          </div>
          <div className="af-stat-value" style={{ fontSize: "20px", marginTop: "4px" }}>
            {isApproved
              ? "Approuvé"
              : status === "pending"
              ? "En examen"
              : status === "rejected"
              ? "Rejeté"
              : "À compléter"}
          </div>
          <span className="af-stat-subtitle-text">
            {isApproved
              ? "Publication illimitée"
              : "Dossier légal exploitation"}
          </span>
        </div>
      </div>

      {/* ── 4. Main Two-Column Grid: Produits & Récoltes ─────────────── */}
      <div className="row g-4">
        {/* Colonne Gauche : Mes Produits Agricoles */}
        <div className="col-12 col-lg-7">
          <div className="af-panel-card h-100">
            <div className="af-panel-header">
              <div>
                <h2 className="af-panel-title">Mes Produits Agricoles</h2>
                <span className="af-stat-subtitle-text">
                  Catalogue direct ({totalProductsCount} produit{totalProductsCount > 1 ? "s" : ""})
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Link to="/farmer/products" className="af-pill-link-btn">
                  Voir tout
                </Link>
                {canPublish ? (
                  <Link to="/farmer/products/new" className="af-pill-link-btn primary">
                    + Nouveau
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="af-pill-link-btn"
                    onClick={() => openModal("l'ajout de produits")}
                  >
                    + Nouveau 🔒
                  </button>
                )}
              </div>
            </div>

            {productsLoading && products.length === 0 ? (
              <LoadingState message="Chargement de vos produits..." />
            ) : products.length > 0 ? (
              <div className="af-product-list">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="af-dashboard-list-item">
                    <div className="af-list-item-avatar">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                        />
                      ) : (
                        <span>🌿</span>
                      )}
                    </div>
                    <div className="af-list-item-content">
                      <div className="af-list-item-title">{product.name}</div>
                      <div className="af-list-item-meta">
                        <span>{product.category?.name || product.category || "Produit agricole"}</span>
                        <span>·</span>
                        <strong style={{ color: "var(--af-primary-forest)" }}>
                          {product.price} DH / {product.unit || "kg"}
                        </strong>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge
                        variant={product.is_available !== false ? "success" : "neutral"}
                        size="sm"
                      >
                        {product.is_available !== false ? "En stock" : "Épuisé"}
                      </Badge>
                      {canPublish && (
                        <Link
                          to={`/farmer/products/${product.id}/edit`}
                          className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
                          style={{ fontSize: "0.78rem" }}
                          title="Modifier le produit"
                        >
                          Modifier
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🌱"
                title="Aucun produit publié"
                description="Vous n'avez pas encore de produit dans votre catalogue. Ajoutez vos productions pour les rendre visibles aux acheteurs professionnels."
                action={
                  canPublish ? (
                    <Link to="/farmer/products/new" className="af-btn-primary-pill">
                      Ajouter mon premier produit
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="af-btn-primary-pill"
                      onClick={() => openModal("la création de produits")}
                    >
                      Ajouter mon premier produit 🔒
                    </button>
                  )
                }
              />
            )}
          </div>
        </div>

        {/* Colonne Droite : Mes Récoltes & Prévisions */}
        <div className="col-12 col-lg-5">
          <div className="af-panel-card h-100">
            <div className="af-panel-header">
              <div>
                <h2 className="af-panel-title">Mes Récoltes</h2>
                <span className="af-stat-subtitle-text">
                  Calendrier de production ({totalHarvestsCount})
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Link to="/farmer/harvests" className="af-pill-link-btn">
                  Voir tout
                </Link>
                {canPublish ? (
                  <Link to="/farmer/harvests/create" className="af-pill-link-btn primary">
                    + Planifier
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="af-pill-link-btn"
                    onClick={() => openModal("la planification de récoltes")}
                  >
                    + Planifier 🔒
                  </button>
                )}
              </div>
            </div>

            {harvestsLoading && harvests.length === 0 ? (
              <LoadingState message="Chargement de vos récoltes..." />
            ) : harvests.length > 0 ? (
              <div className="af-harvest-list">
                {harvests.slice(0, 5).map((harvest) => (
                  <div key={harvest.id} className="af-dashboard-list-item">
                    <div className="af-list-item-avatar" style={{ backgroundColor: "#eaf3ec", color: "#194638" }}>
                      🌾
                    </div>
                    <div className="af-list-item-content">
                      <div className="af-list-item-title">
                        {harvest.product_name || harvest.name || `Récolte #${harvest.id}`}
                      </div>
                      <div className="af-list-item-meta">
                        <span>Quantité : {harvest.estimated_quantity || harvest.quantity || "—"} {harvest.unit || "kg"}</span>
                        <span>·</span>
                        <span>
                          {harvest.harvest_date
                            ? new Date(harvest.harvest_date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                              })
                            : "Date à préciser"}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        harvest.status === "ready"
                          ? "success"
                          : harvest.status === "in_progress"
                          ? "info"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {harvest.status === "ready"
                        ? "Prête"
                        : harvest.status === "in_progress"
                        ? "En cours"
                        : harvest.status || "Planifiée"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🚜"
                title="Aucune récolte enregistrée"
                description="Planifiez vos cycles de culture pour informer les acheteurs de vos volumes prévisionnels et recevoir des précommandes."
                action={
                  canPublish ? (
                    <Link to="/farmer/harvests/create" className="af-btn-primary-pill">
                      Planifier une récolte
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="af-btn-primary-pill"
                      onClick={() => openModal("la planification de récoltes")}
                    >
                      Planifier une récolte 🔒
                    </button>
                  )
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* ── 5. Activité Récente & Commandes reçues ────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Commandes d&apos;Acheteurs Reçues</h2>
            <span className="af-stat-subtitle-text">
              Historique des demandes d&apos;approvisionnement directes
            </span>
          </div>
          <Link to="/farmer/orders" className="af-pill-link-btn">
            Toutes les commandes ({totalOrdersCount})
          </Link>
        </div>

        {ordersLoading && orders.length === 0 ? (
          <LoadingState message="Chargement des commandes..." />
        ) : orders.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle af-dashboard-table mb-0">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Acheteur / Zone</th>
                  <th>Articles</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      <div>{order.client_name || order.user?.name || "Acheteur Pro"}</div>
                      <small className="text-muted">{order.shipping_zone || order.city || "Maroc"}</small>
                    </td>
                    <td>{order.items?.length || 1} article(s)</td>
                    <td>
                      <strong style={{ color: "var(--af-primary-forest)" }}>
                        {order.total ? `${Number(order.total).toLocaleString()} DH` : "—"}
                      </strong>
                    </td>
                    <td>
                      <Badge
                        variant={
                          order.status === "delivered" || order.status === "completed"
                            ? "success"
                            : order.status === "in_delivery" || order.status === "processing"
                            ? "info"
                            : "warning"
                        }
                        size="sm"
                      >
                        {order.status === "delivered"
                          ? "Livrée"
                          : order.status === "in_delivery"
                          ? "En livraison"
                          : order.status === "processing"
                          ? "En préparation"
                          : order.status === "pending"
                          ? "En attente"
                          : order.status}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/farmer/orders`}
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="📦"
            title="Aucune commande pour l'instant"
            description="Dès qu'un acheteur professionnel passe commande pour l'un de vos produits ou récoltes, celle-ci s'affichera directement ici."
            action={
              <Link to="/products" className="af-btn-secondary-pill">
                Consulter le catalogue public
              </Link>
            }
          />
        )}
      </div>

      {/* ── 6. Actions Rapides ────────────────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header mb-3">
          <h2 className="af-panel-title">Actions Rapides</h2>
          <span className="af-stat-subtitle-text">Accès direct aux fonctionnalités clés</span>
        </div>
        <div className="af-quick-actions-grid">
          <Link to="/farmer/products" className="af-quick-action-card">
            <span className="af-quick-action-icon">📦</span>
            <div>
              <div className="af-quick-action-title">Gérer mes produits</div>
              <div className="af-quick-action-sub">Modifier prix et stocks</div>
            </div>
          </Link>

          <Link to="/farmer/harvests" className="af-quick-action-card">
            <span className="af-quick-action-icon">🌾</span>
            <div>
              <div className="af-quick-action-title">Gérer mes récoltes</div>
              <div className="af-quick-action-sub">Suivre les maturités</div>
            </div>
          </Link>

          <Link to="/farmer/orders" className="af-quick-action-card">
            <span className="af-quick-action-icon">🚚</span>
            <div>
              <div className="af-quick-action-title">Commandes reçues</div>
              <div className="af-quick-action-sub">Suivi des livraisons</div>
            </div>
          </Link>

          <Link to="/farmer/verification" className="af-quick-action-card">
            <span className="af-quick-action-icon">🛡️</span>
            <div>
              <div className="af-quick-action-title">Dossier de vérification</div>
              <div className="af-quick-action-sub">Certifier mon exploitation</div>
            </div>
          </Link>

          <Link to="/farmer/profile" className="af-quick-action-card">
            <span className="af-quick-action-icon">🏡</span>
            <div>
              <div className="af-quick-action-title">Mon exploitation</div>
              <div className="af-quick-action-sub">Coordonnées et région</div>
            </div>
          </Link>

          <Link to="/products" className="af-quick-action-card">
            <span className="af-quick-action-icon">🏪</span>
            <div>
              <div className="af-quick-action-title">Catalogue public</div>
              <div className="af-quick-action-sub">Vue marché global</div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── 7. Verification Required Modal (Phase 07) ─────────────────── */}
      {VerificationModal}
    </div>
  );
}
