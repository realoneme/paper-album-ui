// Paper Album UI · Input OTP for Framer
// A one-time code in pressed-in paper slots (Fraunces digits). One real input sits over the slots, so typing,
// pasting, backspace and the phone's "fill code from messages" all work; the active slot lifts with the warm halo
// and shows a blinking caret. The slots shrink together on narrow screens so six never run off a phone.
import { useEffect, useId, useRef, useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

interface InputOTPProps {
    label: string
    length: number
    split: boolean
    value: string
    digitsOnly: boolean
    disabled: boolean
    grooveColor: string
    focusColor: string
    glowColor: string
    textColor: string
    separatorColor: string
    font: CSSProperties
    onComplete?: () => void
    style?: CSSProperties
}

const SUNKEN = "inset 0 3px 5px rgba(40, 24, 10, 0.22), inset 0 -1px 0 rgba(255, 255, 255, 0.5)"
const GROOVE = "inset 0 4px 9px rgba(40, 24, 10, 0.32), inset 0 -1px 0 rgba(255, 255, 255, 0.65)"

/**
 * Input OTP
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function InputOTP(props: InputOTPProps) {
    const {
        label = "Verification code",
        length: lengthProp = 6,
        split = true,
        value: valueProp = "",
        digitsOnly = true,
        disabled = false,
        grooveColor = "#e4d3af",
        focusColor = "#f6eedb",
        glowColor = "#f3c77e",
        textColor = "#2a1f16",
        separatorColor = "#d2b98f",
        font,
        onComplete,
    } = props
    const length = Math.max(3, Math.min(8, Math.round(lengthProp)))
    const clean = (s: string) => (digitsOnly ? s.replace(/\D/g, "") : s.replace(/\s/g, "")).slice(0, length)
    const [value, setValue] = useState(clean(valueProp))
    const [focused, setFocused] = useState(false)
    const input = useRef<HTMLInputElement>(null)
    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "")
    useEffect(() => {
        const v = digitsOnly ? valueProp.replace(/\D/g, "") : valueProp.replace(/\s/g, "")
        startTransition(() => setValue(v.slice(0, length)))
    }, [valueProp, length, digitsOnly])

    function change(next: string) {
        const v = clean(next)
        setValue(v)
        if (v.length === length && value.length !== length) onComplete?.()
    }

    const active = Math.min(value.length, length - 1)
    const half = split && length >= 4 ? Math.ceil(length / 2) : -1
    const slot = (i: number) => {
        const on = focused && i === active
        return (
            <span
                key={i}
                aria-hidden="true"
                style={{
                    flex: "0 1 46px",
                    minWidth: 22,
                    width: 46,
                    aspectRatio: "46 / 56",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: on ? focusColor : grooveColor,
                    boxShadow: on ? `${GROOVE}, 0 0 0 3px color-mix(in srgb, ${glowColor} 60%, transparent), 0 6px 14px rgba(40, 24, 10, 0.14)` : SUNKEN,
                    color: textColor,
                    fontFamily: '"Fraunces", "Iowan Old Style", Georgia, serif',
                    fontWeight: 500,
                    transition: "background-color 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms cubic-bezier(.2,.8,.2,1)",
                    ...font,
                    fontSize: "clamp(16px, 6vw, 24px)",
                }}
            >
                {value[i] ?? (on ? <span className={`pa-otp-caret-${id}`} style={{ width: 2, height: "45%", background: "currentColor" }} /> : null)}
            </span>
        )
    }

    const slots = Array.from({ length }, (_, i) => i)
    return (
        <div
            style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "clamp(4px, 2vw, 12px)", maxWidth: "100%", opacity: disabled ? 0.55 : 1, cursor: disabled ? "default" : "text", ...props.style }}
            onMouseDown={(e) => {
                if (disabled) return
                e.preventDefault()
                input.current?.focus()
            }}
        >
            <style>{`
                @keyframes pa-otp-blink-${id} { 50% { opacity: 0; } }
                .pa-otp-caret-${id} { animation: pa-otp-blink-${id} 1s steps(1, end) infinite; }
                @media (prefers-reduced-motion: reduce) { .pa-otp-caret-${id} { animation: none; } }
            `}</style>
            {half > 0 ? (
                <>
                    <span style={{ display: "flex", gap: "clamp(3px, 1.5vw, 8px)", flex: "0 1 auto", minWidth: 0 }}>{slots.slice(0, half).map(slot)}</span>
                    <span aria-hidden="true" style={{ flex: "none", width: 12, height: 3, borderRadius: 2, background: separatorColor }} />
                    <span style={{ display: "flex", gap: "clamp(3px, 1.5vw, 8px)", flex: "0 1 auto", minWidth: 0 }}>{slots.slice(half).map(slot)}</span>
                </>
            ) : (
                <span style={{ display: "flex", gap: "clamp(3px, 1.5vw, 8px)", flex: "0 1 auto", minWidth: 0 }}>{slots.map(slot)}</span>
            )}
            <input
                ref={input}
                aria-label={label}
                value={value}
                disabled={disabled}
                inputMode={digitsOnly ? "numeric" : "text"}
                autoComplete="one-time-code"
                pattern={digitsOnly ? "[0-9]*" : undefined}
                maxLength={length}
                onChange={(e) => change(e.target.value)}
                onFocus={(e) => {
                    setFocused(true)
                    const el = e.currentTarget
                    requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length))
                }}
                onBlur={() => setFocused(false)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, border: 0, padding: 0, fontSize: 16, color: "transparent", caretColor: "transparent", background: "transparent" }}
            />
        </div>
    )
}

addPropertyControls(InputOTP, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Verification code", description: "Read aloud by screen readers." },
    length: { type: ControlType.Number, title: "Length", defaultValue: 6, min: 3, max: 8, step: 1, displayStepper: true },
    split: { type: ControlType.Boolean, title: "Split", defaultValue: true, description: "Two groups with a dash between." },
    value: { type: ControlType.String, title: "Value", defaultValue: "" },
    digitsOnly: { type: ControlType.Boolean, title: "Digits Only", defaultValue: true },
    disabled: { type: ControlType.Boolean, title: "Disabled", defaultValue: false },
    grooveColor: { type: ControlType.Color, title: "Groove", defaultValue: "#e4d3af" },
    focusColor: { type: ControlType.Color, title: "Focused", defaultValue: "#f6eedb" },
    glowColor: { type: ControlType.Color, title: "Glow", defaultValue: "#f3c77e" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    separatorColor: { type: ControlType.Color, title: "Dash", defaultValue: "#d2b98f" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1em" } },
    onComplete: { type: ControlType.EventHandler, title: "On Complete" },
})
