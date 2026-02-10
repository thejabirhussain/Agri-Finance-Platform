import { useState } from 'react';
import { Search, Filter, Download, MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function TransactionsTable() {
    const [searchTerm, setSearchTerm] = useState('');

    // Dummy data for now - will be replaced by API data later
    const transactions = [
        { id: 'TRX-9821', date: '2023-10-24', desc: 'Milk Sales - Morning Batch', amount: 12500, type: 'income', category: 'Sales', status: 'completed' },
        { id: 'TRX-9820', date: '2023-10-24', desc: 'Cattle Feed Purchase', amount: 4200, type: 'expense', category: 'Supplies', status: 'pending' },
        { id: 'TRX-9819', date: '2023-10-23', desc: 'Veterinary Services', amount: 1500, type: 'expense', category: 'Services', status: 'completed' },
        { id: 'TRX-9818', date: '2023-10-23', desc: 'Manure Sales', amount: 3000, type: 'income', category: 'Sales', status: 'completed' },
        { id: 'TRX-9817', date: '2023-10-22', desc: 'Machinery Maintenance', amount: 8500, type: 'expense', category: 'Maintenance', status: 'completed' },
    ];

    return (
        <div className="glass-card">
            {/* Table Header / Toolbar */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((trx) => (
                            <tr key={trx.id} className="group cursor-pointer">
                                <td className="font-medium text-gray-900">{trx.id}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${trx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {trx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        </div>
                                        <span>{trx.desc}</span>
                                    </div>
                                </td>
                                <td><span className="text-gray-500">{trx.category}</span></td>
                                <td>{trx.date}</td>
                                <td className={`font-semibold ${trx.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    {trx.type === 'income' ? '+' : '-'} ₹{trx.amount.toLocaleString('en-IN')}
                                </td>
                                <td>
                                    <Badge variant={trx.status === 'completed' ? 'success' : 'warning'}>
                                        {trx.status}
                                    </Badge>
                                </td>
                                <td>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple) */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>Showing 5 of 128 results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
}
