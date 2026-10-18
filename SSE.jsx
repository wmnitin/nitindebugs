import { useEffect, useState } from "react";

export default function StockPrice() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const events = new EventSource("/api/prices");

    events.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setPrice(update.price);
    };

    events.onerror = () => {
      console.log("Connection interrupted; browser may reconnect");
    };

    return () => events.close();
  }, []);

  return (
    <div>
      <h2>ABC Ltd.</h2>
      <h1>{price == null ? "Connecting..." : `₹${price}`}</h1>
    </div>
  );
}