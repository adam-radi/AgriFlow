import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";

import { registerClient } from "../features/auth/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
} from "../features/auth/authSelectors";
import Logo from "../components/layout/Logo";
import { Button, Badge } from "../components/common";
import "../assets/auth.css";

const BUYER_ZONES = [
    { value: "Casablanca-Settat", label: "Grand Casablanca / Settat" },
    { value: "Rabat-Salé-Kénitra", label: "Rabat / Salé / Kénitra" },
    { value: "Marrakech-Safi", label: "Marrakech / Région Haouz" },
    { value: "Souss-Massa", label: "Agadir / Région Souss-Massa" },
    { value: "Tanger-Tétouan-Al Hoceïma", label: "Tanger / Région Nord" },
    { value: "Fès-Meknès", label: "Fès / Meknès" },
    { value: "Oriental", label: "Oujda / Berkane / Nador" },
    { value: "Autre région", label: "Autre ville du Maroc" },
];

/**
 * RegisterClientPage — Inscription dédiée aux Acheteurs Professionnels (Phase 05)
 * Conçu pour les épiceries, primeurs, restaurateurs et commerces d'alimentation.
 */
export default function RegisterClientPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        zone: "Casablanca-Settat",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setLocalError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            setLocalError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
        }

        dispatch(registerClient(formData))
            .unwrap()
            .then(() => {
                navigate("/products");
            })
            .catch(() => {});
    };

    const displayError = localError || error;

    return (
        <div className="af-auth-wrapper">
            <div className="af-auth-container" style={{ maxWidth: "1120px" }}>
                {/* ── Colonne Gauche : Formulaire Acheteur Pro ─────────── */}
                <div className="af-auth-form-col">
                    <div>
                        {/* En-tête avec Logo officiel */}
                        <div className="af-auth-form-header">
                            <Link to="/" className="text-decoration-none d-inline-block" aria-label="Retour à l'accueil AgriFlow">
                                <Logo height={38} />
                            </Link>
                            <Badge variant="neutral" size="sm">
                                COMPTE ACHETEUR PRO
                            </Badge>
                        </div>

                        <h1 className="af-auth-title">Inscription Acheteur Pro</h1>
                        <p className="af-auth-subtitle">
                            Épiceries, primeurs, restaurateurs : approvisionnez-vous directement auprès des exploitations agricoles marocaines.
                        </p>

                        {displayError && (
                            <Alert
                                variant="danger"
                                className="rounded-3 mb-4 py-2 small"
                                style={{ backgroundColor: "#FFF0EF", borderColor: "#FED7AA", color: "#9A3412" }}
                            >
                                {typeof displayError === "string" ? displayError : "Veuillez vérifier les informations renseignées."}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <Row className="g-3">
                                {/* Nom complet ou Enseigne commerciale */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="client-name">
                                            Nom ou Enseigne commerciale *
                                        </label>
                                        <input
                                            id="client-name"
                                            className="af-auth-input"
                                            type="text"
                                            name="name"
                                            placeholder="Ex: Primeurs Hassan ou Resto Bio"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </Col>

                                {/* Téléphone professionnel */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="client-phone">
                                            Téléphone professionnel *
                                        </label>
                                        <input
                                            id="client-phone"
                                            className="af-auth-input"
                                            type="tel"
                                            name="phone"
                                            placeholder="06 12 34 56 78"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </Col>

                                {/* Ville ou Zone de livraison */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="client-zone">
                                            Zone de livraison principale *
                                        </label>
                                        <select
                                            id="client-zone"
                                            className="af-auth-input"
                                            name="zone"
                                            value={formData.zone}
                                            onChange={handleChange}
                                            required
                                        >
                                            {BUYER_ZONES.map((z) => (
                                                <option key={z.value} value={z.value}>
                                                    {z.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Col>

                                {/* Adresse e-mail professionnelle */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="client-email">
                                            Adresse e-mail professionnelle *
                                        </label>
                                        <input
                                            id="client-email"
                                            className="af-auth-input"
                                            type="email"
                                            name="email"
                                            placeholder="commerce@contact.ma"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </Col>

                                {/* Mot de passe */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="client-password">
                                            Mot de passe (8 car. min) *
                                        </label>
                                        <div className="af-password-wrapper">
                                            <input
                                                id="client-password"
                                                className="af-auth-input"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="af-password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? "Masquer" : "Afficher"}
                                            </button>
                                        </div>
                                    </div>
                                </Col>

                                {/* Confirmation mot de passe */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="client-confirm">
                                            Confirmer le mot de passe *
                                        </label>
                                        <input
                                            id="client-confirm"
                                            className="af-auth-input"
                                            type={showPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </Col>

                                {/* Bouton de soumission */}
                                <Col xs={12} className="pt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        pill
                                        size="lg"
                                        isLoading={loading}
                                        className="w-100"
                                    >
                                        Créer mon compte Acheteur Pro →
                                    </Button>
                                </Col>
                            </Row>
                        </form>

                        <div className="text-center mt-3">
                            <span className="small text-muted">Vous êtes producteur agricole ? </span>
                            <Link
                                to="/register/farmer"
                                className="small fw-semibold text-decoration-none"
                                style={{ color: "var(--af-green-900, #194638)" }}
                            >
                                Inscription Agriculteur
                            </Link>
                        </div>
                    </div>

                    {/* Support & Connexion */}
                    <div className="text-center pt-3 border-top mt-4" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                        <span className="small text-muted">Déjà inscrit ? </span>
                        <Link
                            to="/login"
                            className="small fw-bold text-decoration-none"
                            style={{ color: "var(--af-green-900, #194638)" }}
                        >
                            Se connecter
                        </Link>
                    </div>
                </div>

                {/* ── Colonne Droite : Visuel B2B & Glass Card ─────────── */}
                <div
                    className="af-auth-visual-col"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&q=80")',
                    }}
                >
                    <div className="af-auth-visual-overlay" />
                    <div className="af-auth-glass-card">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                color: "#FFFFFF",
                                fontSize: "0.9rem",
                            }}
                        >
                            📦
                        </div>
                        <h2 className="af-auth-glass-quote">
                            « La fraîcheur du terroir dans vos rayons et cuisines. »
                        </h2>
                        <p className="af-auth-glass-meta m-0">
                            Commandez par lots calibrés ou palettes entières directement auprès des exploitations partenaires avec livraison optimisée.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
