import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Spinner, Row, Col } from "react-bootstrap";

import {
    fetchProfile,
    saveFarmerProfile,
    saveAccountInfo,
    changePassword,
    clearProfileError,
    clearProfileSuccess,
} from "../../features/profile/profileSlice";
import {
    selectProfile,
    selectAccount,
    selectFarmerProfile,
    selectProfileLoading,
    selectProfileSaving,
    selectProfileError,
    selectProfileSuccess,
    selectFarmerProfileCompletion,
} from "../../features/profile/profileSelectors";
import { fetchActiveVerification } from "../../features/verification/verificationSlice";
import {
    selectActiveVerification,
    selectVerificationStatus,
} from "../../features/verification/verificationSelectors";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileCompletionBar from "../../components/profile/ProfileCompletionBar";
import FarmerProfileForm from "../../components/profile/FarmerProfileForm";
import ProfileSecurityForm from "../../components/profile/ProfileSecurityForm";
import VerificationStatusCard from "../../components/verification/VerificationStatusCard";

export default function FarmerProfilePage() {
    const dispatch = useDispatch();

    const authUser = useSelector((state) => state.auth?.user);
    const profile = useSelector(selectProfile);
    const account = useSelector(selectAccount) || authUser;
    const farmer = useSelector(selectFarmerProfile);
    const loading = useSelector(selectProfileLoading);
    const saving = useSelector(selectProfileSaving);
    const error = useSelector(selectProfileError);
    const success = useSelector(selectProfileSuccess);
    const completion = useSelector(selectFarmerProfileCompletion);

    const activeVerification = useSelector(selectActiveVerification);
    const verificationStatus = useSelector(selectVerificationStatus);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchActiveVerification());
    }, [dispatch]);

    const handleSaveProfile = async ({ farmerData, accountData }) => {
        dispatch(clearProfileError());
        dispatch(clearProfileSuccess());

        const resProfile = await dispatch(saveFarmerProfile(farmerData));
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

    if (loading && !profile?.farmer_profile && !farmer) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-muted small">Chargement de votre profil exploitant...</p>
            </div>
        );
    }

    return (
        <div className="p-3 p-md-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header Profil */}
            <ProfileHeader
                user={account || authUser}
                roleLabel="Exploitant Agricole"
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

            {/* Carte de statut de vérification */}
            <VerificationStatusCard
                status={verificationStatus}
                activeRequest={activeVerification}
                accountType="farmer"
            />

            {/* Barre de complétion du profil */}
            <ProfileCompletionBar completion={completion} />

            {/* Contenu : Formulaire d'édition ou Vue consultation */}
            {isEditing ? (
                <div>
                    <FarmerProfileForm
                        initialFarmer={farmer || {}}
                        initialAccount={account || authUser || {}}
                        isLoading={saving}
                        onSave={handleSaveProfile}
                    />
                </div>
            ) : (
                <Row className="g-4">
                    {/* Colonne gauche : Exploitation agricole */}
                    <Col lg={7}>
                        <div className="af-card h-100">
                            <div className="af-card-header">
                                <div>
                                    <h2 className="af-card-title h6">Exploitation agricole</h2>
                                    <p className="af-card-description">
                                        Informations présentées sur la place de marché AgriFlow.
                                    </p>
                                </div>
                            </div>

                            <div className="af-stack gap-3">
                                <div>
                                    <span className="small text-muted d-block">Nom de l'exploitation</span>
                                    <strong className="fs-6" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                        {farmer?.farm_name || "Non renseigné"}
                                    </strong>
                                </div>

                                <div>
                                    <span className="small text-muted d-block">Description & savoir-faire</span>
                                    <p
                                        className="m-0 small"
                                        style={{
                                            color: farmer?.description
                                                ? "var(--af-ink-800, #34413a)"
                                                : "var(--af-ink-500, #7f8b84)",
                                            whiteSpace: "pre-line",
                                        }}
                                    >
                                        {farmer?.description || "Aucune présentation renseignée pour l'instant."}
                                    </p>
                                </div>

                                <div className="pt-2 border-top">
                                    <span className="small text-muted d-block">Localisation de l'exploitation</span>
                                    <div className="d-flex align-items-center gap-1 small mt-1">
                                        <span>📍</span>
                                        <span className="fw-medium">
                                            {farmer?.address ? `${farmer.address}, ` : ""}
                                            {farmer?.city || "Ville non précisée"}
                                            {farmer?.region ? ` (${farmer.region})` : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Colonne droite : Compte & Sécurité */}
                    <Col lg={5}>
                        <div className="af-card mb-4">
                            <div className="af-card-header">
                                <div>
                                    <h2 className="af-card-title h6">Informations personnelles</h2>
                                    <p className="af-card-description">Gestion du compte et contact logistique.</p>
                                </div>
                            </div>

                            <div className="af-stack gap-3 small">
                                <div>
                                    <span className="text-muted d-block">Nom complet</span>
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
                                    <span className="text-muted d-block">Téléphone</span>
                                    <span style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                        {account?.phone || "Non renseigné"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire de changement de mot de passe */}
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
