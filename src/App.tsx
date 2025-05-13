import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Layout and Error Boundary
import { Layout } from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";

// Main Navigation Pages
import { Home } from "./pages/Home";
import { Merch } from "./pages/Merch";
import { TrainingOptions } from "./pages/TrainingOptions";
import { CommunityEvents } from "./pages/CommunityEvents";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Testimonials } from "./pages/Testimonials";
import { WebsiteThumbnails } from "./pages/WebsiteThumbnails";
import TestUploadPage from "./pages/TestUploadPage";
import TestPdfUploader from "./pages/TestPdfUploader";

// Registration Flow Components
import GymRegistrationForm from "./pages/GymRegistrationForm";
import PDFFormRegistration from "./pages/GymRegistrationForm/components/PDFFormRegistration";
import GymContractAndWaiver from "./pages/RegistrationFlow/GymContractAndWaiver";
import { GymPaymentSelection } from "./pages/RegistrationFlow/GymPaymentSelection";
import { StripePayment } from "./pages/RegistrationFlow/StripePayment";
import ConfirmationPage from "./pages/RegistrationFlow/ConfirmationPage";
import { GymFormProvider } from "./pages/GymRegistrationForm/contexts/GymFormContext";

// Icons
import { Dumbbell } from "lucide-react";

// Define interfaces for component props
interface Plan {
  id: string;
  title: string;
  duration: string;
  initiationFee: string;
  sessions: string;
  price: string;
  perks: string;
  icon: React.ReactNode;
}

// Initialize Stripe with your test public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_TEST_PUBLIC_KEY);

// Default training plan configuration
const defaultPlan: Plan = {
  id: "kickstart",
  title: "The Kickstart",
  duration: "3, 6, or 12 months",
  initiationFee: "$100",
  sessions: "3 sessions/month",
  price: "$195/month ($65/session)",
  perks: "Ideal for beginners easing into a routine",
  icon: <Dumbbell className="w-8 h-8 text-[#DB6E1E]" />,
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <ErrorBoundary>
          <Routes>
            {/* Main Navigation */}
            <Route path="/" element={<Home />} />
            <Route path="/merch" element={<Merch />} />
            <Route
              path="/training-options"
              element={
                <GymFormProvider>
                  <TrainingOptions />
                </GymFormProvider>
              }
            />
            <Route path="/community-events" element={<CommunityEvents />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/website-thumbnails" element={<WebsiteThumbnails />} />
            <Route path="/test-upload" element={<TestUploadPage />} />
            <Route path="/test-pdf-uploader" element={<TestPdfUploader />} />

            {/* Registration Flow */}
            <Route
              path="/register"
              element={
                <GymFormProvider>
                  <GymRegistrationForm />
                </GymFormProvider>
              }
            />
            <Route
              path="/pdf-registration"
              element={<PDFFormRegistration />}
            />
            <Route
              path="/registration-flow/contract-and-waiver"
              element={
                <GymFormProvider>
                  <GymContractAndWaiver />
                </GymFormProvider>
              }
            />
            <Route
              path="/registration-flow/payment-selection"
              element={
                <GymFormProvider>
                  <GymPaymentSelection />
                </GymFormProvider>
              }
            />

            {/* Stripe Payment Route */}
            <Route
              path="/registration-flow/stripe-payment"
              element={
                <GymFormProvider>
                  <Elements stripe={stripePromise}>
                    <StripePayment />
                  </Elements>
                </GymFormProvider>
              }
            />

            {/* Confirmation Page */}
            <Route
              path="/registration-flow/confirmation"
              element={
                <GymFormProvider>
                  <ConfirmationPage />
                </GymFormProvider>
              }
            />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </Router>
  );
};

export default App;