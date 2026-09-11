"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getAppointments, getCustomers } from "@/lib/api";

type Appointment = {
  id: string;
  customer_id: string;
  service: string;
  scheduled_at: string;
};

type Customer = {
  id: string;
  name: string;
};

export default function AppointmentsPage() {
  const { businessId } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;
    Promise.all([getAppointments(businessId), getCustomers(businessId)])
      .then(([appointmentsData, customersData]) => {
        setAppointments(appointmentsData);
        setCustomers(customersData);
      })
      .catch(() => setError("Could not load appointments."))
      .finally(() => setLoading(false));
  }, [businessId]);

  const customerName = (id: string) =>
    customers.find((c) => c.id === id)?.name ?? "Unknown customer";

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <h2 className="text-lg font-medium text-zento-navy mb-4">Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-black/50 text-sm">No appointments yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
          {appointments.map((a) => (
            <div key={a.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-zento-navy font-medium text-sm">{customerName(a.customer_id)}</p>
                <p className="text-black/50 text-sm">{a.service}</p>
              </div>
              <p className="text-sm text-zento-gold-dark bg-zento-gold/10 px-3 py-1 rounded-full">
                {new Date(a.scheduled_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}