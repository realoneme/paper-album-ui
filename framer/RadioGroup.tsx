// Paper Album UI · Radio Group for Framer
// One choice from a short list. Each option is a paper row; the chosen row rises as a paper key and its dot
// springs in, while the dot it leaves scales out. Arrow keys move the choice, as in a native radio group.
import { useEffect, useId, useRef, useState, startTransition, type CSSProperties, type KeyboardEvent } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, useReducedMotion } from "framer-motion"

interface Option {
    label: string
    description: string
}

interface RadioGroupProps {
    label: string
    options: Option[]
    selected: number
    direction: "vertical" | "horizontal"
    selectedColor: string
    borderColor: string
    wellColor: string
    dotColor: string
    textColor: string
    descriptionColor: string
    font: CSSProperties
    descriptionFont: CSSProperties
    onChange?: () => void
    style?: CSSProperties
}

/**
 * Radio Group
 *
 * @framerIntrinsicWidth 360
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function RadioGroup(props: RadioGroupProps) {
    const {
        label = "Print size",
        options = [],
        selected: selectedProp = 0,
        direction = "vertical",
        selectedColor = "#f6eedb",
        borderColor = "#d2b98f",
        wellColor = "#e4d3af",
        dotColor = "#5a3d26",
        textColor = "#2a1f16",
        descriptionColor = "#6a5642",
        font,
        descriptionFont,
        onChange,
    } = props
    const clamp = (i: number) => Math.max(0, Math.min(options.length - 1, i))
    const [selected, setSelected] = useState(clamp(selectedProp))
    const reduce = useReducedMotion()
    const refs = useRef<(HTMLButtonElement | null)[]>([])
    const base = useId()
    useEffect(() => startTransition(() => setSelected(Math.max(0, Math.min(options.length - 1, selectedProp)))), [selectedProp, options.length])

    function choose(i: number, focus = false) {
        if (i !== selected) onChange?.()
        startTransition(() => setSelected(i))
        if (focus) refs.current[i]?.focus()
    }
    function onKeyDown(e: KeyboardEvent) {
        const last = options.length - 1
        const next: Record<string, number> = {
            ArrowDown: selected === last ? 0 : selected + 1,
            ArrowRight: selected === last ? 0 : selected + 1,
            ArrowUp: selected === 0 ? last : selected - 1,
            ArrowLeft: selected === 0 ? last : selected - 1,
        }
        if (e.key in next) {
            e.preventDefault()
            choose(next[e.key], true)
        }
    }

    const row = direction === "horizontal"
    return (
        <div
            role="radiogroup"
            aria-label={label}
            onKeyDown={onKeyDown}
            style={{ position: "relative", display: "flex", flexDirection: row ? "row" : "column", flexWrap: row ? "wrap" : "nowrap", gap: 10, width: "100%", ...props.style }}
        >
            {options.map((opt, i) => {
                const on = i === selected
                return (
                    <button
                        key={i}
                        ref={(el) => {
                            refs.current[i] = el
                        }}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        aria-describedby={opt.description ? `${base}-d${i}` : undefined}
                        tabIndex={on ? 0 : -1}
                        onClick={() => choose(i)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            flex: row ? "1 1 0" : "none",
                            minWidth: row ? "max-content" : 0,
                            minHeight: 52,
                            padding: "10px 16px",
                            border: 0,
                            borderRadius: 6,
                            background: on ? selectedColor : "transparent",
                            boxShadow: on ? `inset 0 0 0 1px ${borderColor}, 0 3px 0 ${borderColor}` : `inset 0 0 0 1px ${borderColor}`,
                            color: textColor,
                            textAlign: "left",
                            cursor: "pointer",
                            transition: reduce ? "none" : "background-color 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms cubic-bezier(.2,.8,.2,1)",
                        }}
                    >
                        <span
                            aria-hidden="true"
                            style={{ width: 22, height: 22, flex: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: wellColor, boxShadow: "inset 0 2px 3px rgba(40, 24, 10, 0.3)" }}
                        >
                            <motion.span
                                initial={false}
                                animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                                transition={reduce ? { duration: 0 } : on ? { type: "spring", stiffness: 520, damping: 18 } : { duration: 0.14, ease: [0.4, 0, 1, 1] }}
                                style={{ display: "block", width: 12, height: 12, borderRadius: "50%", background: dotColor }}
                            />
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, ...font }}>{opt.label}</span>
                            {opt.description ? (
                                <span id={`${base}-d${i}`} style={{ color: descriptionColor, fontSize: 13, lineHeight: 1.45, ...descriptionFont }}>
                                    {opt.description}
                                </span>
                            ) : null}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

addPropertyControls(RadioGroup, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Print size", description: "Read aloud by screen readers." },
    options: {
        type: ControlType.Array,
        title: "Options",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Option" },
                description: { type: ControlType.String, title: "Description", defaultValue: "" },
            },
        },
        defaultValue: [
            { label: "A4", description: "21 × 29.7 cm, on cotton rag" },
            { label: "A3", description: "29.7 × 42 cm, on cotton rag" },
            { label: "Square", description: "30 × 30 cm, on baryta" },
        ],
    },
    selected: { type: ControlType.Number, title: "Selected", defaultValue: 0, min: 0, max: 9, step: 1, displayStepper: true },
    direction: {
        type: ControlType.Enum,
        title: "Direction",
        options: ["vertical", "horizontal"],
        optionTitles: ["Stack", "Row"],
        defaultValue: "vertical",
        displaySegmentedControl: true,
    },
    selectedColor: { type: ControlType.Color, title: "Selected", defaultValue: "#f6eedb" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "#d2b98f" },
    wellColor: { type: ControlType.Color, title: "Well", defaultValue: "#e4d3af" },
    dotColor: { type: ControlType.Color, title: "Dot", defaultValue: "#5a3d26" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    descriptionColor: { type: ControlType.Color, title: "Description", defaultValue: "#6a5642" },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "15px", variant: "Semibold", lineHeight: "1.4em" },
    },
    descriptionFont: {
        type: ControlType.Font,
        title: "Description Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "13px", variant: "Regular", lineHeight: "1.45em" },
    },
    onChange: { type: ControlType.EventHandler, title: "On Change" },
})
