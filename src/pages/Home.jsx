import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch default API key from backend
    const fetchApiKey = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/default-api-key");
        setApiKey(response.data.api_key);
      } catch (error) {
        console.error("Failed to fetch API key:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  if (loading) return <p>Loading widget...</p>;

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {apiKey ? (
        <iframe
          src={`http://localhost:5173/embed/popular-products?apiKey=${apiKey}`}
          width="100%"
          height="500"
          style={{ border: "none", borderRadius: "10px", overflow: "hidden" }}
          allow="autoplay; clipboard-write; encrypted-media"
          loading="lazy"
          title="Popular Products Widget"
        ></iframe>
      ) : (
        <p>Unable to load widget: API key not found.</p>
      )}
    </div>
  );
};

export default Home;
