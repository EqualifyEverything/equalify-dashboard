import { useGlobalStore } from "#src/utils";
import { useEffect } from 'react';
import { Outlet, useLocation } from "react-router-dom";

export const Navigation = () => {
    const location = useLocation();
    const darkMode = useGlobalStore(state => state.darkMode);
    useEffect(() => darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'), [darkMode]);
    useEffect(() => window.scrollTo(0, 0), [location]);

    return (
        <div className={`bg-background text-text m-auto p-4 flex flex-col items-center justify-center`}>
            <Outlet />
        </div>
    )
}