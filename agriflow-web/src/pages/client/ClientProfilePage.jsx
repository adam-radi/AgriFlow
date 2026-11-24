import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Spinner, Row, Col } from "react-bootstrap";

import {
    fetchProfile,
    saveBuyerProfile,
    saveAccountInfo,
    changePassword,
    clearProfileError,
    clearProfileSuccess,
} from "../../features/profile/profileSlice";
import {
    selectProfile,
    selectAccount,
    selectBuyerProfile,
    selectProfileLoading,
    selectProfileSaving,
    selectProfileError,
    selectProfileSuccess,
    selectBuyerProfileCompletion,
} from "../../features/profile/profileSelectors";
import { fetchActiveVerification } from "../../features/verification/verificationSlice";
import {
    selectActiveVerification,
    selectVerificationStatus,
} from "../../features/verification/verificationSelectors";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileCompletionBar from "../../components/profile/ProfileCompletionBar";
import BuyerProfileForm from "../../components/profile/BuyerProfileForm";
import ProfileSecurityForm from "../../components/profile/ProfileSecurityForm";
import VerificationStatusCard from "../../components/verification/VerificationStatusCard";

export default function ClientProfilePage() {
    const dispatch = useDispatch();

    const authUser = useSelector((state) => state.auth?.user);
    const profile = useSelector(selectProfile);
    const account = useSelector(selectAccount) || authUser;
    const buyer = useSelector(selectBuyerProfile);
    const loading = useSelector(selectProfileLoading);
    const saving = useSelector(selectProfileSaving);
    const error = useSelector(selectProfileError);
    const success = useSelector(selectProfileSuccess);
    const completion = useSelector(selectBuyerProfileCompletion);

    const activeVerification = useSelector(selectActiveVerification);
    const verificationStatus = useSelector(selectVerificationStatus);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchActiveVerification());
    }, [dispatch]);

    const handleSaveProfile = async ({ buyerData, accountData }) => {
        dispatch(clearProfileError());
        dispatch(clearProfileSuccess());

        const resProfile = await dispatch(saveBuyerProfile(buyerData));
        let resAccount = { type: "success" };

        if (accountData.name || accountData.phone) {
            resAccount = await dispatch(saveAccountInfo(accountData));
        }

        if (resProfile.type.endsWith("/fulfilled") && (!resAccount.type || resAccount.type.endsWith("/fulfilled"))) {
            setIsEditing(false);
            dispatch(fetchProfile());
        }
    };

    const handleChangePassword = (pwdData) => {
        dispatch(clearProfileError());
        dispatch(clearProfileSuccess());
        dispatch(changePassword(pwdData));
    };

    if (loading && !profile?.professional_buyer_profile && !buyer) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-muted small">Chargement de votre profil professionnel...</p>
            </div>
        );
    }

    return (
        <div className="p-3 p-md-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header Profil */}
            <ProfileHeader
                user={account || authUser}
                roleLabel="Acheteur Professionnel"
                verificationStatus={verificationStatus}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
            />

            {/* Notifications */}
            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => dispatch(clearProfileError())}
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    variant="success"
                    dismissible
                    onClose={() => dispatch(clearProfileSuccess())}
                    className="mb-4"
                >
                    {success}
                </Alert>
            )}

            {/* Statut de vérification professionnelle */}
            <VerificationStatusCard
                status={verificationStatus}
                activeRequest={activeVerification}
                accountType="buyer"
            />

            {/* Barre de complétion */}
            <ProfileCompletionBar completion={completion} />

            {/* Contenu : Formulaire d'édition ou Vue consultation */}
            {isEditing ? (
                <div>
                    <BuyerProfileForm
                        initialBuyer={buyer || {}}
                        initialAccount={account || authUser || {}}
                        isLoading={saving}
                        onSave={handleSaveProfile}
                    />
                </div>
            ) : (
                <Row className="g-4">
                    {/* Colonne gauche : Établissement commercial */}
                    <Col lg={7}>
                        <div className="af-card h-100">
                            <div className="af-card-header">
                                <div>
                                    <h2 className="af-card-title h6">Informations de l'établissement</h2>
                                    <p className="af-card-description">
                                        Renseignements légaux pour la facturation et les livraisons par palettes/lots.
                                    </p>
                                </div>
                            </div>

                            <div className="af-stack gap-3">
                                <div>
                                    <span className="small text-muted d-block">Nom de l'entreprise / Enseigne</span>
                                    <strong className="fs-6" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                        {buyer?.business_name || "Non renseigné"}
                                    </strong>
                                </div>

                                <div className="d-flex gap-4 flex-wrap">
                                    <div>
                                        <span className="small text-muted d-block">Activité</span>
                                        <span className="badge bg-light text-dark border">
                                            {buyer?.business_type || "Commerce alimentaire"}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="small text-muted d-block">Numéro ICE</span>
                                        <span className="fw-mono text-dark">
                                            {buyer?.ice || "Non renseigné"}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 border-top">
                                    <span className="small text-muted d-block">Adresse de livraison & Dépôt</span>
                                    <div className="d-flex align-items-center gap-1 small mt-1">
                                        <span>🏢</span>
                                        <span className="fw-medium">
                                            {buyer?.address ? `${buyer.address}, ` : ""}
                                            {buyer?.city || "Ville non précisée"}
                                            {buyer?.region ? ` (${buyer.region})` : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Colonne droite : Contact & Sécurité */}
                    <Col lg={5}>
                        <div className="af-card mb-4">
                            <div className="af-card-header">
                                <div>
                                    <h2 className="af-card-title h6">Responsable des commandes</h2>
                                    <p className="af-card-description">Coordonnées directes pour le suivi des livraisons.</p>
                                </div>
                            </div>

                            <div className="af-stack gap-3 small">
                                <div>
                                    <span className="text-muted d-block">Nom du responsable</span>
                                    <strong style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                        {account?.name || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span className="text-muted d-block">Adresse e-mail</span>
                                    <span style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                        {account?.email || "—"}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-muted d-block">Téléphone professionnel</span>
                                    <span style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                        {account?.phone || "Non renseigné"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sécurité */}
                        <ProfileSecurityForm
                            isLoading={saving}
                            onSavePassword={handleChangePassword}
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
}
