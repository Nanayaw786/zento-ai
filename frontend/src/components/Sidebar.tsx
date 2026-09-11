import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Assistant", href: "/dashboard/ai-assistant" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Conversations", href: "/dashboard/conversations" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Appointments", href: "/dashboard/appointments" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-zento-navy flex flex-col">
      <div className="px-6 py-6">
        <span className="text-white text-lg font-medium">Zento AI</span>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-3 py-2 mb-1 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-white/10">
        <span className="text-zento-gold text-xs">Your AI employee</span>
      </div>
    </aside>
  );
}