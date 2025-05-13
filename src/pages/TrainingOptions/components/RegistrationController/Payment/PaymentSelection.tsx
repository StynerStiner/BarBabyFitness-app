// src/pages/TrainingOptions/components/RegistrationController/Payment/PaymentSelection.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CreditCard, AlertCircle } from "lucide-react";
import {
  PaymentMethod,
  PaymentMethodType,
  PaymentSelectionProps,
} from "@/pages/TrainingOptions/components/types";

// Define the payment methods with explicit types
const paymentMethods: { id: PaymentMethodType; name: string; icon: string; handle: string }[] = [
  {
    id: "card" as PaymentMethodType,
    name: "Credit / Debit Card",
    icon: "💳",
    handle: "Secure payment via Stripe",
  },
  {
    id: "venmo" as PaymentMethodType,
    name: "Venmo",
    icon: "📱",
    handle: "@barbabyfitness",
  },
  {
    id: "cashapp" as PaymentMethodType,
    name: "Cash App",
    icon: "💵",
    handle: "$barbabyfitness",
  },
  {
    id: "zelle" as PaymentMethodType,
    name: "Zelle",
    icon: "🏦",
    handle: "adm.barbabyfitness@gmail.com",
  },
];

export const PaymentSelection: React.FC<PaymentSelectionProps> = ({
  selectedPlan,
  formData,
  onBack,
  onComplete,
}) => {
  const handlePaymentMethodSelect = (methodId: PaymentMethodType) => {
    const paymentData: PaymentMethod = {
      type: methodId,
      billingZip: formData.zip, // Updated to directly access `zip`
    };
    onComplete(paymentData);
  };

  const calculateTotal = () => {
    const planPrice = parseInt(
      selectedPlan?.price?.replace(/[^0-9]/g, "") || "0",
      10
    );
    const initiationFee =
      selectedPlan?.initiationFee === "None"
        ? 0
        : parseInt(
          selectedPlan?.initiationFee?.replace(/[^0-9]/g, "") || "0",
          10
        );
    const annualMembershipFee = 350;

    return planPrice + initiationFee + annualMembershipFee;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-[#DB6E1E]" />
          <h2 className="text-3xl font-bold">Complete Your Registration</h2>
        </div>

        <div className="mb-8">
          <div className="flex items-start gap-3 p-4 bg-[#DB6E1E]/10 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-[#DB6E1E] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-[#DB6E1E] mb-1">Payment Summary</p>
              <div className="text-gray-300 space-y-1">
                <p>Selected Plan: {selectedPlan?.title}</p>
                <p>Plan Rate: {selectedPlan?.price}</p>
                <p>Initiation Fee: {selectedPlan?.initiationFee}</p>
                <p>Annual Membership Fee: $350</p>
                <p className="font-semibold pt-2 border-t border-gray-700">
                  Total Due Today: ${calculateTotal().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-gray-300 mb-4">
                Please complete your payment using one of the following methods:
              </p>

              {/* Credit/Debit Card - New 3D stylish option */}
              <div
                onClick={() => handlePaymentMethodSelect('card' as PaymentMethodType)}
                className="p-6 mb-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:translate-y-[-5px]"
                style={{
                  background: 'linear-gradient(145deg, #292929, #1a1a1a)',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 10px 20px -5px rgba(219,110,30,0.3), 0 0 0 1px rgba(219,110,30,0.2)',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  borderLeft: '1px solid rgba(255,255,255,0.08)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#DB6E1E] to-[#F59E0B] flex items-center justify-center text-white transform rotate-[-5deg] shadow-lg" style={{ transform: 'translateZ(20px)' }}>
                    <CreditCard className="w-8 h-8" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Credit / Debit Card</h3>
                    <p className="text-zinc-400 text-sm">Secure payment via Stripe - pay instantly online</p>
                  </div>

                  <div className="hidden sm:block">
                    <Button
                      variant="solid"
                      className="bg-gradient-to-r from-[#DB6E1E] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#DB6E1E] border-none text-white shadow-[0_5px_15px_rgba(219,110,30,0.4)]"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
                <div className="sm:hidden mt-4">
                  <Button
                    variant="solid"
                    className="w-full bg-gradient-to-r from-[#DB6E1E] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#DB6E1E] border-none text-white shadow-[0_5px_15px_rgba(219,110,30,0.4)]"
                  >
                    Pay Now
                  </Button>
                </div>
              </div>

              <p className="text-zinc-400 text-sm mb-4">- OR -</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.slice(1).map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                    className="flex flex-col items-start gap-2 p-4 rounded-xl border border-zinc-800 hover:border-[#DB6E1E] transition-colors"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{method.handle}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-black/30 rounded-lg">
              <h3 className="font-medium mb-2">Next Steps:</h3>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-4">
                <li>Send the payment using your preferred method above</li>
                <li>
                  Include "{formData.firstName} {formData.lastName} - BBF
                  Membership" in the payment note
                </li>
                <li>
                  After payment confirmation, we'll contact you to schedule your
                  first session
                </li>
                <li>
                  Future training sessions will be billed separately before each
                  session
                </li>
              </ol>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={onBack} className="w-full">
          Back to Registration
        </Button>
      </div>
    </motion.div>
  );
};
