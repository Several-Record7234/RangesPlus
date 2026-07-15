import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import OBR from "@owlbear-rodeo/sdk";
import { changelog, getUnseenEntries } from "./changelog";

const WHATS_NEW_MODAL_ID = "dev.rangesplus.whats-new";
const AUTO_CLOSE_S = 5;

const TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  feat: { bg: "rgba(166,227,161,0.2)", color: "#a6e3a1", label: "New" },
  fix:  { bg: "rgba(243,139,168,0.2)", color: "#f38ba8", label: "Fix" },
  change: { bg: "rgba(249,226,175,0.2)", color: "#f9e2af", label: "Change" },
};

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={i}>{part.slice(1, -1)}</em>;
        if (part.startsWith("_") && part.endsWith("_"))
          return <em key={i}>{part.slice(1, -1)}</em>;
        return part;
      })}
    </>
  );
}

function WhatsNew() {
  const [remaining, setRemaining] = useState<number | null>(AUTO_CLOSE_S);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lastSeen = new URLSearchParams(window.location.search).get("lastSeen");
  const entries = getUnseenEntries(changelog, lastSeen);

  const handleClose = useCallback(() => {
    OBR.modal.close(WHATS_NEW_MODAL_ID);
  }, []);

  const cancelCountdown = useCallback(() => {
    if (timerRef.current === null) return;
    clearTimeout(timerRef.current);
    clearInterval(tickRef.current!);
    timerRef.current = null;
    tickRef.current = null;
    setRemaining(null);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(handleClose, AUTO_CLOSE_S * 1000);
    tickRef.current = setInterval(() => setRemaining((r) => (r !== null ? r - 1 : null)), 1000);
    return () => {
      clearTimeout(timerRef.current!);
      clearInterval(tickRef.current!);
    };
  }, [handleClose]);

  return (
    <div
      onClick={cancelCountdown}
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        background: "#1e1e2e", color: "#cdd6f4", padding: 16,
        gap: 12, fontFamily: FONT, boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <img src="/icon.svg" alt="" style={{ width: 24, height: 24, borderRadius: 4 }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>RangesPlus</span>
        <span style={{ fontSize: 11, color: "#a6adc8", marginLeft: "auto" }}>What&apos;s New</span>
      </div>

      <div style={{ borderTop: "1px solid #313244", flexShrink: 0 }} />

      <div
        style={{ flex: 1, overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 12 }}
        onScroll={cancelCountdown}
      >
        {entries.map((entry) => (
          <div key={entry.version}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>v{entry.version}</span>
              <span style={{ fontSize: 11, color: "#a6adc8" }}>{entry.date}</span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {entry.changes.map((change, i) => {
                const s = TYPE_STYLES[change.type] ?? TYPE_STYLES.feat;
                return (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <span style={{
                      flexShrink: 0, padding: "0 4px", borderRadius: 3,
                      fontSize: 10, fontWeight: 500, lineHeight: "16px",
                      background: s.bg, color: s.color,
                    }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: 11, color: "#a6adc8" }}>
                      <InlineText text={change.text} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #313244", flexShrink: 0 }} />

      <button
        onClick={handleClose}
        style={{
          width: "100%", padding: "6px 12px", borderRadius: 4, border: "none",
          fontSize: 11, fontWeight: 500, cursor: "pointer", flexShrink: 0,
          background: "#89b4fa", color: "#1e1e2e",
        }}
      >
        {remaining !== null ? `Got it (${remaining}s)` : "Got it"}
      </button>
    </div>
  );
}

OBR.onReady(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <WhatsNew />
    </React.StrictMode>
  );
});
