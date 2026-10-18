// Paper Album UI · Input for Framer
// A labelled text field pressed into the paper. On focus the groove lightens to card paper, deepens and a warm
// halo lifts it; an error keeps a red inset and replaces the helper text. Required fields carry a red asterisk.
// When you leave the field it checks itself: empty and required, or not an email / URL / number when it should be,
// shows the error (and clears it as soon as the value is fixed). Optional leading icon, show/hide key for passwords.
import { useEffect, useId, useState, startTransition, type CSSProperties, type ReactNode } from "react"
import { addPropertyControls, ControlType } from "framer"

type Icon = "none" | "search" | "mail" | "lock" | "user" | "calendar"

interface InputProps {
    label: string
    showLabel: boolean
    placeholder: string
    value: string
    type: "text" | "email" | "password" | "search" | "tel" | "url" | "number"
    icon: Icon
    helper: string
    error: string
    invalid: boolean
    required: boolean
    validate: boolean
    requiredMessage: string
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
    onFocus?: () => void
    onBlur?: () => void
    style?: CSSProperties
}

const ICONS: Record<Exclude<Icon, "none">, ReactNode> = {
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </>
    ),
    lock: (
        <>
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </>
    ),
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
        </>
    ),
}

const SUNKEN = "inset 0 3px 5px rgba(40, 24, 10, 0.22), inset 0 -1px 0 rgba(255, 255, 255, 0.5)"
const GROOVE = "inset 0 4px 9px rgba(40, 24, 10, 0.32), inset 0 -1px 0 rgba(255, 255, 255, 0.65)"
const halo = (glow: string) => `0 0 0 3px color-mix(in srgb, ${glow} 60%, transparent), 0 6px 14px rgba(40, 24, 10, 0.14)`

/**
 * Input
 *
 * @framerIntrinsicWidth 340
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Input(props: InputProps) {
    const {
        label = "Email",
        showLabel = true,
        placeholder = "you@studio.com",
        value: valueProp = "",
        type = "email",
        icon = "mail",
        helper = "We send the gallery link here.",
        error = "Enter an email address, like name@studio.com.",
        invalid = false,
        required = false,
        validate = true,
        requiredMessage = "Fill in this field.",
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
        onFocus,
        onBlur,
    } = props
    const [value, setValue] = useState(valueProp)
    const [focused, setFocused] = useState(false)
    const [reveal, setReveal] = useState(false)
    const [touched, setTouched] = useState(false)
    const [problem, setProblem] = useState<string | null>(null)
    const id = useId()
    const cls = `pa-input-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`
    useEffect(() => startTransition(() => setValue(valueProp)), [valueProp])

    // The browser's own checks (required, email/url/number format) decide; the messages are ours.
    function check(el: HTMLInputElement) {
        if (!validate) return setProblem(null)
        if (el.validity.valueMissing) setProblem(requiredMessage)
        else if (!el.validity.valid) setProblem(error)
        else setProblem(null)
    }
    const bad = invalid || !!problem
    const note = invalid ? error : (problem ?? helper)
    const ring = bad ? `, inset 0 0 0 2px ${errorColor}` : ""
    const isPassword = type === "password"
    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8, width: "100%", opacity: disabled ? 0.55 : 1, ...props.style }}>
            {showLabel ? (
                <label htmlFor={id} style={{ color: textColor, fontSize: 14, fontWeight: 600, lineHeight: 1.3, ...labelFont }}>
                    {label}
                    {required ? <span aria-hidden="true" style={{ color: errorColor }}> *</span> : null}
                </label>
            ) : null}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minHeight: 44,
                    padding: `0 ${isPassword ? 4 : 16}px 0 16px`,
                    borderRadius: 6,
                    background: focused ? focusColor : grooveColor,
                    boxShadow: focused ? `${GROOVE}${ring}, ${halo(glowColor)}` : `${SUNKEN}${ring}`,
                    color: textColor,
                    transition: "background-color 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms cubic-bezier(.2,.8,.2,1)",
                }}
            >
                {icon !== "none" ? (
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={mutedColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
                        {ICONS[icon]}
                    </svg>
                ) : null}
                <input
                    id={id}
                    type={isPassword && reveal ? "text" : type}
                    value={value}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    aria-label={showLabel ? undefined : label}
                    aria-invalid={bad || undefined}
                    aria-required={required || undefined}
                    aria-describedby={note ? `${id}-note` : undefined}
                    onChange={(e) => {
                        setValue(e.target.value)
                        if (touched) check(e.target)
                    }}
                    onFocus={() => {
                        setFocused(true)
                        onFocus?.()
                    }}
                    onBlur={(e) => {
                        setFocused(false)
                        setTouched(true)
                        check(e.target)
                        onBlur?.()
                    }}
                    className={cls}
                    style={{ flex: 1, minWidth: 0, height: 44, padding: 0, border: 0, outline: "none", background: "transparent", color: "inherit", fontFamily: '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif', fontSize: 15, ...font }}
                />
                {isPassword ? (
                    <button
                        type="button"
                        aria-label={reveal ? "Hide password" : "Show password"}
                        aria-pressed={reveal}
                        disabled={disabled}
                        onClick={() => setReveal(!reveal)}
                        style={{ flex: "none", width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, border: 0, borderRadius: 6, background: "transparent", color: mutedColor, cursor: "pointer" }}
                    >
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                            {reveal ? null : <path d="M3 3l18 18" />}
                        </svg>
                    </button>
                ) : null}
            </div>
            <style>{`.${cls}::placeholder { color: ${mutedColor}; opacity: 1; }`}</style>
            {note ? (
                <p id={`${id}-note`} role={bad ? "alert" : undefined} style={{ margin: 0, color: bad ? errorColor : mutedColor, fontSize: 13, lineHeight: 1.45, fontWeight: bad ? 600 : 400, ...helperFont }}>
                    {note}
                </p>
            ) : null}
        </div>
    )
}

addPropertyControls(Input, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Email" },
    showLabel: { type: ControlType.Boolean, title: "Show Label", defaultValue: true },
    placeholder: { type: ControlType.String, title: "Placeholder", defaultValue: "you@studio.com" },
    value: { type: ControlType.String, title: "Value", defaultValue: "" },
    type: {
        type: ControlType.Enum,
        title: "Type",
        options: ["text", "email", "password", "search", "tel", "url", "number"],
        optionTitles: ["Text", "Email", "Password", "Search", "Phone", "URL", "Number"],
        defaultValue: "email",
    },
    icon: {
        type: ControlType.Enum,
        title: "Icon",
        options: ["none", "search", "mail", "lock", "user", "calendar"],
        optionTitles: ["None", "Search", "Mail", "Lock", "User", "Calendar"],
        defaultValue: "mail",
    },
    helper: { type: ControlType.String, title: "Helper", defaultValue: "We send the gallery link here." },
    invalid: { type: ControlType.Boolean, title: "Invalid", defaultValue: false },
    error: { type: ControlType.String, title: "Error", defaultValue: "Enter an email address, like name@studio.com.", description: "Shown when Invalid is on, or when the value is in the wrong format." },
    required: { type: ControlType.Boolean, title: "Required", defaultValue: false },
    requiredMessage: { type: ControlType.String, title: "Required Error", defaultValue: "Fill in this field.", hidden: (p) => !p.required },
    validate: { type: ControlType.Boolean, title: "Check on Leave", defaultValue: true, description: "Check required and format when the field loses focus." },
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
    onFocus: { type: ControlType.EventHandler, title: "On Focus" },
    onBlur: { type: ControlType.EventHandler, title: "On Blur" },
})
