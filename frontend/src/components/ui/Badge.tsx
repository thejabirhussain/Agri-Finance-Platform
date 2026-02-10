import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        info: 'badge-info',
        default: 'bg-gray-100 text-gray-700 border border-gray-200'
    };

    return (
        <span className={cn("badge", variants[variant], className)}>
            {children}
        </span>
    );
}
