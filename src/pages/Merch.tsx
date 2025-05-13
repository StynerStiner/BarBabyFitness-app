import { motion } from "framer-motion";
import { ShoppingBag, Star, Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { MERCH_ITEMS } from "@/data/merch";

export const Merch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; quantity: number }>
  >([]);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: "all", name: "All Products" },
    { id: "apparel", name: "Apparel" },
    { id: "accessories", name: "Accessories" },
    { id: "equipment", name: "Equipment" },
  ];

  const filteredItems = MERCH_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "all" || item.id.includes(selectedCategory)),
  );

  const addToCart = (itemId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { id: itemId, quantity: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const cartTotal = cartItems.reduce((total, cartItem) => {
    const item = MERCH_ITEMS.find((i) => i.id === cartItem.id);
    return total + (item?.price || 0) * cartItem.quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Bar Baby Fitness Gear
          </h1>
          <p className="text-xl text-gray-300">
            Premium quality workout gear and accessories to help you perform at
            your best
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 rounded-full border border-zinc-800 focus:border-[#DB6E1E] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full border transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-[#DB6E1E] border-[#DB6E1E] text-white"
                    : "border-zinc-800 text-gray-300 hover:border-[#DB6E1E]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#DB6E1E] transition-all duration-300 group"
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
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-[#DB6E1E] fill-current" />
                    <span className="ml-1 text-sm">{item.rating}</span>
                  </div>
                </div>

                <p className="text-gray-400 mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#DB6E1E]">
                    ${item.price}
                  </span>
                  <Button
                    variant="solid"
                    className="flex items-center space-x-2"
                    onClick={() => addToCart(item.id)}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shopping Cart Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-full md:w-96 bg-zinc-900 transform transition-transform duration-300 z-50 ${
            showCart ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Shopping Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cartItems.map((cartItem) => {
                const item = MERCH_ITEMS.find((i) => i.id === cartItem.id);
                if (!item) return null;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 mb-4 p-4 bg-zinc-800/50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-[#DB6E1E]">${item.price}</p>
                      <p className="text-sm text-gray-400">
                        Quantity: {cartItem.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start p-2 hover:bg-zinc-700 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-4">
              <div className="flex justify-between mb-4">
                <span className="text-lg">Total:</span>
                <span className="text-lg font-bold">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <Button variant="solid" className="w-full">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
