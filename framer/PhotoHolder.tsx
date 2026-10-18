// Paper Album UI · Photo Holder for Framer
// The ways a print is held on an album page:
//   corners  – wood photo corners with paper thickness, over the bare photo
//   slits    – the print tucked into four slits cut in the page (page-colour flaps)
//   pocket   – the print slipped into a wave-cut sleeve with its name written on it; lifts out on hover
//   tape     – a strip of tape across the top; on hover it is lifted a little off the page from the tape and laid back down
//   polaroid – an instant print with a wide written margin; on hover it is nudged askew, then settles back
import { useState, startTransition, type CSSProperties, type ReactNode } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useAnimationControls, useReducedMotion } from "framer-motion"

type HolderStyle = "corners" | "slits" | "pocket" | "tape" | "polaroid"

interface PhotoHolderProps {
    holder: HolderStyle
    image?: { src: string; srcSet?: string; alt?: string }
    caption: string
    tilt: number
    ratio: "4 / 5" | "1 / 1" | "3 / 2"
    animateOnHover: boolean
    printColor: string
    cornerColor: string
    pageColor: string
    sleeveColor: string
    tapeColor: string
    inkColor: string
    captionFont: CSSProperties
    style?: CSSProperties
}

const EASE_PAPER = [0.2, 0.8, 0.2, 1] as const
/** Each style's own angle; the Tilt control is added on top. */
const REST_SHADOW = "0px 5px 12px rgba(40, 24, 10, 0.26)"
const LIFT_SHADOW = "0px 16px 22px rgba(40, 24, 10, 0.28)"
const BASE_TILT: Record<HolderStyle, number> = { corners: 0, slits: 0, pocket: -2, tape: 2, polaroid: -1.5 }
const WAVE = "M0 18 L0 9 C 50 1 100 14 150 8 C 200 2 250 13 300 6 L300 18 Z"
const IMAGE: { src: string; srcSet?: string; alt?: string } = { src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg", alt: "Otaru, dawn" }

/** A paper triangle with thickness: a soft sheen, a lighter cut edge, and a shadow cast onto the photo. */
function PaperCorner({ corner, size, color, flap }: { corner: "tl" | "tr" | "bl" | "br"; size: number; color: string; flap: boolean }) {
    const rotate = { tl: 0, tr: 90, br: 180, bl: 270 }[corner]
    const place: CSSProperties = {
        tl: { left: 0, top: 0 },
        tr: { right: 0, top: 0 },
        br: { right: 0, bottom: 0 },
        bl: { left: 0, bottom: 0 },
    }[corner]
    // Drawn as the top-left corner and rotated into place, so the shadow is set in that frame: it falls past the
    // cut edge, towards the middle of the photo, whichever corner this is.
    const id = `pa-corner-${corner}-${flap ? "f" : "w"}`
    return (
        <svg
            aria-hidden="true"
            width={size}
            height={size}
            viewBox="0 0 40 40"
            style={{
                position: "absolute",
                zIndex: 2,
                overflow: "visible",
                ...place,
                transform: `rotate(${rotate}deg)`,
                filter: `drop-shadow(1.4px 1.8px 1.6px rgba(40, 24, 10, ${flap ? 0.32 : 0.42}))`,
            }}
        >
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={flap ? 0.35 : 0.22} />
                    <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity={flap ? 0.04 : 0.12} />
                </linearGradient>
            </defs>
            <path d="M0 0 H40 L0 40 Z" fill={color} />
            <path d="M0 0 H40 L0 40 Z" fill={`url(#${id})`} />
            {/* the cut edge catches the light */}
            <path d="M40 0 L0 40" stroke="#ffffff" strokeOpacity={flap ? 0.7 : 0.35} strokeWidth="1" />
        </svg>
    )
}

/**
 * Photo Holder
 *
 * @framerIntrinsicWidth 240
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function PhotoHolder(props: PhotoHolderProps) {
    const {
        holder = "corners",
        image = IMAGE,
        caption = "Otaru, dawn",
        tilt = 0,
        ratio = "4 / 5",
        animateOnHover = true,
        printColor = "#fbf7ee",
        cornerColor = "#a9784a",
        pageColor = "#f6eedb",
        sleeveColor = "#e4d3af",
        tapeColor = "#d9c08a",
        inkColor = "#4a3726",
        captionFont,
    } = props
    const [hover, setHover] = useState(false)
    const isStatic = useIsStaticRenderer()
    const reduce = useReducedMotion()
    const live = animateOnHover && !isStatic && !reduce
    const rock = useAnimationControls()
    const angle = Math.max(-8, Math.min(8, BASE_TILT[holder] + tilt))

    function enter() {
        startTransition(() => setHover(true))
        if (live && holder === "tape") {
            // Lifted from the tape: the bottom edge rises towards the viewer and the shadow deepens, then it drops
            // back with a small bounce.
            rock.start({
                rotateX: [0, 9, -1.5, 1, 0],
                boxShadow: [REST_SHADOW, LIFT_SHADOW, REST_SHADOW, REST_SHADOW, REST_SHADOW],
                transition: { duration: 1, ease: EASE_PAPER, times: [0, 0.38, 0.7, 0.86, 1] },
            })
        }
    }
    function leave() {
        startTransition(() => setHover(false))
    }

    const photo = (
        <img
            src={image.src}
            srcSet={image.srcSet}
            alt={image.alt ?? caption}
            draggable={false}
            style={{ display: "block", width: "100%", aspectRatio: holder === "polaroid" ? "1 / 1" : ratio, objectFit: "cover" }}
        />
    )
    const note = (text: string, extra?: CSSProperties) =>
        text ? <figcaption style={{ color: inkColor, fontSize: 20, lineHeight: 1.2, ...captionFont, ...extra }}>{text}</figcaption> : null

    let body: ReactNode
    if (holder === "corners") {
        body = (
            <div style={{ position: "relative", transform: `rotate(${angle}deg)`, boxShadow: "0 4px 10px rgba(40, 24, 10, 0.24)" }}>
                {photo}
                {/* the corners overhang the photo by 9px */}
                <div aria-hidden="true" style={{ position: "absolute", inset: -9 }}>
                    {(["tl", "tr", "bl", "br"] as const).map((c) => (
                        <PaperCorner key={c} corner={c} size={44} color={cornerColor} flap={false} />
                    ))}
                </div>
            </div>
        )
    } else if (holder === "slits") {
        body = (
            <div style={{ position: "relative", padding: 10, background: printColor, transform: `rotate(${angle}deg)`, boxShadow: "0 4px 10px rgba(40, 24, 10, 0.24)" }}>
                {photo}
                <div aria-hidden="true" style={{ position: "absolute", inset: -4 }}>
                    {(["tl", "tr", "bl", "br"] as const).map((c) => (
                        <PaperCorner key={c} corner={c} size={40} color={pageColor} flap />
                    ))}
                </div>
            </div>
        )
    } else if (holder === "pocket") {
        const lift = 30
        body = (
            <div style={{ position: "relative", paddingTop: live ? lift : 0, paddingInline: 12, paddingBottom: 12 }}>
                <motion.div
                    animate={{ y: live && hover ? -lift : 0, rotate: live && hover ? angle * 0.5 : angle }}
                    transition={{ duration: 0.55, ease: EASE_PAPER }}
                    style={{ position: "relative", padding: 10, background: printColor, boxShadow: "0 4px 10px rgba(40, 24, 10, 0.24)" }}
                >
                    {photo}
                </motion.div>
                <div
                    aria-hidden={caption ? undefined : "true"}
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "44%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: sleeveColor,
                        borderRadius: "0 0 3px 3px",
                        filter: "drop-shadow(0 -4px 5px rgba(40, 24, 10, 0.3))",
                        pointerEvents: "none",
                    }}
                >
                    <svg aria-hidden="true" viewBox="0 0 300 18" preserveAspectRatio="none" focusable="false" style={{ position: "absolute", left: 0, top: -17, width: "100%", height: 18, display: "block" }}>
                        <path d={WAVE} fill={sleeveColor} />
                    </svg>
                    {/* the photo's name, written on the sleeve */}
                    {note(caption, { position: "relative", transform: "rotate(-3deg)", fontSize: 24, opacity: 0.85, margin: 0, padding: "0 12px", textAlign: "center" })}
                </div>
            </div>
        )
    } else if (holder === "tape") {
        body = (
            <motion.div
                initial={false}
                animate={rock}
                style={{ position: "relative", padding: "12px 12px 14px", background: printColor, rotate: angle, rotateX: 0, transformPerspective: 700, transformOrigin: "50% 0%", boxShadow: REST_SHADOW }}
            >
                <span
                    aria-hidden="true"
                    style={{ position: "absolute", left: "50%", top: -12, width: 96, height: 28, marginLeft: -48, background: tapeColor, opacity: 0.9, transform: "rotate(-3deg)", boxShadow: "0 1px 2px rgba(40, 24, 10, 0.18)" }}
                />
                {photo}
                {note(caption, { marginTop: 12 })}
            </motion.div>
        )
    } else {
        body = (
            <motion.div
                animate={live && hover ? { rotate: angle + 3.5, y: -4, x: 3 } : { rotate: angle, y: 0, x: 0 }}
                transition={live ? { type: "spring", stiffness: 260, damping: 14 } : { duration: 0 }}
                style={{ position: "relative", padding: "12px 12px 18px", background: printColor, boxShadow: live && hover ? "0 10px 18px rgba(40, 24, 10, 0.26)" : "0 4px 10px rgba(40, 24, 10, 0.24)", transition: "box-shadow 300ms" }}
            >
                {photo}
                {note(caption, { marginTop: 14 })}
            </motion.div>
        )
    }

    return (
        <figure
            onPointerEnter={enter}
            onPointerLeave={leave}
            style={{ position: "relative", width: "100%", margin: 0, padding: holder === "pocket" ? 0 : 14, boxSizing: "border-box", ...props.style }}
        >
            {body}
        </figure>
    )
}

addPropertyControls(PhotoHolder, {
    holder: {
        type: ControlType.Enum,
        title: "Holder",
        options: ["corners", "slits", "pocket", "tape", "polaroid"],
        optionTitles: ["Corners", "Slits", "Pocket", "Tape", "Polaroid"],
        defaultValue: "corners",
    },
    image: { type: ControlType.ResponsiveImage, title: "Photo" },
    caption: {
        type: ControlType.String,
        title: "Name",
        defaultValue: "Otaru, dawn",
        description: "Written on the sleeve (Pocket) or the margin (Tape, Polaroid).",
    },
    tilt: { type: ControlType.Number, title: "Tilt", defaultValue: 0, min: -6, max: 6, step: 0.5, unit: "°", description: "Added to the holder's own angle." },
    ratio: {
        type: ControlType.Enum,
        title: "Ratio",
        options: ["4 / 5", "1 / 1", "3 / 2"],
        optionTitles: ["4:5", "1:1", "3:2"],
        defaultValue: "4 / 5",
        displaySegmentedControl: true,
        hidden: (p) => p.holder === "polaroid",
    },
    animateOnHover: { type: ControlType.Boolean, title: "Hover Motion", defaultValue: true },
    printColor: { type: ControlType.Color, title: "Print", defaultValue: "#fbf7ee" },
    cornerColor: { type: ControlType.Color, title: "Corners", defaultValue: "#a9784a", hidden: (p) => p.holder !== "corners" },
    pageColor: { type: ControlType.Color, title: "Page", defaultValue: "#f6eedb", hidden: (p) => p.holder !== "slits" },
    sleeveColor: { type: ControlType.Color, title: "Sleeve", defaultValue: "#e4d3af", hidden: (p) => p.holder !== "pocket" },
    tapeColor: { type: ControlType.Color, title: "Tape", defaultValue: "#d9c08a", hidden: (p) => p.holder !== "tape" },
    inkColor: { type: ControlType.Color, title: "Ink", defaultValue: "#4a3726" },
    captionFont: {
        type: ControlType.Font,
        title: "Name Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "20px", variant: "Medium", lineHeight: "1.2em" },
    },
})
