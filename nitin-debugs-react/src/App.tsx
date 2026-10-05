import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const App = () => {
  const items = useMemo(() => Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`), []);

  const parentRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ margin: "0 0 12px 0" }}>Virtualized list demo</h1>
      <p style={{ margin: "0 0 12px 0", color: "#555" }}>Showing {items.length.toLocaleString()} items — only visible rows are rendered.</p>

      <div
        ref={parentRef}
        style={{ height: 400, overflow: "auto", border: "1px solid #ddd", borderRadius: 6 }}
      >
        <div style={{ height: totalSize, position: "relative" }}>
          {virtualItems.map((virtualRow) => {
            const item = items[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  height: virtualRow.size,
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderBottom: "1px solid #f0f0f0",
                  background: "white",
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 12, color: "#666" }}>Rendered rows: {virtualItems.length}</div>
    </div>
  );
};

export default App;
