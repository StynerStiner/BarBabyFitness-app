// 1. Importing React and other necessary libraries
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import RegistrationHeader from "@/pages/GymRegistrationForm/components/RegistrationHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { useLocation, useNavigate } from "react-router-dom";
import HeroSection from "@/pages/GymRegistrationForm/components/HeroSection";

// 2. Import Plan type from the types file
import type { Plan } from "@/pages/TrainingOptions/components/types";

// 3. Import PDF and email services
import pdfService, { ContractFormData } from "@/services/pdfService";
import emailService from "@/services/emailService";
import { toast } from "react-hot-toast"; // Make sure this is installed

// Import the upload service
import uploadService from "@/api/upload-filled-pdfs";

// 4. Import PaymentSummary component
import PaymentSummary from "@/pages/GymRegistrationForm/components/PaymentSummary";

// 5. Declare the Plan prop interface for this component
interface GymContractAndWaiverProps {
  selectedPlan: Plan | null;
}

/**
 * GymContractAndWaiver is a page where users accept the gym's contract and waiver.
 * It renders a long form with a signature pad and several input fields.
 * The form is divided into sections for the trainer, client, and participant.
 * The page also includes a "Back" and "Accept & Continue" button at the bottom.
 *
 * @return {React.ReactElement} A React element representing the GymContractAndWaiver page.
 */
const GymContractAndWaiver: React.FC = () => {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan as Plan | null;

  // Fallback handling
  if (!selectedPlan) {
    return <div>Please select a plan to proceed.</div>;
  }

  // ========== State / Refs ==========

  // Trainer
  const [trainerName, setTrainerName] = useState("");
  const [trainerDate, setTrainerDate] = useState("");
  const trainerSigRef = useRef<SignatureCanvas | null>(null);

  // Client
  const [clientName, setClientName] = useState("");
  const [clientDate, setClientDate] = useState("");
  const clientSigRef = useRef<SignatureCanvas | null>(null);

  // Participant
  const [participantName, setParticipantName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const participantSigRef = useRef<SignatureCanvas | null>(null);

  // For First and Last Name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // For email
  const [email, setEmail] = useState("");

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========== Handlers ==========

  // Clear signatures
  const clearTrainerSig = () => trainerSigRef.current?.clear();
  const clearClientSig = () => clientSigRef.current?.clear();
  const clearParticipantSig = () => participantSigRef.current?.clear();

  // On click Accept & Continue
  const navigate = useNavigate();
  const handleAcceptContinue = async () => {
    try {
      setIsSubmitting(true);
      toast.loading("Processing your contract...");

      let trainerSignatureDataURL = "";
      let clientSignatureDataURL = "";
      let participantSignatureDataURL = "";

      if (trainerSigRef.current) {
        trainerSignatureDataURL = trainerSigRef.current
          .getTrimmedCanvas()
          .toDataURL("image/png");
      }
      if (clientSigRef.current) {
        clientSignatureDataURL = clientSigRef.current
          .getTrimmedCanvas()
          .toDataURL("image/png");
      }
      if (participantSigRef.current) {
        participantSignatureDataURL = participantSigRef.current
          .getTrimmedCanvas()
          .toDataURL("image/png");
      }

      // Create the form data for PDF filling
      const contractFormData: ContractFormData = {
        firstName,
        lastName,
        email,
        phoneNo,
        streetAddress,
        city,
        state,
        zipCode,
        planTitle: selectedPlan.title,
        planPrice: selectedPlan.price.replace(/\$/g, ''),
        planInitiationFee: selectedPlan.initiationFee?.replace(/\$/g, '') || '100',
        planSessions: selectedPlan.sessions,
        planDuration: selectedPlan.duration,
        trainerName,
        clientName: `${firstName} ${lastName}`,
        participantName: `${firstName} ${lastName}`,
        trainerDate,
        clientDate,
        participantDate: trainerDate,
        trainerSignature: trainerSignatureDataURL,
        clientSignature: clientSignatureDataURL,
        participantSignature: participantSignatureDataURL,
        address: {
          street: streetAddress,
          city,
          state,
          zipCode
        },
        personalInfo: {
          firstName,
          lastName,
          email,
          phone: phoneNo
        },
        selectedPlan: {
          ...selectedPlan
        }
      };

      // Generate filled PDFs
      const filledPdfs = await pdfService.prepareContractPdfs(contractFormData);

      // First, upload the filled PDFs to R2
      toast.loading("Uploading your contracts to secure storage...");

      try {
        const uploadResults = await uploadService.uploadFilledPdfsToR2(
          filledPdfs.registrationFormPdf,
          filledPdfs.personalTrainingAgreementPdf,
          filledPdfs.liabilityWaiverPdf,
          contractFormData
        );

        console.log("Contract PDFs uploaded successfully to R2:", uploadResults);

        // Save contract URLs to form data
        contractFormData.contractUrl = uploadResults.contractUrl;
      } catch (uploadError) {
        console.error("Error uploading contracts to R2:", uploadError);
        toast.error("Failed to upload contracts to secure storage, but we'll still email them to you.");
      }

      // Convert PDFs to base64 for email attachments
      const pdfAttachments = [
        {
          filename: 'registration_form.pdf',
          content: pdfService.pdfToBase64(filledPdfs.registrationFormPdf)
        },
        {
          filename: 'personal_training_agreement.pdf',
          content: pdfService.pdfToBase64(filledPdfs.personalTrainingAgreementPdf)
        },
        {
          filename: 'liability_waiver.pdf',
          content: pdfService.pdfToBase64(filledPdfs.liabilityWaiverPdf)
        }
      ];

      // Send emails with PDF attachments
      toast.loading("Sending your contract documents...");
      if (email) {
        await emailService.sendContractConfirmation(
          email,
          {
            firstName,
            lastName,
            email,
            phone: phoneNo
          },
          pdfAttachments
        );
        toast.success("Contract documents sent to your email!");
      }

      // Create form state to pass to the next page
      const formState = {
        trainerInfo: {
          name: trainerName,
          date: trainerDate,
          signature: trainerSignatureDataURL
        },
        clientInfo: {
          name: clientName,
          date: clientDate,
          signature: clientSignatureDataURL
        },
        participantInfo: {
          firstName,
          lastName,
          email,
          signature: participantSignatureDataURL,
          address: {
            street: streetAddress,
            city,
            state,
            zipCode
          },
          phoneNo
        }
      };

      // Navigate to payment selection
      navigate('/registration-flow/payment-selection', {
        state: {
          selectedPlan,
          formState
        }
      });

    } catch (error) {
      console.error('Error processing contract:', error);
      toast.error("An error occurred while processing your contract. Please try again.");
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#1a1a1a] text-white">
      <HeroSection />
      <div className="mx-auto max-w-4xl px-4">
        <RegistrationHeader plan={selectedPlan} />
      </div>
      {selectedPlan && (
        <div className="container mx-auto px-4 max-w-4xl">
          <PaymentSummary plan={selectedPlan} />
        </div>
      )}
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        <Card className="bg-[#1a1a1a]/90 backdrop-blur shadow-xl border border-[#DB6E1E]/30 overflow-hidden">
          <div className="bg-gradient-to-r from-[#DB6E1E] to-[#e08b4c] py-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-md">
              Gym Contract and Waiver
            </h1>
          </div>

          <CardContent className="p-6 md:p-10">
            {/* Payment summary card - improved visual style */}
            <div className="mb-8 p-6 bg-gradient-to-br from-[#1e1e1e] to-[#272727] rounded-xl border border-[#DB6E1E]/30 text-center shadow-md">
              <h3 className="text-xl font-semibold text-white mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <p className="text-lg text-gray-200">
                  <span className="text-gray-400">Plan:</span> <span className="text-white font-medium">{selectedPlan?.title}</span>
                </p>
                <p className="text-lg text-gray-200">
                  <span className="text-gray-400">Sessions:</span> <span className="text-white font-medium">{selectedPlan?.sessions}</span>
                </p>
                <p className="text-lg text-gray-200">
                  <span className="text-gray-400">Plan Price:</span> <span className="text-[#DB6E1E] font-bold">${selectedPlan?.price?.replace(/\$/g, '') || '195'}</span>
                </p>
                <p className="text-lg text-gray-200">
                  <span className="text-gray-400">Initiation Fee:</span> <span className="text-[#DB6E1E] font-bold">${selectedPlan?.initiationFee?.replace(/\$/g, '') || '100'}</span>
                </p>
                <div className="w-full border-b border-[#DB6E1E]/30 my-3"></div>
                <p className="text-xl text-white font-bold">
                  Total initial payment: ${(() => {
                    const price = parseInt(selectedPlan?.price?.replace(/\$/g, '') || '195', 10);
                    const fee = parseInt(selectedPlan?.initiationFee?.replace(/\$/g, '') || '100', 10);
                    return price + fee;
                  })()}
                </p>
              </div>
            </div>

            {/* Contract sections tabs */}
            <div className="mb-10">
              <div className="flex flex-wrap border-b border-[#DB6E1E]/30">
                <button
                  className="px-6 py-3 font-medium text-[#DB6E1E] bg-[#1a1a1a] border-b-2 border-[#DB6E1E] focus:outline-none"
                >
                  Personal Training Agreement
                </button>
                <button
                  className="px-6 py-3 font-medium text-gray-300 hover:text-[#DB6E1E] focus:outline-none"
                >
                  Liability Waiver
                </button>
              </div>
            </div>

            {/* ===================
                PERSONAL TRAINING AGREEMENT
               =================== */}
            <section className="space-y-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-2 bg-[#DB6E1E] rounded-full"></div>
                <h2 className="text-3xl font-bold text-white">
                  Personal Training Agreement
                </h2>
              </div>

              <div className="rounded-lg bg-[#252525] p-6 border-l-4 border-[#DB6E1E] shadow-md">
                <p className="text-lg text-gray-200 text-left">
                  This Agreement is made effective as of <span className="underline">{trainerDate || "[Date]"}</span> by and between <span className="underline">{trainerName || "[Trainer's Name]"}</span>
                  (hereinafter referred to as "Trainer") and <span className="underline">{firstName} {lastName || "[Client's Name]"}</span>
                  (hereinafter referred to as "Client").
                </p>
              </div>

              {/* 1. Session Cancellation */}
              <div className="rounded-lg bg-[#1e1e1e] p-6 transition-all hover:shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E] flex items-center">
                  <span className="inline-flex justify-center items-center bg-[#DB6E1E] text-white rounded-full w-8 h-8 mr-3">1</span>
                  Session Cancellation
                </h3>
                <ul className="list-disc list-outside space-y-3 text-gray-200 ml-6">
                  <li>
                    Cancellations must be made at least <strong className="text-white">4 hours prior</strong> to the scheduled session
                    to avoid loss of the session.
                  </li>
                  <li>
                    If Trainer cancels due to emergency reasons, the Client will be notified as
                    soon as possible.
                  </li>
                  <li>
                    In case a call doesn't go through, leave a voicemail or text message to
                    notify of cancellations.
                  </li>
                </ul>
              </div>

              {/* 2. Contract Early Termination */}
              <div className="rounded-lg bg-[#1e1e1e] p-6 transition-all hover:shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E] flex items-center">
                  <span className="inline-flex justify-center items-center bg-[#DB6E1E] text-white rounded-full w-8 h-8 mr-3">2</span>
                  Contract Early Termination
                </h3>
                <ul className="list-disc list-outside space-y-3 text-gray-200 ml-6">
                  <li>
                    Early termination of the contract will require the payment of <strong className="text-white">half of the
                      remaining contract value</strong>.
                  </li>
                  <li>Upon early termination, all remaining sessions will be forfeited.</li>
                  <li>
                    Clients may choose a <strong className="text-white">$25 freeze option</strong> for any reason; however, the month
                    during which the contract is frozen will not count towards the contract
                    duration.
                  </li>
                  <li>
                    All requests for freezing or cancellation must be submitted at least <strong className="text-white">5
                      business days</strong> prior to the next billing cycle.
                  </li>
                </ul>
              </div>

              {/* 3. Session Timeliness */}
              <div className="rounded-lg bg-[#1e1e1e] p-6 transition-all hover:shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E] flex items-center">
                  <span className="inline-flex justify-center items-center bg-[#DB6E1E] text-white rounded-full w-8 h-8 mr-3">3</span>
                  Session Timeliness
                </h3>
                <ul className="list-disc list-outside space-y-3 text-gray-200 ml-6">
                  <li>
                    Clients arriving late will have their session time cut short accordingly
                    and will not be reimbursed for lost time.
                  </li>
                  <li>
                    If time is lost due to Trainer's tardiness, the missed time will be added
                    to a future session.
                  </li>
                </ul>
              </div>

              {/* 4. Payment Terms */}
              <div className="rounded-lg bg-[#1e1e1e] p-6 transition-all hover:shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E] flex items-center">
                  <span className="inline-flex justify-center items-center bg-[#DB6E1E] text-white rounded-full w-8 h-8 mr-3">4</span>
                  Payment Terms
                </h3>
                <div className="bg-gradient-to-br from-[#DB6E1E]/10 to-[#DB6E1E]/5 p-6 rounded-lg border border-[#DB6E1E]/20">
                  <ul className="list-none space-y-4 text-gray-200">
                    <li className="flex items-start">
                      <div className="min-w-8 h-8 bg-[#DB6E1E]/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-[#DB6E1E]">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white text-lg">Plan Fee:</strong><br />
                        The client agrees to pay the amount of <span className="text-[#DB6E1E] font-medium">${selectedPlan?.price?.replace(/\$/g, '') || '195'}</span> as specified in the selected plan.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-8 h-8 bg-[#DB6E1E]/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-[#DB6E1E]">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white text-lg">Initiation Fee:</strong><br />
                        A one-time initiation fee of <span className="text-[#DB6E1E] font-medium">${selectedPlan?.initiationFee?.replace(/\$/g, '') || '100'}</span> is required for all new clients.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-8 h-8 bg-[#DB6E1E]/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-[#DB6E1E]">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white text-lg">Training Sessions:</strong><br />
                        The number of sessions included is <span className="text-[#DB6E1E] font-medium">{selectedPlan?.sessions}</span> as specified in the selected plan.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-8 h-8 bg-[#DB6E1E]/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-[#DB6E1E]">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white text-lg">Late Fee:</strong><br />
                        Payments made after 5 business days past the due date will incur a <span className="text-[#DB6E1E] font-medium">$25 late fee</span>.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/*   5. Partnership Program */}
              <div className="rounded-lg bg-[#1e1e1e] p-6 transition-all hover:shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E] flex items-center">
                  <span className="inline-flex justify-center items-center bg-[#DB6E1E] text-white rounded-full w-8 h-8 mr-3">5</span>
                  Partnership Program
                </h3>
                <ul className="list-disc list-outside space-y-3 text-gray-200 ml-6">
                  <li>
                    Clients may bring a friend, loved one, or coworker to join a partner program offering <strong className="text-white">$100 savings each month</strong> on a 12-month program (valued at $600/month).
                  </li>
                  <li>
                    Both participants must maintain their contracts to remain eligible.
                  </li>
                  <li>
                    If one participant drops out, the remaining participant will be charged the full $600 for the remaining contract duration.
                  </li>
                </ul>
              </div>

              {/* Agreement Duration */}
              <div className="rounded-lg bg-[#1e1e1e] p-6 transition-all hover:shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E] flex items-center">
                  <span className="inline-flex justify-center items-center bg-[#DB6E1E] text-white rounded-full w-8 h-8 mr-3">6</span>
                  Agreement Duration
                </h3>
                <p className="text-gray-200 ml-6">
                  This agreement shall commence on the effective date and continue for a term of <strong className="text-white">12 months</strong> unless terminated earlier following the provisions of this agreement.
                </p>
              </div>

              {/* Contact Information Form */}
              <div className="mt-12 bg-gradient-to-br from-[#272727] to-[#1a1a1a] rounded-xl p-6 border border-[#DB6E1E]/20 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-md text-gray-200 mb-2 font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="text-black rounded-lg px-10 py-3 w-full bg-white border border-gray-300 focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Your contract documents will be sent to this email address.
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-md text-gray-200 mb-2 font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        placeholder="555-555-5555"
                        className="text-black rounded-lg px-10 py-3 w-full bg-white border border-gray-300 focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-md text-gray-200 mb-2 font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="text-black rounded-lg px-4 py-3 w-full bg-white border border-gray-300 focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-md text-gray-200 mb-2 font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="text-black rounded-lg px-4 py-3 w-full bg-white border border-gray-300 focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-white mt-6 mb-4">Address</h4>

                <div className="space-y-6">
                  {/* Street Address */}
                  <div>
                    <label className="block text-md text-gray-200 mb-2 font-medium">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="123 Main St"
                      className="text-black rounded-lg px-4 py-3 w-full bg-white border border-gray-300 focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* City */}
                    <div className="col-span-2 md:col-span-2">
                      <label className="block text-md text-gray-200 mb-2 font-medium">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="text-black rounded-lg px-4 py-3 w-full bg-white border border-gray-300 focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                        required
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-md text-gray-200 mb-2 font-medium">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="text-black rounded-lg px-4 py-3 w-full bg-white border border-gray-300 focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all appearance-none"
                        required
                      >
                        <option value="" disabled>Select</option>
                        {/* State options (abbreviated for brevity) */}
                        <option value="AL">AL</option>
                        <option value="AK">AK</option>
                        <option value="AZ">AZ</option>
                        <option value="CA">CA</option>
                        <option value="CO">CO</option>
                        <option value="FL">FL</option>
                        <option value="GA">GA</option>
                        <option value="NY">NY</option>
                        <option value="TX">TX</option>
                        {/* ...other states */}
                      </select>
                    </div>

                    {/* ZIP */}
                    <div>
                      <label className="block text-md text-gray-200 mb-2 font-medium">
                        ZIP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="ZIP Code"
                        className="text-black rounded-lg px-4 py-3 w-full bg-white border border-gray-300 focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="mt-12 bg-gradient-to-br from-[#272727] to-[#1a1a1a] rounded-xl p-6 border border-[#DB6E1E]/20 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-white">Signatures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Client signature */}
                  <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-700">
                    <label className="block text-lg text-white mb-3 font-semibold">
                      Client Signature <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-gray-300 bg-white rounded-md mb-3">
                      <SignatureCanvas
                        ref={clientSigRef}
                        canvasProps={{
                          width: 450,
                          height: 150,
                          className: "clientSignatureCanvas w-full",
                          style: { backgroundColor: "white" }
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <button
                        onClick={clearClientSig}
                        className="px-4 py-2 border-2 border-[#DB6E1E] text-[#DB6E1E] 
                        hover:bg-[#DB6E1E] hover:text-white rounded-md transition-all"
                        type="button"
                      >
                        Clear
                      </button>

                      <div className="flex items-center">
                        <label className="mr-2 text-gray-300">Date:</label>
                        <input
                          type="date"
                          value={clientDate}
                          onChange={(e) => setClientDate(e.target.value)}
                          className="text-black rounded px-3 py-2 border border-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trainer signature */}
                  <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-700">
                    <label className="block text-lg text-white mb-3 font-semibold">
                      Trainer Signature
                    </label>
                    <div className="border-2 border-gray-300 bg-white rounded-md mb-3">
                      <SignatureCanvas
                        ref={trainerSigRef}
                        canvasProps={{
                          width: 450,
                          height: 150,
                          className: "trainerSignatureCanvas w-full",
                          style: { backgroundColor: "white" }
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <button
                        onClick={clearTrainerSig}
                        className="px-4 py-2 border-2 border-[#DB6E1E] text-[#DB6E1E] 
                        hover:bg-[#DB6E1E] hover:text-white rounded-md transition-all"
                        type="button"
                      >
                        Clear
                      </button>

                      <div className="flex items-center">
                        <label className="mr-2 text-gray-300">Date:</label>
                        <input
                          type="date"
                          value={trainerDate}
                          onChange={(e) => setTrainerDate(e.target.value)}
                          className="text-black rounded px-3 py-2 border border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================
                NAVIGATION BUTTONS
               ============================ */}
            <div className="flex justify-center space-x-4 mt-12">
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-transparent border-2 border-[#DB6E1E] text-[#DB6E1E] 
                  hover:bg-[#DB6E1E]/10 hover:border-[#DB6E1E] hover:text-white rounded-xl 
                  font-medium transition-all duration-200 shadow-md"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                onClick={handleAcceptContinue}
                className="px-10 py-3 bg-gradient-to-r from-[#DB6E1E] to-[#e08b4c] text-white 
                  hover:from-[#c25812] hover:to-[#d07c3d] rounded-xl font-medium 
                  transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed 
                  flex items-center justify-center min-w-[180px]"
                disabled={isSubmitting || !email || !firstName || !lastName || !streetAddress || !city || !state || !zipCode || !phoneNo}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymContractAndWaiver;
