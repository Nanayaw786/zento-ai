"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getConversations, getCustomers } from "@/lib/api";

type Conversation = {
  id: string;
  customer_id: string;
  last_message: string;
  channel: string;
  created_at: string;
};

type Customer = {
  id: string;
  name: string;
  phone: string | null;
};

export default function ConversationsPage() {
  const { businessId } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;
    Promise.all([getConversations(businessId), getCustomers(businessId)])
      .then(([conversationsData, customersData]) => {
        setConversations(conversationsData);
        setCustomers(customersData);
      })
      .catch(() => setError("Could not load conversations."))
      .finally(() => setLoading(false));
  }, [businessId]);

  const customerInfo = (id: string) =>
    customers.find((c) => c.id === id) ?? { name: "Unknown customer", phone: null };

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <h2 className="text-lg font-medium text-zento-navy mb-4">Conversations</h2>
      {conversations.length === 0 ? (
        <p className="text-black/50 text-sm">No conversations yet. They&apos;ll appear here once customers message you on WhatsApp.</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((c) => {
            const customer = customerInfo(c.customer_id);
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-black/5 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-zento-navy font-medium text-sm">{customer.name}</p>
                    {customer.phone && (
                      <p className="text-black/40 text-xs">{customer.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-zento-navy/5 text-zento-navy">
                      {c.channel}
                    </span>
                    <span className="text-black/40 text-xs">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="bg-zento-surface rounded-lg p-3 text-sm text-black/70 whitespace-pre-wrap">
                  {c.last_message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}