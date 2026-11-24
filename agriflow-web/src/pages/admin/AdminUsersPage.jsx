import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form } from "react-bootstrap";
import { fetchUsers, suspendUser, createDeliveryUser } from "../../app/store/slices/admin/adminSlice";
import {
  selectAdminUsers,
  selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import { Badge, EmptyState, LoadingState } from "../../components/common";

/**
 * AdminUsersPage — Gestion des utilisateurs plateforme (Design System AgriFlow)
 */
export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers) || [];
  const loading = useSelector(selectAdminLoading);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    zone: "",
  });

  const handleSuspend = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir suspendre cet utilisateur ?")) {
      dispatch(suspendUser(id));
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    dispatch(createDeliveryUser(form)).then(() => {
      setShowModal(false);
      setForm({ name: "", email: "", password: "", phone: "", zone: "" });
      dispatch(fetchUsers());
    });
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm));

    const matchesRole =
      selectedRoleFilter === "all" ||
      (selectedRoleFilter === "Farmer" && u.role === "Farmer") ||
      (selectedRoleFilter === "Client" && u.role === "Client") ||
      (selectedRoleFilter === "Livreur" && u.role === "Livreur") ||
      (selectedRoleFilter === "Admin" && u.role === "Admin");

    return matchesSearch && matchesRole;
  });

  const farmersCount = users.filter((u) => u.role === "Farmer").length;
  const clientsCount = users.filter((u) => u.role === "Client").length;
  const livreursCount = users.filter((u) => u.role === "Livreur").length;

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Welcome / Page Header ──────────────────────────────────── */}
      <div className="af-dashboard-header-row">
        <div className="af-dashboard-title-group">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h1>Utilisateurs Plateforme</h1>
            <Badge variant="primary" size="md">
              {users.length} comptes
            </Badge>
          </div>
          <p>
            Consultez, filtrez et administrez l&apos;ensemble des comptes enregistrés sur AgriFlow.
          </p>
        </div>

        <div className="af-dashboard-actions">
          <button
            type="button"
            className="af-btn-primary-pill"
            onClick={() => setShowModal(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Créer un Livreur
          </button>
        </div>
      </div>

      {/* ── 2. Top Stats Overview ─────────────────────────────────────── */}
      <div className="af-stats-row">
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Utilisateurs</span>
          </div>
          <div className="af-stat-value">{users.length}</div>
          <div className="af-stat-pill">Comptes enregistrés</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Agriculteurs</span>
          </div>
          <div className="af-stat-value">{farmersCount}</div>
          <div className="af-stat-pill success">Exploitants</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Acheteurs Pro</span>
          </div>
          <div className="af-stat-value">{clientsCount}</div>
          <div className="af-stat-pill neutral">Commerces & Resto</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Livreurs & Logistique</span>
          </div>
          <div className="af-stat-value">{livreursCount}</div>
          <span className="af-stat-subtitle-text">Transporteurs actifs</span>
        </div>
      </div>

      {/* ── 3. Filters & Search Bar ───────────────────────────────────── */}
      <div className="af-panel-card p-3">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          {/* Search bar */}
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
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter Chips */}
          <div className="af-category-chips-row">
            {[
              { id: "all", label: "Tous les rôles" },
              { id: "Farmer", label: "🌾 Agriculteurs" },
              { id: "Client", label: "🛒 Acheteurs Pro" },
              { id: "Livreur", label: "🚚 Livreurs" },
              { id: "Admin", label: "🛡️ Administrateurs" },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`af-category-chip ${
                  selectedRoleFilter === chip.id ? "active" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedRoleFilter === chip.id ? "#15372F" : "#ffffff",
                  color: selectedRoleFilter === chip.id ? "#ffffff" : "#3b4e43",
                  border:
                    selectedRoleFilter === chip.id
                      ? "1px solid #15372F"
                      : "1px solid #dce5df",
                }}
                onClick={() => setSelectedRoleFilter(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Main Users Table Panel ─────────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Liste des Utilisateurs</h2>
            <span className="af-stat-subtitle-text">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""} affiché{filteredUsers.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {loading && users.length === 0 ? (
          <LoadingState message="Chargement des utilisateurs en cours..." />
        ) : filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle af-dashboard-table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Utilisateur</th>
                  <th>Contact</th>
                  <th>Rôle</th>
                  <th>Statut Exploitant</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const initials = (user.name || "U")
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join("");

                  return (
                    <tr key={user.id}>
                      <td className="fw-bold text-muted">#{user.id}</td>
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
                            <div className="fw-semibold text-dark">{user.name || "—"}</div>
                            <small className="text-muted">{user.zone || "Maroc"}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{user.email}</div>
                        <small className="text-muted">{user.phone || "—"}</small>
                      </td>
                      <td>
                        <Badge
                          variant={
                            user.role === "Farmer"
                              ? "success"
                              : user.role === "Client"
                              ? "info"
                              : user.role === "Livreur"
                              ? "warning"
                              : "primary"
                          }
                          size="sm"
                        >
                          {user.role === "Farmer"
                            ? "Agriculteur"
                            : user.role === "Client"
                            ? "Acheteur Pro"
                            : user.role === "Livreur"
                            ? "Livreur"
                            : user.role}
                        </Badge>
                      </td>
                      <td>
                        {user.role === "Farmer" ? (
                          <Badge
                            variant={
                              user.farmer_status === "approved"
                                ? "success"
                                : user.farmer_status === "rejected"
                                ? "danger"
                                : "warning"
                            }
                            size="sm"
                          >
                            {user.farmer_status === "approved"
                              ? "Certifié ✓"
                              : user.farmer_status === "rejected"
                              ? "Rejeté ✗"
                              : "En attente ⏳"}
                          </Badge>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1"
                          style={{ fontSize: "0.78rem" }}
                          onClick={() => handleSuspend(user.id)}
                        >
                          Suspendre
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="👥"
            title="Aucun utilisateur trouvé"
            description="Aucun compte ne correspond à vos critères de recherche actuels."
          />
        )}
      </div>

      {/* ── 5. Modal Création Livreur ──────────────────────────────────── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #edf2ee" }}>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--af-primary-forest)" }}>
            Créer un Compte Livreur Logistique
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Nom complet</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Youssef Mansouri"
                className="rounded-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Adresse e-mail</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="livreur@agriflow.ma"
                className="rounded-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Mot de passe</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 caractères"
                className="rounded-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Téléphone</Form.Label>
              <Form.Control
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+212 6XX XXXXXX"
                className="rounded-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Zone de livraison / Région</Form.Label>
              <Form.Control
                name="zone"
                value={form.zone}
                onChange={handleChange}
                placeholder="Ex: Casablanca-Settat, Marrakech-Haouz..."
                className="rounded-3"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #edf2ee" }}>
          <button
            type="button"
            className="af-btn-secondary-pill"
            onClick={() => setShowModal(false)}
          >
            Annuler
          </button>
          <button
            type="button"
            className="af-btn-primary-pill"
            onClick={handleSubmit}
            disabled={!form.name || !form.email || !form.password}
          >
            Créer le Livreur
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
