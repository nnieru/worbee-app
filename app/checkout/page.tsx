import Link from "next/link";
import { EnquiryForm } from "../../components/checkout/EnquiryForm";
import { SetupReview } from "../../components/checkout/SetupReview";

export default function CheckoutPage() {
  return (
    <main className="checkout-shell">
      <header className="checkout-header">
        <Link href="/" className="wordmark" aria-label="Back to Worbee workspace builder">
          <span className="wordmark-icon" aria-hidden="true">w</span>
          <span>Worbee</span>
        </Link>
        <Link href="/" className="checkout-back-link">← Back to builder</Link>
      </header>

      <div className="checkout-intro">
        <span className="eyebrow">Setup review</span>
        <h1>Nearly ready for a better workday.</h1>
        <p>Check the pieces, then tell us a little about your plans.</p>
      </div>

      <div className="checkout-layout">
        <SetupReview />
        <EnquiryForm />
      </div>

      <footer className="checkout-footer">
        Your enquiry is a request to check availability. No payment is taken here.
      </footer>
    </main>
  );
}
