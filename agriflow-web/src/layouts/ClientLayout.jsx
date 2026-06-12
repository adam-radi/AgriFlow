import {Outlet} from "react-router-dom";

function ClientLayout(){
    return(
        <div  className='container-fluid'>
            <Outlet />
        </div>
    );
}
export default ClientLayout ;
