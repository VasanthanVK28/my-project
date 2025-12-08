import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const colors = [
  "bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300",
  "bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300",
  "bg-gradient-to-r from-green-100 via-green-200 to-green-300",
  "bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300",
  "bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300",
];

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
        console.error(err);
      }
    };
    fetchApiKey();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/scrapes");
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
    const interval = setInterval(fetchProducts, 10000);
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
    <div className="max-w-[1200px] mx-auto p-6">
      {/* Widget */}
      {apiKey && (
        <iframe
          src={`http://localhost:5173/embed/popular-products?apiKey=${apiKey}`}
          className="w-full h-[500px] rounded-xl mb-12 shadow-lg"
          loading="lazy"
          title="Popular Products Widget"
        />
      )}

      {/* Products by tag */}
      {loadingProducts ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        tagKeys.map((tag, idx) => (
          <div
            key={tag}
            className={`${colors[idx % colors.length]} p-6 rounded-2xl mb-12`}
          >
            <h2 className="text-2xl font-bold mb-6 capitalize">{tag}</h2>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {grouped[tag].map((p) => (
                <SwiperSlide key={p._id}>
                  <motion.a
                    href={p.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="block bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <motion.img
                      src={p.image_url}
                      alt={p.title || p.brand}
                      className="w-36 h-36 object-contain mb-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <h3 className="font-semibold text-lg text-center">{p.title || p.brand}</h3>
                    <p className="text-sm text-gray-500 mt-1 text-center">Brand: {p.brand}</p>
                    <p className="text-sm text-gray-500 text-center">
                      Price: <span className="font-bold text-black">{p.price || "N/A"}</span>
                    </p>
                    
                    {/* Rating Stars */}
                    <div className="flex items-center mt-1 space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const filled = p.rating && i < Math.round(p.rating);
                        return (
                          <span key={i} className={filled ? "text-yellow-500" : "text-gray-300"}>
                            ★
                          </span>
                        );
                      })}
                    </div>

                    {p.tags && (
                      <div className="flex flex-wrap justify-center mt-2 gap-1">
                        {p.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-gray-200 rounded-full px-2 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
