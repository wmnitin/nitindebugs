// ETag
// If-None-Match
// 304 → browser use cached response 

// no-cache, no-store aur max-age

import { useState } from "react";

const demoUrl = `https://httpbin.org/etag/demo-etag`;

export default function ETAG() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function callApi() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(demoUrl);
      const body = await response.text();
      setResult({ status: response.status, body });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : String(requestError),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "32px 24px",
        textAlign: "left",
      }}
    >
      <p
        style={{
          color: "#6b6375",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        HTTP CACHING
      </p>
      <h1 style={{ fontSize: 40, margin: "8px 0 12px" }}>ETag and 304 demo</h1>
      <p>
        An ETag is a validator for a resource. The browser can send it back in
        an <code>If-None-Match</code> request header; when it matches, the
        server replies with <code>304 Not Modified</code> instead of sending the
        body again.
      </p>

      <div style={{ marginTop: 24 }}>
        <p style={{ marginBottom: 8 }}>Endpoint</p>
        <code style={{ display: "block", overflowWrap: "anywhere" }}>
          {demoUrl}
        </code>
      </div>

      <div style={{ marginTop: 24 }}>
        <button type="button" onClick={callApi} disabled={loading}>
          {loading ? "Requesting..." : "Load resource"}
        </button>
      </div>

      {result && (
        <section role="status" style={{ marginTop: 20 }}>
          <p>
            Fetch returned HTTP <strong>{result.status}</strong>. If the Network
            tab shows a <code>304</code>, the browser handled it internally and
            gave JavaScript the cached response body with status{" "}
            <code>200</code>.
          </p>
          <h2 style={{ marginTop: 16 }}>Response body</h2>
          <pre
            style={{
              overflowX: "auto",
              padding: 16,
              background: "var(--code-bg)",
              borderRadius: 4,
              fontSize: 14,
            }}
          >
            {result.body || "(empty response body)"}
          </pre>
        </section>
      )}

      {error && (
        <p role="alert" style={{ marginTop: 20, color: "#ff7b72" }}>
          Request failed: {error}
        </p>
      )}

      <p style={{ marginTop: 24, fontSize: 14 }}>
        The browser manages the ETag automatically; no validator is stored or
        sent by this page. Keep DevTools’ “Disable cache” unchecked to observe
        caching.
      </p>
    </main>
  );
}
