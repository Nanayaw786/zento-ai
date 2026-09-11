import Link from "next/link";

const features = [
  { title: "Talk to customers", desc: "Zento AI answers questions and takes orders on WhatsApp and your website, day or night." },
  { title: "Handle the busywork", desc: "Bookings, invoices, follow-ups, and status updates happen automatically." },
  { title: "Stay in control", desc: "See every conversation and order in one dashboard, built for how you run your business." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zento-surface">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <span className="text-zento-navy text-lg font-medium">Zento AI</span>
        <Link
          href="/login"
          className="text-sm font-medium text-white bg-zento-navy px-4 py-2 rounded-lg hover:bg-zento-navy-light transition-colors"
        >
          Sign in
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto text-center px-6 pt-20 pb-24">
        <h1 className="text-4xl font-medium text-zento-navy mb-5 leading-tight">
          Your AI employee for business
        </h1>
        <p className="text-black/60 text-lg mb-8">
          Zento AI talks to your customers, takes orders, books appointments, and keeps your business running while you focus on what matters.
        </p>
        <Link
          href="/signup"
          className="inline-block text-sm font-medium text-zento-gold-dark bg-zento-gold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get started
        </Link>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-2xl border border-black/5 p-6">
            <h3 className="text-zento-navy font-medium mb-2">{f.title}</h3>
            <p className="text-black/60 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}