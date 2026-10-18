// Paper Album UI · Button for Framer
// A paper key. Hover lifts it 1px; pressed, it sinks 2px onto its edge and loses only its soft shadow (the edge
// stays, so it still reads as a key). The press is held for at least 140ms, from a pointer or Enter/Space, so a
// trackpad tap-to-click, which is over before a frame is drawn, still shows it. With a link it renders an <a>.
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useReducedMotion } from "framer-motion"

type Variant = "primary" | "secondary" | "seal" | "outline" | "ghost" | "destructive"
type Icon = "none" | "arrow-right" | "arrow-left" | "calendar" | "camera" | "download" | "plus" | "check"

interface ButtonProps {
    label: string
    variant: Variant
    size: "sm" | "default" | "lg"
    icon: Icon
    iconSide: "left" | "right"
    iconOnly: boolean
    link: string
    newTab: boolean
    disabled: boolean
    fullWidth: boolean
    primaryColor: string
    primaryText: string
    edgeColor: string
    cardColor: string
    cardText: string
    borderColor: string
    sealColor: string
    sealText: string
    hoverColor: string
    outlineColor: string
    destructiveColor: string
    destructiveText: string
    font: CSSProperties
    onClick?: () => void
    style?: CSSProperties
}

const MIN_PRESS_MS = 140
const SIZES = { sm: { h: 36, pad: 12, font: 14, icon: 16 }, default: { h: 44, pad: 20, font: 15, icon: 18 }, lg: { h: 56, pad: 28, font: 17, icon: 20 } }
const SOFT = "0 8px 16px rgba(40, 24, 10, 0.25)"

const ICONS: Record<Exclude<Icon, "none">, ReactNode> = {
    "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
    "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
        </>
    ),
    camera: (
        <>
            <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
            <circle cx="12" cy="13" r="3.5" />
        </>
    ),
    download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="M20 6 9 17l-5-5" />,
}

/**
 * Button
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Button(props: ButtonProps) {
    const {
        label = "View albums",
        variant = "primary",
        size = "default",
        icon = "none",
        iconSide = "right",
        iconOnly = false,
        link = "",
        newTab = false,
        disabled = false,
        fullWidth = false,
        primaryColor = "#5a3d26",
        primaryText = "#f6eedb",
        edgeColor = "#3a2716",
        cardColor = "#f6eedb",
        cardText = "#2a1f16",
        borderColor = "#d2b98f",
        sealColor = "#9e3b2b",
        sealText = "#fff8ec",
        hoverColor = "#e4d3af",
        outlineColor = "#6a5642",
        destructiveColor = "#9e3b2b",
        destructiveText = "#fff8ec",
        font,
        onClick,
    } = props
    const reduce = useReducedMotion()
    const [hover, setHover] = useState(false)
    const [pressed, setPressed] = useState(false)
    const since = useRef(0)
    const timer = useRef<number | undefined>(undefined)
    useEffect(() => () => window.clearTimeout(timer.current), [])

    function down() {
        if (disabled) return
        window.clearTimeout(timer.current)
        since.current = performance.now()
        setPressed(true)
    }
    function up() {
        window.clearTimeout(timer.current)
        const left = MIN_PRESS_MS - (performance.now() - since.current)
        if (left <= 0) setPressed(false)
        else timer.current = window.setTimeout(() => setPressed(false), left)
    }

    // Each variant: fill, text, the key's edge and whether it has the soft drop shadow.
    const look: Record<Variant, { fill: string; text: string; edge: string | null; soft: boolean; inset?: string; hoverFill?: string }> = {
        primary: { fill: primaryColor, text: primaryText, edge: edgeColor, soft: true },
        secondary: { fill: cardColor, text: cardText, edge: borderColor, soft: false, inset: `inset 0 0 0 1px ${borderColor}` },
        seal: { fill: sealColor, text: sealText, edge: edgeColor, soft: true },
        outline: { fill: "transparent", text: outlineColor, edge: null, soft: false, inset: `inset 0 0 0 1.5px ${outlineColor}` },
        ghost: { fill: "transparent", text: cardText, edge: null, soft: false, hoverFill: hoverColor },
        destructive: { fill: destructiveColor, text: destructiveText, edge: edgeColor, soft: false },
    }
    const v = look[variant] ?? look.primary
    const s = SIZES[size] ?? SIZES.default
    const live = !disabled
    const sink = live && pressed
    const lift = live && hover && !pressed

    const shadows = [v.inset, v.edge ? `0 3px 0 ${v.edge}` : null, v.soft && !sink ? SOFT : null].filter(Boolean).join(", ")
    const y = reduce ? 0 : sink ? 2 : lift ? -1 : 0

    const glyph =
        icon !== "none" ? (
            <svg aria-hidden="true" width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
                {ICONS[icon]}
            </svg>
        ) : null
    const only = iconOnly && glyph !== null

    const style: CSSProperties = {
        position: "relative",
        display: fullWidth ? "flex" : "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxSizing: "border-box",
        width: fullWidth ? "100%" : only ? s.h : undefined,
        minHeight: s.h,
        padding: only ? 0 : `0 ${s.pad}px`,
        border: 0,
        borderRadius: 6,
        background: variant === "ghost" && hover && live ? v.hoverFill : v.fill,
        color: v.text,
        boxShadow: shadows || "none",
        transform: `translateY(${y}px)`,
        // Down fast (so even a tap reaches the bottom), back up a little slower.
        transition: reduce ? "none" : sink ? "transform .08s ease-out, box-shadow .08s ease-out" : "transform .15s ease, box-shadow .15s ease, background-color .15s ease",
        fontFamily: '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif',
        ...font,
        fontSize: s.font,
        lineHeight: 1,
        whiteSpace: "nowrap",
        textDecoration: "none",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.55 : 1,
        WebkitTapHighlightColor: "transparent",
        ...props.style,
    }
    const handlers = {
        onPointerEnter: (e: PointerEvent) => e.pointerType === "mouse" && setHover(true),
        onPointerLeave: () => {
            setHover(false)
            if (pressed) up()
        },
        onPointerDown: (e: PointerEvent) => e.button === 0 && down(),
        onPointerUp: up,
        onPointerCancel: up,
        onKeyDown: (e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && !e.repeat && down(),
        onKeyUp: (e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && up(),
        onBlur: () => pressed && up(),
        onClick: (e: MouseEvent) => {
            if (disabled) {
                e.preventDefault()
                return
            }
            onClick?.()
        },
    }
    const content = (
        <>
            {iconSide === "left" ? glyph : null}
            {only ? null : <span>{label}</span>}
            {iconSide === "right" ? glyph : null}
        </>
    )
    const common = { "data-pressed": sink ? "" : undefined, "aria-label": only ? label : undefined, style, ...handlers }

    if (link && !disabled) {
        return (
            <a href={link} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined} {...common}>
                {content}
            </a>
        )
    }
    return (
        <button type="button" disabled={disabled} {...common}>
            {content}
        </button>
    )
}

addPropertyControls(Button, {
    label: { type: ControlType.String, title: "Label", defaultValue: "View albums" },
    variant: {
        type: ControlType.Enum,
        title: "Variant",
        options: ["primary", "secondary", "seal", "outline", "ghost", "destructive"],
        optionTitles: ["Primary", "Secondary", "Seal", "Outline", "Ghost", "Destructive"],
        defaultValue: "primary",
    },
    size: {
        type: ControlType.Enum,
        title: "Size",
        options: ["sm", "default", "lg"],
        optionTitles: ["Small", "Default", "Large"],
        defaultValue: "default",
        displaySegmentedControl: true,
    },
    icon: {
        type: ControlType.Enum,
        title: "Icon",
        options: ["none", "arrow-right", "arrow-left", "calendar", "camera", "download", "plus", "check"],
        optionTitles: ["None", "Arrow right", "Arrow left", "Calendar", "Camera", "Download", "Plus", "Check"],
        defaultValue: "none",
    },
    iconSide: {
        type: ControlType.Enum,
        title: "Icon Side",
        options: ["left", "right"],
        optionTitles: ["Left", "Right"],
        defaultValue: "right",
        displaySegmentedControl: true,
        hidden: (p) => p.icon === "none" || !!p.iconOnly,
    },
    iconOnly: { type: ControlType.Boolean, title: "Icon Only", defaultValue: false, description: "The label is then read aloud only.", hidden: (p) => p.icon === "none" },
    link: { type: ControlType.Link, title: "Link" },
    newTab: { type: ControlType.Boolean, title: "New Tab", defaultValue: false, hidden: (p) => !p.link },
    disabled: { type: ControlType.Boolean, title: "Disabled", defaultValue: false },
    fullWidth: { type: ControlType.Boolean, title: "Full Width", defaultValue: false },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#5a3d26", hidden: (p) => p.variant !== "primary" },
    primaryText: { type: ControlType.Color, title: "Primary Text", defaultValue: "#f6eedb", hidden: (p) => p.variant !== "primary" },
    edgeColor: { type: ControlType.Color, title: "Edge", defaultValue: "#3a2716", hidden: (p) => !["primary", "seal", "destructive"].includes(p.variant ?? "primary") },
    cardColor: { type: ControlType.Color, title: "Paper", defaultValue: "#f6eedb", hidden: (p) => p.variant !== "secondary" },
    cardText: { type: ControlType.Color, title: "Paper Text", defaultValue: "#2a1f16", hidden: (p) => p.variant !== "secondary" && p.variant !== "ghost" },
    borderColor: { type: ControlType.Color, title: "Paper Edge", defaultValue: "#d2b98f", hidden: (p) => p.variant !== "secondary" },
    sealColor: { type: ControlType.Color, title: "Seal", defaultValue: "#9e3b2b", hidden: (p) => p.variant !== "seal" },
    sealText: { type: ControlType.Color, title: "Seal Text", defaultValue: "#fff8ec", hidden: (p) => p.variant !== "seal" },
    hoverColor: { type: ControlType.Color, title: "Hover", defaultValue: "#e4d3af", hidden: (p) => p.variant !== "ghost" },
    outlineColor: { type: ControlType.Color, title: "Outline", defaultValue: "#6a5642", hidden: (p) => p.variant !== "outline" },
    destructiveColor: { type: ControlType.Color, title: "Destructive", defaultValue: "#9e3b2b", hidden: (p) => p.variant !== "destructive" },
    destructiveText: { type: ControlType.Color, title: "Destructive Text", defaultValue: "#fff8ec", hidden: (p) => p.variant !== "destructive" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", displayFontSize: false, defaultValue: { variant: "Semibold" } },
    onClick: { type: ControlType.EventHandler, title: "On Click" },
})
