// Paper Album UI · Select for Framer
// A labelled native select pressed into the paper, with a chevron. Native, so it opens the phone's own picker and
// works with every keyboard and screen reader; the focus groove and warm halo match Input.
import { useEffect, useId, useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

interface SelectProps {
    label: string
    showLabel: boolean
    placeholder: string
    options: string[]
    selected: number
    helper: string
    error: string
    invalid: boolean
    disabled: boolean
    grooveColor: string
    focusColor: string
    glowColor: string
    textColor: string
    mutedColor: string
    errorColor: string
    labelFont: CSSProperties
    font: CSSProperties
    helperFont: CSSProperties
    onChange?: () => void
    style?: CSSProperties
}

const SUNKEN = "inset 0 3px 5px rgba(40, 24, 10, 0.22), inset 0 -1px 0 rgba(255, 255, 255, 0.5)"
const GROOVE = "inset 0 4px 9px rgba(40, 24, 10, 0.32), inset 0 -1px 0 rgba(255, 255, 255, 0.65)"

/**
 * Select
 *
 * @framerIntrinsicWidth 320
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Select(props: SelectProps) {
    const {
        label = "Session type",
        showLabel = true,
        placeholder = "Choose a session",
        options = [],
        selected: selectedProp = -1,
        helper = "",
        error = "Choose a session type.",
        invalid = false,
        disabled = false,
        grooveColor = "#e4d3af",
        focusColor = "#f6eedb",
        glowColor = "#f3c77e",
        textColor = "#2a1f16",
        mutedColor = "#6a5642",
        errorColor = "#9e3b2b",
        labelFont,
        font,
        helperFont,
        onChange,
    } = props
    const [value, setValue] = useState(String(selectedProp))
    const [focused, setFocused] = useState(false)
    const id = useId()
    useEffect(() => startTransition(() => setValue(String(selectedProp))), [selectedProp])

    const empty = value === "-1" || !options[Number(value)]
    const note = invalid ? error : helper
    const ring = invalid ? `, inset 0 0 0 2px ${errorColor}` : ""
    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8, width: "100%", opacity: disabled ? 0.55 : 1, ...props.style }}>
            {showLabel ? (
                <label htmlFor={id} style={{ color: textColor, fontSize: 14, fontWeight: 600, lineHeight: 1.3, ...labelFont }}>
                    {label}
                </label>
            ) : null}
            <div style={{ position: "relative" }}>
                <select
                    id={id}
                    value={empty ? "-1" : value}
                    disabled={disabled}
                    aria-label={showLabel ? undefined : label}
                    aria-invalid={invalid || undefined}
                    aria-describedby={note ? `${id}-note` : undefined}
                    onChange={(e) => {
                        setValue(e.target.value)
                        onChange?.()
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        display: "block",
                        width: "100%",
                        minHeight: 44,
                        padding: "0 40px 0 16px",
                        border: 0,
                        outline: "none",
                        borderRadius: 6,
                        background: focused ? focusColor : grooveColor,
                        boxShadow: focused ? `${GROOVE}${ring}, 0 0 0 3px color-mix(in srgb, ${glowColor} 60%, transparent), 0 6px 14px rgba(40, 24, 10, 0.14)` : `${SUNKEN}${ring}`,
                        color: empty ? mutedColor : textColor,
                        fontFamily: '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif',
                        fontSize: 15,
                        cursor: disabled ? "default" : "pointer",
                        transition: "background-color 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms cubic-bezier(.2,.8,.2,1)",
                        ...font,
                    }}
                >
                    <option value="-1" disabled>
                        {placeholder}
                    </option>
                    {options.map((o, i) => (
                        <option key={i} value={String(i)} style={{ color: textColor }}>
                            {o}
                        </option>
                    ))}
                </select>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }}>
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
            {note ? (
                <p id={`${id}-note`} role={invalid ? "alert" : undefined} style={{ margin: 0, color: invalid ? errorColor : mutedColor, fontSize: 13, lineHeight: 1.45, fontWeight: invalid ? 600 : 400, ...helperFont }}>
                    {note}
                </p>
            ) : null}
        </div>
    )
}

addPropertyControls(Select, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Session type" },
    showLabel: { type: ControlType.Boolean, title: "Show Label", defaultValue: true },
    placeholder: { type: ControlType.String, title: "Placeholder", defaultValue: "Choose a session" },
    options: {
        type: ControlType.Array,
        title: "Options",
        control: { type: ControlType.String, defaultValue: "Option" },
        defaultValue: ["Portrait", "Wedding", "Family", "Product"],
    },
    selected: { type: ControlType.Number, title: "Selected", defaultValue: -1, min: -1, max: 30, step: 1, displayStepper: true, description: "−1 shows the placeholder." },
    helper: { type: ControlType.String, title: "Helper", defaultValue: "" },
    invalid: { type: ControlType.Boolean, title: "Invalid", defaultValue: false },
    error: { type: ControlType.String, title: "Error", defaultValue: "Choose a session type.", hidden: (p) => !p.invalid },
    disabled: { type: ControlType.Boolean, title: "Disabled", defaultValue: false },
    grooveColor: { type: ControlType.Color, title: "Groove", defaultValue: "#e4d3af" },
    focusColor: { type: ControlType.Color, title: "Focused", defaultValue: "#f6eedb" },
    glowColor: { type: ControlType.Color, title: "Glow", defaultValue: "#f3c77e" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    mutedColor: { type: ControlType.Color, title: "Muted", defaultValue: "#6a5642" },
    errorColor: { type: ControlType.Color, title: "Error", defaultValue: "#9e3b2b" },
    labelFont: { type: ControlType.Font, title: "Label Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "14px", variant: "Semibold", lineHeight: "1.3em" } },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "15px", variant: "Regular", lineHeight: "1.2em" } },
    helperFont: { type: ControlType.Font, title: "Helper Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "13px", variant: "Regular", lineHeight: "1.45em" } },
    onChange: { type: ControlType.EventHandler, title: "On Change" },
})
