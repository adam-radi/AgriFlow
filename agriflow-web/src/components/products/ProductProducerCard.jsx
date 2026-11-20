import { Card, Badge, Button } from "../common";

/**
 * ProductProducerCard — Fiche producteur sobre, factuelle et sans verbiage inutile
 * Met en valeur l'identité de l'agriculteur et les actions de contact direct.
 */
export default function ProductProducerCard({ farmer, onOpenInquiry }) {
    if (!farmer) return null;

    const isApproved = farmer.farmer_status === "approved";
    const farmerName = farmer.name || "Exploitation partenaire";
    const farmerZone = farmer.zone || "Maroc";
    const farmerPhone = farmer.phone || null;

    const initials = farmerName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    const cleanPhone = farmerPhone ? farmerPhone.replace(/[^0-9]/g, "") : null;
    const whatsappLink = cleanPhone
        ? `https://wa.me/${cleanPhone.startsWith("0") ? "212" + cleanPhone.slice(1) : cleanPhone}`
        : null;

    return (
        <Card
            className="p-4 rounded-4"
            style={{
                backgroundColor: "var(--af-surface, #FFFFFF)",
                border: "1px solid var(--af-border, #E2E9E3)",
            }}
        >
            <div className="d-flex align-items-center gap-3 mb-3">
                <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 fw-bold"
                    style={{
                        width: "52px",
                        height: "52px",
                        backgroundColor: "var(--af-green-100, #E8F2EC)",
                        color: "var(--af-green-900, #194638)",
                        fontSize: "1.15rem",
                        border: "1px solid var(--af-green-300, #C4DFD1)",
                    }}
                >
                    {initials || "AG"}
                </div>

                <div className="flex-grow-1">
                    <h4
                        className="fw-bold m-0"
                        style={{
                            color: "var(--af-green-950, #15372F)",
                            fontSize: "1.05rem",
                        }}
                    >
                        {farmerName}
                    </h4>

                    <div className="d-flex align-items-center gap-2 mt-1">
                        {isApproved ? (
                            <Badge variant="green" size="sm">
                                Exploitant certifié ✓
                            </Badge>
                        ) : (
                            <Badge variant="neutral" size="sm">
                                Exploitant partenaire
                            </Badge>
                        )}
                        <span className="small text-muted">· {farmerZone}</span>
                    </div>
                </div>
            </div>

            {/* Actions de mise en relation directe — simples et directes */}
            <div className="d-flex flex-column gap-2 pt-2 border-top" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    pill
                    onClick={onOpenInquiry}
                    className="w-100"
                >
                    Demander une cotation directe →
                </Button>

                <div className="d-flex gap-2">
                    {farmerPhone && (
                        <Button
                            as="a"
                            href={`tel:${farmerPhone}`}
                            variant="secondary"
                            size="sm"
                            pill
                            className="text-decoration-none flex-grow-1 text-center"
                        >
                            Appeler
                        </Button>
                    )}

                    {whatsappLink && (
                        <Button
                            as="a"
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline"
                            size="sm"
                            pill
                            className="text-decoration-none flex-grow-1 text-center"
                        >
                            WhatsApp 💬
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
