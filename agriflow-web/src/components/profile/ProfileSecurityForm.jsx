import { useState } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { Button } from "../common";

export default function ProfileSecurityForm({ isLoading = false, onSavePassword }) {
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!passwordData.current_password) {
            setError("Le mot de passe actuel est requis.");
            return;
        }

        if (passwordData.password.length < 8) {
            setError("Le nouveau mot de passe doit comporter au moins 8 caractères.");
            return;
        }

        if (passwordData.password !== passwordData.password_confirmation) {
            setError("La confirmation du mot de passe ne correspond pas.");
            return;
        }

        onSavePassword(passwordData);
        setPasswordData({
            current_password: "",
            password: "",
            password_confirmation: "",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="af-card mt-4">
            <div className="af-card-header">
                <div>
                    <h2 className="af-card-title h6">Sécurité du compte</h2>
                    <p className="af-card-description">
                        Modifiez votre mot de passe pour protéger votre espace professionnel.
                    </p>
                </div>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")} className="py-2 px-3 small mb-3">
                    {error}
                </Alert>
            )}

            <Row className="g-3">
                <Col md={12}>
                    <div className="af-field">
                        <label className="af-label" htmlFor="sec-current-password">
                            Mot de passe actuel <span className="text-danger">*</span>
                        </label>
                        <input
                            id="sec-current-password"
                            name="current_password"
                            type="password"
                            className="af-input"
                            value={passwordData.current_password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </Col>

                <Col md={6}>
                    <div className="af-field">
                        <label className="af-label" htmlFor="sec-new-password">
                            Nouveau mot de passe <span className="text-danger">*</span>
                        </label>
                        <input
                            id="sec-new-password"
                            name="password"
                            type="password"
                            className="af-input"
                            placeholder="Min. 8 caractères"
                            value={passwordData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </Col>

                <Col md={6}>
                    <div className="af-field">
                        <label className="af-label" htmlFor="sec-confirm-password">
                            Confirmer le mot de passe <span className="text-danger">*</span>
                        </label>
                        <input
                            id="sec-confirm-password"
                            name="password_confirmation"
                            type="password"
                            className="af-input"
                            placeholder="Répétez le mot de passe"
                            value={passwordData.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
                <Button type="submit" variant="secondary" size="sm" isLoading={isLoading}>
                    Mettre à jour le mot de passe
                </Button>
            </div>
        </form>
    );
}
