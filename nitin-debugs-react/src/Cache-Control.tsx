import { useState } from "react";

const demos = [
  {
    id: "no-cache",
    title: "no-cache",
    url: "https://badhttp.dev/etag/ok",
  },
  {
    id: "no-store",
    title: "no-store",
    url: "https://httpbin.org/response-headers?Cache-Control=no-store",
  },
  {
    id: "max-age",
    title: "max-age=60",
    url: "https://httpbin.org/response-headers?Cache-Control=max-age%3D60",
  },
] as const;

type RequestResult = {
  status: number;
  body: string;
};

export default function CacheControl() {
  const [results, setResults] = useState<Record<string, RequestResult>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function callApi(id: string, url: string) {
    setLoadingId(id);
    setErrors((current) => ({ ...current, [id]: "" }));

    try {
      const response = await fetch(url);
      const body = await response.text();
      setResults((current) => ({
        ...current,
        [id]: { status: response.status, body },
      }));
    } catch (requestError) {
      setErrors((current) => ({
        ...current,
        [id]:
          requestError instanceof Error
            ? requestError.message
            : String(requestError),
      }));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <main
      style={{
        width: "90%",
        margin: "0 auto",
        padding: "32px 24px",
        textAlign: "left",
      }}
    >
      <h1 style={{ fontSize: 40, margin: "8px 0 12px" }}>Cache-Control</h1>
      <h3>Nitin Debugs</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        {demos.map((demo) => (
          <section
            key={demo.id}
            style={{
              minWidth: 0,
              padding: 20,
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "var(--code-bg)",
            }}
          >
            <h2>{demo.title}</h2>
            <button
              type="button"
              onClick={() => callApi(demo.id, demo.url)}
              disabled={loadingId !== null}
              style={{ marginTop: 8 }}
            >
              {loadingId === demo.id ? "Requesting..." : "Call API"}
            </button>

            {results[demo.id] && (
              <>
                <p role="status" style={{ marginTop: 16 }}>
                  Fetch returned HTTP <strong>{results[demo.id].status}</strong>
                </p>
                <pre
                  style={{
                    overflowX: "auto",
                    padding: 12,
                    background: "var(--bg)",
                    borderRadius: 4,
                    fontSize: 13,
                  }}
                >
                  {results[demo.id].body || "(empty response body)"}
                </pre>
              </>
            )}

            {errors[demo.id] && (
              <p role="alert" style={{ marginTop: 16, color: "#ff7b72" }}>
                Request failed: {errors[demo.id]}
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
