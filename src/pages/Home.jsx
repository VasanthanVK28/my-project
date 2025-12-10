import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Tag colors for badges (Vibrant for light mode)
const tagColors = {
  default: "bg-blue-100 text-blue-700 border-blue-200",
  new: "bg-green-100 text-green-700 border-green-200",
  sale: "bg-red-100 text-red-700 border-red-200",
  popular: "bg-purple-100 text-purple-700 border-purple-200",
};

const Home = () => {
  const [apiKey, setApiKey] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch API key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/default-api-key");
        setApiKey(res.data.api_key);
      } catch (err) {
        console.error("Failed to fetch API key:", err);
      }
    };
    fetchApiKey();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/scraped-products");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
    const interval = setInterval(fetchProducts, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  // Group products by tags
  const groupByTag = () => {
    const map = {};
    products.forEach((p) => {
      if (p.tags && p.tags.length > 0) {
        p.tags.forEach((tag) => {
          const t = tag.toLowerCase();
          if (!map[t]) map[t] = [];
          map[t].push(p);
        });
      } else {
        if (!map["untagged"]) map["untagged"] = [];
        map["untagged"].push(p);
      }
    });
    return map;
  };

  const grouped = groupByTag();
  const tagKeys = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900 relative overflow-hidden">
      {/* Colorful Background Orbs - Light Mode */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-3xl opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl opacity-60 pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-[1400px] mx-auto p-6 relative z-10">

        {/* Header */}
        <header className="mb-12 text-center pt-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 mb-4 tracking-tight drop-shadow-sm"
          >
            Vibrant Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-slate-600 text-lg max-w-2xl mx-auto font-medium"
          >
            Experience the freshness of premium products with our new real-time catalog.
          </motion.p>
        </header>

        {/* Widget Section */}
        {apiKey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-[500px] rounded-3xl mb-16 shadow-2xl shadow-indigo-200/50 border border-white/50 bg-white/40 backdrop-blur-xl overflow-hidden ring-1 ring-white/60"
          >
            <iframe
              src={`http://localhost:5173/embed/popular-products?apiKey=${apiKey}&theme=light`}
              className="w-full h-full"
              loading="lazy"
              title="Popular Products Widget"
              style={{ border: 'none' }}
            />
          </motion.div>
        )}

        {/* Products by tag */}
        {loadingProducts ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-100"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-l-indigo-600 animate-spin"></div>
            </div>
          </div>
        ) : (
          tagKeys.map((tag, idx) => {
            // Dynamic gradients for section headers based on index
            const headerGradients = [
              "from-blue-500 to-cyan-500",
              "from-fuchsia-500 to-pink-500",
              "from-amber-500 to-orange-500",
              "from-emerald-500 to-green-500"
            ];
            const currentGradient = headerGradients[idx % headerGradients.length];

            return (
              <section
                key={tag}
                className="mb-20 relative"
              >
                {/* Section Header */}
                <div className="flex items-center mb-8 pl-2">
                  <div className={`h-10 w-1.5 bg-gradient-to-b ${currentGradient} rounded-full mr-4 shadow-lg`}></div>
                  <h2 className="text-4xl font-extrabold capitalize text-slate-800 tracking-tight">{tag}</h2>
                </div>

                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={24}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true, dynamicBullets: true }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                  }}
                  className="!pb-14 !px-2" // Space for pagination and shadow
                >
                  {grouped[tag].map((p) => (
                    <SwiperSlide key={p._id}>
                      <motion.a
                        href={p.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block h-full"
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="h-full bg-white/70 backdrop-blur-lg border border-white/60 rounded-3xl p-5 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-indigo-200/40 hover:bg-white/90 ring-1 ring-slate-100 group-hover:ring-indigo-200">
                          {/* Image Container */}
                          <div className="relative w-full aspect-square mb-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-6 group-hover:from-indigo-50 group-hover:to-white transition-colors duration-300">
                            <motion.img
                              src={p.image_url}
                              alt={p.title || p.brand}
                              className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                            />
                            {/* Rating Overlay */}
                            {p.rating && (
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm border border-slate-100">
                                <span className="text-amber-400 text-xs shadow-amber-200">★</span>
                                <span className="text-xs font-bold text-slate-700">{p.rating}</span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-grow flex flex-col">
                            <div className="mb-3">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{p.brand || "Generic"}</p>
                              <h3 className="font-bold text-lg leading-snug text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                {p.title || "Untitled Product"}
                              </h3>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                              <p className="text-2xl font-black text-slate-900 tracking-tight">
                                {p.price || "N/A"}
                              </p>
                              <motion.span
                                className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                              >
                                Buy Now
                              </motion.span>
                            </div>

                            {/* Tags */}
                            {p.tags && p.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {p.tags.slice(0, 2).map((t, i) => (
                                  <span key={i} className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${tagColors.default}`}>
                                    {t}
                                  </span>
                                ))}
                                {p.tags.length > 2 && (
                                  <span className="text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200 bg-slate-100 text-slate-500">
                                    +{p.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.a>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            );
          })
        )}
      </div>

      {/* Footer / Copyright */}
      <footer className="text-center text-slate-400 py-10 text-sm font-medium">
        <p>© 2024 Vasant's Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
