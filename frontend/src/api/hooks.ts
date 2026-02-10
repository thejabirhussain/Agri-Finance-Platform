import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';

// Auth
export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            const { data } = await apiClient.post('/auth/login', credentials);
            return data;
        },
    });
};

// Accounts
export const useAccounts = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const { data } = await apiClient.get('/mdm/accounts');
            return data;
        },
    });
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (accountData: any) => {
            const { data } = await apiClient.post('/mdm/accounts', accountData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

// Products
export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await apiClient.get('/mdm/products');
            return data;
        },
    });
};

// Customers
export const useCustomers = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const { data } = await apiClient.get('/mdm/customers');
            return data;
        },
    });
};

// Locations
export const useLocations = () => {
    return useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            const { data } = await apiClient.get('/mdm/locations');
            return data;
        },
    });
};

// Cost Centers
export const useCostCenters = () => {
    return useQuery({
        queryKey: ['costCenters'],
        queryFn: async () => {
            const { data } = await apiClient.get('/mdm/cost-centers');
            return data;
        },
    });
};

// Transaction Groups
export const useTransactionGroups = () => {
    return useQuery({
        queryKey: ['transactionGroups'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/transaction-groups');
            return data;
        },
    });
};

// Categories
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/categories');
            return data;
        },
    });
};

// Budgets
export const useBudgets = () => {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/budgets');
            return data;
        },
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (budgetData: any) => {
            const { data } = await apiClient.post('/finance/budgets', budgetData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

// Transactions
export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/transactions');
            return data;
        },
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (transactionData: any) => {
            const { data } = await apiClient.post('/finance/transactions', transactionData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['account-balances'] });
        },
    });
};

// Reports
export const useAccountBalances = () => {
    return useQuery({
        queryKey: ['account-balances'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/reports/account-balances');
            return data;
        },
    });
};

export const useCompanyValuation = () => {
    return useQuery({
        queryKey: ['company-valuation'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/reports/company-valuation');
            return data;
        },
    });
};

export const useCashFlowSecureness = () => {
    return useQuery({
        queryKey: ['cashflow-secureness'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/reports/cashflow-secureness');
            return data;
        },
    });
};

export const useOperationalCosts = () => {
    return useQuery({
        queryKey: ['operational-costs'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/reports/operational-costs');
            return data;
        },
    });
};

export const useCashFlowReport = (startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['cashflow-report', startDate, endDate],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/reports/cashflow', {
                params: { startDate, endDate },
            });
            return data;
        },
        enabled: !!startDate && !!endDate,
    });
};

// ============================================
// DAIRY MODULE
// ============================================

// Cows
export const useCows = (filter?: any) => {
    return useQuery({
        queryKey: ['cows', filter],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/cows', { params: filter });
            return data;
        },
    });
};

export const useCow = (id: string) => {
    return useQuery({
        queryKey: ['cow', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/dairy/cows/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCreateCow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (cowData: any) => {
            const { data } = await apiClient.post('/dairy/cows', cowData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cows'] });
            queryClient.invalidateQueries({ queryKey: ['dairy-dashboard'] });
        },
    });
};

export const useUpdateCow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...cowData }: any) => {
            const { data } = await apiClient.put(`/dairy/cows/${id}`, cowData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cows'] });
        },
    });
};

// Milk Production
export const useMilkProduction = (query?: any) => {
    return useQuery({
        queryKey: ['milk-production', query],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/milk-production', { params: query });
            return data;
        },
    });
};

export const useRecordMilkProduction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productionData: any) => {
            const { data } = await apiClient.post('/dairy/milk-production', productionData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milk-production'] });
            queryClient.invalidateQueries({ queryKey: ['dairy-dashboard'] });
        },
    });
};

export const useBulkRecordMilk = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (records: any) => {
            const { data } = await apiClient.post('/dairy/milk-production/bulk', { records });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milk-production'] });
            queryClient.invalidateQueries({ queryKey: ['dairy-dashboard'] });
        },
    });
};

// Feeding
export const useFeedingRecords = (query?: any) => {
    return useQuery({
        queryKey: ['feeding-records', query],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/feeding/records', { params: query });
            return data;
        },
    });
};

export const useCreateFeedingRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ accountId, ...feedingData }: any) => {
            const { data } = await apiClient.post('/dairy/feeding/records', feedingData, {
                params: { accountId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feeding-records'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

// Health
export const useHealthRecords = (cowId?: string) => {
    return useQuery({
        queryKey: ['health-records', cowId],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/health', { params: { cowId } });
            return data;
        },
    });
};

export const useCreateHealthRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ accountId, ...healthData }: any) => {
            const { data } = await apiClient.post('/dairy/health', healthData, {
                params: { accountId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health-records'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useUpcomingCheckups = () => {
    return useQuery({
        queryKey: ['upcoming-checkups'],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/health/upcoming-checkups');
            return data;
        },
    });
};

// Breeding
export const useBreedingRecords = (cowId?: string) => {
    return useQuery({
        queryKey: ['breeding-records', cowId],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/breeding', { params: { cowId } });
            return data;
        },
    });
};

export const useCreateBreedingRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ accountId, ...breedingData }: any) => {
            const { data } = await apiClient.post('/dairy/breeding', breedingData, {
                params: { accountId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['breeding-records'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useUpcomingCalvings = () => {
    return useQuery({
        queryKey: ['upcoming-calvings'],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/breeding/upcoming-calvings');
            return data;
        },
    });
};

// Calves
export const useCalves = (status?: string) => {
    return useQuery({
        queryKey: ['calves', status],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/calves', { params: { status } });
            return data;
        },
    });
};

export const useRegisterCalf = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (calfData: any) => {
            const { data } = await apiClient.post('/dairy/calves', calfData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calves'] });
            queryClient.invalidateQueries({ queryKey: ['breeding-records'] });
            queryClient.invalidateQueries({ queryKey: ['dairy-dashboard'] });
        },
    });
};

// Dairy Dashboard
export const useDairyDashboard = () => {
    return useQuery({
        queryKey: ['dairy-dashboard'],
        queryFn: async () => {
            const { data } = await apiClient.get('/dairy/dashboard');
            return data;
        },
    });
};

export const useCowCostAnalysis = (cowId: string) => {
    return useQuery({
        queryKey: ['cow-cost-analysis', cowId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/dairy/cows/${cowId}/cost-analysis`);
            return data;
        },
        enabled: !!cowId,
    });
};


// ===== AGRICULTURE HOOKS =====
export const useAgricultureDashboard = () => {
    return useQuery({
        queryKey: ['agriculture', 'dashboard'],
        queryFn: async () => {
            const { data } = await apiClient.get('/agriculture/dashboard');
            return data;
        },
    });
};

export const useFields = () => {
    return useQuery({
        queryKey: ['agriculture', 'fields'],
        queryFn: async () => {
            const { data } = await apiClient.get('/agriculture/fields');
            return data;
        },
    });
};



// ===== INVENTORY HOOKS =====
export const useInventoryDashboard = () => {
    return useQuery({
        queryKey: ['inventory', 'dashboard'],
        queryFn: async () => {
            const { data } = await apiClient.get('/inventory/dashboard');
            return data;
        },
    });
};

export const useInventoryItems = () => {
    return useQuery({
        queryKey: ['inventory', 'items'],
        queryFn: async () => {
            const { data } = await apiClient.get('/inventory/items');
            return data;
        },
    });
};

export const useStockLevels = () => {
    return useQuery({
        queryKey: ['inventory', 'stock'],
        queryFn: async () => {
            const { data } = await apiClient.get('/inventory/stock');
            return data;
        },
    });
};

// ===== WAREHOUSE HOOKS =====
export const useWarehouseLocations = () => {
    return useQuery({
        queryKey: ['warehouse', 'locations'],
        queryFn: async () => {
            const { data } = await apiClient.get('/warehouse/locations');
            return data;
        },
    });
};

export const useRootLocations = () => {
    return useQuery({
        queryKey: ['warehouse', 'locations', 'roots'],
        queryFn: async () => {
            const { data } = await apiClient.get('/warehouse/locations/roots');
            return data;
        },
    });
};

export const useStockTransfers = () => {
    return useQuery({
        queryKey: ['warehouse', 'transfers'],
        queryFn: async () => {
            const { data } = await apiClient.get('/warehouse/transfers');
            return data;
        },
    });
};

export const useInitiateTransfer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (transferData: any) => {
            const { data } = await apiClient.post('/warehouse/transfers', transferData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouse', 'transfers'] });
            queryClient.invalidateQueries({ queryKey: ['inventory', 'stock'] });
        },
    });
};

// ===== PROCESSING HOOKS =====
export const useRecipes = () => {
    return useQuery({
        queryKey: ['processing', 'recipes'],
        queryFn: async () => {
            const { data } = await apiClient.get('/processing/recipes');
            return data;
        },
    });
};

export const useBatches = () => {
    return useQuery({
        queryKey: ['processing', 'batches'],
        queryFn: async () => {
            const { data } = await apiClient.get('/processing/batches');
            return data;
        },
    });
};

export const useCreateBatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (batchData: any) => {
            const { data } = await apiClient.post('/processing/batches', batchData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['processing', 'batches'] });
        },
    });
};

export const useStartBatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.post(`/processing/batches/${id}/start`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['processing', 'batches'] });
            queryClient.invalidateQueries({ queryKey: ['inventory', 'stock'] });
        },
    });
};

export const useCompleteBatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, actualYield }: { id: string; actualYield: number }) => {
            const { data } = await apiClient.post(`/processing/batches/${id}/complete`, { actualYield });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['processing', 'batches'] });
            queryClient.invalidateQueries({ queryKey: ['inventory', 'stock'] });
        },
    });
};

