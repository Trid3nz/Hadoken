import './App.css'

const INPUT_DISPLAY_MAP = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Space: '␣',
}

const COMBOS = [
  { id: 1, name: 'Hadoken', sequence: ['ArrowRight', 'ArrowRight', 'Space'] },
  {
    id: 2,
    name: 'Shoryuken',
    sequence: ['ArrowUp', 'ArrowRight', 'ArrowUp', 'Space'],
  },
  {
    id: 3,
    name: 'Tatsumaki',
    sequence: ['ArrowLeft', 'ArrowLeft', 'ArrowRight', 'Space'],
  },
  {
    id: 4,
    name: 'Dragon Punch',
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowRight', 'Space'],
  },
  {
    id: 5,
    name: 'Hurricane Kick',
    sequence: ['ArrowRight', 'ArrowDown', 'ArrowRight', 'Space'],
  },
  {
    id: 6,
    name: 'Giga Hadoken',
    sequence: ['ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowRight', 'Space'],
  },
  {
    id: 7,
    name: 'Ultra Shoryuken',
    sequence: ['ArrowUp', 'ArrowRight', 'ArrowUp', 'ArrowRight', 'Space'],
  },
  {
    id: 8,
    name: 'Mega Tatsumaki',
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'Space'],
  },
  {
    id: 9,
    name: 'Final Dragon Punch',
    sequence: [
      'ArrowLeft',
      'ArrowRight',
      'ArrowRight',
      'ArrowDown',
      'ArrowRight',
      'Space',
    ],
  },
  {
    id: 10,
    name: 'Ultimate Hurricane Kick',
    sequence: [
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
      'ArrowLeft',
      'ArrowRight',
      'ArrowRight',
      'Space',
    ],
  },
]

const MAX_INPUT_DELAY_MS = 1000
const MAX_LOG_ITEMS = 12

function matchCombos(currentSequence, timestamp) {
  const matches = []

  COMBOS.forEach((combo) => {
    const neededLength = combo.sequence.length
    if (currentSequence.length < neededLength) return

    const recentSlice = currentSequence.slice(-neededLength)
    const buttonsMatch = recentSlice
      .map((e) => e.key)
      .every((key, idx) => key === combo.sequence[idx])

    if (!buttonsMatch) return

    const firstTime = recentSlice[0].time
    const lastTime = recentSlice[recentSlice.length - 1].time
    if (lastTime - firstTime <= MAX_INPUT_DELAY_MS * (neededLength - 1)) {
      matches.push({
        combo,
        completedAt: timestamp,
      })
    }
  })

  if (matches.length === 0) return null
  return matches[matches.length - 1]
}

function App() {
  const [log, setLog] = React.useState([])
  const [lastCombo, setLastCombo] = React.useState(null)
  const [message, setMessage] = React.useState('Press arrow keys and Space to start.')
  const [charged, setCharged] = React.useState(false)
  const spaceDownRef = React.useRef(null)

  React.useEffect(() => {
    function handleKeyDown(event) {
      const { key } = event
      const validKeys = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        ' ',
      ]

      if (!validKeys.includes(key)) return
      event.preventDefault()

      const now = Date.now()
      const normalizedKey = key === ' ' ? 'Space' : key

      if (normalizedKey === 'Space' && spaceDownRef.current == null) {
        spaceDownRef.current = now
      }

      setLog((prev) => {
        const filtered = prev.filter(
          (entry) => now - entry.time <= MAX_INPUT_DELAY_MS,
        )
        const next = [...filtered, { key: normalizedKey, time: now }]
        return next.slice(-MAX_LOG_ITEMS)
      })

      setMessage('...')
      setCharged(false)

      setLog((prev) => {
        const filtered = prev.filter(
          (entry) => now - entry.time <= MAX_INPUT_DELAY_MS,
        )
        const next = [...filtered, { key: normalizedKey, time: now }]
        const match = matchCombos(next, now)

        if (match) {
          setLastCombo(match.combo.name)
          setMessage(`Combo detected: ${match.combo.name}!`)
        } else {
          setLastCombo(null)
          setMessage('No combo yet. Keep going!')
        }

        return next.slice(-MAX_LOG_ITEMS)
      })
    }

    function handleKeyUp(event) {
      const { key } = event
      if (key !== ' ') return

      const now = Date.now()
      if (spaceDownRef.current != null) {
        const held = now - spaceDownRef.current
        spaceDownRef.current = null

        if (held >= 2000 && held <= 3000) {
          setCharged(true)
          setMessage('Charged Space! Your next combo is powered up.')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Hadoken Lab</h1>
        <p className="app-subtitle">
          Practice classic fighting-game combos using your keyboard.
        </p>
        <p className="app-hint">
          Use the arrow keys and space bar. Each input must be within{' '}
          <span className="hint-highlight">1 second</span> of the previous one.
          Hold space for <span className="hint-highlight">2–3 seconds</span> for
          a charged effect.
        </p>
      </header>

      <main className="layout">
        <section className="panel highlight-panel">
          <h2 className="panel-title">Current Combo</h2>
          <div className={`combo-display ${charged ? 'combo-charged' : ''}`}>
            <span className="combo-name">
              {lastCombo ?? 'No combo detected yet'}
            </span>
          </div>
          <p className="status-message">{message}</p>
        </section>

        <section className="panel">
          <h2 className="panel-title">Input Stream</h2>
          <div className="input-log">
            {log.length === 0 && (
              <p className="muted">Waiting for your first input…</p>
            )}
            {log.map((entry, idx) => (
              <div className="input-pill" key={`${entry.time}-${idx}`}>
                <span className="pill-icon">
                  {INPUT_DISPLAY_MAP[entry.key] ?? entry.key}
                </span>
                <span className="pill-label">{entry.key}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2 className="panel-title">Combo List</h2>
          <div className="combo-table-wrapper">
            <table className="combo-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Input</th>
                  <th>Combo</th>
                </tr>
              </thead>
              <tbody>
                {COMBOS.map((combo) => (
                  <tr key={combo.id}>
                    <td>{combo.id}</td>
                    <td className="combo-sequence">
                      {combo.sequence.map((step, index) => (
                        <span key={index} className="sequence-step">
                          {INPUT_DISPLAY_MAP[step] ?? step}
                        </span>
                      ))}
                      <span className="sequence-step sequence-space">
                        {INPUT_DISPLAY_MAP.Space}
                      </span>
                    </td>
                    <td>{combo.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>Built for combo timing practice.</span>
      </footer>
    </div>
  )
}

export default App
