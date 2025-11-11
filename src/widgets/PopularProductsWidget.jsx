import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PopularProductsWidget = ({
  apiKey,             // Required: User's API key
  visibleCount = 10,  // Number of products to show
  cardColor = "#fff",
  textColor = "#000",
  starColor = "#f59e0b"
}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!apiKey) return;

    fetch("https://your-backend.com/api/popular-products", {
      headers: { "x-api-key": apiKey },
    })
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, [apiKey]);

  if (!products.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Popular Products</h2>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
        grabCursor
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {products.slice(0, visibleCount).map((item) => (
          <SwiperSlide key={item._id}>
            <div
              className="shadow-md rounded-xl overflow-hidden hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: cardColor }}
            >
              <img
                src={item.image_url || "https://via.placeholder.com/300"}
                alt={item.title}
                className="w-full h-56 object-contain bg-gray-100"
              />
              <div className="p-4" style={{ color: textColor }}>
                <h3 className="text-sm font-semibold line-clamp-2">{item.title}</h3>
                <p className="text-xs mt-1">{item.brand || "Brand"}</p>
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }, (_, i) => {
                    const rating = item.rating || 4.2;
                    if (rating >= i + 1) return <span key={i} style={{ color: starColor }}>★</span>;
                    if (rating >= i + 0.5) return <span key={i} style={{ color: starColor }}>☆</span>;
                    return <span key={i} style={{ color: "#ccc" }}>★</span>;
                  })}
                  <span className="text-xs ml-2">({item.rating || "4.2"})</span>
                </div>
                <p className="text-lg font-bold mt-2">₹{item.price || "—"}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PopularProductsWidget;
