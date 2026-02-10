import { useAccounts } from '../../api/hooks';

export default function Accounts() {
    const { data: accounts, isLoading } = useAccounts();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
                <p className="text-gray-600 mt-1">Manage bank and cash accounts</p>
            </div>

            <div className="card p-6">
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
                        ))}
                    </div>
                ) : accounts && accounts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accounts.map((account: any) => (
                            <div key={account.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{account.accountName}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${account.accountType === 'BANK' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {account.accountType}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(account.currentBalance)}</p>
                                {account.bankName && (
                                    <p className="text-sm text-gray-600 mt-1">{account.bankName}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No accounts found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
