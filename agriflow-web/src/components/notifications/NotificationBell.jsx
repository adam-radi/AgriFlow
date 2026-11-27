import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge, Spinner } from "react-bootstrap";
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../../features/notifications/notificationSlice";
import {
    selectNotifications,
    selectUnreadCount,
    selectNotificationLoading,
} from "../../features/notifications/notificationSelectors";

function formatRelativeTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return "Hier";
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function NotificationBell() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notifications = useSelector(selectNotifications);
    const unreadCount = useSelector(selectUnreadCount);
    const loading = useSelector(selectNotificationLoading);

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Initial fetch & polling every 30s
    useEffect(() => {
        dispatch(fetchNotifications());
        const interval = setInterval(() => {
            dispatch(fetchNotifications());
        }, 30000);
        return () => clearInterval(interval);
    }, [dispatch]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = async (notif) => {
        if (!notif.is_read) {
            dispatch(markNotificationAsRead(notif.id));
        }
        setIsOpen(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const handleMarkAllRead = (e) => {
        e.stopPropagation();
        dispatch(markAllNotificationsAsRead());
    };

    return (
        <div className="position-relative" ref={containerRef}>
            {/* Bell trigger button */}
            <button
                type="button"
                className="af-header-icon-btn position-relative"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} non lues)` : ""}`}
                aria-expanded={isOpen}
                title="Notifications"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {unreadCount > 0 && (
                    <span
                        className="position-absolute badge rounded-pill bg-danger d-flex align-items-center justify-content-center"
                        style={{
                            top: "-2px",
                            right: "-4px",
                            fontSize: "10px",
                            minWidth: "18px",
                            height: "18px",
                            padding: "0 4px",
                            border: "2px solid #ffffff",
                        }}
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div
                    className="position-absolute end-0 mt-2 bg-white rounded-4 shadow-lg border-0 overflow-hidden"
                    style={{
                        width: "360px",
                        maxWidth: "90vw",
                        zIndex: 1060,
                        border: "1px solid var(--af-gray-200, #e9ecef)",
                        animation: "fadeIn 0.15s ease",
                    }}
                >
                    {/* Header */}
                    <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-2">
                            <strong style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.95rem" }}>
                                Notifications
                            </strong>
                            {unreadCount > 0 && (
                                <Badge bg="success" pill style={{ fontSize: "11px" }}>
                                    {unreadCount}
                                </Badge>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{ fontSize: "12px", color: "var(--af-green-700, #398565)" }}
                            >
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    {/* Content list */}
                    <div
                        style={{
                            maxHeight: "380px",
                            overflowY: "auto",
                        }}
                    >
                        {loading && notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted small">
                                <Spinner animation="border" size="sm" variant="success" className="me-2" />
                                Chargement...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center">
                                <span className="d-block fs-3 mb-2">🔔</span>
                                <p className="mb-0 text-muted small">Aucune notification pour le moment.</p>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush">
                                {notifications.map((notif) => {
                                    const isUnread = !notif.is_read;
                                    return (
                                        <button
                                            key={notif.id}
                                            type="button"
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`list-group-item list-group-item-action p-3 border-bottom text-start d-flex gap-3 align-items-start transition-all ${
                                                isUnread ? "bg-light" : "bg-white"
                                            }`}
                                            style={{
                                                backgroundColor: isUnread ? "var(--af-green-50, #F4F8F5)" : "#ffffff",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {/* Type icon indicator */}
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: "36px",
                                                    height: "36px",
                                                    fontSize: "14px",
                                                    backgroundColor:
                                                        notif.type === "inquiry_accepted" || notif.type === "inquiry_confirmed"
                                                            ? "var(--af-green-100, #E8F2EC)"
                                                            : notif.type === "inquiry_rejected"
                                                            ? "#fee2e2"
                                                            : "var(--af-gray-100, #f1f5f9)",
                                                    color:
                                                        notif.type === "inquiry_accepted" || notif.type === "inquiry_confirmed"
                                                            ? "var(--af-green-800, #194638)"
                                                            : notif.type === "inquiry_rejected"
                                                            ? "#dc2626"
                                                            : "var(--af-green-900, #15372F)",
                                                }}
                                            >
                                                {notif.type === "inquiry_accepted"
                                                    ? "✓"
                                                    : notif.type === "inquiry_confirmed"
                                                    ? "🚀"
                                                    : notif.type === "inquiry_rejected"
                                                    ? "✕"
                                                    : "📋"}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow-1 min-w-0">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span
                                                        className={`small mb-0 text-truncate ${isUnread ? "fw-bold text-dark" : "text-muted"}`}
                                                        style={{ maxWidth: "190px" }}
                                                    >
                                                        {notif.title}
                                                    </span>
                                                    <span className="text-muted" style={{ fontSize: "11px" }}>
                                                        {formatRelativeTime(notif.created_at)}
                                                    </span>
                                                </div>
                                                <p
                                                    className="small text-muted mb-0 line-clamp-2"
                                                    style={{
                                                        fontSize: "12px",
                                                        lineHeight: "1.35",
                                                        overflow: "hidden",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                    }}
                                                >
                                                    {notif.message}
                                                </p>
                                            </div>

                                            {/* Unread dot */}
                                            {isUnread && (
                                                <span
                                                    className="rounded-circle mt-1 flex-shrink-0"
                                                    style={{
                                                        width: "7px",
                                                        height: "7px",
                                                        backgroundColor: "var(--af-green-600, #398565)",
                                                    }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
