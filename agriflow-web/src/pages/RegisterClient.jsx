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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOROCCAN_PHONE_REGEX = /^(?:(?:\+|00)212|0)[5-7]\d{8}$/;

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
 * RegisterClientPage — Inscription dédiée aux Acheteurs Professionnels (Phase 05 / 07)
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
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectAuthLoading);
    const serverError = useSelector(selectAuthError);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setLocalError("");
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const cleanPhone = formData.phone.replace(/[\s.-]/g, "");

        if (!trimmedName) {
            errors.name = "Le nom ou l'enseigne commerciale est obligatoire.";
        } else if (trimmedName.length < 2) {
            errors.name = "Le nom doit comporter au moins 2 caractères.";
        }

        if (!cleanPhone) {
            errors.phone = "Le numéro de téléphone est obligatoire.";
        } else if (!MOROCCAN_PHONE_REGEX.test(cleanPhone)) {
            errors.phone = "Numéro marocain invalide (ex: 06 12 34 56 78 ou 05 22 ...).";
        }

        if (!trimmedEmail) {
            errors.email = "L'adresse e-mail professionnelle est obligatoire.";
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            errors.email = "Format d'e-mail invalide (ex: commerce@contact.ma).";
        }

        if (!formData.password) {
            errors.password = "Le mot de passe est obligatoire.";
        } else if (formData.password.length < 8) {
            errors.password = "Le mot de passe doit comporter au moins 8 caractères.";
        }

        if (!formData.password_confirmation) {
            errors.password_confirmation = "Veuillez confirmer votre mot de passe.";
        } else if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = "Les mots de passe ne correspondent pas.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (!validateForm()) return;

        try {
            await dispatch(registerClient(formData)).unwrap();
            navigate("/products");
        } catch (err) {
            if (err && typeof err === "object") {
                const apiFieldErrors = {};
                for (const [key, msgs] of Object.entries(err)) {
                    apiFieldErrors[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                }
                setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }));
            } else if (typeof err === "string") {
                setLocalError(err);
            }
        }
    };

    const displayError = localError || (typeof serverError === "string" ? serverError : null);

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
                                className="rounded-3 mb-4 py-2 small d-flex align-items-center gap-2"
                                style={{ backgroundColor: "#FFF0EF", borderColor: "#FED7AA", color: "#9A3412" }}
                            >
                                <span>⚠️</span>
                                <div>{displayError}</div>
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
                                            className={`af-auth-input ${fieldErrors.name ? "is-invalid" : ""}`}
                                            type="text"
                                            name="name"
                                            placeholder="Ex: Primeurs Hassan ou Resto Bio"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        />
                                        {fieldErrors.name && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.name}
                                            </div>
                                        )}
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
                                            className={`af-auth-input ${fieldErrors.phone ? "is-invalid" : ""}`}
                                            type="tel"
                                            name="phone"
                                            placeholder="06 12 34 56 78"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        />
                                        {fieldErrors.phone && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.phone}
                                            </div>
                                        )}
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
                                            disabled={loading}
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
                                            className={`af-auth-input ${fieldErrors.email ? "is-invalid" : ""}`}
                                            type="email"
                                            name="email"
                                            placeholder="commerce@contact.ma"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                            autoComplete="email"
                                        />
                                        {fieldErrors.email && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.email}
                                            </div>
                                        )}
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
                                                className={`af-auth-input ${fieldErrors.password ? "is-invalid" : ""}`}
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                disabled={loading}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="af-password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                            >
                                                {showPassword ? "Masquer" : "Afficher"}
                                            </button>
                                        </div>
                                        {fieldErrors.password && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.password}
                                            </div>
                                        )}
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
                                            className={`af-auth-input ${fieldErrors.password_confirmation ? "is-invalid" : ""}`}
                                            type={showPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        />
                                        {fieldErrors.password_confirmation && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.password_confirmation}
                                            </div>
                                        )}
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
                                        disabled={loading}
                                        className="w-100"
                                    >
                                        {loading ? "Création du compte en cours..." : "Créer mon compte Acheteur Pro →"}
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
