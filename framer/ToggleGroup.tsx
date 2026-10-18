// Paper Album UI · Toggle Group for Framer
// A segmented strip in a sunken groove; one paper slip slides to the chosen item. `Columns` lays the items out
// n to a row in equal cells so a narrow container never leaves a ragged last row (0 = one line, as wide as needed).
import { useEffect, useId, useState, startTransition, type CSSProperties, type KeyboardEvent } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, useReducedMotion } from "framer-motion"

interface ToggleGroupProps {
    options: string[]
    selected: number
    columns: number
    label: string
    grooveColor: string
    slipColor: string
    textColor: string
    font: CSSProperties
    onChange?: () => void
    style?: CSSProperties
}

/**
 * Toggle Group
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function ToggleGroup(props: ToggleGroupProps) {
    const {
        options = [],
        selected = 0,
        columns = 0,
        label = "Gallery layout",
        grooveColor = "#e4d3af",
        slipColor = "#f6eedb",
        textColor = "#2a1f16",
        font,
        onChange,
    } = props
    const [index, setIndex] = useState(selected)
    const reduce = useReducedMotion()
    const slipId = useId()
    useEffect(() => startTransition(() => setIndex(selected)), [selected])

    function choose(i: number) {
        if (i === index) return
        startTransition(() => setIndex(i))
        onChange?.()
    }
    function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        const last = options.length - 1
        const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? (index === last ? 0 : index + 1) : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (index === 0 ? last : index - 1) : -1
        if (next < 0) return
        e.preventDefault()
        choose(next)
        const buttons = (e.currentTarget as HTMLDivElement).querySelectorAll<HTMLButtonElement>("button")
        buttons[next]?.focus()
    }

    const grid = columns > 0
    return (
        <div
            role="radiogroup"
            aria-label={label}
            onKeyDown={onKeyDown}
            style={{
                position: "relative",
                display: grid ? "grid" : "inline-flex",
                gridTemplateColumns: grid ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
                gap: 4,
                padding: 5,
                borderRadius: 8,
                background: grooveColor,
                boxShadow: "inset 0 3px 5px rgba(40, 24, 10, 0.22), inset 0 -1px 0 rgba(255, 255, 255, 0.5)",
                boxSizing: "border-box",
                ...props.style,
            }}
        >
            {options.map((option, i) => {
                const on = i === index
                return (
                    <button
                        key={i}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        tabIndex={on ? 0 : -1}
                        onClick={() => choose(i)}
                        style={{
                            position: "relative",
                            minWidth: 0,
                            minHeight: 40,
                            padding: grid ? "0 8px" : "0 16px",
                            border: 0,
                            borderRadius: 5,
                            background: "transparent",
                            color: textColor,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            fontSize: 14,
                            fontWeight: 600,
                            ...font,
                        }}
                    >
                        {on && (
                            <motion.span
                                layoutId={slipId}
                                aria-hidden="true"
                                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: 5,
                                    background: slipColor,
                                    boxShadow: "0 2px 0 #d2b98f, 0 4px 8px rgba(40, 24, 10, 0.16)",
                                }}
                            />
                        )}
                        <span style={{ position: "relative" }}>{option}</span>
                    </button>
                )
            })}
        </div>
    )
}

addPropertyControls(ToggleGroup, {
    options: {
        type: ControlType.Array,
        title: "Options",
        control: { type: ControlType.String, defaultValue: "Option" },
        defaultValue: ["Grid", "List", "Masonry"],
        maxCount: 8,
    },
    selected: { type: ControlType.Number, title: "Selected", defaultValue: 0, min: 0, max: 7, step: 1, displayStepper: true },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 0,
        min: 0,
        max: 8,
        step: 1,
        displayStepper: true,
        description: "0 keeps one line; a number lays the items out that many to a row.",
    },
    label: { type: ControlType.String, title: "Label", defaultValue: "Gallery layout", description: "Read aloud by screen readers." },
    grooveColor: { type: ControlType.Color, title: "Groove", defaultValue: "#e4d3af" },
    slipColor: { type: ControlType.Color, title: "Slip", defaultValue: "#f6eedb" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "14px", variant: "Semibold", lineHeight: "1em" },
    },
    onChange: { type: ControlType.EventHandler, title: "On Change" },
})
