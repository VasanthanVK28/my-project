import React from "react";

const EmbeddedCarousel = ({ apiKey }) => {
  const widgetUrl = `http://127.0.0.1:8000/embed-widget/${apiKey}`;

  return (
    <iframe
      src={widgetUrl}
      title="Product Carousel"
      style={{ width: "100%", height: "480px", border: "none", borderRadius: "12px" }}
      allowFullScreen
    ></iframe>
  );
};

export default EmbeddedCarousel;
