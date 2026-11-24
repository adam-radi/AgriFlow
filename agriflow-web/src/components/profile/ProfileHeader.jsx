import VerificationStatusBadge from "../verification/VerificationStatusBadge";
import { Button } from "../common";

export default function ProfileHeader({
    user = {},
    roleLabel = "Utilisateur",
    verificationStatus = "not_submitted",
    isEditing = false,
    onToggleEdit,
}) {
    const initials = (user?.name || "AgriFlow")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="af-card mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div className="d-flex align-items-center gap-3">
                    {/* Avatar Initials */}
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                        style={{
                            width: "64px",
                            height: "64px",
                            backgroundColor: "var(--af-green-900, #194638)",
                            fontSize: "1.4rem",
                            boxShadow: "var(--af-shadow-sm, 0 2px 8px rgb(25 45 34 / 6%))",
                        }}
                    >
                        {initials}
                    </div>

                    <div>
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <h1 className="h5 fw-bold m-0" style={{ color: "var(--af-ink-950, #1d2924)" }}>
                                {user?.name || "Profil Utilisateur"}
                            </h1>
                            <span
                                className="badge rounded-pill"
                                style={{
                                    backgroundColor: "var(--af-green-100, #e8f2ec)",
                                    color: "var(--af-green-800, #215b46)",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                }}
                            >
                                {roleLabel}
                            </span>
                            <VerificationStatusBadge status={verificationStatus} />
                        </div>

                        <div className="d-flex align-items-center gap-3 flex-wrap small text-muted">
                            {user?.email && <span>✉ {user.email}</span>}
                            {user?.phone && <span>📞 {user.phone}</span>}
                            {user?.zone && <span>📍 {user.zone}</span>}
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant={isEditing ? "secondary" : "primary"}
                        size="sm"
                        onClick={onToggleEdit}
                    >
                        {isEditing ? "Annuler les modifications" : "✎ Modifier le profil"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
