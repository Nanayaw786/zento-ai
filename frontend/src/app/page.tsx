import Link from "next/link";

const businessTypes = [
  "Restaurants",
  "Salons",
  "Retail stores",
  "Hotels",
  "Pharmacies",
  "Real estate",
  "Schools",
  "Service businesses",
];

const flowSteps = [
  {
    title: "A customer messages you",
    body: "On WhatsApp, any hour, about anything — a menu question, a booking, an order.",
  },
  {
    title: "Zento AI answers and acts",
    body: "It reads your real catalog, replies like a team member, and books or orders on the spot.",
  },
  {
    title: "You see everything",
    body: "Every conversation, order, and booking lands in your dashboard, with an alert if it needs you.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zento-surface">
      <style>{`
        .hero-gradient {
          background: linear-gradient(120deg, #1E1B4B, #312E81, #412402, #D4A017, #312E81, #1E1B4B);
          background-size: 300% 300%;
          animation: gradientShift 20s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-gradient { animation: none; background-position: 0% 50%; }
        }
      `}</style>

      {/* Hero with animated gradient */}
      <section className="hero-gradient relative">
        <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto relative z-10">
          <span className="text-white text-lg font-medium">Zento AI</span>
          <Link
            href="/login"
            className="text-sm font-medium text-white bg-white/10 backdrop-blur px-4 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            Sign in
          </Link>
        </nav>

        <div className="max-w-3xl mx-auto px-6 md:px-10 pt-16 pb-24 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-medium text-white leading-[1.1] mb-6">
            Your business, answered on WhatsApp.
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Zento AI talks to your customers, books appointments, takes orders,
            and tells you what happened — while you get on with running the place.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link
              href="/signup"
              className="text-sm font-medium text-zento-gold-dark bg-zento-gold px-7 py-3.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white px-7 py-3.5 rounded-lg border border-white/25 hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {businessTypes.map((type) => (
              <span
                key={type}
                className="text-xs text-white/80 bg-white/10 backdrop-blur border border-white/15 px-3 py-1.5 rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — actual sequence, so numbered is justified */}
      <section className="bg-white border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          <h2 className="text-2xl font-medium text-zento-navy mb-10 max-w-md">
            One message in, everything handled.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {flowSteps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-zento-navy text-white text-xs font-medium flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {i < flowSteps.length - 1 && (
                    <span className="hidden md:block flex-1 h-px bg-black/10" />
                  )}
                </div>
                <h3 className="text-zento-navy font-medium mb-1">{step.title}</h3>
                <p className="text-black/60 text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard mockup — grounds "stay in control" in something real */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-zento-navy rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white text-sm font-medium">Overview</p>
                <div className="w-6 h-6 rounded-full bg-zento-gold" />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Orders today", value: "18" },
                  { label: "Conversations", value: "6" },
                  { label: "Revenue", value: "GHS 1,240" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-lg p-3">
                    <p className="text-white/50 text-[10px] mb-1">{stat.label}</p>
                    <p className="text-white text-base font-medium">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <p className="text-white/40 text-[10px]">Recent activity</p>
                <p className="text-white/80 text-xs">New order from Efua Mensah</p>
                <p className="text-white/80 text-xs">Appointment booked by Kwesi Boateng</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-medium text-zento-navy mb-4">
              See everything, from one place.
            </h2>
            <p className="text-black/60 mb-4 max-w-md">
              Every conversation, order, and booking your AI handles shows up in
              your dashboard as it happens — not buried in a chat you have to scroll back through.
            </p>
            <p className="text-black/60 max-w-md">
              Add your products, check on customers, and get a WhatsApp
              alert the moment something needs you.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
            Your customers are already messaging you.
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Give them someone to talk to, at any hour, without adding to your day.
          </p>
          <Link
            href="/signup"
            className="inline-block text-sm font-medium text-zento-gold-dark bg-zento-gold px-7 py-3.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get started free
          </Link>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex items-center justify-between text-xs text-black/40">
        <span>Zento AI</span>
        <span>Your AI employee for business.</span>
      </footer>
    </main>
  );
}