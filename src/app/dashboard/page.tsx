"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardUser from "../components/dashboard-user";
import DashboardAdmin from "../components/dashboard-admin";

export default function DashboardPage(){
    const router = useRouter();
    // const [userRole, setUserRole] = useState<string | null>(null);

    // useEffect(()=>{
    //     const role = localStorage.getItem("userRole");
    //     if(!role) {
    //         router.push("/login");
    //     }else{
    //         setUserRole(role);
    //     }
    // });

    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        router.push("/login");
    };

    const renderDashboard = () => {
        // if( userRole?.toLowerCase() === "user"){
            // return <DashboardUser />;
        // } else if (userRole === "admin"){
            return <DashboardAdmin />;
        // } 
    };

    return (
        <div>
            <header>
                <h1>Bem-Vindo</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main>
                {renderDashboard()}
            </main>
        </div>
    );
}