import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";

/**
 * Logo réutilisable officiel AgriFlow.
 * Visible, proportionné et cliquable vers la page d'accueil (Desktop et Mobile).
 *
 * @param {number|string} height    - Hauteur du logo (défaut: 40px)
 * @param {number|string} width     - Largeur du logo (auto par défaut)
 * @param {string}        alt       - Texte alternatif (défaut: "AgriFlow - Marketplace agricole")
 * @param {string}        className - Classes CSS additionnelles
 * @param {boolean}       round     - Si true, applique un arrondi circulaire
 * @param {string|false}  to        - Destination du lien (défaut: "/", ou false pour désactiver le lien)
 * @param {object}        style     - Styles en ligne additionnels
 */
export default function Logo({
    height = 40,
    width,
    alt = "AgriFlow - Marketplace agricole",
    className = "",
    round = false,
    to = "/",
    style = {},
}) {
    const imgStyle = {
        height: typeof height === "number" ? `${height}px` : height,
        width: width ? (typeof width === "number" ? `${width}px` : width) : "auto",
        display: "block",
        objectFit: "contain",
        borderRadius: round ? "50%" : "0",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        ...style,
    };

    const imageElement = (
        <img
            src={logoImg}
            alt={alt}
            style={imgStyle}
            className={`af-logo-img ${className}`.trim()}
        />
    );

    if (to) {
        return (
            <Link
                to={to}
                className="af-logo-link d-inline-flex align-items-center text-decoration-none"
                style={{ lineHeight: 0 }}
                aria-label="Retour à l'accueil AgriFlow"
            >
                {imageElement}
            </Link>
        );
    }

    return imageElement;
}
