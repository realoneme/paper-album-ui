// Paper Album UI · Checkbox for Framer
// A sunken paper square that turns deep wood when checked: the box gives a small press and the tick draws in;
// unchecking undraws it. "Mixed" shows a dash (for a "select all" over a partly chosen list).
import { useEffect, useId, useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, useAnimationControls, useReducedMotion } from "framer-motion"

type CheckState = "unchecked" | "checked" | "mixed"

interface CheckboxProps {
    label: string
    description: string
    state: CheckState
    disabled: boolean
    boxColor: string
    checkedColor: string
    edgeColor: string
    tickColor: string
    labelColor: string
    descriptionColor: string
    font: CSSProperties
    descriptionFont: CSSProperties
    onCheck?: () => void
    onUncheck?: () => void
    style?: CSSProperties
}

const EASE_PAPER = [0.2, 0.8, 0.2, 1] as const

/**
 * Checkbox
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Checkbox(props: CheckboxProps) {
    const {
        label = "Include RAW files",
        description = "",
        state: stateProp = "checked",
        disabled = false,
        boxColor = "#e4d3af",
        checkedColor = "#5a3d26",
        edgeColor = "#3a2716",
        tickColor = "#f6eedb",
        labelColor = "#2a1f16",
        descriptionColor = "#6a5642",
        font,
        descriptionFont,
        onCheck,
        onUncheck,
    } = props
    const [state, setState] = useState<CheckState>(stateProp)
    const reduce = useReducedMotion()
    const press = useAnimationControls()
    const descId = useId()
    useEffect(() => startTransition(() => setState(stateProp)), [stateProp])

    const on = state !== "unchecked"
    function toggle() {
        if (disabled) return
        const next: CheckState = state === "checked" ? "unchecked" : "checked"
        startTransition(() => setState(next))
        if (!reduce) press.start({ scale: [1, 0.86, 1], transition: { duration: 0.22, ease: [0.34, 1.56, 0.64, 1] } })
        if (next === "checked") onCheck?.()
        else onUncheck?.()
    }

    const draw = (shown: boolean) => ({
        initial: false as const,
        animate: { pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 },
        transition: reduce
            ? { duration: 0 }
            : shown
              ? { pathLength: { duration: 0.22, ease: EASE_PAPER, delay: 0.08 }, opacity: { duration: 0 } }
              : { pathLength: { duration: 0.14, ease: [0.4, 0, 1, 1] }, opacity: { duration: 0, delay: 0.14 } },
    })

    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={state === "mixed" ? "mixed" : on}
            aria-describedby={description ? descId : undefined}
            disabled={disabled}
            onClick={toggle}
            style={{
                position: "relative",
                display: "inline-flex",
                alignItems: description ? "flex-start" : "center",
                gap: 12,
                minHeight: 32,
                padding: 0,
                border: 0,
                background: "transparent",
                textAlign: "left",
                cursor: disabled ? "default" : "pointer",
                opacity: disabled ? 0.55 : 1,
                ...props.style,
            }}
        >
            <motion.span
                aria-hidden="true"
                animate={press}
                style={{
                    flex: "none",
                    width: 22,
                    height: 22,
                    marginTop: description ? 1 : 0,
                    borderRadius: 5,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: on ? checkedColor : boxColor,
                    boxShadow: on ? `0 2px 0 ${edgeColor}` : "inset 0 2px 3px rgba(40, 24, 10, 0.28)",
                    transition: reduce ? "none" : "background-color 140ms cubic-bezier(.2,.8,.2,1), box-shadow 140ms cubic-bezier(.2,.8,.2,1)",
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tickColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path d="M20 6 9 17l-5-5" {...draw(state === "checked")} />
                    <motion.path d="M5 12h14" {...draw(state === "mixed")} />
                </svg>
            </motion.span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "max-content" }}>
                <span style={{ color: labelColor, fontSize: 15, fontWeight: 500, lineHeight: 1.5, ...font }}>{label}</span>
                {description ? (
                    <span id={descId} style={{ color: descriptionColor, fontSize: 13, lineHeight: 1.45, ...descriptionFont }}>
                        {description}
                    </span>
                ) : null}
            </span>
        </button>
    )
}

addPropertyControls(Checkbox, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Include RAW files" },
    description: { type: ControlType.String, title: "Description", defaultValue: "", placeholder: "Optional helper text" },
    state: {
        type: ControlType.Enum,
        title: "State",
        options: ["unchecked", "checked", "mixed"],
        optionTitles: ["Off", "On", "Mixed"],
        defaultValue: "checked",
        displaySegmentedControl: true,
    },
    disabled: { type: ControlType.Boolean, title: "Disabled", defaultValue: false },
    boxColor: { type: ControlType.Color, title: "Box", defaultValue: "#e4d3af" },
    checkedColor: { type: ControlType.Color, title: "Checked", defaultValue: "#5a3d26" },
    edgeColor: { type: ControlType.Color, title: "Edge", defaultValue: "#3a2716" },
    tickColor: { type: ControlType.Color, title: "Tick", defaultValue: "#f6eedb" },
    labelColor: { type: ControlType.Color, title: "Label", defaultValue: "#2a1f16" },
    descriptionColor: { type: ControlType.Color, title: "Description", defaultValue: "#6a5642" },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "15px", variant: "Medium", lineHeight: "1.5em" },
    },
    descriptionFont: {
        type: ControlType.Font,
        title: "Description Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "13px", variant: "Regular", lineHeight: "1.45em" },
    },
    onCheck: { type: ControlType.EventHandler, title: "On Check" },
    onUncheck: { type: ControlType.EventHandler, title: "On Uncheck" },
})
