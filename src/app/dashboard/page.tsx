"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardUser from "../components/dashboard-user";
import DashboardAdmin from "../components/dashboard-admin";

export default function DashboardPage(){
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token) {
            router.push("/login");
            return;
        }

        // Decode JWT to get role
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserRole(payload.role);
        } catch (error) {
            console.error("Invalid token:", error);
            router.push("/login");
        }
    }, [router]);

    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/login");
    };

    const renderDashboard = () => {
        if( userRole?.toUpperCase() === "USER"){
            return <DashboardUser />;
        } else if (userRole?.toUpperCase() === "ADMIN"){
            return <DashboardAdmin />;
        } else {
            return <div>Carregando...</div>;
        }
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