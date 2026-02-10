import { useState } from 'react';
import { Plus, Droplets, Calendar, TrendingUp } from 'lucide-react';
import { useCows, useRecordMilkProduction, useMilkProduction } from '../../api/hooks';

export default function MilkProduction() {
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const { data: cows } = useCows({ status: 'ACTIVE' });
    const recordMilk = useRecordMilkProduction();
    const { data: productions } = useMilkProduction({
        startDate: selectedDate,
        endDate: selectedDate,
    });

    const [formData, setFormData] = useState({
        cowId: '',
        productionDate: new Date().toISOString().split('T')[0],
        session: 'MORNING',
        quantityLiters: 0,
        fatPercentage: 0,
        snfPercentage: 0,
        qualityGrade: 'A',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await recordMilk.mutateAsync(formData);
            setShowModal(false);
            setFormData({
                cowId: '',
                productionDate: new Date().toISOString().split('T')[0],
                session: 'MORNING',
                quantityLiters: 0,
                fatPercentage: 0,
                snfPercentage: 0,
                qualityGrade: 'A',
                notes: '',
            });
        } catch (error) {
            console.error('Error recording milk:', error);
        }
    };

    const todayTotal = productions?.reduce((sum: number, p: any) => sum + Number(p.quantityLiters), 0) || 0;
    const todayCows = new Set(productions?.map((p: any) => p.cowId)).size || 0;
    const avgPerCow = todayCows > 0 ? todayTotal / todayCows : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Milk Production</h1>
                    <p className="text-gray-600 mt-1">Record and track daily milk production</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Record Milk
                </button>
            </div>

            {/* Date Filter */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Daily Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Production</p>
                            <p className="text-3xl font-bold text-gray-900">{todayTotal.toFixed(1)}L</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <Droplets className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Cows Milked</p>
                            <p className="text-3xl font-bold text-gray-900">{todayCows}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg per Cow</p>
                            <p className="text-3xl font-bold text-gray-900">{avgPerCow.toFixed(1)}L</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Droplets className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Production Records */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Today's Records</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cow
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Session
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity (L)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fat %
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SNF %
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quality
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {productions?.length > 0 ? (
                                productions.map((prod: any) => (
                                    <tr key={prod.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {prod.cow?.cowTagNumber}
                                                </div>
                                                <div className="text-sm text-gray-500">{prod.cow?.cowName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${prod.session === 'MORNING'
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : prod.session === 'AFTERNOON'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {prod.session}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {Number(prod.quantityLiters).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {prod.fatPercentage ? `${Number(prod.fatPercentage).toFixed(1)}%` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {prod.snfPercentage ? `${Number(prod.snfPercentage).toFixed(1)}%` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${prod.qualityGrade === 'A'
                                                        ? 'bg-green-100 text-green-800'
                                                        : prod.qualityGrade === 'B'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                Grade {prod.qualityGrade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{prod.notes || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No production records for this date
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Record Milk Production</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cow *</label>
                                <select
                                    required
                                    value={formData.cowId}
                                    onChange={(e) => setFormData({ ...formData, cowId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Cow</option>
                                    {cows?.map((cow: any) => (
                                        <option key={cow.id} value={cow.id}>
                                            {cow.cowTagNumber} - {cow.cowName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.productionDate}
                                        onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Session *</label>
                                    <select
                                        value={formData.session}
                                        onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="MORNING">Morning</option>
                                        <option value="AFTERNOON">Afternoon</option>
                                        <option value="EVENING">Evening</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity (L) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.quantityLiters || ''}
                                        onChange={(e) =>
                                            setFormData({ ...formData, quantityLiters: +e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fat %</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.fatPercentage || ''}
                                        onChange={(e) => setFormData({ ...formData, fatPercentage: +e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SNF %</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.snfPercentage || ''}
                                        onChange={(e) => setFormData({ ...formData, snfPercentage: +e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
                                <select
                                    value={formData.qualityGrade}
                                    onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="A">Grade A</option>
                                    <option value="B">Grade B</option>
                                    <option value="C">Grade C</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={recordMilk.isPending}
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {recordMilk.isPending ? 'Recording...' : 'Record Production'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
