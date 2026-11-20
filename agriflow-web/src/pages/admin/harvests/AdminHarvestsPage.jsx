import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Alert } from "react-bootstrap";
import { fetchAdminHarvests, setFilters } from "../../../features/harvests/harvestSlice";
import {
    selectAdminHarvests,
    selectHarvestLoading,
    selectHarvestError,
    selectHarvestFilters,
} from "../../../features/harvests/harvestSelectors";
import HarvestTable from "../../../components/harvests/HarvestTable";

export default function AdminHarvestsPage() {
    const dispatch = useDispatch();
    const harvests = useSelector(selectAdminHarvests);
    const loading = useSelector(selectHarvestLoading);
    const error = useSelector(selectHarvestError);
    const filters = useSelector(selectHarvestFilters);

    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    useEffect(() => {
        dispatch(fetchAdminHarvests({ search, status }));
    }, [dispatch, search, status]);

    function handleSearch(val) {
        setSearch(val);
        dispatch(setFilters({ search: val }));
    }

    function handleStatusFilter(val) {
        setStatus(val);
        dispatch(setFilters({ status: val }));
    }

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Harvest Monitoring</h1>
                <p className="text-muted mb-0">Read-only overview of all harvests across the platform</p>
            </div>

            {error && <Alert variant="danger">{typeof error === "string" ? error : "Failed to load harvests"}</Alert>}

            {loading && harvests.length === 0 ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="text-muted mt-2">Loading harvests…</p>
                </div>
            ) : (
                <HarvestTable
                    harvests={harvests}
                    onSearch={handleSearch}
                    searchValue={search}
                    onFilterStatus={handleStatusFilter}
                    statusValue={status}
                />
            )}
        </div>
    );
}
