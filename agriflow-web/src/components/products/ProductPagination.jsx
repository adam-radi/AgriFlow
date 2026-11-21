import { Button } from "../common";

/**
 * ProductPagination — Contrôleur de pagination accessible et réactif
 * S'appuie sur le Design System AgriFlow (boutons et jetons de couleur).
 */
export default function ProductPagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
}) {
    if (!totalPages || totalPages <= 1) {
        return null;
    }

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav
            aria-label="Pagination du catalogue"
            className="d-flex justify-content-center align-items-center gap-2 mt-5 flex-wrap"
        >
            <Button
                variant="outline"
                size="sm"
                pill
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                id="catalog-pagination-prev"
                style={{ minWidth: "110px" }}
            >
                ← Précédent
            </Button>

            <div className="d-flex align-items-center gap-1">
                {pageNumbers.map((page) => {
                    const isActive = page === currentPage;
                    return (
                        <button
                            key={page}
                            type="button"
                            id={`catalog-page-${page}`}
                            onClick={() => onPageChange(page)}
                            className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center fw-bold transition-all"
                            style={{
                                width: "38px",
                                height: "38px",
                                backgroundColor: isActive ? "var(--af-green-900, #194638)" : "transparent",
                                color: isActive ? "#FFFFFF" : "var(--af-ink-700, #3F4D45)",
                                border: isActive ? "none" : "1px solid var(--af-border, #E2E9E3)",
                                fontSize: "0.88rem",
                            }}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <Button
                variant="outline"
                size="sm"
                pill
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                id="catalog-pagination-next"
                style={{ minWidth: "110px" }}
            >
                Suivant →
            </Button>
        </nav>
    );
}

