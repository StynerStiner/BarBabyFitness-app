// src/components/MerchSection.tsx

import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MERCH_ITEMS } from "@/data/merch";
import { MerchHeader } from "./Merch/MerchHeader";

export const MerchSection = () => {
  return (
    <section
      id="merch"
      className="bg-black relative overflow-hidden -mt-8"
      style={{ paddingTop: "0px", paddingBottom: "96px", marginTop: "-32px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-[#DB6E1E]/10" />

      <div className="container mx-auto px-4 relative">
        <MerchHeader
          backgroundText="MERCH"
          title="Official Bar Baby Fitness Gear"
          description="Rep your commitment to fitness with our premium workout gear and accessories"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MERCH_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-[#DB6E1E]/20 transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                />
                {item.isNew && (
                  <div className="absolute top-4 right-4 bg-[#DB6E1E] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    New
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-[#DB6E1E] fill-current" />
                    <span className="ml-1 text-sm text-white">
                      {item.rating}
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#DB6E1E]">
                    ${item.price}
                  </span>
                  <Button
                    variant="solid"
                    className="flex items-center space-x-2 bg-[#DB6E1E] hover:bg-[#B85B19] text-white"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
