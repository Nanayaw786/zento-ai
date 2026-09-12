export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-zento-surface px-6 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-black/5 p-8">
        <h1 className="text-2xl font-medium text-zento-navy mb-2">Privacy Policy</h1>
        <p className="text-black/40 text-sm mb-8">Last updated: September 2026</p>

        <div className="space-y-6 text-sm text-black/70 leading-relaxed">
          <section>
            <h2 className="text-zento-navy font-medium mb-2">1. Overview</h2>
            <p>
              Zento AI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides an AI-powered
              business assistant that helps businesses communicate with their customers,
              including via WhatsApp. This policy explains what information we collect,
              how we use it, and how it is protected.
            </p>
          </section>

          <section>
            <h2 className="text-zento-navy font-medium mb-2">2. Information We Collect</h2>
            <p>We collect and store the following information to operate the service:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Business account information (name, email, phone number, business type)</li>
              <li>Customer information provided by businesses or by customers themselves (name, phone number, email)</li>
              <li>Conversation content exchanged between customers and the Zento AI assistant, including via WhatsApp</li>
              <li>Order, appointment, and product/service data entered by businesses or generated through customer interactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-zento-navy font-medium mb-2">3. How We Use Information</h2>
            <p>Information is used to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide and operate the Zento AI assistant on behalf of businesses</li>
              <li>Respond to customer inquiries, process orders, and manage appointments</li>
              <li>Notify business owners of relevant activity (e.g. new orders or bookings)</li>
              <li>Improve the reliability and functionality of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-zento-navy font-medium mb-2">4. WhatsApp Messaging</h2>
            <p>
              When a customer messages a business through WhatsApp, Zento AI receives and
              processes that message via the WhatsApp Business Platform in order to generate
              and send a response on behalf of the business. Message content may be processed
              by our AI provider (Anthropic) solely to generate responses, and is not used to
              train AI models or shared with third parties for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-zento-navy font-medium mb-2">5. Data Storage &amp; Security</h2>
            <p>
              Data is stored securely using industry-standard hosting and database providers.
              Access to business data is restricted to that business only; one business cannot
              access another business&apos;s data.
            </p>
          </section>

          <section>
            <h2 className="text-zento-navy font-medium mb-2">6. Data Retention &amp; Deletion</h2>
            <p>
              We retain data for as long as an account remains active. Businesses or customers
              may request deletion of their data by contacting us using the details below.
            </p>
          </section>

          <section>
            <h2 className="text-zento-navy font-medium mb-2">7. Contact</h2>
            <p>
              For questions about this policy or to request data deletion, contact us at:{" "}
              <a href="mailto:privacy@zentoai.app" className="text-zento-navy underline">
                privacy@zentoai.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}