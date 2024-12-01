import SignIn from "./components/auth/login/signIn";
import Dashboard from "./pages/Dashboard/dashboard";
import Inventory from "./pages/Inventory/inventory";
import SalesHistory from "./pages/Sales History/salesHistory";
import PurchaseHistory from "./pages/Purchase History/purchaseHistory";
import Attendance from "./pages/Attendance/attendance";
import Analytics from "./pages/Analytics/analytics";
import NewCustomer from "./pages/New Customer/newCustomer";
import { AuthProvider } from "./context/authContext";
import { useRoutes } from "react-router-dom";
import MainLayout from "./components/mainLayout/mainLayout";
import ProtectedRoute from "./components/auth/login/protectedRoute";
import Settings from "./pages/Settings/settings";

function App() {
  const routesArray = [
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "inventory", element: <Inventory /> },
        { path: "sales-history", element: <SalesHistory /> },
        { path: "purchase-history", element: <PurchaseHistory /> },
        { path: "attendance", element: <Attendance /> },
        { path: "analytics", element: <Analytics /> },
        { path: "new-customer", element: <NewCustomer /> },
        { path: "settings", element: <Settings /> },
      ],
    },
    {
      path: "*",
      element: <SignIn />,
    },
  ];

  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <div>{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
