import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
    selectVerificationStatus,
    selectIsVerified,
    selectIsPending,
    selectIsRejected,
    selectIsNotSubmitted,
    selectCanPublish,
} from "./verificationSelectors";
import VerificationRequiredModal from "../../components/verification/VerificationRequiredModal";

/**
 * useVerificationAccess
 *
 * Hook réutilisable pour contrôler et sécuriser l'accès aux fonctionnalités
 * sensibles (ex: création de produit, publication de récolte, commande B2B).
 *
 * Permet de :
 * 1. Obtenir les booléens d'état (isVerified, isPending, etc.)
 * 2. Bloquer une action utilisateur avec checkAccess(callback, "nom de la fonction")
 * 3. Afficher automatiquement la modale explicative
 */
export function useVerificationAccess({ accountType = "farmer" } = {}) {
    const status = useSelector(selectVerificationStatus);
    const isVerified = useSelector(selectIsVerified);
    const isPending = useSelector(selectIsPending);
    const isRejected = useSelector(selectIsRejected);
    const isNotSubmitted = useSelector(selectIsNotSubmitted);
    const canPublish = useSelector(selectCanPublish);

    const [modalOpen, setModalOpen] = useState(false);
    const [featureName, setFeatureName] = useState("la publication");

    const checkAccess = useCallback(
        (actionFn, requiredFeature = "la publication") => {
            if (canPublish) {
                if (typeof actionFn === "function") {
                    actionFn();
                }
                return true;
            }
            setFeatureName(requiredFeature);
            setModalOpen(true);
            return false;
        },
        [canPublish]
    );

    const openModal = useCallback((requiredFeature = "la publication") => {
        setFeatureName(requiredFeature);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    const VerificationModal = (
        <VerificationRequiredModal
            show={modalOpen}
            onHide={closeModal}
            status={status}
            accountType={accountType}
            featureName={featureName}
        />
    );

    return {
        status,
        isVerified,
        isPending,
        isRejected,
        isNotSubmitted,
        canPublish,
        checkAccess,
        openModal,
        closeModal,
        modalOpen,
        VerificationModal,
    };
}

export default useVerificationAccess;
