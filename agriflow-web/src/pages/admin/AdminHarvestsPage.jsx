import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHarvests } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminHarvests,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import AdminHarvestOverviewTable from "../../components/admin/AdminHarvestOverviewTable";

export default function AdminHarvestsPage() {
    const dispatch = useDispatch();
    const harvests = useSelector(selectAdminHarvests);
    const loading = useSelector(selectAdminLoading);

    useEffect(() => {
        dispatch(fetchHarvests());
    }, [dispatch]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Harvests</h1>
                <p className="text-muted mb-0">Monitor all harvest records</p>
            </div>
            <AdminHarvestOverviewTable harvests={harvests} loading={loading} />
        </div>
    );
}
