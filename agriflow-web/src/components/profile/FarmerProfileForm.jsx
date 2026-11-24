import { useState } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { Button } from "../common";

const MOROCCAN_REGIONS = [
    "Tanger-Tétouan-Al Hoceïma",
    "L'Oriental",
    "Fès-Meknès",
    "Rabat-Salé-Kénitra",
    "Béni Mellal-Khénifra",
    "Casablanca-Settat",
    "Marrakech-Safi",
    "Drâa-Tafilalet",
    "Souss-Massa",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab",
];

export default function FarmerProfileForm({
    initialFarmer = {},
    initialAccount = {},
    isLoading = false,
    onSave,
}) {
    const [farmerData, setFarmerData] = useState({
        farm_name: initialFarmer?.farm_name || "",
        description: initialFarmer?.description || "",
        address: initialFarmer?.address || "",
        city: initialFarmer?.city || "",
        region: initialFarmer?.region || "Souss-Massa",
    });

    const [accountData, setAccountData] = useState({
        name: initialAccount?.name || "",
        phone: initialAccount?.phone || "",
    });

    const [validationError, setValidationError] = useState("");

    const handleFarmerChange = (e) => {
        setFarmerData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setValidationError("");
    };

    const handleAccountChange = (e) => {
        setAccountData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setValidationError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validations frontend alignées sur le backend
        if (!farmerData.farm_name.trim()) {
            setValidationError("Le nom de l'exploitation est obligatoire.");
            return;
        }
        if (!farmerData.address.trim()) {
            setValidationError("L'adresse de l'exploitation est obligatoire.");
            return;
        }
        if (!farmerData.city.trim()) {
            setValidationError("La ville est obligatoire.");
            return;
        }
        if (!farmerData.region.trim()) {
            setValidationError("La région est obligatoire.");
            return;
        }
        if (farmerData.description && farmerData.description.length > 2000) {
            setValidationError("La description ne doit pas dépasser 2000 caractères.");
            return;
        }

        onSave({ farmerData, accountData });
    };

    return (
        <form onSubmit={handleSubmit}>
            {validationError && (
                <Alert variant="danger" dismissible onClose={() => setValidationError("")} className="py-2 px-3 small mb-3">
                    {validationError}
                </Alert>
            )}

            <div className="af-card mb-4">
                <div className="af-card-header">
                    <div>
                        <h2 className="af-card-title h6">Informations de l'exploitation agricole</h2>
                        <p className="af-card-description">
                            Ces informations qualifient votre exploitation auprès des acheteurs de la plateforme.
                        </p>
                    </div>
                </div>

                <Row className="g-3">
                    <Col md={12}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="farmer-farm_name">
                                Nom de l'exploitation / Domaine agricole <span className="text-danger">*</span>
                            </label>
                            <input
                                id="farmer-farm_name"
                                name="farm_name"
                                type="text"
                                className="af-input"
                                placeholder="ex. Domaine Al Baraka, Coopérative Atlas Bio..."
                                value={farmerData.farm_name}
                                onChange={handleFarmerChange}
                                required
                            />
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="farmer-description">
                                Présentation de l'exploitation & savoir-faire
                            </label>
                            <textarea
                                id="farmer-description"
                                name="description"
                                rows={4}
                                className="af-textarea"
                                placeholder="Décrivez votre terroir, types de cultures (maraîchage, agrumes, arboriculture), certifications..."
                                value={farmerData.description}
                                onChange={handleFarmerChange}
                                maxLength={2000}
                            />
                            <div className="d-flex justify-content-between small text-muted">
                                <span>Partagez votre histoire et vos garanties de fraîcheur.</span>
                                <span>{farmerData.description.length}/2000 car.</span>
                            </div>
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="farmer-address">
                                Adresse / Localisation de l'exploitation <span className="text-danger">*</span>
                            </label>
                            <input
                                id="farmer-address"
                                name="address"
                                type="text"
                                className="af-input"
                                placeholder="ex. Route de Taroudant, Km 14, Commune d'Ouled Teïma"
                                value={farmerData.address}
                                onChange={handleFarmerChange}
                                required
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="farmer-city">
                                Ville / Commune <span className="text-danger">*</span>
                            </label>
                            <input
                                id="farmer-city"
                                name="city"
                                type="text"
                                className="af-input"
                                placeholder="ex. Taroudant, Agadir, Berkane..."
                                value={farmerData.city}
                                onChange={handleFarmerChange}
                                required
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="farmer-region">
                                Région agricole <span className="text-danger">*</span>
                            </label>
                            <select
                                id="farmer-region"
                                name="region"
                                className="af-select"
                                value={farmerData.region}
                                onChange={handleFarmerChange}
                                required
                            >
                                {MOROCCAN_REGIONS.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Col>
                </Row>
            </div>

            <div className="af-card mb-4">
                <div className="af-card-header">
                    <div>
                        <h2 className="af-card-title h6">Coordonnées de l'exploitant</h2>
                        <p className="af-card-description">
                            Informations de contact pour la logistique et le suivi des commandes.
                        </p>
                    </div>
                </div>

                <Row className="g-3">
                    <Col md={6}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="account-name">
                                Nom du gérant / exploitant
                            </label>
                            <input
                                id="account-name"
                                name="name"
                                type="text"
                                className="af-input"
                                value={accountData.name}
                                onChange={handleAccountChange}
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="account-phone">
                                Téléphone de contact direct
                            </label>
                            <input
                                id="account-phone"
                                name="phone"
                                type="tel"
                                className="af-input"
                                placeholder="06XXXXXXXX ou 07XXXXXXXX"
                                value={accountData.phone}
                                onChange={handleAccountChange}
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    Enregistrer les modifications
                </Button>
            </div>
        </form>
    );
}
