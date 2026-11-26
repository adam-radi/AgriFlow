import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Alert } from "react-bootstrap";
import {
  fetchUsers,
  suspendUser,
  createDeliveryUser,
  validateFarmer,
  rejectFarmer,
} from "../../app/store/slices/admin/adminSlice";
import {
  selectAdminUsers,
  selectAdminLoading,
  selectAdminError,
} from "../../app/store/slices/admin/adminSelectors";
import { Badge, EmptyState, LoadingState, Button } from "../../components/common";

/**
 * AdminUsersPage — Gestion des utilisateurs plateforme (Lot 11)
 */
export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers) || [];
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToSuspend, setUserToSuspend] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    zone: "",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleConfirmSuspend = async () => {
    if (!userToSuspend) return;
    const res = await dispatch(suspendUser(userToSuspend.id));
    if (res.meta?.requestStatus === "fulfilled") {
      setFeedbackMsg({ type: "success", text: `Le compte #${userToSuspend.id} (${userToSuspend.name}) a été suspendu avec succès.` });
      dispatch(fetchUsers());
    } else {
      setFeedbackMsg({ type: "danger", text: "Impossible de suspendre cet utilisateur." });
    }
    setUserToSuspend(null);
  };

  const handleValidateFarmer = async (id) => {
    const res = await dispatch(validateFarmer(id));
    if (res.meta?.requestStatus === "fulfilled") {
      setFeedbackMsg({ type: "success", text: `L'exploitant #${id} a été approuvé avec succès.` });
      if (selectedUser?.id === id) {
        setSelectedUser((prev) => ({ ...prev, farmer_status: "approved" }));
      }
      dispatch(fetchUsers());
    }
  };

  const handleRejectFarmer = async (id) => {
    const res = await dispatch(rejectFarmer(id));
    if (res.meta?.requestStatus === "fulfilled") {
      setFeedbackMsg({ type: "success", text: `Le dossier #${id} a été refusé.` });
      if (selectedUser?.id === id) {
        setSelectedUser((prev) => ({ ...prev, farmer_status: "rejected" }));
      }
      dispatch(fetchUsers());
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitDelivery = () => {
    dispatch(createDeliveryUser(form)).then((res) => {
      if (res.meta?.requestStatus === "fulfilled") {
        setShowCreateModal(false);
        setForm({ name: "", email: "", password: "", phone: "", zone: "" });
        setFeedbackMsg({ type: "success", text: "Compte livreur logistique créé avec succès !" });
        dispatch(fetchUsers());
      }
    });
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      (u.zone && u.zone.toLowerCase().includes(searchTerm.toLowerCase()));

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
  const adminsCount = users.filter((u) => u.role === "Admin").length;

  return (
    <div className="af-dashboard-container">
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
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
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Créer un Livreur
          </button>
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
          {typeof error === "string" ? error : "Erreur lors du chargement des utilisateurs."}
        </Alert>
      )}

      {/* ── 2. Top Stats Overview ─────────────────────────────────────── */}
      <div className="af-stats-row">
        <div className="af-stat-card-featured">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Total Utilisateurs</span>
            <span className="fs-5">👥</span>
          </div>
          <div className="af-stat-value">{users.length}</div>
          <div className="af-stat-pill">Comptes enregistrés</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Agriculteurs</span>
            <span className="fs-5">🌾</span>
          </div>
          <div className="af-stat-value">{farmersCount}</div>
          <div className="af-stat-pill success">Exploitants certifiés</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Acheteurs Pro</span>
            <span className="fs-5">🛒</span>
          </div>
          <div className="af-stat-value">{clientsCount}</div>
          <div className="af-stat-pill neutral">Commerces & Resto</div>
        </div>

        <div className="af-stat-card-white">
          <div className="af-stat-card-top">
            <span className="af-stat-card-label">Livreurs & Logistique</span>
            <span className="fs-5">🚚</span>
          </div>
          <div className="af-stat-value">{livreursCount}</div>
          <span className="af-stat-subtitle-text">{adminsCount} administrateur(s)</span>
        </div>
      </div>

      {/* ── 3. Filters & Search Bar ───────────────────────────────────── */}
      <div className="af-panel-card p-3 mb-4">
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
              placeholder="Rechercher par nom, email, téléphone, région..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter Chips */}
          <div className="af-category-chips-row">
            {[
              { id: "all", label: `Tous (${users.length})` },
              { id: "Farmer", label: `🌾 Agriculteurs (${farmersCount})` },
              { id: "Client", label: `🛒 Acheteurs Pro (${clientsCount})` },
              { id: "Livreur", label: `🚚 Livreurs (${livreursCount})` },
              { id: "Admin", label: `🛡️ Admins (${adminsCount})` },
            ].map((chip) => {
              const isActive = selectedRoleFilter === chip.id;
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
                  onClick={() => setSelectedRoleFilter(chip.id)}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. Main Users Table Panel ─────────────────────────────────── */}
      <div className="af-panel-card">
        <div className="af-panel-header">
          <div>
            <h2 className="af-panel-title">Liste des Utilisateurs</h2>
            <span className="af-stat-subtitle-text">
              {filteredUsers.length} compte{filteredUsers.length > 1 ? "s" : ""} affiché{filteredUsers.length > 1 ? "s" : ""}
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
                  <th>Vérification / Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const initials = (u.name || "U")
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join("");

                  return (
                    <tr key={u.id}>
                      <td className="fw-bold text-muted">#{u.id}</td>
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
                            <div className="fw-semibold text-dark">{u.name || "—"}</div>
                            <small className="text-muted">📍 {u.zone || "Maroc"}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{u.email}</div>
                        <small className="text-muted">{u.phone || "—"}</small>
                      </td>
                      <td>
                        <Badge
                          variant={
                            u.role === "Farmer"
                              ? "success"
                              : u.role === "Client"
                              ? "info"
                              : u.role === "Livreur"
                              ? "warning"
                              : "primary"
                          }
                          size="sm"
                        >
                          {u.role === "Farmer"
                            ? "Agriculteur"
                            : u.role === "Client"
                            ? "Acheteur Pro"
                            : u.role === "Livreur"
                            ? "Livreur"
                            : u.role}
                        </Badge>
                      </td>
                      <td>
                        {u.role === "Farmer" ? (
                          <Badge
                            variant={
                              u.farmer_status === "approved"
                                ? "success"
                                : u.farmer_status === "rejected"
                                ? "danger"
                                : "warning"
                            }
                            size="sm"
                          >
                            {u.farmer_status === "approved"
                              ? "Certifié ✓"
                              : u.farmer_status === "rejected"
                              ? "Rejeté ✗"
                              : "En attente ⏳"}
                          </Badge>
                        ) : (
                          <span className="text-muted small">Standard</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                            style={{ fontSize: "0.8rem" }}
                            onClick={() => setSelectedUser(u)}
                          >
                            Consulter
                          </button>
                          {u.role !== "Admin" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1"
                              style={{ fontSize: "0.8rem" }}
                              onClick={() => setUserToSuspend(u)}
                            >
                              Suspendre
                            </button>
                          )}
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
            icon="👥"
            title="Aucun utilisateur trouvé"
            description="Aucun compte ne correspond à vos critères de recherche actuels."
          />
        )}
      </div>

      {/* ── 5. Modal Détails Utilisateur ───────────────────────────────── */}
      <Modal show={!!selectedUser} onHide={() => setSelectedUser(null)} centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #edf2ee" }}>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--af-primary-forest)" }}>
            Dossier Utilisateur #{selectedUser?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedUser && (
            <div className="d-flex flex-column gap-3">
              <div>
                <span className="text-muted small d-block">Nom complet</span>
                <strong className="fs-6" style={{ color: "var(--af-green-950, #15372F)" }}>
                  {selectedUser.name}
                </strong>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Email</span>
                  <span className="small">{selectedUser.email}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Téléphone</span>
                  <span className="small">{selectedUser.phone || "Non renseigné"}</span>
                </div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Rôle</span>
                  <Badge variant="primary" size="sm">
                    {selectedUser.role}
                  </Badge>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Région / Zone</span>
                  <span className="small">📍 {selectedUser.zone || "Maroc"}</span>
                </div>
              </div>
              {selectedUser.role === "Farmer" && (
                <div className="p-3 rounded-3" style={{ backgroundColor: "var(--af-canvas, #F6F8F5)" }}>
                  <span className="text-muted small d-block mb-1">Statut d&apos;accréditation agricole :</span>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <Badge
                      variant={
                        selectedUser.farmer_status === "approved"
                          ? "success"
                          : selectedUser.farmer_status === "rejected"
                          ? "danger"
                          : "warning"
                      }
                      size="md"
                    >
                      {selectedUser.farmer_status === "approved"
                        ? "Exploitant Certifié ✓"
                        : selectedUser.farmer_status === "rejected"
                        ? "Dossier Rejeté"
                        : "En cours d'examen ⏳"}
                    </Badge>
                    <div className="d-flex gap-2">
                      {selectedUser.farmer_status !== "approved" && (
                        <button
                          type="button"
                          className="btn btn-sm btn-success rounded-pill px-3"
                          onClick={() => handleValidateFarmer(selectedUser.id)}
                        >
                          Approuver
                        </button>
                      )}
                      {selectedUser.farmer_status !== "rejected" && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleRejectFarmer(selectedUser.id)}
                        >
                          Rejeter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div>
                <span className="text-muted small d-block">Date d&apos;inscription</span>
                <span className="small">
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #edf2ee" }}>
          <Button variant="secondary" pill onClick={() => setSelectedUser(null)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── 6. Modal Confirmation Suspension ───────────────────────────── */}
      <Modal show={!!userToSuspend} onHide={() => setUserToSuspend(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold text-danger">
            Confirmer la suspension du compte
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Êtes-vous certain de vouloir suspendre le compte de{" "}
            <strong>{userToSuspend?.name}</strong> (#{userToSuspend?.id}) ?
            L&apos;utilisateur ne pourra plus se connecter ni publier d&apos;offres sur la plateforme.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" pill onClick={() => setUserToSuspend(null)}>
            Annuler
          </Button>
          <Button variant="danger" pill onClick={handleConfirmSuspend}>
            Confirmer la suspension
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── 7. Modal Création Livreur ──────────────────────────────────── */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #edf2ee" }}>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--af-primary-forest)" }}>
            Créer un Compte Livreur Logistique
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Nom complet *</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Youssef Mansouri"
                className="rounded-3"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Adresse e-mail *</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="livreur@agriflow.ma"
                className="rounded-3"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Mot de passe *</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 caractères"
                className="rounded-3"
                required
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
              <Form.Label className="small fw-semibold text-muted">Zone logistique / Région</Form.Label>
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
          <Button variant="outline" pill onClick={() => setShowCreateModal(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            pill
            onClick={handleSubmitDelivery}
            disabled={!form.name || !form.email || !form.password}
          >
            Créer le Livreur
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
