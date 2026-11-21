import { Row, Col } from "react-bootstrap";
import { Card } from "../common";

/**
 * ProductSpecsTable — Fiche technique moderne, épurée et visuelle
 * Présente les caractéristiques sous forme de mini-cartes synthétiques
 * pour éviter les longs blocs de texte et rendre l'information immédiatement lisible.
 */
export default function ProductSpecsTable({ product }) {
    if (!product) return null;

    const firstHarvest = product.harvests?.[0] || null;
    const specs = [];

    // 1. Variété / Catégorie
    const catName =
        (typeof product.category === "object" ? product.category?.name : product.category) ||
        product.variety;
    if (catName) {
        specs.push({ label: "Variété / Filière", value: catName });
    }

    // 2. Terroir / Origine
    if (product.farmer?.zone) {
        specs.push({ label: "Bassin de culture", value: product.farmer.zone });
    }

    // 3. Conditionnements
    if (product.quantities && product.quantities.length > 0) {
        const labels = product.quantities.map((q) => `${q.label} kg`).join(", ");
        specs.push({ label: "Conditionnement", value: `Packs ${labels}` });
    } else if (product.base_price != null) {
        specs.push({ label: "Conditionnement", value: "Vente au kg" });
    }

    // 4. Calendrier de récolte
    if (firstHarvest?.start_date) {
        const dateRange = firstHarvest.end_date
            ? `${firstHarvest.start_date} → ${firstHarvest.end_date}`
            : `Dès le ${firstHarvest.start_date}`;
        specs.push({ label: "Période de récolte", value: dateRange });
    }

    // 5. Volume estimé
    if (firstHarvest?.estimated_total_qte) {
        specs.push({
            label: "Volume disponible",
            value: `${Number(firstHarvest.estimated_total_qte).toLocaleString("fr-FR")} kg`,
        });
    }

    // 6. Prélèvement journalier
    if (firstHarvest?.max_daily_qte) {
        specs.push({
            label: "Capacité journalière",
            value: `${Number(firstHarvest.max_daily_qte).toLocaleString("fr-FR")} kg / jour`,
        });
    }

    // 7. Expédition
    specs.push({
        label: "Expédition",
        value: "Direct exploitation · 24-48h",
    });

    if (specs.length === 0) return null;

    return (
        <Card
            className="p-4 rounded-4"
            style={{
                backgroundColor: "var(--af-surface, #FFFFFF)",
                border: "1px solid var(--af-border, #E2E9E3)",
            }}
        >
            <h3
                className="fw-bold mb-3"
                style={{
                    color: "var(--af-green-950, #15372F)",
                    fontSize: "1.15rem",
                    letterSpacing: "-0.015em",
                }}
            >
                Caractéristiques du lot
            </h3>

            {/* Grille de fiches synthétiques — aérée, moderne et sans surcharge textuelle */}
            <Row className="g-3">
                {specs.map((item, idx) => (
                    <Col key={idx} xs={12} sm={6} md={4}>
                        <div
                            className="p-3 rounded-3 h-100"
                            style={{
                                backgroundColor: "var(--af-canvas, #F6F8F5)",
                                border: "1px solid var(--af-border, #E2E9E3)",
                            }}
                        >
                            <span
                                className="d-block text-uppercase fw-semibold"
                                style={{
                                    fontSize: "0.68rem",
                                    color: "var(--af-ink-600, #68756E)",
                                    letterSpacing: "0.05em",
                                    marginBottom: "4px",
                                }}
                            >
                                {item.label}
                            </span>
                            <span
                                className="fw-bold"
                                style={{
                                    color: "var(--af-green-950, #15372F)",
                                    fontSize: "0.92rem",
                                    lineHeight: 1.3,
                                }}
                            >
                                {item.value}
                            </span>
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>
    );
}
