import { useRef, useState } from "react";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  async function askAI() {
    const controller = new AbortController();
    controllerRef.current = controller;

    setAnswer("");
    setLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      if (!response.body) {
        throw new Error("Streaming is not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        setAnswer((prev) => prev + decoder.decode(value, {
          stream: true,
        }));
      }

      // Flush any remaining bytes from the decoder.
      setAnswer((prev) => prev + decoder.decode());
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  }

  function stop() {
    controllerRef.current?.abort();
  }

  return (
    <div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />

      <button onClick={askAI} disabled={loading || !question.trim()}>
        Ask AI
      </button>

      <button onClick={stop} disabled={!loading}>
        Stop
      </button>

      <p>{answer}</p>
    </div>
  );
}