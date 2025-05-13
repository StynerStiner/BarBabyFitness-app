import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useGymForm } from '../../pages/GymRegistrationForm/contexts/GymFormContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import HeroSection from '../../pages/GymRegistrationForm/components/HeroSection';
import confetti from 'canvas-confetti';

/**
 * ConfirmationPage is the final page of the registration flow.
 * It displays a confirmation message with the registration details
 * and a summary of the payment made.
 */
const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { formState } = useGymForm();

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Get registration data from location state or context
  const registrationData = location.state?.registrationData || formState || {};
  const sessionId = searchParams.get('session_id');
  const paymentMethod = location.state?.paymentMethod || 'Credit Card';

  // Store registration data in local storage as a backup
  useEffect(() => {
    if (registrationData?.firstName && registrationData?.lastName && registrationData?.email) {
      try {
        localStorage.setItem('gym_registration_data', JSON.stringify({
          ...registrationData,
          // Remove large data like signatures
          signatureDataURL: registrationData.signatureDataURL ? '[SIGNATURE DATA]' : undefined,
          clientSignatureDataURL: registrationData.clientSignatureDataURL ? '[SIGNATURE DATA]' : undefined,
        }));
        console.log('Registration data saved to local storage');
      } catch (error) {
        console.error('Failed to save registration data to local storage:', error);
      }
    }
  }, [registrationData]);

  // Send contract and registration copies only after successful payment
  useEffect(() => {
    const sendContractAndRegistrationCopies = async () => {
      try {
        // Try to load registration data from localStorage if it's missing
        let finalRegistrationData = registrationData;
        if (!finalRegistrationData?.firstName || !finalRegistrationData?.lastName || !finalRegistrationData?.email) {
          try {
            const savedData = localStorage.getItem('gym_registration_data');
            if (savedData) {
              finalRegistrationData = JSON.parse(savedData);
              console.log('Restored registration data from localStorage', finalRegistrationData);
            }
          } catch (e) {
            console.error('Error loading registration data from localStorage:', e);
          }
        }

        // Ensure registrationData is populated
        const clientName = `${finalRegistrationData?.firstName || 'Unknown'} ${finalRegistrationData?.lastName || 'User'}`.trim();
        const clientEmail = finalRegistrationData?.email || localStorage.getItem('gym_registration_email');
        const contractUrl = finalRegistrationData?.contractInfo?.contractUrl || 'No contract URL available';

        // Log the state of registrationData for debugging
        console.log('Debugging registrationData:', finalRegistrationData);
        console.log('Debugging location.state:', location.state);

        // Validate payload before sending
        if (!clientName || !clientEmail || !contractUrl) {
          console.error('Missing required fields in payload:', {
            clientName,
            clientEmail,
            contractUrl,
          });
          setEmailError('Required information is missing. Please contact support.');
          return;
        }

        // Prepare the request payload
        const payload = {
          clientName,
          clientEmail,
          contractUrl,
          registrationData: finalRegistrationData,
          paymentDetails: {
            amount: location.state?.amount || '195',
            method: paymentMethod,
            transactionId: sessionId || `manual-${Date.now()}`,
          },
          planName: finalRegistrationData?.selectedPlan?.title || 'No Plan Selected',
        };

        console.log('Sending post-payment actions request with payload:', {
          ...payload,
          registrationData: '... (data omitted for brevity) ...'
        });

        // Determine the correct endpoint URL - try localhost:3002 first if in development
        const apiUrl = window.location.hostname === 'localhost'
          ? 'http://localhost:3002/api/post-payment-actions'
          : '/api/post-payment-actions';

        console.log(`Using API URL: ${apiUrl}`);

        // Send both contract and registration copies in one request
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error('API call failed:', {
            status: response.status,
            statusText: response.statusText,
          });
          const errorText = await response.text();
          console.error('Response body:', errorText);
          setEmailError('Failed to send confirmation. Please try again later.');
          return;
        }

        const data = await response.json();
        console.log('Post-payment actions completed:', data);

        if (data.success) {
          setIsEmailSent(true);
        } else {
          setEmailError('There was an issue sending your confirmation email');
          console.warn('Email sending had issues:', data);
        }
      } catch (error) {
        console.error('Error sending contract and registration copies:', error);
        setEmailError('Unable to send confirmation email');
      }
    };

    // Only send emails if payment is confirmed (as indicated by being on this page)
    if (registrationData.registrationComplete || sessionId || location.state?.paymentMethod) {
      sendContractAndRegistrationCopies();
    }
  }, [registrationData, location.state, sessionId]);

  // Trigger confetti effect on component mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Create confetti on both sides
      confetti({
        particleCount: Math.floor(randomInRange(particleCount / 2, particleCount)),
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 },
        colors: ['#f97316', '#ffffff', '#000000']
      });

    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // If we have a session_id but no registrationComplete in formState, we still consider it complete
  const isComplete = registrationData.registrationComplete || sessionId || location.state?.paymentMethod;

  if (!isComplete) {
    // Redirect to home if registration is not complete
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#1a1a1a] text-white">
      <HeroSection />

      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <Card className="bg-[#1a1a1a]/90 backdrop-blur border-orange-500/20 p-2 sm:p-6 md:p-8 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full -ml-12 -mb-12"></div>

          <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                  Registration Complete!
                </span>
              </h1>
              <div className="w-16 h-1 bg-orange-500 mx-auto my-4"></div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Thank you for joining the BarBaby Fitness family! Your registration has been successfully processed.
              </p>

              {/* Email status notification */}
              {isEmailSent && (
                <div className="mt-4 bg-green-900/30 border border-green-600/30 rounded-lg py-2 px-4 inline-block">
                  <p className="text-green-400 text-sm">
                    ✓ Confirmation email sent with your contract and registration details
                  </p>
                </div>
              )}
              {emailError && (
                <div className="mt-4 bg-red-900/30 border border-red-600/30 rounded-lg py-2 px-4 inline-block">
                  <p className="text-red-400 text-sm">
                    {emailError}. Please contact support if needed.
                  </p>
                </div>
              )}
            </div>

            {/* Registration details */}
            <div className="bg-black/40 rounded-lg p-6 mb-8 border border-orange-500/20">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">Registration Summary</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-2">
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="font-medium">{registrationData.firstName} {registrationData.lastName}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="font-medium">{registrationData.email}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="font-medium">{registrationData.phone}</span>
                    </li>
                  </ul>
                </div>

                {/* Membership Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-2">
                    Membership Details
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Plan:</span>
                      <span className="font-medium">{registrationData.selectedPlan?.title || location.state?.plan?.title || location.state?.selectedPlan?.title || 'Personal Training Plan'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Sessions:</span>
                      <span className="font-medium">{registrationData.selectedPlan?.sessions || location.state?.plan?.sessions || location.state?.selectedPlan?.sessions || "12 sessions per month"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="font-medium">{registrationData.selectedPlan?.duration || location.state?.plan?.duration || location.state?.selectedPlan?.duration || "Valid for 30 days"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Registration Date:</span>
                      <span className="font-medium">{formatDate(registrationData.registrationDate || new Date().toISOString())}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Payment Information */}
              {(registrationData.paymentInfo || sessionId || location.state?.paymentMethod) && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-2">
                    Payment Information
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="font-medium capitalize">
                        {registrationData.paymentInfo?.paymentMethod || location.state?.paymentMethod || 'Credit Card'}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Transaction ID:</span>
                      <span className="font-medium">
                        {registrationData.paymentInfo?.transactionId || sessionId || location.state?.paymentId || location.state?.transactionId || `TRANS-${Date.now()}`}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Amount Paid:</span>
                      <span className="font-medium text-orange-400">
                        ${location.state?.amount ||
                          registrationData.paymentInfo?.totalAmount ||
                          (registrationData.selectedPlan?.price?.match(/\$(\d+)/) ?
                            parseInt(registrationData.selectedPlan?.price?.match(/\$(\d+)/)[1]) +
                            parseInt(registrationData.selectedPlan?.initiationFee?.match(/\$(\d+)/)[1] || '100') :
                            (location.state?.plan?.price?.match(/\$(\d+)/) ?
                              parseInt(location.state.plan.price.match(/\$(\d+)/)[1]) +
                              parseInt(location.state.plan.initiationFee?.match(/\$(\d+)/)[1] || '100') :
                              '295'))}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Payment Date:</span>
                      <span className="font-medium">
                        {formatDate(registrationData.paymentInfo?.paymentDate || new Date().toString())}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-orange-500/10 rounded-lg p-6 mb-8 border border-orange-500/30">
              <h2 className="text-xl font-bold text-orange-400 mb-3">What's Next?</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Check your email for a detailed confirmation of your membership.</li>
                <li>Your contract and registration details have been sent to your email.</li>
                <li>Download our mobile app to schedule your first session.</li>
                <li>Prepare your workout gear and get ready to transform your fitness journey!</li>
                <li>Contact us at <a href="mailto:support@barbabyfitness.com" className="text-orange-400 hover:underline">support@barbabyfitness.com</a> if you have any questions.</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button
                className="px-8 py-3 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-all duration-200"
                onClick={() => window.open('https://www.barbabyfitness.com/schedule', '_blank')}
              >
                Schedule First Session
              </Button>
              <Button
                variant="outline"
                className="px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-lg transition-all duration-200"
                onClick={() => navigate('/')}
              >
                Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmationPage;
