// 1. Importing React and other necessary libraries
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import RegistrationHeader from "@/pages/GymRegistrationForm/components/RegistrationHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { useLocation, useNavigate } from "react-router-dom";
import HeroSection from "@/pages/GymRegistrationForm/components/HeroSection";

// 2. Import Plan type from the types file (add this line here)
import type { Plan } from "@/pages/TrainingOptions/components/types";  // <-- Add this import here

// 4. Import PaymentSummary component
import PaymentSummary from "@/pages/GymRegistrationForm/components/PaymentSummary";

// 5. Declare the Plan prop interface for this component
interface GymContractAndWaiverProps {
  selectedPlan: Plan | null;  // <-- Add the selectedPlan prop here
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

  // ========== Handlers ==========

  // Clear signatures
  const clearTrainerSig = () => trainerSigRef.current?.clear();
  const clearClientSig = () => clientSigRef.current?.clear();
  const clearParticipantSig = () => participantSigRef.current?.clear();

  // On click Accept & Continue
  const navigate = useNavigate();
  const handleAcceptContinue = () => {
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

    console.log("Trainer Name:", trainerName);
    console.log("Trainer Date:", trainerDate);
    console.log("Trainer Signature:", trainerSignatureDataURL);

    console.log("Client Name:", clientName);
    console.log("Client Date:", clientDate);
    console.log("Client Signature:", clientSignatureDataURL);

    console.log("Participant Name:", participantName);
    console.log("Participant Signature:", participantSignatureDataURL);
    console.log("Street Address:", streetAddress);
    console.log("City:", city);
    console.log("State:", state);
    console.log("ZIP Code:", zipCode);
    console.log("Phone No.:", phoneNo);

    // Replace window.location.href with navigate
    navigate('/registration-flow/payment-selection', {
      state: {
        selectedPlan,
        formState: {
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
            signature: participantSignatureDataURL,
            address: {
              street: streetAddress,
              city,
              state,
              zipCode
            },
            phoneNo
          }
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#1a1a1a] text-white">
      <HeroSection /> {/* Add this line here, at the very top */}
      <div className="mx-auto max-w-4xl px-4">
        <RegistrationHeader plan={selectedPlan} />
      </div>
      {selectedPlan && (
        <div className="container mx-auto px-4 max-w-4xl">
          <PaymentSummary plan={selectedPlan} />
        </div>
      )}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Changed from max-w-5xl to max-w-4xl */}

        <Card className="bg-[#1a1a1a]/90 backdrop-blur border-[#DB6E1E]/20 p-6 md:p-8">

          <CardContent className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
              Gym Contract and Waiver
            </h1>

            {/* Add a total cost statement - fixed formatting */}
            <div className="mb-8 p-4 bg-[#DB6E1E]/10 rounded-lg border border-[#DB6E1E]/20 text-center">
              <p className="text-lg text-gray-200">
                By signing this contract, you agree to pay a <span className="text-[#DB6E1E] font-bold">one-time initiation fee of ${selectedPlan?.initiationFee?.replace(/\$/g, '') || '100'}</span> and <span className="text-[#DB6E1E] font-bold">${selectedPlan?.price?.replace(/\$/g, '') || '195'}</span> for the <span className="text-[#DB6E1E] font-bold">{selectedPlan?.title}</span> plan, which includes <span className="text-[#DB6E1E] font-bold">{selectedPlan?.sessions}</span>.
              </p>
              <p className="text-lg text-white font-bold mt-2">
                Total initial payment: ${(() => {
                  const price = parseInt(selectedPlan?.price?.replace(/\$/g, '') || '195', 10);
                  const fee = parseInt(selectedPlan?.initiationFee?.replace(/\$/g, '') || '100', 10);
                  return price + fee;
                })()}
              </p>
            </div>

            {/* ===================
                PERSONAL TRAINING AGREEMENT
               =================== */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold mb-6 text-[#DB6E1E]">
                Personal Training Agreement
              </h2>
              <p className="text-lg text-gray-200 text-left">
                This Agreement is made effective as of [Date] by and between [Trainer's Name]
                (hereinafter referred to as "Trainer") and [Client's Name]
                (hereinafter referred to as "Client").
              </p>

              {/* 1. Session Cancellation */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E]">
                  1. Session Cancellation
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-200 ml-4">
                  <li>
                    Cancellations must be made at least 4 hours prior to the scheduled session
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
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E]">
                  2. Contract Early Termination
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-200 ml-4">
                  <li>
                    Early termination of the contract will require the payment of half of the
                    remaining contract value.
                  </li>
                  <li>Upon early termination, all remaining sessions will be forfeited.</li>
                  <li>
                    Clients may choose a $25 freeze option for any reason; however, the month
                    during which the contract is frozen will not count towards the contract
                    duration.
                  </li>
                  <li>
                    All requests for freezing or cancellation must be submitted at least 5
                    business days prior to the next billing cycle.
                  </li>
                </ul>
              </div>

              {/* 3. Session Timeliness */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E]">
                  3. Session Timeliness
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-200 ml-4">
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
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E]">
                  4. Payment Terms
                </h3>
                <div className="bg-[#DB6E1E]/10 p-4 rounded-lg border border-[#DB6E1E]/20">
                  <ul className="list-disc list-inside space-y-3 text-gray-200 ml-4">
                    <li>
                      <strong>Plan Fee:</strong> The client agrees to pay the amount specified in the selected plan.
                    </li>
                    <li>
                      <strong>Initiation Fee:</strong> A one-time initiation fee of $100 is required for all new clients.
                    </li>
                    <li>
                      <strong>Training Sessions:</strong> The number of sessions included is specified in the selected plan.
                    </li>
                    <li>
                      <strong>Late Fee:</strong> Payments made after 5 business days past the due date will incur a $25 late fee.
                    </li>
                  </ul>
                </div>
              </div>

              {/*   5. Partnership Program */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E]">
                  5. Partnership Program
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-200 ml-4">
                  <li>
                    Clients may bring a friend, loved one, or coworker to join a partner program offering $100 savings each month on a 12-month program (valued at $600/month).
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
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#DB6E1E]">
                  Agreement Duration
                </h3>
                <p className="text-gray-200 ml-4">
                  This agreement shall commence on the effective date and continue for a term of 12 months unless terminated earlier following the provisions of this agreement.
                </p>
              </div>
              {/* Termination */}
              {/* Participant Name */}
              <div>
                <label className="block text-md text-gray-200 mb-1">
                  Participant Name:
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="text-black rounded px-3 py-2 flex-1"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="text-black rounded px-3 py-2 flex-1"
                  />
                </div>
              </div>


              <div className="mt-12 pt-8 border-t border-[#DB6E1E]/20">
                <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
                  {/* Trainer signature */}
                  <div>
                    <label className="block text-lg text-gray-200 mb-2">
                      Trainer Signature:
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="border border-gray-300 bg-white inline-block">
                        <SignatureCanvas
                          ref={trainerSigRef}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "trainerSignatureCanvas",
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        value={trainerDate}
                        onChange={(e) => setTrainerDate(e.target.value)}
                        placeholder="mm/dd/yyyy"
                        className="text-black rounded px-2 py-1 w-full max-w-[150px] border border-gray-300"
                      />
                    </div>
                    <button
                      onClick={clearTrainerSig}
                      className="mt-2 px-3 py-1 border-2 border-[#DB6E1E] text-[#DB6E1E] 
          hover:bg-[#DB6E1E] hover:text-white rounded-md"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Client signature */}
                  <div>
                    <label className="block text-lg text-gray-200 mb-2">
                      Client Signature:
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="border border-gray-300 bg-white inline-block">
                        <SignatureCanvas
                          ref={clientSigRef}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "clientSignatureCanvas",
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        value={clientDate}
                        onChange={(e) => setClientDate(e.target.value)}
                        placeholder="mm/dd/yyyy"
                        className="text-black rounded px-2 py-1 w-full max-w-[150px] border border-gray-300"
                      />
                    </div>
                    <button
                      onClick={clearClientSig}
                      className="mt-2 px-3 py-1 border-2 border-[#DB6E1E] text-[#DB6E1E] 
          hover:bg-[#DB6E1E] hover:text-white rounded-md"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>


            </section>

            {/* ======================
                ASSUMPTION OF RISK
               ====================== */}
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-6 text-[#DB6E1E]">
                Assumption of Risk & Release of Liability
              </h2>

              <div className="space-y-6 text-gray-200">
                <p className="font-semibold text-lg">
                  THIS FORM MUST BE READ AND SIGNED BEFORE PARTICIPATION IN ANY ACTIVITIES
                </p>
                <p>
                  I understand and agree that Bar Baby Fitness, LLC. is <strong>NOT RESPONSIBLE</strong>{" "}
                  for any injury, disability, death, or loss of property I may suffer while
                  present at the fitness center ("Gym") for exercises, other activities, or
                  for any reason whatsoever.
                </p>
                <p>
                  For and in consideration of permission to enter the Gym or to perform any
                  activities at the Gym, I, for myself and on behalf of my heirs, assigns,
                  personal representatives and next of kin, hereby release, discharge, waive
                  and relinquish Bar Baby Fitness LLC, and any of their partners, affiliates,
                  members, contractors, agents, volunteers, and employees ("Release"), from
                  any or all present and future claims of injury, disability, death, or loss
                  of property however they may occur, including any ordinary negligence,
                  except for any intentional misconduct of Release.
                </p>
                <p>
                  Further, I am aware of the following risks, and numerous other inherent
                  risks in observing or participating in any exercises or any incidental
                  activities thereto. These risks include, but are not limited to, serious
                  injury or death resulting from: Slips, trips, falls, collision with other
                  persons in the gym, malfunction of equipment, muscle and tendon injuries,
                  fractures, abnormal blood pressure, fainting, disorders of heart rhythm,
                  and heart attack.
                </p>
                <p>
                  Although a complete list of all risks has not been provided to me, I
                  subjectively understand the risks of my participation in exercises or other
                  physical activities, and knowing and appreciating these risks, I voluntarily
                  choose to be present at the Gym for exercise, other activities, or for any
                  reason whatsoever, and assume all risks, both known and unknown, of personal
                  injury, death, or loss or damage to property. I further acknowledge that I
                  have been advised to seek physician approval before participating in any
                  exercises or other physical activities. I further acknowledge that I have
                  had an opportunity to ask questions and any questions I have asked have been
                  answered to my complete satisfaction. I further agree to indemnify and hold
                  harmless Releases for all claims arising from my participation in exercise
                  or other activities at the Gym.
                </p>
                <p>
                  If any provision of this release is held to be invalid or unenforceable,
                  then all other provisions shall continue to be valid and enforceable, and
                  the valid or unenforceable provisions shall be modified, reformed, or
                  restricted, to the minimum extent possible to make that provision valid and
                  enforceable. I affirm that I am of legal age and freely read and sign this
                  release.
                </p>
                <p>
                  I HAVE READ THIS ASSUMPTION OF RISK AGREEMENT AND RELEASE OF LIABILITY,
                  FULLY UNDERSTAND THAT I HAVE GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT,
                  AND SIGN IT FREELY AND VOLUNTARILY AND VOLUNTARILY WITHOUT ANY INDICEMENT.
                </p>

                {/* EXACT placeholders replaced by real inputs */}
                <div className="mt-12 space-y-4">
                  {/* Participant Name */}
                  <div>
                    <label className="block text-md text-gray-200 mb-1">
                      Participant Name:
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="text-black rounded px-3 py-2 flex-1"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="text-black rounded px-3 py-2 flex-1"
                      />
                    </div>
                  </div>

                  {/* Participant's Signature (Signature Pad) */}
                  <div>
                    <label className="block text-md text-gray-200 mb-1">
                      Participant's Signature:
                    </label>
                    <div className="border border-gray-300 bg-white inline-block">
                      <SignatureCanvas
                        ref={participantSigRef}
                        canvasProps={{
                          width: 400,
                          height: 100,
                          className: "participantSignatureCanvas",
                        }}
                      />
                    </div>
                    <button
                      onClick={clearParticipantSig}
                      className="ml-2 px-3 py-1 border-2 border-[#DB6E1E] text-[#DB6E1E] 
                        hover:bg-[#DB6E1E] hover:text-white rounded-md"
                    >
                      Clear
                    </button>
                  </div>
                  {/* Participant's Date */}
                  <div className="mt-4">
                    <label className="block text-md text-gray-200 mb-1">
                      Participant's Date:
                    </label>
                    <input
                      type="text"
                      value={trainerDate} // Reuse state or replace with a participant-specific date state if needed
                      onChange={(e) => setTrainerDate(e.target.value)} // Adjust handler if specific state is created
                      placeholder="mm/dd/yyyy"
                      className="text-black rounded px-2 py-1 mt-1 w-full max-w-[200px]"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-md text-gray-200 mb-1">
                      Address:
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="Street Address"
                        className="text-black rounded px-3 py-2 flex-1"
                      />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="text-black rounded px-3 py-2 flex-[0.75]"
                      />
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="text-black rounded px-3 py-2 w-28"
                      >
                        <option value="" disabled>State</option>
                        <option value="AL">AL</option>
                        <option value="AK">AK</option>
                        <option value="AZ">AZ</option>
                        <option value="AR">AR</option>
                        <option value="CA">CA</option>
                        <option value="CO">CO</option>
                        <option value="CT">CT</option>
                        <option value="DE">DE</option>
                        <option value="FL">FL</option>
                        <option value="GA">GA</option>
                        <option value="HI">HI</option>
                        <option value="ID">ID</option>
                        <option value="IL">IL</option>
                        <option value="IN">IN</option>
                        <option value="IA">IA</option>
                        <option value="KS">KS</option>
                        <option value="KY">KY</option>
                        <option value="LA">LA</option>
                        <option value="ME">ME</option>
                        <option value="MD">MD</option>
                        <option value="MA">MA</option>
                        <option value="MI">MI</option>
                        <option value="MN">MN</option>
                        <option value="MS">MS</option>
                        <option value="MO">MO</option>
                        <option value="MT">MT</option>
                        <option value="NE">NE</option>
                        <option value="NV">NV</option>
                        <option value="NH">NH</option>
                        <option value="NJ">NJ</option>
                        <option value="NM">NM</option>
                        <option value="NY">NY</option>
                        <option value="NC">NC</option>
                        <option value="ND">ND</option>
                        <option value="OH">OH</option>
                        <option value="OK">OK</option>
                        <option value="OR">OR</option>
                        <option value="PA">PA</option>
                        <option value="RI">RI</option>
                        <option value="SC">SC</option>
                        <option value="SD">SD</option>
                        <option value="TN">TN</option>
                        <option value="TX">TX</option>
                        <option value="UT">UT</option>
                        <option value="VT">VT</option>
                        <option value="VA">VA</option>
                        <option value="WA">WA</option>
                        <option value="WV">WV</option>
                        <option value="WI">WI</option>
                        <option value="WY">WY</option>
                      </select>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="ZIP"
                        className="text-black rounded px-3 py-2 w-24"
                      />
                    </div>
                  </div>

                  {/* Phone No. */}
                  <div>
                    <label className="block text-md text-gray-200 mb-1">
                      Phone No.:
                    </label>
                    <input
                      type="text"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      placeholder="555-555-5555"
                      className="w-full text-black rounded px-3 py-2 max-w-md"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ============================
                NAVIGATION BUTTONS
               ============================ */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border-2 border-[#DB6E1E] text-[#DB6E1E] 
                  hover:bg-[#DB6E1E] hover:text-white rounded-lg 
                  transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleAcceptContinue}
                className="px-8 py-3 bg-[#DB6E1E] text-white hover:bg-[#DB6E1E] 
                  rounded-lg transition-all duration-200"
              >
                Accept & Continue
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymContractAndWaiver;
