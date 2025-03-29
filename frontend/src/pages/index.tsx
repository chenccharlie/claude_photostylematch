import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Examples from '@/components/landing/Examples';
import UseCases from '@/components/landing/UseCases';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import CallToAction from '@/components/landing/CallToAction';

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>PhotoStyleMatch - Match the style of any photo</title>
        <meta name="description" content="Automatically apply photo styling from reference images to your own photos using AI and Adobe Lightroom" />
      </Head>

      <main>
        <Hero />
        <Features />
        <Examples />
        <UseCases />
        <Pricing />
        <Testimonials />
        <CallToAction />
      </main>
    </>
  );
}
