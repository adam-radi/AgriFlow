import { useState } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { Button } from "../common";

const BUSINESS_TYPES = [
    "Épicerie fine / Alimentation générale",
    "Primeur & Fruits / Légumes",
    "Restaurant & Traiteur",
    "Grossiste / Semi-grossiste",
    "Supermarché / Supérette",
    "Hôtellerie & Restauration collective",
    "Autre commerce alimentaire",
];

const MOROCCAN_REGIONS = [
    "Casablanca-Settat",
    "Rabat-Salé-Kénitra",
    "Marrakech-Safi",
    "Fès-Meknès",
    "Tanger-Tétouan-Al Hoceïma",
    "Souss-Massa",
    "L'Oriental",
    "Béni Mellal-Khénifra",
    "Drâa-Tafilalet",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab",
];

export default function BuyerProfileForm({
    initialBuyer = {},
    initialAccount = {},
    isLoading = false,
    onSave,
}) {
    const [buyerData, setBuyerData] = useState({
        business_name: initialBuyer?.business_name || "",
        business_type: initialBuyer?.business_type || BUSINESS_TYPES[0],
        ice: initialBuyer?.ice || "",
        address: initialBuyer?.address || "",
        city: initialBuyer?.city || "",
        region: initialBuyer?.region || "Casablanca-Settat",
    });

    const [accountData, setAccountData] = useState({
        name: initialAccount?.name || "",
        phone: initialAccount?.phone || "",
    });

    const [validationError, setValidationError] = useState("");

    const handleBuyerChange = (e) => {
        setBuyerData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setValidationError("");
    };

    const handleAccountChange = (e) => {
        setAccountData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setValidationError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validations frontend alignées sur le backend
        if (!buyerData.business_name.trim()) {
            setValidationError("Le nom de l'entreprise est obligatoire.");
            return;
        }
        if (!buyerData.business_type.trim()) {
            setValidationError("Le type d'activité est obligatoire.");
            return;
        }
        if (!buyerData.address.trim()) {
            setValidationError("L'adresse de l'établissement est obligatoire.");
            return;
        }
        if (!buyerData.city.trim()) {
            setValidationError("La ville est obligatoire.");
            return;
        }
        if (!buyerData.region.trim()) {
            setValidationError("La région est obligatoire.");
            return;
        }
        if (buyerData.ice && buyerData.ice.trim().length > 30) {
            setValidationError("L'ICE ne peut pas dépasser 30 caractères.");
            return;
        }

        onSave({ buyerData, accountData });
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
                        <h2 className="af-card-title h6">Informations de l'établissement professionnel</h2>
                        <p className="af-card-description">
                            Données commerciales requises pour la facturation et les livraisons en lots.
                        </p>
                    </div>
                </div>

                <Row className="g-3">
                    <Col md={7}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="buyer-business_name">
                                Nom commercial / Raison sociale <span className="text-danger">*</span>
                            </label>
                            <input
                                id="buyer-business_name"
                                name="business_name"
                                type="text"
                                className="af-input"
                                placeholder="ex. Primeur Atlas SARL, Épicerie Centrale..."
                                value={buyerData.business_name}
                                onChange={handleBuyerChange}
                                required
                            />
                        </div>
                    </Col>

                    <Col md={5}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="buyer-ice">
                                Numéro ICE (Identifiant Entreprise)
                            </label>
                            <input
                                id="buyer-ice"
                                name="ice"
                                type="text"
                                className="af-input"
                                placeholder="15 chiffres (ex. 001234567000089)"
                                value={buyerData.ice}
                                onChange={handleBuyerChange}
                                maxLength={30}
                            />
                            <span className="small text-muted">Facilite la facturation inter-entreprises.</span>
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="buyer-business_type">
                                Type d'activité professionnelle <span className="text-danger">*</span>
                            </label>
                            <select
                                id="buyer-business_type"
                                name="business_type"
                                className="af-select"
                                value={buyerData.business_type}
                                onChange={handleBuyerChange}
                                required
                            >
                                {BUSINESS_TYPES.map((bt) => (
                                    <option key={bt} value={bt}>
                                        {bt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="buyer-address">
                                Adresse de livraison / Magasin <span className="text-danger">*</span>
                            </label>
                            <input
                                id="buyer-address"
                                name="address"
                                type="text"
                                className="af-input"
                                placeholder="ex. 42 Boulevard d'Anfa, Quartier Gauthier"
                                value={buyerData.address}
                                onChange={handleBuyerChange}
                                required
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="buyer-city">
                                Ville <span className="text-danger">*</span>
                            </label>
                            <input
                                id="buyer-city"
                                name="city"
                                type="text"
                                className="af-input"
                                placeholder="ex. Casablanca, Rabat, Marrakech..."
                                value={buyerData.city}
                                onChange={handleBuyerChange}
                                required
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="buyer-region">
                                Région <span className="text-danger">*</span>
                            </label>
                            <select
                                id="buyer-region"
                                name="region"
                                className="af-select"
                                value={buyerData.region}
                                onChange={handleBuyerChange}
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
                        <h2 className="af-card-title h6">Responsable des achats & contact</h2>
                        <p className="af-card-description">
                            Personne de contact pour la réception des livraisons groupées.
                        </p>
                    </div>
                </div>

                <Row className="g-3">
                    <Col md={6}>
                        <div className="af-field">
                            <label className="af-label" htmlFor="buyer-contact-name">
                                Nom et prénom du responsable
                            </label>
                            <input
                                id="buyer-contact-name"
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
                            <label className="af-label" htmlFor="buyer-contact-phone">
                                Téléphone professionnel
                            </label>
                            <input
                                id="buyer-contact-phone"
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
