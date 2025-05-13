import { motion } from "framer-motion";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { VIDEOS } from "@/data/videos";
import { VideoHeader } from "./Video/VideoHeader";
export const VideoSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#DB6E1E] to-[#963E00] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#DB6E1E]/10 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#963E00]/10 rounded-full filter blur-3xl animate-float" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <VideoHeader
          backgroundText="TRAINING"
          title="Training Videos & Tutorials"
          description="Access our library of professional fitness tutorials designed to help you achieve your strength and conditioning goals."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-16">
          {VIDEOS.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-white/5"
            >
              <Link
                href={video.url}
                className="block focus:outline-none focus:ring-2 focus:ring-white"
              >
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform-gpu transition-all duration-300 group-hover:scale-110 group-hover:bg-white/40">
                      <Youtube className="w-8 h-8 text-white/90" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white text-xl font-bold mb-2">
                      {video.title}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6"
        >
          <Button
            variant="outline"
            className="w-full sm:w-auto px-8 py-3 text-lg font-bold text-white border-2 border-white hover:bg-white hover:text-[#DB6E1E] transition-all duration-300"
          >
            Browse All Videos
          </Button>
          <Button
            variant="solid"
            className="w-full sm:w-auto px-8 py-3 text-lg font-bold bg-white text-[#DB6E1E] hover:bg-[#DB6E1E] hover:text-white hover:ring-2 hover:ring-white transition-all duration-300"
          >
            Start Training Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
