import logoImg from "../../assets/logo.png";

/**
 * Logo réutilisable pour tout le site AgriFlow.
 * Utilise l'image src/assets/logo.png (traitée par Vite).
 *
 * @param {number}   height  - Hauteur du logo (défaut 40px)
 * @param {number}   width   - Largeur du logo (auto si non précisé)
 * @param {string}   alt     - Texte alternatif
 * @param {string}   className - Classe CSS additionnelle
 * @param {boolean}  round   - Si true, applique un border-radius circulaire
 */
export default function Logo({
    height = 40,
    width,
    alt = "AgriFlow",
    className = "",
    round = false,
}) {
    const imgStyle = {
        height,
        width: width || "auto",
        display: "block",
        borderRadius: round ? "50%" : "0",
    };

    return (
        <img
            src={logoImg}
            alt={alt}
            style={imgStyle}
            className={className}
        />
    );
}
