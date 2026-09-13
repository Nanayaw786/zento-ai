"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminStats, getAdminBusinesses } from "@/lib/api";

type Stats = {
  total_businesses: number;
  total_customers: number;
  total_orders: number;
  total_appointments: number;
  total_conversations: number;
  businesses_with_whatsapp: number;
  pending_whatsapp_requests: number;
};

type BusinessRow = {
  id: string;
  name: string;
  email: string;
  business_type: string | null;
  phone: string | null;
  whatsapp_connected: boolean;
  whatsapp_phone_number_id: string | null;
  whatsapp_requested_number: string | null;
  whatsapp_request_status: string | null;
  order_count: number;
  customer_count: number;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("zento_admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    Promise.all([getAdminStats(token), getAdminBusinesses(token)])
      .then(([statsData, businessesData]) => {
        setStats(statsData);
        setBusinesses(businessesData);
      })
      .catch(() => {
        localStorage.removeItem("zento_admin_token");
        router.push("/admin");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("zento_admin_token");
    router.push("/admin");
  };

  const pendingRequests = businesses.filter((b) => b.whatsapp_request_status === "pending");

  if (loading) return <div className="min-h-screen bg-zento-surface" />;

  return (
    <div className="min-h-screen bg-zento-surface p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-medium text-zento-navy">Zento AI - Platform Admin</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-black/50 hover:text-black/80"
          >
            Sign out
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-8">
            {[
              { label: "Businesses", value: stats.total_businesses },
              { label: "With WhatsApp", value: stats.businesses_with_whatsapp },
              { label: "Pending Requests", value: stats.pending_whatsapp_requests, highlight: stats.pending_whatsapp_requests > 0 },
              { label: "Customers", value: stats.total_customers },
              { label: "Orders", value: stats.total_orders },
              { label: "Appointments", value: stats.total_appointments },
              { label: "Conversations", value: stats.total_conversations },
            ].map((s) => (
              <div
                key={s.label}
                className={`rounded-2xl border p-4 ${
                  s.highlight ? "bg-zento-gold/10 border-zento-gold/30" : "bg-white border-black/5"
                }`}
              >
                <p className="text-black/50 text-xs mb-1">{s.label}</p>
                <p className={`text-2xl font-medium ${s.highlight ? "text-zento-gold-dark" : "text-zento-navy"}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-zento-navy mb-3">
              Pending WhatsApp Number Requests
            </h2>
            <div className="bg-white rounded-2xl border border-zento-gold/30 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-black/5 text-black/50">
                    <th className="px-5 py-3 font-medium">Business</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Requested Number</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((b) => (
                    <tr key={b.id} className="border-b border-black/5 last:border-0">
                      <td className="px-5 py-3 text-zento-navy font-medium">{b.name}</td>
                      <td className="px-5 py-3 text-black/70">{b.email}</td>
                      <td className="px-5 py-3 text-black/70 font-medium">
                        {b.whatsapp_requested_number}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <h2 className="text-sm font-medium text-zento-navy mb-3">All Businesses</h2>
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-black/5 text-black/50">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">WhatsApp</th>
                <th className="px-5 py-3 font-medium">Customers</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-zento-navy font-medium">{b.name}</td>
                  <td className="px-5 py-3 text-black/70">{b.email}</td>
                  <td className="px-5 py-3 text-black/70">{b.business_type ?? "N/A"}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`w-fit px-2 py-1 rounded-full text-xs font-medium ${
                          b.whatsapp_connected
                            ? "bg-green-100 text-green-700"
                            : b.whatsapp_request_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {b.whatsapp_connected
                          ? "Connected"
                          : b.whatsapp_request_status === "pending"
                          ? "Pending"
                          : "Not connected"}
                      </span>
                      {b.whatsapp_connected && (
                        <span className="text-black/40 text-xs">
                          ID: {b.whatsapp_phone_number_id}
                        </span>
                      )}
                      {b.whatsapp_request_status === "pending" && b.whatsapp_requested_number && (
                        <span className="text-black/40 text-xs">
                          Requested: {b.whatsapp_requested_number}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-black/70">{b.customer_count}</td>
                  <td className="px-5 py-3 text-black/70">{b.order_count}</td>
                  <td className="px-5 py-3 text-black/50">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}