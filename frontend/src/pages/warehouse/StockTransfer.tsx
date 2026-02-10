import { useState } from 'react';
import { useInventoryItems, useWarehouseLocations, useInitiateTransfer } from '../../api/hooks';
import { ArrowRight, Truck } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function StockTransfer() {
    const { user } = useAuthStore();
    const { mutate: initiateTransfer, isPending } = useInitiateTransfer();
    const { data: items } = useInventoryItems();
    const { data: locations } = useWarehouseLocations();

    const [formData, setFormData] = useState({
        itemId: '',
        fromLocationId: '',
        toLocationId: '',
        quantity: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        initiateTransfer({
            ...formData,
            quantity: Number(formData.quantity),
            userId: user?.id,
        }, {
            onSuccess: () => {
                alert('Transfer Initiated!');
                setFormData({ ...formData, quantity: '' });
            },
            onError: (err: any) => {
                // Safely handle error object
                const msg = err.response?.data?.message || err.message || 'Unknown error';
                alert('Transfer Failed: ' + msg);
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-4">
                    <Truck className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Outfit' }}>
                    Move Stock
                </h1>
                <p className="text-gray-600 mt-2">Transfer items between warehouse locations</p>
            </div>

            <div className="glass-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Item Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Item to Move</label>
                        <select
                            className="input-field w-full"
                            value={formData.itemId}
                            onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                            required
                        >
                            <option value="">Select Item...</option>
                            {items?.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item.name} ({item.sku})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {/* Visual Connector */}
                        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-sm border border-gray-100">
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>

                        {/* From Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Location</label>
                            <select
                                className="input-field w-full"
                                value={formData.fromLocationId}
                                onChange={(e) => setFormData({ ...formData, fromLocationId: e.target.value })}
                                required
                            >
                                <option value="">Select Source...</option>
                                {locations?.map((loc: any) => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* To Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To Location</label>
                            <select
                                className="input-field w-full"
                                value={formData.toLocationId}
                                onChange={(e) => setFormData({ ...formData, toLocationId: e.target.value })}
                                required
                            >
                                <option value="">Select Destination...</option>
                                {locations?.map((loc: any) => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                            type="number"
                            className="input-field w-full"
                            min="1"
                            placeholder="Enter amount..."
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                        disabled={isPending}
                    >
                        {isPending ? 'Processing...' : 'Confirm Transfer'}
                    </button>
                </form>
            </div>
        </div>
    );
}
