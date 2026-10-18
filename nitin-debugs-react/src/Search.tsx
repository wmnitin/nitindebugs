import { useRef, useState, useEffect } from "react";

export default function Search() {
  const [results, setResults] = useState([]);
  const controllerRef = useRef<any>(null);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  async function search(query: string) {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!controller.signal.aborted) {
        setResults(data);
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Search failed:", error);
      }
    }
  }

  return (
    <div>
      <input placeholder="Search..." onChange={(e) => search(e.target.value)} />

      <ul>
        {results.map((item: any) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
