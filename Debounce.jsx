// Nitin Debugs

// ✅ 2. The Clean & Native React way (Zero libraries, zero stale closures!)

import { useState, useEffect } from "react";

export default function SearchComponent() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    // ⏱️ Start 500ms timer
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${query}`);
      setResults(await res.json());
    }, 500);
    // 🛑 Clears old timer on every keystroke!
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
