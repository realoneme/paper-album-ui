// Paper Album UI · Photo Pocket for Framer
// A print slipped into a paper sleeve with a wavy-cut top edge (the same SVG wave as the design system's Photo
// Holder). On hover the print slides up out of its pocket; the sleeve stays put.
import { useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion } from "framer-motion"

interface PhotoPocketProps {
    image?: { src: string; srcSet?: string; alt?: string }
    caption: string
    tilt: number
    ratio: "4 / 5" | "1 / 1" | "3 / 2"
    lift: number
    liftOnHover: boolean
    printColor: string
    sleeveColor: string
    inkColor: string
    captionFont: CSSProperties
    style?: CSSProperties
}

/** The design system's cut: a gentle double wave across the sleeve's top edge. */
const WAVE = "M0 18 L0 9 C 50 1 100 14 150 8 C 200 2 250 13 300 6 L300 18 Z"

/**
 * Photo Pocket
 *
 * @framerIntrinsicWidth 240
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function PhotoPocket(props: PhotoPocketProps) {
    const {
        image = { src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg", alt: "Birch line" },
        caption = "",
        tilt = -2,
        ratio = "4 / 5",
        lift = 30,
        liftOnHover = true,
        printColor = "#fbf7ee",
        sleeveColor = "#e4d3af",
        inkColor = "#4a3726",
        captionFont,
    } = props
    const [hover, setHover] = useState(false)
    const isStatic = useIsStaticRenderer()
    const reduce = useReducedMotion()
    const lifted = liftOnHover && hover && !isStatic
    const angle = Math.max(-8, Math.min(8, tilt))

    return (
        <figure
            onPointerEnter={() => startTransition(() => setHover(true))}
            onPointerLeave={() => startTransition(() => setHover(false))}
            style={{
                position: "relative",
                width: "100%",
                margin: 0,
                // Room above for the print to slide into, and beside/below for the sleeve's overhang.
                padding: `${liftOnHover ? lift : 0}px 12px 12px`,
                boxSizing: "border-box",
                ...props.style,
            }}
        >
            <motion.div
                animate={{ y: lifted ? -lift : 0, rotate: lifted ? angle * 0.5 : angle }}
                transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ position: "relative", padding: 10, background: printColor, boxShadow: "0 4px 10px rgba(40, 24, 10, 0.24)" }}
            >
                <img
                    src={image.src}
                    srcSet={image.srcSet}
                    alt={image.alt ?? caption}
                    style={{ display: "block", width: "100%", aspectRatio: ratio, objectFit: "cover" }}
                />
                {caption && (
                    <figcaption style={{ marginTop: 32, color: inkColor, fontSize: 20, lineHeight: 1.2, ...captionFont }}>{caption}</figcaption>
                )}
            </motion.div>
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "44%",
                    background: sleeveColor,
                    borderRadius: "0 0 3px 3px",
                    filter: "drop-shadow(0 -4px 5px rgba(40, 24, 10, 0.3))",
                    pointerEvents: "none",
                }}
            >
                <svg viewBox="0 0 300 18" preserveAspectRatio="none" focusable="false" style={{ position: "absolute", left: 0, top: -17, width: "100%", height: 18, display: "block" }}>
                    <path d={WAVE} fill={sleeveColor} />
                </svg>
            </div>
        </figure>
    )
}

addPropertyControls(PhotoPocket, {
    image: { type: ControlType.ResponsiveImage, title: "Photo" },
    caption: { type: ControlType.String, title: "Caption", defaultValue: "", placeholder: "Optional note on the margin" },
    tilt: { type: ControlType.Number, title: "Tilt", defaultValue: -2, min: -8, max: 8, step: 0.5, unit: "°" },
    ratio: {
        type: ControlType.Enum,
        title: "Ratio",
        options: ["4 / 5", "1 / 1", "3 / 2"],
        optionTitles: ["4:5", "1:1", "3:2"],
        defaultValue: "4 / 5",
        displaySegmentedControl: true,
    },
    liftOnHover: { type: ControlType.Boolean, title: "Lift on Hover", defaultValue: true },
    lift: { type: ControlType.Number, title: "Lift", defaultValue: 30, min: 0, max: 60, unit: "px", hidden: (p) => !p.liftOnHover },
    printColor: { type: ControlType.Color, title: "Print", defaultValue: "#fbf7ee" },
    sleeveColor: { type: ControlType.Color, title: "Sleeve", defaultValue: "#e4d3af" },
    inkColor: { type: ControlType.Color, title: "Caption", defaultValue: "#4a3726" },
    captionFont: {
        type: ControlType.Font,
        title: "Caption Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "20px", variant: "Medium", lineHeight: "1.2em" },
    },
})
