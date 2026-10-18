// Paper Album UI · Tabs for Framer
// Index-card tabs standing on a deep-wood rule; the selected card is taller and deep wood. When the cards do not
// fit (a phone), the row scrolls sideways, the side with more tabs fades, and the selected tab scrolls into view.
import { useEffect, useId, useRef, useState, startTransition, type CSSProperties, type KeyboardEvent } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, useReducedMotion } from "framer-motion"

interface Tab {
    label: string
    content: string
}

interface TabsProps {
    tabs: Tab[]
    initial: number
    selectedColor: string
    selectedText: string
    cardColor: string
    cardText: string
    contentColor: string
    tabFont: CSSProperties
    contentFont: CSSProperties
    style?: CSSProperties
}

/**
 * Tabs
 *
 * @framerIntrinsicWidth 560
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Tabs(props: TabsProps) {
    const {
        tabs = [],
        initial = 0,
        selectedColor = "#5a3d26",
        selectedText = "#f6eedb",
        cardColor = "#e4d3af",
        cardText = "#2a1f16",
        contentColor = "#6a5642",
        tabFont,
        contentFont,
    } = props
    const [index, setIndex] = useState(Math.min(initial, Math.max(0, tabs.length - 1)))
    const [edges, setEdges] = useState({ start: false, end: false })
    const listRef = useRef<HTMLDivElement>(null)
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
    const base = useId()
    const reduce = useReducedMotion()

    useEffect(() => startTransition(() => setIndex(Math.min(initial, Math.max(0, tabs.length - 1)))), [initial, tabs.length])

    // Track whether there is more to scroll on either side (for the edge fades).
    useEffect(() => {
        const list = listRef.current
        if (!list || typeof ResizeObserver === "undefined") return
        const update = () => {
            const max = list.scrollWidth - list.clientWidth
            const next = { start: list.scrollLeft > 1, end: max - list.scrollLeft > 1 }
            setEdges((prev) => (prev.start === next.start && prev.end === next.end ? prev : next))
        }
        update()
        list.addEventListener("scroll", update, { passive: true })
        const ro = new ResizeObserver(update)
        ro.observe(list)
        return () => {
            list.removeEventListener("scroll", update)
            ro.disconnect()
        }
    }, [tabs.length])

    // Bring the selected tab into view inside the strip (never scrolls the page).
    useEffect(() => {
        const list = listRef.current
        const tab = tabRefs.current[index]
        if (!list || !tab) return
        const l = list.getBoundingClientRect()
        const t = tab.getBoundingClientRect()
        if (t.left < l.left + 24) list.scrollBy({ left: t.left - l.left - 24, behavior: "smooth" })
        else if (t.right > l.right - 24) list.scrollBy({ left: t.right - l.right + 24, behavior: "smooth" })
    }, [index])

    function select(i: number, focus = false) {
        startTransition(() => setIndex(i))
        if (focus) tabRefs.current[i]?.focus()
    }
    function onKeyDown(e: KeyboardEvent) {
        const last = tabs.length - 1
        const keys: Record<string, number> = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }
        if (e.key in keys) {
            e.preventDefault()
            select(keys[e.key], true)
        }
    }

    const mask =
        edges.start && edges.end
            ? "linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)"
            : edges.end
              ? "linear-gradient(to right, black calc(100% - 40px), transparent)"
              : edges.start
                ? "linear-gradient(to left, black calc(100% - 40px), transparent)"
                : undefined

    return (
        <div style={{ position: "relative", width: "100%", ...props.style }}>
            <div
                ref={listRef}
                role="tablist"
                aria-orientation="horizontal"
                onKeyDown={onKeyDown}
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                    // Fixed height: the selected card grows inside the row, never pushing the panel down.
                    height: 16 + 51,
                    boxSizing: "border-box",
                    padding: "16px 16px 0",
                    margin: "-8px -8px 0",
                    overflowX: "auto",
                    overflowY: "hidden",
                    scrollbarWidth: "none",
                    background: `linear-gradient(${selectedColor}, ${selectedColor}) center bottom / calc(100% - 16px) 3px no-repeat`,
                    WebkitMaskImage: mask,
                    maskImage: mask,
                }}
            >
                {tabs.map((tab, i) => {
                    const on = i === index
                    return (
                        <motion.button
                            key={i}
                            // A newly selected card is pulled up past its height and springs back; the one it leaves
                            // settles. `initial={false}` keeps the first render still.
                            initial={false}
                            animate={on ? { height: reduce ? 51 : [42, 58, 49, 51], marginBottom: 0 } : { height: 42, marginBottom: 3 }}
                            transition={on && !reduce ? { duration: 0.46, times: [0, 0.4, 0.7, 1], ease: [0.2, 0.8, 0.2, 1] } : { duration: reduce ? 0 : 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                            ref={(el) => {
                                tabRefs.current[i] = el
                            }}
                            id={`${base}-t${i}`}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            aria-controls={`${base}-p${i}`}
                            tabIndex={on ? 0 : -1}
                            onClick={() => select(i)}
                            style={{
                                flex: "none",
                                whiteSpace: "nowrap",
                                padding: "0 20px",
                                border: 0,
                                borderRadius: "8px 8px 0 0",
                                background: on ? selectedColor : cardColor,
                                color: on ? selectedText : cardText,
                                boxShadow: on ? "0 -4px 10px rgba(40, 24, 10, 0.22)" : "inset 0 -6px 6px -4px rgba(40, 24, 10, 0.18)",
                                cursor: "pointer",
                                fontSize: 15,
                                fontWeight: 600,
                                transition: "background-color 220ms, color 220ms",
                                ...tabFont,
                            }}
                        >
                            {tab.label}
                        </motion.button>
                    )
                })}
            </div>
            {/* Every panel shares one grid cell, so the area is as tall as the longest panel and never jumps. */}
            <div style={{ display: "grid" }}>
                {tabs.map((tab, i) => (
                    <div
                        key={i}
                        id={`${base}-p${i}`}
                        role="tabpanel"
                        aria-labelledby={`${base}-t${i}`}
                        aria-hidden={i !== index}
                        tabIndex={i === index ? 0 : -1}
                        style={{
                            gridArea: "1 / 1",
                            visibility: i === index ? "visible" : "hidden",
                            padding: "16px 8px 0",
                            color: contentColor,
                            fontSize: 15,
                            lineHeight: 1.6,
                            ...contentFont,
                        }}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    )
}

addPropertyControls(Tabs, {
    tabs: {
        type: ControlType.Array,
        title: "Tabs",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Photos" },
                content: { type: ControlType.String, title: "Content", displayTextArea: true, defaultValue: "24 photos from [Album title]." },
            },
        },
        defaultValue: [
            { label: "Photos", content: "24 photos from Winter in Hokkaido." },
            { label: "Story", content: "Snow light, harbour mornings and a very cold ferry." },
            { label: "Prints", content: "Archival prints in A4, A3 and square." },
            { label: "Map", content: "Otaru, Sapporo and the coast road north." },
        ],
    },
    initial: { type: ControlType.Number, title: "Selected", defaultValue: 0, min: 0, max: 9, step: 1, displayStepper: true },
    selectedColor: { type: ControlType.Color, title: "Selected", defaultValue: "#5a3d26" },
    selectedText: { type: ControlType.Color, title: "Selected Text", defaultValue: "#f6eedb" },
    cardColor: { type: ControlType.Color, title: "Card", defaultValue: "#e4d3af" },
    cardText: { type: ControlType.Color, title: "Card Text", defaultValue: "#2a1f16" },
    contentColor: { type: ControlType.Color, title: "Content", defaultValue: "#6a5642" },
    tabFont: {
        type: ControlType.Font,
        title: "Tab Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "15px", variant: "Semibold", lineHeight: "1em" },
    },
    contentFont: {
        type: ControlType.Font,
        title: "Content Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "15px", variant: "Regular", lineHeight: "1.6em" },
    },
})
