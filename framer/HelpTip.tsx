// Paper Album UI · Help Tip for Framer
// A "?" beside a label that explains a setting. A mouse hover opens it, a tap or click toggles it (so it works on
// phones), Enter or Space opens it and Escape closes it. A click after a hover-open pins it open.
import { useEffect, useId, useRef, useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

interface HelpTipProps {
    label: string
    text: string
    side: "bottom" | "top"
    defaultOpen: boolean
    keyColor: string
    keyActiveFill: string
    bubbleColor: string
    textColor: string
    font: CSSProperties
    style?: CSSProperties
}

const LEAVE_DELAY = 150

/**
 * Help Tip
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function HelpTip(props: HelpTipProps) {
    const {
        label = "About watermarks",
        text = "Your studio name is printed faintly in the corner of web-size images.",
        side = "bottom",
        defaultOpen = false,
        keyColor = "#6a5642",
        keyActiveFill = "#e4d3af",
        bubbleColor = "#f6eedb",
        textColor = "#2a1f16",
        font,
    } = props
    const [open, setOpen] = useState(defaultOpen)
    const [shift, setShift] = useState(0)
    const byHover = useRef(false)
    const leaveTimer = useRef<number | undefined>(undefined)
    const rootRef = useRef<HTMLSpanElement>(null)
    const bubbleRef = useRef<HTMLSpanElement>(null)
    const bubbleId = useId()

    useEffect(() => startTransition(() => setOpen(defaultOpen)), [defaultOpen])
    useEffect(() => () => window.clearTimeout(leaveTimer.current), [])

    // Close on Escape and on a press outside.
    useEffect(() => {
        if (!open || typeof window === "undefined") return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close()
        }
        const onDown = (e: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) close()
        }
        window.addEventListener("keydown", onKey)
        window.addEventListener("pointerdown", onDown)
        return () => {
            window.removeEventListener("keydown", onKey)
            window.removeEventListener("pointerdown", onDown)
        }
    }, [open])

    // Keep the bubble on screen: shift it sideways; the arrow keeps pointing at the key. The shift is reset to 0
    // on close, so each open measures the centred position.
    useEffect(() => {
        if (!open || typeof window === "undefined" || !bubbleRef.current) return
        const r = bubbleRef.current.getBoundingClientRect()
        const pad = 16
        if (r.left < pad) setShift(pad - r.left)
        else if (r.right > window.innerWidth - pad) setShift(window.innerWidth - pad - r.right)
    }, [open])

    function close() {
        byHover.current = false
        setShift(0)
        window.clearTimeout(leaveTimer.current)
        startTransition(() => setOpen(false))
    }
    function leave(e: React.PointerEvent) {
        if (e.pointerType !== "mouse" || !byHover.current) return
        window.clearTimeout(leaveTimer.current)
        leaveTimer.current = window.setTimeout(close, LEAVE_DELAY)
    }

    const above = side === "top"
    return (
        <span ref={rootRef} style={{ position: "relative", display: "inline-flex", ...props.style }}>
            <button
                type="button"
                aria-label={label}
                aria-expanded={open}
                aria-controls={open ? bubbleId : undefined}
                onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return
                    window.clearTimeout(leaveTimer.current)
                    if (!open) {
                        byHover.current = true
                        startTransition(() => setOpen(true))
                    }
                }}
                onPointerLeave={leave}
                onClick={() => {
                    if (byHover.current && open) {
                        byHover.current = false // pin it open
                        window.clearTimeout(leaveTimer.current)
                        return
                    }
                    startTransition(() => setOpen(!open))
                }}
                style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    padding: 0,
                    border: 0,
                    borderRadius: 999,
                    background: open ? keyActiveFill : "transparent",
                    color: open ? textColor : keyColor,
                    cursor: "pointer",
                    transition: "background-color 140ms, color 140ms",
                }}
            >
                {/* 44×44 tap target around the 24px key */}
                <span aria-hidden="true" style={{ position: "absolute", inset: -10 }} />
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                </svg>
            </button>
            {open && (
                <span
                    ref={bubbleRef}
                    id={bubbleId}
                    role="dialog"
                    aria-label={label}
                    onPointerEnter={(e) => e.pointerType === "mouse" && window.clearTimeout(leaveTimer.current)}
                    onPointerLeave={leave}
                    style={{
                        position: "absolute",
                        zIndex: 10,
                        left: "50%",
                        [above ? "bottom" : "top"]: "calc(100% + 10px)",
                        transform: `translateX(calc(-50% + ${shift}px))`,
                        width: "max-content",
                        maxWidth: 280,
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: bubbleColor,
                        color: textColor,
                        boxShadow: "0 2px 0 rgba(210, 185, 143, 1), 0 22px 38px rgba(40, 24, 10, 0.30)",
                        fontSize: 14,
                        lineHeight: 1.5,
                        textAlign: "left",
                        ...font,
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            left: `calc(50% - 7px - ${shift}px)`,
                            [above ? "bottom" : "top"]: -7,
                            width: 14,
                            height: 14,
                            background: bubbleColor,
                            transform: "rotate(45deg)",
                        }}
                    />
                    <span style={{ position: "relative" }}>{text}</span>
                </span>
            )}
        </span>
    )
}

addPropertyControls(HelpTip, {
    label: { type: ControlType.String, title: "Label", defaultValue: "About watermarks", description: "Read aloud by screen readers." },
    text: {
        type: ControlType.String,
        title: "Help",
        defaultValue: "Your studio name is printed faintly in the corner of web-size images.",
        displayTextArea: true,
    },
    side: { type: ControlType.Enum, title: "Side", options: ["bottom", "top"], optionTitles: ["Below", "Above"], defaultValue: "bottom", displaySegmentedControl: true },
    defaultOpen: { type: ControlType.Boolean, title: "Start Open", defaultValue: false },
    keyColor: { type: ControlType.Color, title: "Key", defaultValue: "#6a5642" },
    keyActiveFill: { type: ControlType.Color, title: "Key Open", defaultValue: "#e4d3af" },
    bubbleColor: { type: ControlType.Color, title: "Bubble", defaultValue: "#f6eedb" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "14px", variant: "Regular", lineHeight: "1.5em" },
    },
})
