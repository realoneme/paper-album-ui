// Paper Album UI · Progress for Framer
// A sunken groove that fills with deep wood. The fill glides to each new value while a soft light band sweeps
// across it, and settles into the success tone at 100. Indeterminate: a glowing segment travels back and forth.
import { useId, type CSSProperties } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

interface ProgressProps {
    label: string
    showLabel: boolean
    value: number
    indeterminate: boolean
    trackColor: string
    fillColor: string
    doneColor: string
    glowColor: string
    textColor: string
    mutedColor: string
    font: CSSProperties
    style?: CSSProperties
}

/**
 * Progress
 *
 * @framerIntrinsicWidth 360
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Progress(props: ProgressProps) {
    const {
        label = "Uploading 18 photos",
        showLabel = true,
        value = 64,
        indeterminate = false,
        trackColor = "#e4d3af",
        fillColor = "#5a3d26",
        doneColor = "#426331",
        glowColor = "#f3c77e",
        textColor = "#2a1f16",
        mutedColor = "#6a5642",
        font,
    } = props
    const isStatic = useIsStaticRenderer()
    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const pct = Math.max(0, Math.min(100, Math.round(value)))
    const done = !indeterminate && pct >= 100
    const c = `pa-progress-${id}`
    const glow = `linear-gradient(100deg, transparent 30%, color-mix(in srgb, ${glowColor} 75%, transparent) 50%, transparent 70%)`
    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8, width: "100%", ...props.style }}>
            <style>{`
                @keyframes ${c}-sweep { 0% { background-position: 120% 0; } 100% { background-position: -20% 0; } }
                @keyframes ${c}-travel { 0% { transform: translateX(0); } 100% { transform: translateX(163.2%); } }
                .${c}-glow { animation: ${c}-sweep 1.8s ease-in-out infinite; }
                .${c}-run { animation: ${c}-travel 1.4s cubic-bezier(.2,.8,.2,1) infinite alternate; }
                @media (prefers-reduced-motion: reduce) {
                    .${c}-glow { display: none; }
                    .${c}-run { animation: none; transform: translateX(81.6%); }
                    .${c}-fill { transition: none !important; }
                }
            `}</style>
            {showLabel ? (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, ...font }}>
                    <span style={{ color: textColor, fontWeight: 600 }}>{label}</span>
                    {indeterminate ? null : <span style={{ color: mutedColor, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>}
                </div>
            ) : null}
            <div
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={indeterminate ? undefined : pct}
                style={{ position: "relative", height: 10, borderRadius: 999, background: trackColor, boxShadow: "inset 0 2px 3px rgba(40, 24, 10, 0.25)", overflow: "hidden" }}
            >
                <span
                    className={indeterminate ? `${c}-fill${isStatic ? "" : ` ${c}-run`}` : `${c}-fill`}
                    style={{
                        position: "relative",
                        display: "block",
                        height: "100%",
                        overflow: "hidden",
                        borderRadius: 999,
                        width: indeterminate ? "38%" : `${pct}%`,
                        background: indeterminate
                            ? `linear-gradient(90deg, color-mix(in srgb, ${fillColor} 30%, transparent), ${fillColor} 45%, ${fillColor} 55%, color-mix(in srgb, ${fillColor} 30%, transparent))`
                            : done
                              ? doneColor
                              : fillColor,
                        boxShadow: indeterminate ? `0 0 10px color-mix(in srgb, ${glowColor} 70%, transparent)` : "inset 0 1px 0 rgba(246, 238, 219, 0.35)",
                        transition: indeterminate ? "none" : "width 600ms cubic-bezier(.2,.8,.2,1), background-color 360ms cubic-bezier(.2,.8,.2,1)",
                    }}
                >
                    {!done && !isStatic ? (
                        <span
                            aria-hidden="true"
                            className={`${c}-glow`}
                            style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: glow, backgroundSize: "250% 100%", backgroundRepeat: "no-repeat", animationDuration: indeterminate ? "1.4s" : undefined }}
                        />
                    ) : null}
                </span>
            </div>
        </div>
    )
}

addPropertyControls(Progress, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Uploading 18 photos" },
    showLabel: { type: ControlType.Boolean, title: "Show Label", defaultValue: true },
    indeterminate: { type: ControlType.Boolean, title: "Unknown Length", defaultValue: false },
    value: { type: ControlType.Number, title: "Value", defaultValue: 64, min: 0, max: 100, step: 1, unit: "%", hidden: (p) => !!p.indeterminate },
    trackColor: { type: ControlType.Color, title: "Track", defaultValue: "#e4d3af" },
    fillColor: { type: ControlType.Color, title: "Fill", defaultValue: "#5a3d26" },
    doneColor: { type: ControlType.Color, title: "Done", defaultValue: "#426331" },
    glowColor: { type: ControlType.Color, title: "Glow", defaultValue: "#f3c77e" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16", hidden: (p) => !p.showLabel },
    mutedColor: { type: ControlType.Color, title: "Percent", defaultValue: "#6a5642", hidden: (p) => !p.showLabel },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "14px", variant: "Regular", lineHeight: "1.3em" },
        hidden: (p) => !p.showLabel,
    },
})
