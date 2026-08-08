import { Link } from "@tanstack/react-router";

interface NavItemProps {
    to: string;
    icon: React.ElementType;
    label: string;
    exact?: boolean;
}

export const NavItem = ({ to, icon: Icon, label, exact }: NavItemProps) => {
    const navItemClasses = (isActive: boolean) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${isActive
            ? 'bg-zinc-800/90 text-white font-medium shadow-xs border border-zinc-700/50'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
        }`;

    return (
        <Link
            to={to}
            activeOptions={{ exact }}
            children={({ isActive }) => (
                <div className={navItemClasses(isActive)}>
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                </div>
            )}
        />
    )
}