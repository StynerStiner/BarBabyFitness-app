import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const Contact = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-[#DB6E1E]" />,
      title: "Location",
      details: ["123 Fitness Street", "Cityville, ST 12345"],
    },
    {
      icon: <Phone className="w-6 h-6 text-[#DB6E1E]" />,
      title: "Phone",
      details: ["+1 (555) 123-4567"],
    },
    {
      icon: <Mail className="w-6 h-6 text-[#DB6E1E]" />,
      title: "Email",
      details: ["info@barbabyfitness.com", "support@barbabyfitness.com"],
    },
    {
      icon: <Clock className="w-6 h-6 text-[#DB6E1E]" />,
      title: "Hours",
      details: ["Mon-Fri: 5:00 AM - 10:00 PM", "Sat-Sun: 6:00 AM - 8:00 PM"],
    },
  ];

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, name: "Instagram", url: "#" },
    { icon: <Facebook className="w-6 h-6" />, name: "Facebook", url: "#" },
    { icon: <Twitter className="w-6 h-6" />, name: "Twitter", url: "#" },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300">
            Have questions? We're here to help. Reach out to us through any of
            the following channels.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800"
          >
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black/50 rounded-lg border border-zinc-800 focus:border-[#DB6E1E] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-black/50 rounded-lg border border-zinc-800 focus:border-[#DB6E1E] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-black/50 rounded-lg border border-zinc-800 focus:border-[#DB6E1E] focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <Button variant="solid" className="w-full">
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800"
              >
                <div className="p-3 bg-black/30 rounded-lg">{info.icon}</div>
                <div>
                  <h3 className="font-bold mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-400">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="p-6 bg-[#DB6E1E]/10 rounded-xl">
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="p-3 bg-zinc-900/50 rounded-lg hover:bg-[#DB6E1E]/20 transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};
