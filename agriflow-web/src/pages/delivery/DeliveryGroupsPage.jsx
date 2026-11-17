import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeliveryGroups, setFilters } from "../../features/delivery/deliverySlice";
import {
    selectAllDeliveryGroups,
    selectDeliveryLoading,
    selectDeliveryFilters,
} from "../../features/delivery/deliverySelectors";
import DeliveryGroupList from "../../components/delivery/DeliveryGroupList";

export default function DeliveryGroupsPage() {
    const dispatch = useDispatch();
    const groups = useSelector(selectAllDeliveryGroups);
    const loading = useSelector(selectDeliveryLoading);
    const filters = useSelector(selectDeliveryFilters);

    const [search, setSearch] = useState(filters.zone || "");
    const [status, setStatus] = useState(filters.status || "");

    useEffect(() => {
        dispatch(fetchDeliveryGroups({ zone: search, status }));
    }, [dispatch, search, status]);

    function handleSearch(val) {
        setSearch(val);
        dispatch(setFilters({ zone: val }));
    }

    function handleStatusFilter(val) {
        setStatus(val);
        dispatch(setFilters({ status: val }));
    }

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Delivery Groups</h1>
                <p className="text-muted mb-0">All delivery groups across zones</p>
            </div>

            <DeliveryGroupList
                groups={groups}
                loading={loading}
                linkPrefix="/delivery/groups"
                onSearch={handleSearch}
                searchValue={search}
                onFilterStatus={handleStatusFilter}
                statusValue={status}
            />
        </div>
    );
}
