// Paper Album UI · Spinner for Framer
// A gooey comet for unknown waits: a lead ball circles, a tail of shrinking balls follows, and an SVG goo filter
// (blur, then an alpha threshold) melts them into one liquid drop. With reduced motion it holds still.
import { useId, type CSSProperties } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

interface SpinnerProps {
    size: "sm" | "default" | "lg"
    color: string
    label: string
    showLabel: boolean
    labelColor: string
    font: CSSProperties
    style?: CSSProperties
}

const SIZES = { sm: 18, default: 32, lg: 48 }
const ORBIT = 12
const TAIL = [5, 4.4, 3.8, 3.2, 2.7, 2.2, 1.7]
const STEP_DEG = 15
const STEP_DELAY_S = 0.045

/**
 * Spinner
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Spinner(props: SpinnerProps) {
    const { size = "default", color = "#a9784a", label = "Loading", showLabel = false, labelColor = "#6a5642", font } = props
    const isStatic = useIsStaticRenderer()
    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const px = SIZES[size] ?? SIZES.default
    const orbit = `pa-goo-orbit-${id}`
    return (
        <span role="status" aria-label={label} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, ...props.style }}>
            <style>{`
                @keyframes ${orbit} { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .${orbit} { transform-box: view-box; transform-origin: 50% 50%; animation: ${orbit} 1.3s cubic-bezier(.55, .1, .35, .9) infinite; }
                @media (prefers-reduced-motion: reduce) { .${orbit} { animation: none; } }
            `}</style>
            <svg aria-hidden="true" width={px} height={px} viewBox="0 0 40 40" style={{ overflow: "visible", color, flex: "none" }}>
                <defs>
                    <filter id={`f-${id}`} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
                    </filter>
                </defs>
                <g filter={`url(#f-${id})`}>
                    {TAIL.map((r, i) => (
                        <g key={i} className={isStatic ? undefined : orbit} style={{ animationDelay: `${i * STEP_DELAY_S}s` }}>
                            <circle cx="20" cy={20 - ORBIT} r={r} fill="currentColor" transform={`rotate(${-i * STEP_DEG} 20 20)`} />
                        </g>
                    ))}
                </g>
            </svg>
            {showLabel ? (
                <span aria-hidden="true" style={{ color: labelColor, fontSize: 14, whiteSpace: "nowrap", ...font }}>
                    {label}
                </span>
            ) : null}
        </span>
    )
}

addPropertyControls(Spinner, {
    size: {
        type: ControlType.Enum,
        title: "Size",
        options: ["sm", "default", "lg"],
        optionTitles: ["Small", "Default", "Large"],
        defaultValue: "default",
        displaySegmentedControl: true,
    },
    color: { type: ControlType.Color, title: "Color", defaultValue: "#a9784a" },
    label: { type: ControlType.String, title: "Label", defaultValue: "Loading", description: "Read aloud by screen readers." },
    showLabel: { type: ControlType.Boolean, title: "Show Label", defaultValue: false },
    labelColor: { type: ControlType.Color, title: "Label Color", defaultValue: "#6a5642", hidden: (p) => !p.showLabel },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "14px", variant: "Medium", lineHeight: "1.2em" },
        hidden: (p) => !p.showLabel,
    },
})
