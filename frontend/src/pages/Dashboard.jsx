import CustomerDashboard from "./dashboards/CustomerDashboard";
import SalesDashboard from "./dashboards/SalesDashboard";
import OperationsDashboard from "./dashboards/OperationsDashboard";
import ManagerDashboard from "./dashboards/ManagerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

export default function Dashboard() {

    const ROLE_MAP = {

        ops: "OPERATIONS",

        sales: "SALES",

        customer: "CUSTOMER",

        manager: "MANAGER",

        admin: "ADMIN"

    };

    const role =
    ROLE_MAP[
        (localStorage.getItem("userRole") || "").toLowerCase()
    ] || "";

    switch(role){

        case "CUSTOMER":
        case "CUSTOMER_SERVICE":
            return <CustomerDashboard />;

        case "SALES":
            return <SalesDashboard />;

        case "OPERATIONS":
            return <OperationsDashboard />;

        case "MANAGER":
            return <ManagerDashboard />;

        default:
            return <AdminDashboard />;
    }
}