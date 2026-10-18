// Paper Album UI · Switch for Framer
// An on/off control: a print-white knob in a sunken track that turns wood when on. Sizes sm 36×20, default 44×24,
// lg 64×36; every size keeps a tap target at least 44px tall.
import { useEffect, useId, useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, useReducedMotion } from "framer-motion"

interface SwitchProps {
    label: string
    showLabel: boolean
    on: boolean
    size: "sm" | "default" | "lg"
    onColor: string
    offColor: string
    knobColor: string
    labelColor: string
    font: CSSProperties
    onTurnOn?: () => void
    onTurnOff?: () => void
    style?: CSSProperties
}

const SIZES = {
    sm: { w: 36, h: 20, pad: 3 },
    default: { w: 44, h: 24, pad: 3 },
    lg: { w: 64, h: 36, pad: 4 },
}

/**
 * Switch
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Switch(props: SwitchProps) {
    const {
        label = "Show captions",
        showLabel = true,
        on: onProp = true,
        size = "default",
        onColor = "#a9784a",
        offColor = "#d2b98f",
        knobColor = "#fbf7ee",
        labelColor = "#2a1f16",
        font,
        onTurnOn,
        onTurnOff,
    } = props
    const [on, setOn] = useState(onProp)
    const reduce = useReducedMotion()
    const id = useId()
    useEffect(() => startTransition(() => setOn(onProp)), [onProp])

    const { w, h, pad } = SIZES[size] ?? SIZES.default
    const knob = h - pad * 2

    function toggle() {
        const next = !on
        startTransition(() => setOn(next))
        if (next) onTurnOn?.()
        else onTurnOff?.()
    }

    return (
        <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, ...props.style }}>
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={showLabel ? undefined : label}
                onClick={toggle}
                style={{
                    position: "relative",
                    flex: "none",
                    width: w,
                    height: h,
                    padding: 0,
                    border: 0,
                    borderRadius: 999,
                    background: on ? onColor : offColor,
                    boxShadow: size === "lg" ? "inset 0 3px 5px rgba(40, 24, 10, 0.3)" : "inset 0 2px 4px rgba(40, 24, 10, 0.3)",
                    cursor: "pointer",
                    transition: "background-color 220ms cubic-bezier(.2,.8,.2,1)",
                }}
            >
                <span aria-hidden="true" style={{ position: "absolute", left: -4, right: -4, top: "50%", height: Math.max(44, h), transform: "translateY(-50%)" }} />
                <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ x: on ? w - knob - pad * 2 : 0 }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 28 }}
                    style={{
                        position: "absolute",
                        left: pad,
                        top: pad,
                        width: knob,
                        height: knob,
                        borderRadius: "50%",
                        background: knobColor,
                        boxShadow: size === "lg" ? "0 2px 0 #d2b98f, 0 4px 6px rgba(40, 24, 10, 0.3)" : "0 1px 0 #d2b98f, 0 2px 4px rgba(40, 24, 10, 0.3)",
                    }}
                />
            </button>
            {showLabel && (
                <label htmlFor={id} style={{ color: labelColor, cursor: "pointer", whiteSpace: "nowrap", fontSize: 14, fontWeight: 600, ...font }}>
                    {label}
                </label>
            )}
        </span>
    )
}

addPropertyControls(Switch, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Show captions" },
    showLabel: { type: ControlType.Boolean, title: "Show Label", defaultValue: true },
    on: { type: ControlType.Boolean, title: "On", defaultValue: true },
    size: {
        type: ControlType.Enum,
        title: "Size",
        options: ["sm", "default", "lg"],
        optionTitles: ["Small", "Default", "Large"],
        defaultValue: "default",
        displaySegmentedControl: true,
    },
    onColor: { type: ControlType.Color, title: "On", defaultValue: "#a9784a" },
    offColor: { type: ControlType.Color, title: "Off", defaultValue: "#d2b98f" },
    knobColor: { type: ControlType.Color, title: "Knob", defaultValue: "#fbf7ee" },
    labelColor: { type: ControlType.Color, title: "Label", defaultValue: "#2a1f16", hidden: (p) => !p.showLabel },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "14px", variant: "Semibold", lineHeight: "1.2em" },
        hidden: (p) => !p.showLabel,
    },
    onTurnOn: { type: ControlType.EventHandler, title: "On Turn On" },
    onTurnOff: { type: ControlType.EventHandler, title: "On Turn Off" },
})
