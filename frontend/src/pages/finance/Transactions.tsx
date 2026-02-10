import { useState } from 'react';
import { useTransactions, useCreateTransaction, useAccounts, useTransactionGroups, useCategories, useCostCenters } from '../../api/hooks';
import { Plus, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Transactions() {
    const [showModal, setShowModal] = useState(false);
    const { data: transactions, isLoading } = useTransactions();
    const { data: accounts } = useAccounts();
    const { data: groups } = useTransactionGroups();
    const { data: categories } = useCategories();
    const { data: costCenters } = useCostCenters();
    const createMutation = useCreateTransaction();

    const [formData, setFormData] = useState({
        transactionCode: '',
        transactionDate: format(new Date(), 'yyyy-MM-dd'),
        transactionGroupId: '',
        categoryId: '',
        accountId: '',
        costCenterId: '',
        amount: '',
        description: '',
        paymentMethod: 'BANK_TRANSFER',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync(formData);
            setShowModal(false);
            setFormData({
                transactionCode: '',
                transactionDate: format(new Date(), 'yyyy-MM-dd'),
                transactionGroupId: '',
                categoryId: '',
                accountId: '',
                costCenterId: '',
                amount: '',
                description: '',
                paymentMethod: 'BANK_TRANSFER',
            });
        } catch (error) {
            alert('Failed to create transaction');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-600 mt-1">Manage all financial transactions</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>New Transaction</span>
                </button>
            </div>


            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">New Transaction</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Code</label>
                                    <input
                                        type="text"
                                        value={formData.transactionCode}
                                        onChange={(e) => setFormData({ ...formData, transactionCode: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={formData.transactionDate}
                                        onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={formData.transactionGroupId}
                                        onChange={(e) => setFormData({ ...formData, transactionGroupId: e.target.value })}
                                        className="input"
                                        required
                                    >
                                        <option value="">Select type</option>
                                        {groups?.map((g: any) => (
                                            <option key={g.id} value={g.id}>{g.groupName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="input"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories?.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.categoryName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                                    <select
                                        value={formData.accountId}
                                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                                        className="input"
                                        required
                                    >
                                        <option value="">Select account</option>
                                        {accounts?.map((a: any) => (
                                            <option key={a.id} value={a.id}>{a.accountName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
                                    <select
                                        value={formData.costCenterId}
                                        onChange={(e) => setFormData({ ...formData, costCenterId: e.target.value })}
                                        className="input"
                                    >
                                        <option value="">Select cost center</option>
                                        {costCenters?.map((cc: any) => (
                                            <option key={cc.id} value={cc.id}>{cc.costCenterName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                                    {createMutation.isPending ? 'Creating...' : 'Create Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="card p-6">
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
                        ))}
                    </div>
                ) : transactions && transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Account</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn: any) => (
                                    <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                                            {format(new Date(txn.transactionDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{txn.transactionCode}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{txn.description || '-'}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${txn.transactionGroup?.groupCode === 'INCOME'
                                                    ? 'bg-green-100 text-green-700'
                                                    : txn.transactionGroup?.groupCode === 'EXPENSE'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}
                                            >
                                                {txn.transactionGroup?.groupName}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{txn.category?.categoryName || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{txn.account?.accountName || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                            {formatCurrency(txn.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No transactions found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
