import {
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function RecentGrid() {
    const activities = [
        {
            id: 1,
            type: 'Milk Sale',
            amount: '+ ₹12,500',
            status: 'completed',
            date: 'Today, 10:30 AM',
            icon: ArrowUpRight,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            id: 2,
            type: 'Feed Purchase',
            amount: '- ₹4,200',
            status: 'pending',
            date: 'Today, 09:15 AM',
            icon: ArrowDownRight,
            color: 'text-red-600',
            bg: 'bg-red-50'
        },
        {
            id: 3,
            type: 'Vet Visit',
            amount: '- ₹1,500',
            status: 'completed',
            date: 'Yesterday, 04:00 PM',
            icon: ArrowDownRight,
            color: 'text-red-600',
            bg: 'bg-red-50'
        },
        {
            id: 4,
            type: 'Crop Harvest',
            amount: '+ ₹45,000',
            status: 'completed',
            date: 'Yesterday, 02:30 PM',
            icon: ArrowUpRight,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center`}>
                                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                                    {activity.type}
                                </p>
                                <p className="text-xs text-gray-500">{activity.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-semibold ${activity.color}`}>
                                {activity.amount}
                            </p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                                {activity.status === 'completed' ? (
                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="w-3 h-3 text-amber-500" />
                                )}
                                <span className="text-xs text-gray-400 capitalize">{activity.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
