// src/pages/TrainingOptions/components/Plans/LoyaltyRewards.tsx
import { GraduationCap, Calendar, Gift } from "lucide-react";

export default function LoyaltyRewards() {
  return (
    <div className="relative min-h-[600px] w-full bg-black text-white overflow-hidden p-8">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-end opacity-10 pr-4">
        <span className="text-[200px] font-bold tracking-wider">
          LOYALTY & REWARDS
        </span>
      </div>

      {/* Content Container */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        {/* Left Column - Image with Enhanced Circle Design */}
        <div className="relative">
          <div className="absolute inset-0 w-[480px] h-[480px] border-4 border-orange-500 rounded-full transform rotate-45 opacity-20"></div>
          <div className="absolute inset-0 w-[480px] h-[480px] border-4 border-orange-400 rounded-full transform -rotate-45 opacity-20"></div>
          <div className="absolute inset-0 w-[440px] h-[440px] border-2 border-orange-300 rounded-full animate-pulse"></div>
          <div className="w-[400px] h-[400px] relative">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-black opacity-70"></div>
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
                alt="Gym equipment in dark setting with orange lighting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Text Content */}
        <div className="space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Unlock Exclusive Benefits
          </h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-6 h-6 text-orange-500" />
              <p className="text-lg">
                6+ months or referring a new member: Earn a bonus session or 5%
                merch discount
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-orange-500" />
              <p className="text-lg">
                Monthly (Dedicated): 10% merch discount after 6 months
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Gift className="w-6 h-6 text-orange-500" />
              <p className="text-lg">
                Yearly (Freedom): 10% merch discount year-round
              </p>
            </div>
          </div>
          <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors">
            View all benefits
          </button>
        </div>
      </div>
    </div>
  );
}
