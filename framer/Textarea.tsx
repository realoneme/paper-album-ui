// Paper Album UI · Textarea for Framer
// A labelled multi-line field pressed into the paper, with the same focus groove and warm halo as Input. It can
// grow with its text (between a minimum and maximum number of lines) and count characters against a limit.
import { useEffect, useId, useLayoutEffect, useRef, useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

interface TextareaProps {
    label: string
    showLabel: boolean
    placeholder: string
    value: string
    helper: string
    error: string
    invalid: boolean
    minRows: number
    maxRows: number
    autoResize: boolean
    maxLength: number
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
    style?: CSSProperties
}

const SUNKEN = "inset 0 3px 5px rgba(40, 24, 10, 0.22), inset 0 -1px 0 rgba(255, 255, 255, 0.5)"
const GROOVE = "inset 0 4px 9px rgba(40, 24, 10, 0.32), inset 0 -1px 0 rgba(255, 255, 255, 0.65)"
const LINE = 22
const PAD_Y = 12

/**
 * Textarea
 *
 * @framerIntrinsicWidth 360
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Textarea(props: TextareaProps) {
    const {
        label = "Message",
        showLabel = true,
        placeholder = "Tell us about the shoot: date, place, how many people.",
        value: valueProp = "",
        helper = "We reply within two working days.",
        error = "Write a few words so we know what you need.",
        invalid = false,
        minRows = 3,
        maxRows = 8,
        autoResize = true,
        maxLength = 0,
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
    } = props
    const [value, setValue] = useState(valueProp)
    const [focused, setFocused] = useState(false)
    const ref = useRef<HTMLTextAreaElement>(null)
    const id = useId()
    const cls = `pa-textarea-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`
    useEffect(() => startTransition(() => setValue(valueProp)), [valueProp])

    const min = Math.max(1, minRows) * LINE + PAD_Y * 2
    const max = Math.max(minRows, maxRows) * LINE + PAD_Y * 2
    // Grow with the text: measure the content height and clamp it between the min and max lines.
    useLayoutEffect(() => {
        const el = ref.current
        if (!el || !autoResize) return
        el.style.height = "auto"
        el.style.height = `${Math.min(max, Math.max(min, el.scrollHeight))}px`
    }, [value, autoResize, min, max])

    const note = invalid ? error : helper
    const ring = invalid ? `, inset 0 0 0 2px ${errorColor}` : ""
    const over = maxLength > 0 && value.length >= maxLength
    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8, width: "100%", opacity: disabled ? 0.55 : 1, ...props.style }}>
            {showLabel ? (
                <label htmlFor={id} style={{ color: textColor, fontSize: 14, fontWeight: 600, lineHeight: 1.3, ...labelFont }}>
                    {label}
                </label>
            ) : null}
            <style>{`.${cls}::placeholder { color: ${mutedColor}; opacity: 1; }`}</style>
            <textarea
                ref={ref}
                id={id}
                className={cls}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength > 0 ? maxLength : undefined}
                aria-label={showLabel ? undefined : label}
                aria-invalid={invalid || undefined}
                aria-describedby={note || maxLength > 0 ? `${id}-note` : undefined}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    display: "block",
                    width: "100%",
                    minHeight: min,
                    maxHeight: autoResize ? max : undefined,
                    height: autoResize ? undefined : min,
                    padding: `${PAD_Y}px 16px`,
                    border: 0,
                    outline: "none",
                    borderRadius: 6,
                    resize: autoResize ? "none" : "vertical",
                    overflowY: "auto",
                    background: focused ? focusColor : grooveColor,
                    boxShadow: focused ? `${GROOVE}${ring}, 0 0 0 3px color-mix(in srgb, ${glowColor} 60%, transparent), 0 6px 14px rgba(40, 24, 10, 0.14)` : `${SUNKEN}${ring}`,
                    color: textColor,
                    fontFamily: '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif',
                    fontSize: 15,
                    lineHeight: `${LINE}px`,
                    boxSizing: "border-box",
                    transition: "background-color 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms cubic-bezier(.2,.8,.2,1)",
                    ...font,
                }}
            />
            {note || maxLength > 0 ? (
                <div id={`${id}-note`} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, lineHeight: 1.45, ...helperFont }}>
                    <span role={invalid ? "alert" : undefined} style={{ color: invalid ? errorColor : mutedColor, fontWeight: invalid ? 600 : 400 }}>
                        {note}
                    </span>
                    {maxLength > 0 ? (
                        <span style={{ flex: "none", color: over ? errorColor : mutedColor, fontVariantNumeric: "tabular-nums" }}>
                            {value.length} / {maxLength}
                        </span>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}

addPropertyControls(Textarea, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Message" },
    showLabel: { type: ControlType.Boolean, title: "Show Label", defaultValue: true },
    placeholder: { type: ControlType.String, title: "Placeholder", defaultValue: "Tell us about the shoot: date, place, how many people.", displayTextArea: true },
    value: { type: ControlType.String, title: "Value", defaultValue: "", displayTextArea: true },
    helper: { type: ControlType.String, title: "Helper", defaultValue: "We reply within two working days." },
    invalid: { type: ControlType.Boolean, title: "Invalid", defaultValue: false },
    error: { type: ControlType.String, title: "Error", defaultValue: "Write a few words so we know what you need.", hidden: (p) => !p.invalid },
    autoResize: { type: ControlType.Boolean, title: "Grow", defaultValue: true, description: "Grow with the text between Min and Max lines." },
    minRows: { type: ControlType.Number, title: "Min Lines", defaultValue: 3, min: 1, max: 20, step: 1, displayStepper: true },
    maxRows: { type: ControlType.Number, title: "Max Lines", defaultValue: 8, min: 1, max: 40, step: 1, displayStepper: true, hidden: (p) => !p.autoResize },
    maxLength: { type: ControlType.Number, title: "Max Length", defaultValue: 0, min: 0, max: 5000, step: 10, description: "0 = no limit and no counter." },
    disabled: { type: ControlType.Boolean, title: "Disabled", defaultValue: false },
    grooveColor: { type: ControlType.Color, title: "Groove", defaultValue: "#e4d3af" },
    focusColor: { type: ControlType.Color, title: "Focused", defaultValue: "#f6eedb" },
    glowColor: { type: ControlType.Color, title: "Glow", defaultValue: "#f3c77e" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    mutedColor: { type: ControlType.Color, title: "Muted", defaultValue: "#6a5642" },
    errorColor: { type: ControlType.Color, title: "Error", defaultValue: "#9e3b2b" },
    labelFont: { type: ControlType.Font, title: "Label Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "14px", variant: "Semibold", lineHeight: "1.3em" } },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "15px", variant: "Regular", lineHeight: "22px" } },
    helperFont: { type: ControlType.Font, title: "Helper Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "13px", variant: "Regular", lineHeight: "1.45em" } },
})
