import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFarmers, validateFarmer, rejectFarmer, suspendUser } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminFarmers,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import AdminFarmerValidationTable from "../../components/admin/AdminFarmerValidationTable";

export default function AdminFarmersPage() {
    const dispatch = useDispatch();
    const farmers = useSelector(selectAdminFarmers);
    const loading = useSelector(selectAdminLoading);

    useEffect(() => {
        dispatch(fetchFarmers());
    }, [dispatch]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Farmers</h1>
                <p className="text-muted mb-0">Validate, reject, or suspend farmer accounts</p>
            </div>
            <AdminFarmerValidationTable
                farmers={farmers}
                loading={loading}
                onValidate={(id) => dispatch(validateFarmer(id))}
                onReject={(id) => dispatch(rejectFarmer(id))}
                onSuspend={(id) => dispatch(suspendUser(id))}
            />
        </div>
    );
}
