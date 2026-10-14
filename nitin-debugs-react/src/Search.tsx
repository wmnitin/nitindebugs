import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type SearchResult = {
  title: string;
  description: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
 return typeof value === "object" && value !== null;
}

async function searchApi(
 query: string,
 signal?: AbortSignal,
): Promise<SearchResult[]> {
 const url = new URL("https://hn.algolia.com/api/v1/search");
 url.searchParams.set("query", query);
 url.searchParams.set("hitsPerPage", "8");

 const response = await fetch(url, { signal });
 if (!response.ok) {
   throw new Error(`Search API returned HTTP ${response.status}`);
 }

 const payload: unknown = await response.json();
 if (!isRecord(payload) || !Array.isArray(payload.hits)) {
   throw new Error("Search API returned an unexpected response.");
 }

 return payload.hits.flatMap((hit): SearchResult[] => {
   if (!isRecord(hit)) return [];

   const title =
     (typeof hit.title === "string" && hit.title) ||
     (typeof hit.story_title === "string" && hit.story_title) ||
     (typeof hit.story_text === "string" && hit.story_text);
   if (!title) return [];

   const url =
     (typeof hit.url === "string" && hit.url) ||
     (typeof hit.story_url === "string" && hit.story_url);

   return [{ title, description: url || "Hacker News result" }];
 });
}

type SearchPanelProps = {
  title: string;
  description: string;
  query: string;
  abortPrevious: boolean;
};

function SearchPanel({
  title,
  description,
  query,
  abortPrevious,
}: SearchPanelProps) {
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [resultQuery, setResultQuery] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  async function runSearch() {
    const searchTerm = query.trim();
    if (!searchTerm) return;

    if (abortPrevious) {
      controllerRef.current?.abort();
    }

    const controller = abortPrevious ? new AbortController() : null;
    if (controller) controllerRef.current = controller;

    setPendingCount((count) => count + 1);
    setError("");

    try {
      const nextResults = await searchApi(searchTerm, controller?.signal);
      setResults(nextResults);
      setResultQuery(searchTerm);
    } catch (requestError) {
      if (
        requestError instanceof DOMException &&
        requestError.name === "AbortError"
      ) {
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : String(requestError),
      );
    } finally {
      setPendingCount((count) => Math.max(0, count - 1));
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }

  return (
    <section style={styles.panel}>
      <div style={styles.panelHeading}>
        <span style={abortPrevious ? styles.fixedBadge : styles.raceBadge}>
          {abortPrevious ? "FIXED" : "RACE CONDITION"}
        </span>
        <h2 style={styles.panelTitle}>{title}</h2>
      </div>
      <p style={styles.description}>{description}</p>

      <button
        type="button"
        onClick={runSearch}
        disabled={!query.trim()}
        style={styles.button}
      >
        Search for “{query.trim() || "..."}”
      </button>

      {pendingCount > 0 && (
        <p role="status" style={styles.pending}>
          {pendingCount === 1
            ? "Request in flight..."
            : `${pendingCount} requests in flight...`}
        </p>
      )}

      {resultQuery && (
        <div style={styles.results}>
          <p style={styles.resultLabel}>
            Showing response for <strong>{resultQuery}</strong>
          </p>
          <ul style={styles.resultList}>
            {results?.length ? (
              results.map((result) => (
                <li key={`${result.title}-${result.description}`} style={styles.resultItem}>
                  <strong>{result.title}</strong>
                  <span style={styles.resultDescription}>
                    {result.description}
                  </span>
                </li>
              ))
            ) : (
              <li style={styles.resultItem}>No results found.</li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <p role="alert" style={styles.error}>
          Search failed: {error}
        </p>
      )}
    </section>
  );
}

export default function Search() {
  const [query, setQuery] = useState("React");

  return (
    <main style={styles.page}>
      <header>
        <p style={styles.eyebrow}>NITIN DEBUGS · FRONTEND INTERVIEW</p>
        <h1 style={styles.title}>Search Race Condition</h1>
        <p style={styles.intro}>
          Both panels call the same Hacker News search API. Search for React,
          quickly change the query to Redux, and search again. Watch which
          response arrives last.
        </p>
      </header>

      <label htmlFor="search-query" style={styles.label}>
        Search query
      </label>
      <input
        id="search-query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try React, then Redux"
        style={styles.input}
      />
      <p style={styles.hint}>
        Run both searches for each query. Use React first, then Redux before the
        React request finishes.
      </p>

      <div style={styles.grid}>
        <SearchPanel
          title="Without cancellation"
          description="Every response updates the UI, even when it belongs to an older search."
          query={query}
          abortPrevious={false}
        />
        <SearchPanel
          title="With AbortController"
          description="A new search aborts the previous request and passes its signal to the API."
          query={query}
          abortPrevious
        />
      </div>

      <p style={styles.note}>
        Demo note: response times are simulated so React takes longer than
        The requests use the live Hacker News search API, so response timing
        can vary. The fixed example passes <code>signal</code> to{" "}
        <code>fetch</code> and ignores <code>AbortError</code> when a request is
        cancelled.
      </p>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    width: "min(100% - 32px, 960px)",
    margin: "0 auto",
    padding: "36px 0 48px",
    textAlign: "left",
  },
  eyebrow: {
    color: "var(--accent)",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.12em",
    marginBottom: 8,
  },
  title: {
    fontSize: "clamp(32px, 5vw, 48px)",
    lineHeight: 1.1,
    margin: "0 0 12px",
  },
  intro: { maxWidth: 700, lineHeight: 1.6 },
  label: { display: "block", marginTop: 28, marginBottom: 8, fontWeight: 600 },
  input: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 420,
    padding: "11px 12px",
    border: "1px solid var(--border)",
    borderRadius: 6,
    background: "var(--code-bg)",
    color: "var(--text-h)",
    font: "inherit",
  },
  hint: { marginTop: 8, fontSize: 14 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: 16,
    marginTop: 24,
  },
  panel: {
    minWidth: 0,
    padding: 20,
    border: "1px solid var(--border)",
    borderRadius: 10,
    background: "var(--code-bg)",
  },
  panelHeading: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  raceBadge: {
    color: "#ff7b72",
    border: "1px solid rgba(255,123,114,.45)",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".06em",
  },
  fixedBadge: {
    color: "#7ee787",
    border: "1px solid rgba(126,231,135,.45)",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".06em",
  },
  panelTitle: { margin: 0, fontSize: 20 },
  description: { minHeight: 48, marginTop: 12, fontSize: 15, lineHeight: 1.5 },
  button: {
    marginTop: 12,
    padding: "9px 12px",
    border: "1px solid var(--accent-border)",
    borderRadius: 6,
    background: "var(--accent-bg)",
    color: "var(--text-h)",
    font: "inherit",
    cursor: "pointer",
  },
  pending: { marginTop: 12, color: "var(--accent)", fontSize: 14 },
  results: {
    marginTop: 18,
    padding: 14,
    border: "1px solid var(--border)",
    borderRadius: 6,
    background: "var(--bg)",
  },
  resultLabel: { fontSize: 14 },
  resultList: { listStyle: "none", padding: 0, margin: "12px 0 0" },
  resultItem: {
    display: "grid",
    gap: 3,
    padding: "10px 0",
    borderTop: "1px solid var(--border)",
  },
  resultDescription: { fontSize: 13 },
  error: { marginTop: 12, color: "#ff7b72", fontSize: 14 },
  note: { marginTop: 24, fontSize: 14, lineHeight: 1.6 },
};