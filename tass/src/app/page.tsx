import Head from 'next/head';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '../components/Home/Hero/Hero';
import Features from '@/components/Home/Features';
import Benefit from '@/components/Home/Benefit'
import Footer from '@/components/Footer/Footer';
import HowItWorks from '@/components/Home/HowItWorks';
import CallToAction from '@/components/Home/CallToAction';


export default function Home() {
  return (
    <>
      <Head>
        <title>Secure Data Backup Solutions</title>
        <meta name="description" content="Automated, secure, and scalable backups for business continuity" />
      </Head>
      <main className="">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Benefit />
        <CallToAction />
        <Footer />

        {/*<ChooseUs />
        <BackupRestore />
        <Integrations />
        <PricingTable />
        <FrequentQuestions />
        <Footer /> */}
      </main>
    </>
  );
}