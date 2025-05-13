import { FC } from "react";

export const ContractContent: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">
          BarBaby Fitness - Personal Training Contract
        </h3>
        <p className="text-gray-300 mb-4">
          This agreement is made between BarBaby Fitness ("Trainer") and the
          undersigned client ("Client"). By signing this contract, the Client
          acknowledges that they have read, understood, and agreed to the terms
          and conditions outlined below.
        </p>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Program Options</h4>
        <div className="space-y-2">
          <p className="font-medium">Training Plans:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-1">
            <li>3 sessions per week: $600/month</li>
            <li>2 sessions per week: $440/month</li>
            <li>1 session per week: $240/month</li>
          </ul>
          <p className="text-gray-300">
            A $99 enrollment fee is required for all new clients.
          </p>

          <p className="font-medium mt-4">Included Features:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-1">
            <li>Tailored workout plans designed to meet the Client's goals.</li>
            <li>Progress tracking to monitor results and improvements.</li>
            <li>Access to flexible scheduling options.</li>
          </ul>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Payment Terms</h4>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Payment Obligations:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>
                Payments must be made in advance for the selected training plan.
              </li>
              <li>
                Additional sessions beyond the selected plan are billed at
                $75/session.
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium">Refund Policy:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>The $99 enrollment fee is non-refundable.</li>
              <li>
                Refunds for unused sessions are not available unless under
                exceptional circumstances.
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium">Cancellation Policy:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>
                Sessions canceled with less than 24 hours' notice will not be
                refunded.
              </li>
              <li>Unused sessions do not roll over to the next month.</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">
          Health and Liability Waiver
        </h4>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Acknowledgment of Risk:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>
                The Client acknowledges that participating in physical exercise
                involves inherent risks.
              </li>
              <li>
                Clients with pre-existing conditions must consult their
                physician before starting.
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium">Release of Liability:</p>
            <p className="text-gray-300 pl-6">
              The Client agrees to release and hold harmless BarBaby Fitness,
              its trainers, and employees from any claims, demands, and causes
              of action arising from their participation.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Client Commitments</h4>
        <p className="text-gray-300 mb-2">The Client agrees to:</p>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li>Show up for sessions on time and ready to participate.</li>
          <li>
            Actively communicate with the Trainer about any health concerns or
            injuries.
          </li>
          <li>Commit to the program for the agreed duration.</li>
          <li>
            Follow the Trainer's guidance for achieving their fitness goals.
          </li>
        </ul>
      </div>
    </div>
  );
};
