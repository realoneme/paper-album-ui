// Paper Album UI · Calendar for Framer
// A month on a paper card. Today is bold with a small wood dot under the number; the chosen day is a deep-wood key that springs in. In range mode
// the first click sets the start and the second the end, with the days between pressed into the paper (and a
// preview while you hover). Arrow keys move by day and week, Page Up / Page Down by month, Enter chooses.
import { useEffect, useId, useMemo, useRef, useState, startTransition, type CSSProperties, type KeyboardEvent } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, useReducedMotion } from "framer-motion"

interface CalendarProps {
    mode: "single" | "range"
    month: string
    selectedDay: number
    rangeLength: number
    weekStart: "monday" | "sunday"
    disablePast: boolean
    showOutside: boolean
    cardColor: string
    edgeColor: string
    textColor: string
    mutedColor: string
    selectedColor: string
    selectedText: string
    selectedEdge: string
    rangeColor: string
    todayColor: string
    hoverColor: string
    titleFont: CSSProperties
    font: CSSProperties
    onChange?: () => void
    style?: CSSProperties
}

const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const same = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime()
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), 28))

/**
 * Calendar
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Calendar(props: CalendarProps) {
    const {
        mode = "single",
        month: monthProp = "",
        selectedDay = 14,
        rangeLength = 4,
        weekStart = "monday",
        disablePast = false,
        showOutside = true,
        cardColor = "#f6eedb",
        edgeColor = "#d2b98f",
        textColor = "#2a1f16",
        mutedColor = "#6a5642",
        selectedColor = "#5a3d26",
        selectedText = "#f6eedb",
        selectedEdge = "#3a2716",
        rangeColor = "#e4d3af",
        todayColor = "#a9784a",
        hoverColor = "#e4d3af",
        titleFont,
        font,
        onChange,
    } = props
    const reduce = useReducedMotion()
    const today = useMemo(() => strip(new Date()), [])
    const initialMonth = useMemo(() => {
        const d = monthProp ? new Date(monthProp) : today
        return isNaN(d.getTime()) ? new Date(today.getFullYear(), today.getMonth(), 1) : new Date(d.getFullYear(), d.getMonth(), 1)
    }, [monthProp, today])
    const initialStart = selectedDay > 0 ? new Date(initialMonth.getFullYear(), initialMonth.getMonth(), Math.min(selectedDay, 28)) : null

    const [view, setView] = useState(initialMonth)
    const [start, setStart] = useState<Date | null>(initialStart)
    const [end, setEnd] = useState<Date | null>(mode === "range" && initialStart && rangeLength > 1 ? addDays(initialStart, rangeLength - 1) : null)
    const [hover, setHover] = useState<Date | null>(null)
    const [focus, setFocus] = useState<Date>(initialStart ?? (today.getMonth() === initialMonth.getMonth() ? today : initialMonth))
    const grid = useRef<HTMLDivElement>(null)
    const cls = `pa-cal-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
    const wantFocus = useRef(false)

    useEffect(() => {
        startTransition(() => {
            setView(initialMonth)
            setStart(initialStart)
            setEnd(mode === "range" && initialStart && rangeLength > 1 ? addDays(initialStart, rangeLength - 1) : null)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialMonth, selectedDay, rangeLength, mode])

    // Keep keyboard focus on the focused day after it moves (including across months).
    useEffect(() => {
        if (!wantFocus.current) return
        wantFocus.current = false
        grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus.getTime()}"]`)?.focus()
    }, [focus, view])

    const offset = weekStart === "monday" ? 1 : 0
    const first = new Date(view.getFullYear(), view.getMonth(), 1)
    const lead = (first.getDay() - offset + 7) % 7
    const days = Array.from({ length: 42 }, (_, i) => addDays(first, i - lead))
    const weeks = days[35].getMonth() !== view.getMonth() ? 5 : 6
    const names = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 7 + i + offset).toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 2))
    const title = view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })

    const disabled = (d: Date) => disablePast && d.getTime() < today.getTime()
    const lo = start && (end ?? (mode === "range" ? hover : null))
    const [rs, re] = start && lo ? (start <= lo ? [start, lo] : [lo, start]) : [start, start]

    function choose(d: Date) {
        if (disabled(d)) return
        if (d.getMonth() !== view.getMonth()) setView(new Date(d.getFullYear(), d.getMonth(), 1))
        setFocus(d)
        onChange?.()
        startTransition(() => {
            if (mode === "single") {
                setStart(d)
                setEnd(null)
            } else if (!start || end) {
                setStart(d)
                setEnd(null)
            } else if (same(d, start)) {
                setEnd(d)
            } else {
                setStart(d < start ? d : start)
                setEnd(d < start ? start : d)
            }
        })
    }
    function move(d: Date) {
        wantFocus.current = true
        setFocus(d)
        if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) setView(new Date(d.getFullYear(), d.getMonth(), 1))
    }
    function onKeyDown(e: KeyboardEvent) {
        const steps: Record<string, () => Date> = {
            ArrowLeft: () => addDays(focus, -1),
            ArrowRight: () => addDays(focus, 1),
            ArrowUp: () => addDays(focus, -7),
            ArrowDown: () => addDays(focus, 7),
            PageUp: () => addMonths(focus, -1),
            PageDown: () => addMonths(focus, 1),
            Home: () => addDays(focus, -((focus.getDay() - offset + 7) % 7)),
            End: () => addDays(focus, 6 - ((focus.getDay() - offset + 7) % 7)),
        }
        if (e.key in steps) {
            e.preventDefault()
            move(steps[e.key]())
        }
    }

    const nav = (dir: -1 | 1) => (
        <button
            type="button"
            aria-label={dir < 0 ? "Previous month" : "Next month"}
            onClick={() => {
                setView(addMonths(view, dir))
                setFocus(addMonths(focus, dir))
            }}
            style={{ width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, border: 0, borderRadius: 6, background: cardColor, color: textColor, boxShadow: `inset 0 0 0 1px ${edgeColor}, 0 3px 0 ${edgeColor}`, cursor: "pointer" }}
        >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={dir < 0 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
            </svg>
        </button>
    )

    const range = mode === "range"
    return (
        <div style={{ position: "relative", width: 300, boxSizing: "border-box", padding: 16, fontFamily: '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif', borderRadius: 8, background: cardColor, color: textColor, boxShadow: `0 2px 0 ${edgeColor}, 0 6px 12px rgba(40, 24, 10, 0.16)`, ...props.style }}>
            <style>{`.${cls}-day { transition: background-color 140ms; } .${cls}-day:hover { background-color: ${hoverColor} !important; }`}</style>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                {nav(-1)}
                <span aria-live="polite" style={{ fontFamily: '"Fraunces", "Iowan Old Style", Georgia, serif', fontSize: 18, ...titleFont }}>
                    {title}
                </span>
                {nav(1)}
            </div>
            <div ref={grid} role="grid" aria-label={title} onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)} style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", rowGap: 2, columnGap: range ? 0 : 2, textAlign: "center", ...font }}>
                {names.map((n) => (
                    <span key={n} role="columnheader" style={{ fontSize: 11, fontWeight: 600, color: mutedColor, paddingBottom: 4 }}>
                        {n}
                    </span>
                ))}
                {days.slice(0, weeks * 7).map((d) => {
                    const out = d.getMonth() !== view.getMonth()
                    if (out && !showOutside) return <span key={d.getTime()} role="gridcell" />
                    const isStart = same(d, rs)
                    const isEnd = same(d, re)
                    const ends = isStart || isEnd
                    const mid = range && rs && re && d > rs && d < re
                    const off = disabled(d)
                    const radius = range && rs && re && !same(rs, re) ? (isStart ? "6px 0 0 6px" : isEnd ? "0 6px 6px 0" : mid ? 0 : 6) : 6
                    return (
                        <span key={d.getTime()} role="gridcell" aria-selected={ends || !!mid}>
                            <motion.button
                                type="button"
                                data-day={d.getTime()}
                                tabIndex={same(d, focus) ? 0 : -1}
                                disabled={off}
                                aria-current={same(d, today) ? "date" : undefined}
                                aria-label={d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                onClick={() => choose(d)}
                                onMouseEnter={() => range && setHover(d)}
                                onFocus={() => setFocus(d)}
                                animate={ends && !reduce ? { scale: [0.82, 1] } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 520, damping: 20 }}
                                className={off || ends || mid ? undefined : `${cls}-day`}
                                style={{
                                    position: "relative",
                                    display: "block",
                                    width: "100%",
                                    aspectRatio: "1 / 1",
                                    padding: 0,
                                    border: 0,
                                    borderRadius: radius,
                                    backgroundColor: ends ? selectedColor : mid ? rangeColor : "transparent",
                                    color: ends ? selectedText : out ? mutedColor : textColor,
                                    boxShadow: ends ? `0 2px 0 ${selectedEdge}` : mid ? `0 2px 0 ${edgeColor}` : "none",
                                    fontFamily: "inherit",
                                    fontSize: 13,
                                    fontWeight: ends || mid || same(d, today) ? 700 : out ? 400 : 500,
                                    textDecoration: off ? "line-through" : "none",
                                    opacity: off ? 0.55 : 1,
                                    cursor: off ? "default" : "pointer",
                                }}
                            >
                                {d.getDate()}
                                {same(d, today) ? (
                                    <span aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: "14%", width: 4, height: 4, marginLeft: -2, borderRadius: 999, background: ends ? selectedText : todayColor }} />
                                ) : null}
                            </motion.button>
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

addPropertyControls(Calendar, {
    mode: {
        type: ControlType.Enum,
        title: "Mode",
        options: ["single", "range"],
        optionTitles: ["One day", "Range"],
        defaultValue: "single",
        displaySegmentedControl: true,
    },
    month: { type: ControlType.Date, title: "Month", description: "Empty shows the current month." },
    selectedDay: { type: ControlType.Number, title: "Selected Day", defaultValue: 14, min: 0, max: 28, step: 1, displayStepper: true, description: "0 = nothing chosen." },
    rangeLength: { type: ControlType.Number, title: "Range Days", defaultValue: 4, min: 1, max: 28, step: 1, displayStepper: true, hidden: (p) => p.mode !== "range" },
    weekStart: {
        type: ControlType.Enum,
        title: "Week Starts",
        options: ["monday", "sunday"],
        optionTitles: ["Monday", "Sunday"],
        defaultValue: "monday",
        displaySegmentedControl: true,
    },
    disablePast: { type: ControlType.Boolean, title: "No Past Days", defaultValue: false },
    showOutside: { type: ControlType.Boolean, title: "Other Months", defaultValue: true },
    cardColor: { type: ControlType.Color, title: "Card", defaultValue: "#f6eedb" },
    edgeColor: { type: ControlType.Color, title: "Edge", defaultValue: "#d2b98f" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    mutedColor: { type: ControlType.Color, title: "Muted", defaultValue: "#6a5642" },
    selectedColor: { type: ControlType.Color, title: "Selected", defaultValue: "#5a3d26" },
    selectedText: { type: ControlType.Color, title: "Selected Text", defaultValue: "#f6eedb" },
    selectedEdge: { type: ControlType.Color, title: "Selected Edge", defaultValue: "#3a2716" },
    rangeColor: { type: ControlType.Color, title: "Range", defaultValue: "#e4d3af" },
    todayColor: { type: ControlType.Color, title: "Today", defaultValue: "#a9784a" },
    hoverColor: { type: ControlType.Color, title: "Hover", defaultValue: "#e4d3af" },
    titleFont: { type: ControlType.Font, title: "Title Font", controls: "extended", defaultFontType: "serif", defaultValue: { fontSize: "18px", lineHeight: "1.2em" } },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", displayFontSize: false, defaultValue: { variant: "Medium" } },
    onChange: { type: ControlType.EventHandler, title: "On Change" },
})
