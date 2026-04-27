import React from "react";
import { useState, useRef } from "react";
import axios from "axios";
import "./console.css";

export default function Console() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const streamRef = useRef(null);
  const outputRef = useRef(null);

  const streamText = (text) => {
    if (streamRef.current) clearInterval(streamRef.current);
    setDisplayedAnswer("");
    let i = 0;
    streamRef.current = setInterval(() => {
      if (i < text.length) {
        setDisplayedAnswer((prev) => prev + text[i]);
        i++;
        if (outputRef.current)
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
      } else {
        clearInterval(streamRef.current);
      }
    }, 18);
  };

  const sendRequest = async () => {
    const cmd = query.trim();
    if (!cmd || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setDisplayedAnswer("");
    setLastQuery(cmd);
    setQuery("");

    const t0 = Date.now();

    try {
      const res = await axios.post("http://localhost:3001/search/search", {
        query: cmd,
      });
      const text = res.data.answer ?? JSON.stringify(res.data, null, 2);
      setAnswer(text);
      setElapsed(((Date.now() - t0) / 1000).toFixed(2));
      streamText(text);
    } catch (err) {
      setError(err.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const clearOutput = () => {
    if (streamRef.current) clearInterval(streamRef.current);
    setAnswer("");
    setDisplayedAnswer("");
    setError("");
    setLastQuery("");
    setElapsed(null);
  };

  const isEmpty = !displayedAnswer && !error && !loading;

  return (
    <div className="root">
      <div className="grid-bg" />
      <div className="glow" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo-mark">⬡</div>
          <div className="header-text">
            <h1>Search AI</h1>
            <p>Semantic query interface</p>
          </div>
          <div className={`status-dot ${loading ? "loading" : ""}`} />
        </div>

        {/* Output pane */}
        <div className="output-pane" ref={outputRef}>
          {isEmpty ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <p>Awaiting query input</p>
              <p>Type below and press enter</p>
            </div>
          ) : (
            <>
              {lastQuery && (
                <p className="prompt-line">
                  <span>&gt;</span> {lastQuery}
                </p>
              )}
              {error ? (
                <p className="error-text">✕ {error}</p>
              ) : (
                <div className="answer-block">
                  {displayedAnswer}
                  {loading || displayedAnswer.length < answer.length ? (
                    <span className="cursor" />
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>

        {/* Loading bar */}
        {loading && <div className="loading-bar" />}

        {/* Input row */}
        <div className="input-row">
          <div className="input-wrapper">
            <span className="prompt-symbol">&gt;</span>
            <input
              type="text"
              className="console-input"
              placeholder="Enter your search query..."
              value={query}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendRequest()}
            />
          </div>
          <button className="btn btn-run" onClick={sendRequest} disabled={loading}>
            {loading ? "..." : "Run"}
          </button>
          <button className="btn" onClick={clearOutput}>
            Clear
          </button>
        </div>

        {/* Footer */}
        <div className="footer-bar">
          <p className="meta">
            Backend <span>localhost:3001</span>
          </p>
          <p className="meta">{elapsed ? `${elapsed}s` : "—"}</p>
        </div>
      </div>
    </div>
  );
}