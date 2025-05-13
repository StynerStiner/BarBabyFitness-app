import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { AchievementsSection } from "./About/components/AchievementsSection";
import { FacilitiesSection } from "./About/components/FacilitiesSection";
import { HeroSection } from "./About/components/HeroSection";
import { JoinSection } from "./About/components/JoinSection";
import { StatsSection } from "./About/components/StatsSection";
import { TeamSection } from "./About/components/TeamSection";
import { TestimonialsSection } from "./About/components/TestimonialsSection";

export const About = () => {
  return (
    <main className="relative min-h-screen bg-black text-white pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: 'url("/path-to-your-background-image.jpg")' }}
      ></div>
      <HeroSection />
      <section className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                About Bar Baby Fitness
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Founded with a passion for transforming lives through fitness,
                Bar Baby Fitness has grown into a community dedicated to helping
                individuals achieve their ultimate potential.
              </p>
              <div className="space-y-4 text-gray-300">
                <p>
                  Our journey began with a simple mission: to make
                  professional-grade fitness training accessible to everyone.
                  Today, we've evolved into a comprehensive fitness solution
                  that combines personalized training, nutrition guidance, and
                  community support.
                </p>
                <p>
                  What sets us apart is our commitment to individualized
                  attention. We understand that every person's fitness journey
                  is unique, which is why we offer flexible training options
                  tailored to your specific goals and lifestyle.
                </p>
              </div>

              {/* Added PDF Registration Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href="/pdf-registration"
                  className="inline-block px-6 py-3 bg-[#DB6E1E] text-white font-medium rounded-lg hover:bg-[#c75e15] transition-all duration-300"
                >
                  Register with Auto-Fill PDFs
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80"
                alt="Fitness Training"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-24 grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Expert Trainers",
                description:
                  "Our certified trainers bring years of experience and specialized knowledge.",
              },
              {
                title: "Proven Results",
                description:
                  "Track record of successful transformations and satisfied clients.",
              },
              {
                title: "Community Focus",
                description:
                  "Build connections while achieving your fitness goals.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-[#DB6E1E] transition-colors"
              >
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Values</h2>
            <div className="relative">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/images/values-background.jpg')] bg-cover opacity-70 animate-fade" />
              </div>
              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {[
                  {
                    title: "Dedication to Excellence",
                    description:
                      "We maintain the highest standards in everything we do, from our training programs to our facility maintenance.",
                  },
                  {
                    title: "Inclusive Environment",
                    description:
                      "Everyone is welcome, regardless of their fitness level or background.",
                  },
                  {
                    title: "Continuous Innovation",
                    description:
                      "We constantly update our methods and equipment to provide the best possible experience.",
                  },
                  {
                    title: "Personal Growth",
                    description:
                      "We believe in developing not just physical strength, but mental resilience as well.",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="p-6 bg-black/70 rounded-lg border border-[#DB6E1E]/30 hover:border-[#DB6E1E] transition-all"
                  >
                    <h3 className="text-xl font-bold text-[#DB6E1E] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-300">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <AchievementsSection />
      <FacilitiesSection />
      <JoinSection />
      <StatsSection />
      <TeamSection />
      <TestimonialsSection />
    </main>
  );
};
