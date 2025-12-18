## Hadoken Lab – Fighting Game Combo Detector

Hadoken Lab is a small React + Vite web app that simulates a fighting game **combo detector**.  
Use your keyboard arrow keys and the space bar to input moves; the app checks whether your inputs match one of several classic-style combos within a strict timing window.

### How It Works

- **Inputs**: The app listens globally for:
  - `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`
  - `Space` (jump / attack button)
- **Timing rule**:
  - Each input must come **within 1 second** of the previous one.
  - If you wait longer than 1 second, the internal combo state resets and you must start over.
- **Combos**:
  - Ten different combos are defined (Hadoken, Shoryuken, Tatsumaki, etc.).
  - When your recent input stream exactly matches a combo sequence and respects the timing rule, the combo name flashes in the **Current Combo** panel.
- **Charged space (bonus)**:
  - Hold the space bar for **2–3 seconds**.
  - A special “Charged Space” effect appears and the combo display glows.

### Running the Project

- **Install dependencies**:

```bash
npm install
```

- **Start the dev server**:

```bash
npm run dev
```

Then open the printed local URL in your browser (usually `http://localhost:5173`).

### Using the UI

- **Current Combo panel**: Shows the last detected combo and status text.
- **Input Stream**: Displays your recent key presses as small arrow/space chips so you can see the sequence you just entered.
- **Combo List**: Static reference table that lists all valid combos and their exact input order.

### Implementation Notes

- Built with **React 19** and **Vite**.
- The combo matching logic:
  - Tracks the recent sequence of normalized keys with timestamps.
  - Resets when a gap between inputs exceeds 1000 ms.
  - Compares the recent slice of inputs against the defined combos, preferring the last combo in the list when multiple patterns overlap.

This project is intended as a simple demonstration of **state-machine style input handling**, keyboard event management in React, and a retro-inspired UI design.
