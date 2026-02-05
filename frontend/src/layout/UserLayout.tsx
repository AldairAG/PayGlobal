import { Outlet } from "react-router-dom";

export const UserLayout = () => {
    return (
        <div>
            <h1>User Layout</h1>
            <div>
                <Outlet/>
            </div>
        </div>
    );
}