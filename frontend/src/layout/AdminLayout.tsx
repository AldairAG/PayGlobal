import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
    return (
        <div>
            <h1>Admin Layout</h1>

            <div>
                <Outlet/>
            </div>
        </div>
    );
}