import {Outlet} from "react-router-dom";

function FarmerLayout(){
    return (
        <div className="container-fluid">
            <Outlet />
        </div>
    )
}

export default FarmerLayout;