import {Outlet} from "react-router-dom";

function AdminLayout(){
    return (
        <div className="container-fluid">
            <Outlet />
        </div>
    );
}

export default AdminLayout ;