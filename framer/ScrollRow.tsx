// A row that scrolls sideways: link one layer (a horizontal stack, often holding a CMS collection list) and it scrolls
// inside the row, with two paper arrow keys under it and a soft fade on the edge that has more to show. Swipe and
// trackpad scrolling work as usual; the arrows move by most of a screen and grey out at either end.
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

interface ScrollRowProps {
    content: ReactNode
    arrows: "below-right" | "below-center" | "none"
    fade: number
    step: number
    keyColor: string
    keyText: string
    edge: string
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ScrollRow(props: ScrollRowProps) {
    const { content, arrows = "below-right", fade = 48, step = 85, keyColor = "#f6eedb", keyText = "#2a1f16", edge = "#d2b98f", style } = props
    const isStatic = useIsStaticRenderer()
    const ref = useRef<HTMLDivElement>(null)
    const [ends, setEnds] = useState({ start: true, end: false })
    const cls = "pa-scrollrow"

    const measure = () => {
        const el = ref.current
        if (!el) return
        const start = el.scrollLeft <= 2
        const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
        setEnds((p) => (p.start === start && p.end === end ? p : { start, end }))
    }

    useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        if (el.firstElementChild) ro.observe(el.firstElementChild)
        return () => ro.disconnect()
    }, [])

    const go = (dir: 1 | -1) => {
        const el = ref.current
        if (!el) return
        el.scrollBy({ left: dir * Math.round((el.clientWidth * step) / 100), behavior: "smooth" })
    }

    const mask = isStatic
        ? undefined
        : `linear-gradient(to right, ${ends.start ? "black" : "transparent"} 0, black ${fade}px, black calc(100% - ${fade}px), ${ends.end ? "black" : "transparent"} 100%)`

    const keyStyle = (disabled: boolean): CSSProperties => ({
        width: 44,
        height: 44,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        border: 0,
        borderRadius: 999,
        background: keyColor,
        color: keyText,
        boxShadow: `inset 0 0 0 1px ${edge}, 0 3px 0 ${edge}`,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "opacity .2s, transform .08s",
        flex: "none",
    })

    const showKeys = arrows !== "none" && !(ends.start && ends.end)

    return (
        <div role="region" aria-roledescription="carousel" aria-label="Albums" style={{ ...style, position: "relative", display: "flex", flexDirection: "column", gap: 24 }}>
            <style>{`
                .${cls}::-webkit-scrollbar { display: none; }
                .${cls}-key:not(:disabled):active { transform: translateY(2px); box-shadow: inset 0 0 0 1px ${edge}, 0 1px 0 ${edge} !important; }
                .${cls}-key:focus-visible { outline: 2px solid ${keyText}; outline-offset: 3px; }
                @media (prefers-reduced-motion: reduce) { .${cls} { scroll-behavior: auto !important; } }
            `}</style>
            <div
                ref={ref}
                className={cls}
                tabIndex={0}
                onScroll={measure}
                onKeyDown={(e) => {
                    if (e.key === "ArrowRight") { e.preventDefault(); go(1) }
                    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1) }
                }}
                style={{
                    width: "100%",
                    overflowX: isStatic ? "hidden" : "auto",
                    overflowY: "hidden",
                    scrollbarWidth: "none",
                    overscrollBehaviorX: "contain",
                    WebkitMaskImage: mask,
                    maskImage: mask,
                    outline: "none",
                    // room for the photo holders' shadows and lift
                    padding: "12px 0 16px",
                    margin: "-12px 0 -16px",
                }}
            >
                <div style={{ display: "flex", width: "max-content" }}>{content}</div>
            </div>
            {showKeys ? (
                <div style={{ display: "flex", gap: 12, paddingBottom: 4, justifyContent: arrows === "below-center" ? "center" : "flex-end" }}>
                    <button type="button" className={`${cls}-key`} aria-label="Previous albums" disabled={ends.start} onClick={() => go(-1)} style={keyStyle(ends.start)}>
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button type="button" className={`${cls}-key`} aria-label="Next albums" disabled={ends.end} onClick={() => go(1)} style={keyStyle(ends.end)}>
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
            ) : null}
        </div>
    )
}

addPropertyControls(ScrollRow, {
    content: { type: ControlType.Slot, title: "Content", maxCount: 1 },
    arrows: {
        type: ControlType.Enum,
        title: "Arrows",
        options: ["below-right", "below-center", "none"],
        optionTitles: ["Below, right", "Below, center", "None"],
        defaultValue: "below-right",
    },
    fade: { type: ControlType.Number, title: "Edge Fade", min: 0, max: 160, step: 4, unit: "px", defaultValue: 48 },
    step: { type: ControlType.Number, title: "Step", min: 30, max: 100, step: 5, unit: "%", defaultValue: 85 },
    keyColor: { type: ControlType.Color, title: "Arrow Key", defaultValue: "#f6eedb" },
    keyText: { type: ControlType.Color, title: "Arrow", defaultValue: "#2a1f16" },
    edge: { type: ControlType.Color, title: "Key Edge", defaultValue: "#d2b98f" },
})
