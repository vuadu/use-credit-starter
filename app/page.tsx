import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import Pricing from '@/components/Pricing';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';

export default async function PricingPage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <>
      <Navbar />
      <main
        id="skip"
        className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
      >
        <Pricing
          session={session}
          user={session?.user}
          products={products}
          subscription={subscription}
        />
      </main>
      <Footer />
    </>
  );
}
