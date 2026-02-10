import { useState } from 'react';
import { useWarehouseLocations, useRootLocations } from '../../api/hooks';
import { Network, Plus, Folder, Box } from 'lucide-react';

export default function LocationManager() {
    const { data: rootLocations, isLoading } = useRootLocations();
    // In a real app we'd fetch children on demand, for now we might load all or just roots

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>
                        Location Management
                    </h1>
                    <p className="text-gray-600">Configure your warehouse hierarchy</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Location
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Location Tree */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Network className="w-5 h-5 text-indigo-500" />
                        Storage Hierarchy
                    </h3>

                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="space-y-4">
                            {rootLocations?.map((location: any) => (
                                <LocationNode key={location.id} location={location} />
                            ))}
                            {(!rootLocations || rootLocations.length === 0) && (
                                <p className="text-gray-500 text-center py-8">No locations defined yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Info Panel / Quick Stats */}
                <div className="space-y-6">
                    <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <h4 className="font-bold text-gray-900 mb-2">Structure Tips</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Organize your warehouse logically:
                        </p>
                        <ul className="text-sm space-y-2 text-gray-700">
                            <li className="flex items-center gap-2">
                                <Folder className="w-4 h-4 text-blue-500" />
                                <span>Warehouse (Root)</span>
                            </li>
                            <li className="flex items-center gap-2 ml-4">
                                <Folder className="w-4 h-4 text-blue-400" />
                                <span>Zone (E.g., Cold Storage)</span>
                            </li>
                            <li className="flex items-center gap-2 ml-8">
                                <Box className="w-4 h-4 text-indigo-500" />
                                <span>Rack / Bin (Leaf)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LocationNode({ location }: { location: any }) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = location.children && location.children.length > 0;

    return (
        <div className="border border-gray-100 rounded-lg bg-white overflow-hidden">
            <div
                className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${location.type === 'WAREHOUSE' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        {location.type === 'WAREHOUSE' ? <Network className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{location.name}</p>
                        <p className="text-xs text-gray-500">{location.code} • {location.type}</p>
                    </div>
                </div>
            </div>

            {expanded && hasChildren && (
                <div className="pl-8 pr-3 pb-3 space-y-2 border-t border-gray-100 bg-gray-50/50">
                    {location.children.map((child: any) => (
                        <LocationNode key={child.id} location={child} />
                    ))}
                </div>
            )}
        </div>
    );
}
