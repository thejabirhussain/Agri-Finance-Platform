import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import FinanceDashboard from './pages/finance/Dashboard';
import Transactions from './pages/finance/Transactions';
import Budgets from './pages/finance/Budgets';
import Reports from './pages/finance/Reports';
import Accounts from './pages/mdm/Accounts';
import Products from './pages/mdm/Products';
import Customers from './pages/mdm/Customers';
import DairyDashboard from './pages/dairy/Dashboard';
import CowManagement from './pages/dairy/CowManagement';
import MilkProduction from './pages/dairy/MilkProduction';
import AgricultureDashboard from './pages/agriculture/Dashboard';
import InventoryDashboard from './pages/inventory/Dashboard';
import AnalyticsOverview from './pages/analytics/Overview';
import Dashboard from './pages/Dashboard';

// Warehouse
import WarehouseDashboard from './pages/warehouse/Dashboard';
import LocationManager from './pages/warehouse/LocationManager';
import StockTransfer from './pages/warehouse/StockTransfer';

// Processing
import ProcessingDashboard from './pages/processing/Dashboard';
import RecipeManager from './pages/processing/RecipeManager';
import BatchManager from './pages/processing/BatchManager';

function App() {
    const { token } = useAuthStore();

    if (!token) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="finance/dashboard" element={<FinanceDashboard />} />
                    <Route path="finance/transactions" element={<Transactions />} />
                    <Route path="finance/budgets" element={<Budgets />} />
                    <Route path="finance/reports" element={<Reports />} />
                    <Route path="mdm/accounts" element={<Accounts />} />
                    <Route path="mdm/products" element={<Products />} />
                    <Route path="mdm/customers" element={<Customers />} />
                    <Route path="dairy/dashboard" element={<DairyDashboard />} />
                    <Route path="dairy/cows" element={<CowManagement />} />
                    <Route path="dairy/milk-production" element={<MilkProduction />} />
                    <Route path="agriculture/dashboard" element={<AgricultureDashboard />} />
                    <Route path="inventory/dashboard" element={<InventoryDashboard />} />

                    {/* Warehouse */}
                    <Route path="warehouse/dashboard" element={<WarehouseDashboard />} />
                    <Route path="warehouse/locations" element={<LocationManager />} />
                    <Route path="warehouse/transfers" element={<StockTransfer />} />

                    {/* Processing */}
                    <Route path="processing/dashboard" element={<ProcessingDashboard />} />
                    <Route path="processing/recipes" element={<RecipeManager />} />
                    <Route path="processing/batches" element={<BatchManager />} />
                    <Route path="analytics/overview" element={<AnalyticsOverview />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
