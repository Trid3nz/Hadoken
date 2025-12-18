export const INPUT_DISPLAY_MAP = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Space: "␣",
};

export const COMBOS = [
  {
    id: 1,
    name: "Hadoken",
    sequence: ["ArrowRight", "ArrowRight", "ArrowRight", "Space"],
  },
  {
    id: 2,
    name: "Shoryuken",
    sequence: ["ArrowUp", "ArrowRight", "ArrowUp", "ArrowRight", "Space"],
  },
  {
    id: 3,
    name: "Tatsumaki",
    sequence: ["ArrowLeft", "ArrowLeft", "ArrowRight", "ArrowLeft", "Space"],
  },
  {
    id: 4,
    name: "Dragon Punch",
    sequence: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowRight", "Space"],
  },
  {
    id: 5,
    name: "Hurricane Kick",
    sequence: ["ArrowRight", "ArrowDown", "ArrowRight", "ArrowRight", "Space"],
  },
  {
    id: 6,
    name: "Giga Hadoken",
    sequence: [
      "ArrowRight",
      "ArrowRight",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      "ArrowRight",
      "Space",
    ],
  },
  {
    id: 7,
    name: "Ultra Shoryuken",
    sequence: ["ArrowUp", "ArrowRight", "ArrowUp", "ArrowRight", "Space"],
  },
  {
    id: 8,
    name: "Mega Tatsumaki",
    sequence: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowRight", "Space"],
  },
  {
    id: 9,
    name: "Final Dragon Punch",
    sequence: [
      "ArrowLeft",
      "ArrowRight",
      "ArrowRight",
      "ArrowDown",
      "ArrowRight",
      "Space",
    ],
  },
  {
    id: 10,
    name: "Ultimate Hurricane Kick",
    sequence: [
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      "ArrowLeft",
      "ArrowRight",
      "ArrowRight",
      "Space",
    ],
  },
];

export const MAX_INPUT_DELAY_MS = 1000;
export const MAX_LOG_ITEMS = 12;

export const VALID_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  " ",
];

function matchCombos(currentSequence) {
  for (let i = COMBOS.length - 1; i >= 0; i -= 1) {
    const combo = COMBOS[i];
    const neededLength = combo.sequence.length;
    if (currentSequence.length < neededLength) continue;

    const recentSlice = currentSequence.slice(-neededLength);
    const matches = recentSlice.every(
      (entry, idx) => entry.key === combo.sequence[idx]
    );

    if (matches) {
      return combo;
    }
  }

  return null;
}

export class ComboEngine {
  constructor() {
    this.log = [];
    this.lastInputTime = null;
    this.spaceDownAt = null;
  }

  handleKeyDown(key, now = Date.now()) {
    if (!VALID_KEYS.includes(key)) return null;

    const normalizedKey = key === " " ? "Space" : key;

    if (normalizedKey === "Space" && this.spaceDownAt == null) {
      this.spaceDownAt = now;
    }

    const lastTime = this.lastInputTime;
    const isTooSlow =
      typeof lastTime === "number" && now - lastTime > MAX_INPUT_DELAY_MS;

    this.lastInputTime = now;

    const base = isTooSlow ? [] : this.log;
    const next = [...base, { key: normalizedKey, time: now }];
    const trimmed = next.slice(-MAX_LOG_ITEMS);
    this.log = trimmed;

    const combo = matchCombos(trimmed);

    const message = combo ? `Combo detected: ${combo.name}!` : null;

    return {
      log: trimmed,
      combo,
      charged: false,
      message,
    };
  }

  handleKeyUp(key, now = Date.now()) {
    if (key !== " ") return null;

    if (this.spaceDownAt == null) {
      return null;
    }

    const held = now - this.spaceDownAt;
    this.spaceDownAt = null;

    if (held >= 2000 && held <= 3000) {
      return {
        charged: true,
        message: "Charged Space! Your next combo is powered up.",
      };
    }

    return {
      charged: false,
      message: null,
    };
  }
}
