import React from "react";
import "./App.css";
import {
  INPUT_DISPLAY_MAP,
  COMBOS,
  MAX_INPUT_DELAY_MS,
  ComboEngine,
} from "./comboEngine";

function App() {
  const [log, setLog] = React.useState([]);
  const [lastCombo, setLastCombo] = React.useState(null);
  const [message, setMessage] = React.useState(
    "Press arrow keys and Space to start."
  );
  const [charged, setCharged] = React.useState(false);
  const engineRef = React.useRef(null);

  React.useEffect(() => {
    engineRef.current = new ComboEngine();

    function handleKeyDown(event) {
      if (event.repeat) return;

      const { key } = event;
      
      // Prevent default behavior for game keys to stop page scrolling
      const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
      if (gameKeys.includes(key)) {
        event.preventDefault();
      }

      setMessage("...");
      setCharged(false);

      const engine = engineRef.current;
      if (!engine) return;

      const result = engine.handleKeyDown(key);
      if (!result) return;

      const {
        log: newLog,
        combo,
        charged: isCharged,
        message: newMessage,
      } = result;

      if (Array.isArray(newLog)) {
        setLog(newLog);
      }

      if (combo) {
        setLastCombo(combo.name);
      } else {
        setLastCombo(null);
      }

      if (typeof newMessage === "string") {
        setMessage(newMessage);
      }

      if (typeof isCharged === "boolean") {
        setCharged(isCharged);
      }
    }

    function handleKeyUp(event) {
      const { key } = event;
      
      // Prevent default behavior for game keys to stop page scrolling
      const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
      if (gameKeys.includes(key)) {
        event.preventDefault();
      }

      const engine = engineRef.current;
      if (!engine) return;

      const result = engine.handleKeyUp(key);
      if (!result) return;

      const { charged: isCharged, message: newMessage } = result;

      if (typeof isCharged === "boolean") {
        setCharged(isCharged);
      }

      if (typeof newMessage === "string" && newMessage) {
        setMessage(newMessage);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="app-root max-w-3xl mx-auto px-4 py-10">
      <header className="app-header text-center mb-8">
        <h1 className="app-title font-press text-xl tracking-[0.25em] uppercase mb-3">
          Fighting Game Combo WKWKWK
        </h1>
        <p className="app-subtitle text-sm text-slate-200">
          Tes Kombo di keyboard lu bjir
        </p>
        <p className="app-hint mt-2 text-xs text-violet-100">
          Use the arrow keys and space bar. Each input must be within{" "}
          <span className="hint-highlight font-semibold text-amber-300">
            1 second
          </span>{" "}
          of the previous one. Hold space for{" "}
          <span className="hint-highlight font-semibold text-amber-300">
            2–3 seconds
          </span>{" "}
          a charged effect.
        </p>
      </header>

      <main className="layout grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:grid-rows-[auto_auto]">
        <section className="panel highlight-panel md:col-span-2 bg-gradient-to-br from-violet-900/80 to-slate-950/80 rounded-xl border border-violet-200/20 p-4 shadow-2xl">
          <h2 className="panel-title text-[0.7rem] uppercase tracking-[0.25em] text-violet-100/90 mb-3">
            Current Combo
          </h2>
          <div className={`combo-display ${charged ? "combo-charged" : ""}`}>
            <span className="combo-name">
              {lastCombo ?? "No combo detected yet"}
            </span>
          </div>
          <p className="status-message mt-2 text-xs text-violet-100/90">
            {message}
          </p>
        </section>

        <section className="panel bg-slate-950/70 rounded-xl border border-violet-200/20 p-4 shadow-xl">
          <h2 className="panel-title text-[0.7rem] uppercase tracking-[0.25em] text-violet-100/90 mb-3">
            Input Stream
          </h2>
          <div className="input-log flex flex-wrap gap-1.5 min-h-[2.5rem]">
            {log.length === 0 && (
              <p className="muted text-xs text-slate-300/80">
                Waiting for your first input…
              </p>
            )}
            {log.map((entry, idx) => (
              <div
                className="input-pill inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-900/80 px-2 py-1 text-[0.7rem]"
                key={`${entry.time}-${idx}`}
              >
                <span className="pill-icon text-sm">
                  {INPUT_DISPLAY_MAP[entry.key] ?? entry.key}
                </span>
                <span className="pill-label opacity-80">{entry.key}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel bg-slate-950/70 rounded-xl border border-violet-200/20 p-4 shadow-xl">
          <h2 className="panel-title text-[0.7rem] uppercase tracking-[0.25em] text-violet-100/90 mb-3">
            Combo List
          </h2>
          <div className="combo-table-wrapper rounded-lg overflow-hidden border border-violet-300/30">
            <table className="combo-table w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left font-semibold tracking-[0.15em] uppercase text-[0.65rem] bg-violet-900/80">
                    No
                  </th>
                  <th className="px-2 py-2 text-left font-semibold tracking-[0.15em] uppercase text-[0.65rem] bg-violet-900/80">
                    Input
                  </th>
                  <th className="px-2 py-2 text-left font-semibold tracking-[0.15em] uppercase text-[0.65rem] bg-violet-900/80">
                    Combo
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMBOS.map((combo) => (
                  <tr
                    key={combo.id}
                    className="odd:bg-slate-950/90 even:bg-slate-900/80 hover:bg-violet-800/80"
                  >
                    <td className="px-2 py-1 align-middle">{combo.id}</td>
                    <td className="combo-sequence px-2 py-1 whitespace-nowrap">
                      {combo.sequence.map((step, index) => (
                        <span
                          key={index}
                          className={`sequence-step ${
                            step === "Space" ? "sequence-space" : ""
                          }`}
                        >
                          {INPUT_DISPLAY_MAP[step] ?? step}
                        </span>
                      ))}
                    </td>
                    <td className="px-2 py-1 align-middle">{combo.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="app-footer mt-4 text-center text-[0.7rem] text-slate-300/80">
        <span>Built for combo timing practice.</span>
      </footer>
    </div>
  );
}

export default App;
