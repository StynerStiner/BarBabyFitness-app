// 1. Importing React and other necessary libraries
import React, { useRef, useState, useEffect, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";
import RegistrationHeader from "@/pages/GymRegistrationForm/components/RegistrationHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Dumbbell, ChevronRight } from "lucide-react";

// Services
import { ContractFormData } from "@/services/pdfService";
import { fillAndUploadContractPdfs } from "@/api/upload-filled-pdfs";

// Plan interface
import type { Plan } from "@/pages/TrainingOptions/components/types";

/**
 * GymContractAndWaiver component where users accept the gym's contract and waiver
 */
const GymContractAndWaiver: React.FC = () => {
  // Get selected plan from state
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan as Plan | null;

  // State for client information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const trainingSignatureRef = useRef<SignatureCanvas | null>(null);
  const liabilitySignatureRef = useRef<SignatureCanvas | null>(null);

  // Store signature data for submission
  const [trainingSignatureData, setTrainingSignatureData] = useState("");
  const [liabilitySignatureData, setLiabilitySignatureData] = useState("");

  // Add state for active tab
  const [activeTab, setActiveTab] = useState<'training' | 'liability'>('training');

  // State for storing document URLs after upload
  const [contractUrls, setContractUrls] = useState<{
    registrationFormUrl: string;
    personalTrainingAgreementUrl: string;
    liabilityWaiverUrl: string;
    contractUrl: string;
  } | null>(null);

  // State for tracking upload progress
  const [isUploading, setIsUploading] = useState(false);

  // Functions to clear signatures
  const clearTrainingSignature = () => {
    console.log("Clearing training signature");
    if (trainingSignatureRef.current) {
      trainingSignatureRef.current.clear();
      setTrainingSignatureData("");
      console.log("Training signature cleared successfully");
    } else {
      console.warn("Training signature ref is null, cannot clear");
    }
  };

  const clearLiabilitySignature = () => {
    console.log("Clearing liability signature");
    if (liabilitySignatureRef.current) {
      liabilitySignatureRef.current.clear();
      setLiabilitySignatureData("");
      console.log("Liability signature cleared successfully");
    } else {
      console.warn("Liability signature ref is null, cannot clear");
    }
  };

  // Function to save the current signature based on the active tab
  const saveCurrentSignature = useCallback(() => {
    if (activeTab === 'training' && trainingSignatureRef.current && !trainingSignatureRef.current.isEmpty()) {
      const dataURL = trainingSignatureRef.current.getTrimmedCanvas().toDataURL("image/png");
      setTrainingSignatureData(dataURL);
      console.log("Training signature saved");
    } else if (activeTab === 'liability' && liabilitySignatureRef.current && !liabilitySignatureRef.current.isEmpty()) {
      const dataURL = liabilitySignatureRef.current.getTrimmedCanvas().toDataURL("image/png");
      setLiabilitySignatureData(dataURL);
      console.log("Liability signature saved");
    }
  }, [activeTab]);

  // Simplified signature saving: Save when tab changes or before submission.
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  // Fallback handling
  if (!selectedPlan) {
    return <div>Please select a plan to proceed.</div>;
  }

  // Component to display plan details, similar to PlanDetails from registration page
  const PlanDetailsBox = ({ plan }: { plan: Plan }) => {
    const sessions = plan.sessions || "12 sessions per month";
    const initiationFee = plan.initiationFee || "$100";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 p-6 bg-gradient-to-r from-[#DB6E1E]/10 to-orange-500/5 rounded-xl border border-orange-500/20 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
          <Dumbbell className="w-5 h-5" />
          Selected Plan: {plan.title}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span className="text-gray-400">Duration:</span>
              <span className="text-orange-400 font-medium">{plan.duration}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span className="text-gray-400">Price:</span>
              <span className="text-orange-400 font-medium">{plan.price}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span className="text-gray-400">Sessions:</span>
              <span className="text-orange-400 font-medium">{sessions}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span className="text-gray-400">Initiation Fee:</span>
              <span className="text-orange-400 font-medium">
                {initiationFee}
              </span>
            </div>
          </div>
        </div>
        {plan.perks && (
          <p className="text-gray-400 mt-4 p-3 bg-white/5 rounded">
            {plan.perks}
          </p>
        )}
      </motion.div>
    );
  };

  // Add state for checkbox
  const [contractsAgreed, setContractsAgreed] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#1a1a1a] text-white">
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:pt-12 md:pt-16">
        <RegistrationHeader plan={selectedPlan ? { ...selectedPlan, perks: selectedPlan.perks || "", icon: selectedPlan.icon || null } : null} />

        {selectedPlan && <PlanDetailsBox plan={selectedPlan} />}
      </div>
      {selectedPlan && (
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 p-4 bg-[#DB6E1E]/10 rounded-lg border border-[#DB6E1E]/20 text-center">
            <p className="text-sm sm:text-base md:text-lg text-gray-200">
              By signing this contract, you agree to pay a <span className="text-[#DB6E1E] font-bold">one-time initiation fee of ${selectedPlan?.initiationFee?.replace(/\$/g, '') || '100'}</span> and <span className="text-[#DB6E1E] font-bold">${selectedPlan?.price?.replace(/\$/g, '') || '195'}</span> for the <span className="text-[#DB6E1E] font-bold">{selectedPlan?.title}</span> plan, which includes <span className="text-[#DB6E1E] font-bold">{selectedPlan?.sessions}</span>.
            </p>
            <p className="text-base sm:text-lg text-white font-bold mt-2">
              Total initial payment: ${(() => {
                const price = parseInt(selectedPlan?.price?.replace(/\$/g, '') || '195', 10);
                const fee = parseInt(selectedPlan?.initiationFee?.replace(/\$/g, '') || '100', 10);
                return price + fee;
              })()}
            </p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-5xl">
        <Card className="bg-[#1a1a1a]/90 backdrop-blur border-[#DB6E1E]/20 p-2 sm:p-4 md:p-6 lg:p-8 relative" style={{ position: 'relative', zIndex: 1 }}>
          <CardContent className="p-2 sm:p-4 md:p-6 lg:p-8 relative" style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="mb-4 sm:mb-8 text-center">
              <span className="inline-block px-3 sm:px-6 py-2 sm:py-3 bg-[#DB6E1E] text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wider rounded-lg shadow-lg border-2 border-[#DB6E1E]/80">
                Gym Contract and Waiver
              </span>
            </h1>

            <div className="flex mb-6 border-b border-[#DB6E1E]/20">
              <button
                className={`py-3 px-5 font-medium text-lg ${activeTab === 'training' ? 'text-[#DB6E1E] border-b-2 border-[#DB6E1E] font-bold' : 'text-gray-400 hover:text-white'}`}
                onClick={() => {
                  if (activeTab === 'liability') {
                    if (liabilitySignatureRef.current && !liabilitySignatureRef.current.isEmpty()) {
                      setLiabilitySignatureData(liabilitySignatureRef.current.getTrimmedCanvas().toDataURL("image/png"));
                      console.log("Liability signature saved when switching to training tab");
                    }
                  }
                  setActiveTab('training');
                }}
              >
                Training Agreement
              </button>
              <button
                className={`py-3 px-5 font-medium text-lg ${activeTab === 'liability' ? 'text-[#DB6E1E] border-b-2 border-[#DB6E1E] font-bold' : 'text-gray-400 hover:text-white'}`}
                onClick={() => {
                  if (activeTab === 'training') {
                    if (trainingSignatureRef.current && !trainingSignatureRef.current.isEmpty()) {
                      setTrainingSignatureData(trainingSignatureRef.current.getTrimmedCanvas().toDataURL("image/png"));
                      console.log("Training signature saved when switching to liability tab");
                    }
                  }
                  setActiveTab('liability');
                }}
              >
                Liability Waiver
              </button>
            </div>

            {activeTab === 'training' && (
              <div className="bg-white rounded-lg border border-gray-300 shadow-md">
                <div className="h-[400px] overflow-y-auto p-6 text-gray-800" style={{ scrollbarWidth: 'thin', position: 'relative' }}>
                  <div className="flex justify-center mb-8">
                    <img
                      src="https://pub-ae7a867ffdfc4078b5859520121853d0.r2.dev/SinglePage-Contracts-BarBabyFitnes.png"
                      alt="BarBaby Fitness Logo"
                      className="max-h-24 w-auto"
                    />
                  </div>
                  <div className="w-full border-b-2 border-[#DB6E1E]/30 mb-6"></div>
                  <h2 className="text-2xl font-bold text-[#DB6E1E] mb-6 text-center">BARBABY FITNESS PERSONAL TRAINING CONTRACT</h2>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-[#DB6E1E]">
                    <p className="mb-0">
                      This Personal Training Contract ("Contract") is entered into by and between Barbaby Fitness ("Trainer/Owner") and the undersigned client ("Client"). By signing below, the Client agrees to comply with the terms and conditions outlined in this Contract.
                    </p>
                  </div>
                  <div className="mt-10 border-t-2 border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Authorization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB6E1E]"
                          placeholder="Enter your first name"
                        />
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB6E1E]"
                          placeholder="Enter your last name"
                        />
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB6E1E]"
                          placeholder="Enter your email"
                        />
                        <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          id="phoneNo"
                          value={phoneNo}
                          onChange={(e) => setPhoneNo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB6E1E]"
                          placeholder="Enter your phone number"
                        />
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">Date</label>
                          <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Client Signature</label>
                        <div className="border-2 border-gray-300 rounded-md h-36 bg-gray-50 p-2 relative" style={{ zIndex: 1, position: 'relative' }}>
                          <SignatureCanvas
                            ref={trainingSignatureRef}
                            canvasProps={{
                              className: 'w-full h-full cursor-pointer',
                              id: 'training-signature-canvas',
                              style: { backgroundColor: 'white', position: 'relative', zIndex: 10 },
                              // @ts-ignore - Keeping this for now, but hoping onEnded works
                              onEnded: saveCurrentSignature, // Changed from onEnd to onEnded
                            }}
                          />
                        </div>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={clearTrainingSignature}
                            className="text-sm text-[#DB6E1E] hover:underline">
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'liability' && (
              <div className="bg-white rounded-lg border border-gray-300 shadow-md">
                <div className="h-[400px] overflow-y-auto p-6 text-gray-800" style={{ scrollbarWidth: 'thin', position: 'relative' }}>
                  <div className="flex justify-center mb-8">
                    <img
                      src="https://pub-ae7a867ffdfc4078b5859520121853d0.r2.dev/SinglePage-Contracts-BarBabyFitnes.png"
                      alt="BarBaby Fitness Logo"
                      className="max-h-24 w-auto"
                    />
                  </div>
                  <div className="w-full border-b-2 border-[#DB6E1E]/30 mb-6"></div>
                  <h2 className="text-2xl font-bold text-[#DB6E1E] mb-6 text-center">LIABILITY WAIVER & RELEASE</h2>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-[#DB6E1E]">
                    <p className="font-semibold text-center">
                      THIS FORM MUST BE READ AND SIGNED BEFORE THE PARTICIPANT IS ALLOWED TO TAKE PART IN ANY ACTIVITIES
                    </p>
                  </div>
                  <div className="mt-10 border-t-2 border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Participant Authorization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label htmlFor="liability_firstName" className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="liability_firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB6E1E]"
                          placeholder="Enter your first name"
                          required
                        />
                        <label htmlFor="liability_lastName" className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="liability_lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB6E1E]"
                          placeholder="Enter your last name"
                          required
                        />
                        <label htmlFor="liability_email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          id="liability_email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB6E1E]"
                          placeholder="Enter your email"
                          required
                        />
                        <label htmlFor="liability_phoneNo" className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          id="liability_phoneNo"
                          value={phoneNo}
                          onChange={(e) => setPhoneNo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB6E1E]"
                          placeholder="Enter your phone number"
                        />
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">Date</label>
                          <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Participant Signature</label>
                        <div className="border-2 border-gray-300 rounded-md h-36 bg-gray-50 p-2 relative" style={{ zIndex: 1, position: 'relative' }}>
                          <SignatureCanvas
                            ref={liabilitySignatureRef}
                            canvasProps={{
                              className: 'w-full h-full cursor-pointer',
                              id: 'liability-signature-canvas',
                              style: { backgroundColor: 'white', position: 'relative', zIndex: 10 },
                              // @ts-ignore - Keeping this for now, but hoping onEnded works
                              onEnded: saveCurrentSignature, // Changed from onEnd to onEnded
                            }}
                          />
                        </div>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={clearLiabilitySignature}
                            className="text-sm text-[#DB6E1E] hover:underline">
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center">
              <input
                type="checkbox"
                id="agree-contract"
                checked={contractsAgreed}
                onChange={() => setContractsAgreed(!contractsAgreed)}
                className="h-5 w-5 accent-[#DB6E1E] cursor-pointer"
              />
              <label htmlFor="agree-contract" className="ml-3 text-white cursor-pointer">
                I have read and agree to both the Training Agreement and Liability Waiver
              </label>
            </div>

            <div className="mt-20 flex justify-center" id="continue-button-container" style={{ position: 'relative', zIndex: 9999, pointerEvents: 'auto' }}>
              <button
                id="continue-button"
                type="button"
                aria-label="Continue to payment"
                style={{ position: 'relative', zIndex: 9999, pointerEvents: 'auto' }}
                onClick={async (e) => {
                  console.log("Continue button clicked", new Date().toISOString());
                  e.preventDefault();

                  saveCurrentSignature();

                  if (trainingSignatureRef.current && !trainingSignatureRef.current.isEmpty() && !trainingSignatureData) {
                    setTrainingSignatureData(trainingSignatureRef.current.getTrimmedCanvas().toDataURL("image/png"));
                    console.log("Training signature force-saved on continue");
                  }
                  if (liabilitySignatureRef.current && !liabilitySignatureRef.current.isEmpty() && !liabilitySignatureData) {
                    setLiabilitySignatureData(liabilitySignatureRef.current.getTrimmedCanvas().toDataURL("image/png"));
                    console.log("Liability signature force-saved on continue");
                  }

                  await new Promise(resolve => setTimeout(resolve, 100));

                  console.log("Form validation state before submission:", {
                    contractsAgreed,
                    firstName,
                    lastName,
                    email,
                    phoneNo,
                    trainingSignatureDataExists: !!trainingSignatureData,
                    liabilitySignatureDataExists: !!liabilitySignatureData,
                  });

                  if (!contractsAgreed) {
                    toast.error("Please agree to the contracts before proceeding.");
                    return;
                  }

                  if (!firstName.trim() || !lastName.trim()) {
                    toast.error("Please enter your first and last name.");
                    return;
                  }

                  if (!email.trim()) {
                    toast.error("Please enter your email address.");
                    return;
                  }

                  if (!/\S+@\S+\.\S+/.test(email)) {
                    toast.error("Please enter a valid email address.");
                    return;
                  }

                  if (!phoneNo.trim()) {
                    toast.error("Please enter your phone number.");
                    return;
                  }

                  if (phoneNo.replace(/\D/g, '').length < 7) {
                    toast.error("Please enter a valid phone number.");
                    return;
                  }

                  if (!trainingSignatureData && !liabilitySignatureData) {
                    let trainingDrawn = false;
                    let liabilityDrawn = false;
                    if (trainingSignatureRef.current && !trainingSignatureRef.current.isEmpty()) {
                      setTrainingSignatureData(trainingSignatureRef.current.getTrimmedCanvas().toDataURL("image/png"));
                      trainingDrawn = true;
                    }
                    if (liabilitySignatureRef.current && !liabilitySignatureRef.current.isEmpty()) {
                      setLiabilitySignatureData(liabilitySignatureRef.current.getTrimmedCanvas().toDataURL("image/png"));
                      liabilityDrawn = true;
                    }
                    if (!trainingDrawn && !liabilityDrawn) {
                      toast.error("Please sign at least one of the documents (Training Agreement or Liability Waiver).");
                      return;
                    }
                    await new Promise(resolve => setTimeout(resolve, 50));
                  }

                  setIsUploading(true);
                  toast.loading("Processing your contracts. This may take a moment...");

                  try {
                    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    const contractFormData: ContractFormData = {
                      firstName,
                      lastName,
                      email,
                      phoneNo,
                      streetAddress: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      selectedPlan,
                      signatureDate: currentDate,
                      trainingSignature: trainingSignatureData,
                      liabilitySignature: liabilitySignatureData,
                      signatureDataURL: trainingSignatureData || liabilitySignatureData,
                      clientSignature: trainingSignatureData,
                      participantSignature: liabilitySignatureData,
                      clientSignatureDataURL: trainingSignatureData,
                      participantSignatureDataURL: liabilitySignatureData,
                    };

                    console.log("Submitting contractFormData:", JSON.stringify({
                      ...contractFormData,
                      trainingSignature: contractFormData.trainingSignature ? 'exists' : 'missing',
                      liabilitySignature: contractFormData.liabilitySignature ? 'exists' : 'missing',
                      signatureDataURL: contractFormData.signatureDataURL ? 'exists' : 'missing',
                      clientSignatureDataURL: contractFormData.clientSignatureDataURL ? 'exists' : 'missing',
                      participantSignatureDataURL: contractFormData.participantSignatureDataURL ? 'exists' : 'missing',
                    }, null, 2));

                    const pdfUrls = await fillAndUploadContractPdfs(contractFormData);

                    setContractUrls({
                      registrationFormUrl: pdfUrls.registrationUrl,
                      personalTrainingAgreementUrl: pdfUrls.trainingAgreementUrl,
                      liabilityWaiverUrl: pdfUrls.liabilityWaiverUrl,
                      contractUrl: pdfUrls.trainingAgreementUrl,
                    });

                    toast.dismiss();
                    const hasErrors = Object.values(pdfUrls).some(url => url.startsWith('error://'));

                    if (hasErrors) {
                      toast.error("There was an issue generating some documents, but we can proceed.", { duration: 5000 });
                      console.error("PDF generation/upload resulted in error URLs:", pdfUrls);
                    } else {
                      toast.success("Contract documents signed and saved successfully!", { duration: 4000 });
                    }

                    navigate('/registration-flow/payment-selection', {
                      state: {
                        selectedPlan,
                        clientInfo: {
                          firstName,
                          lastName,
                          email,
                          phoneNo,
                          signatureDate: currentDate,
                          signatureDataURL: trainingSignatureData || liabilitySignatureData,
                        },
                        contractUrls: pdfUrls,
                      },
                    });

                  } catch (error) {
                    toast.dismiss();
                    const errorMessage = error instanceof Error ? error.message : "Unknown error processing contracts";
                    console.error("Contract processing error:", error);
                    toast.error(
                      <div>
                        <p>Error processing contracts: {errorMessage}</p>
                        <button
                          className="mt-2 px-4 py-2 bg-[#DB6E1E] text-white rounded-md"
                          onClick={() => {
                            const placeholderUrls = {
                              registrationFormUrl: `error://registration-failed-${Date.now()}`,
                              personalTrainingAgreementUrl: `error://training-agreement-failed-${Date.now()}`,
                              liabilityWaiverUrl: `error://liability-waiver-failed-${Date.now()}`,
                              contractUrl: `error://contract-failed-${Date.now()}`,
                            };
                            setContractUrls(placeholderUrls);
                            navigate('/registration-flow/payment-selection', {
                              state: {
                                selectedPlan,
                                clientInfo: { firstName, lastName, email, phoneNo, signatureDate: new Date().toLocaleDateString() },
                                contractUrls: placeholderUrls,
                              },
                            });
                          }}
                        >
                          Continue to Payment Anyway
                        </button>
                      </div>,
                      { duration: 10000 }
                    );
                  } finally {
                    setIsUploading(false);
                  }
                }}
                disabled={!contractsAgreed || !firstName.trim() || !lastName.trim() || !email.trim() || !phoneNo.trim() || isUploading}
                className={`px-16 py-5 rounded-lg flex items-center ${!contractsAgreed || !firstName.trim() || !lastName.trim() || !email.trim() || !phoneNo.trim() || isUploading
                  ? 'bg-gray-500 cursor-not-allowed opacity-70'
                  : 'bg-[#DB6E1E] hover:bg-[#c75e15] hover:scale-105 transition-all duration-300 shadow-xl'} text-white font-bold focus:outline-none focus:ring-4 focus:ring-[#DB6E1E] focus:ring-opacity-50 relative z-50 text-2xl tracking-wide border-2 border-[#DB6E1E]/80`}
              >
                {isUploading ? (
                  <>Uploading...</>
                ) : (!contractsAgreed || !firstName.trim() || !lastName.trim() || !email.trim() || !phoneNo.trim()) ? (
                  <>Complete Required Fields</>
                ) : (
                  <>Continue <ChevronRight className="ml-2 h-5 w-5" /></>
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
