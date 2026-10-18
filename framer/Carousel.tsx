// Paper Album UI · Carousel for Framer
// A strip of prints that pages left and right; neighbours peek at reduced opacity. Drag or swipe, or use the
// arrows; dots for up to seven prints, a "3 / 12" counter beyond that (or force either).
import { useEffect, useRef, useState, startTransition, type CSSProperties, type KeyboardEvent } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion"

interface Slide {
    image?: { src: string; srcSet?: string; alt?: string }
    caption: string
    details: string
    description: string
}

interface CarouselProps {
    slides: Slide[]
    slideWidth: number
    indicator: "auto" | "dots" | "counter"
    label: string
    printColor: string
    inkColor: string
    keyColor: string
    keyText: string
    activeDot: string
    dotColor: string
    flipToDetails: boolean
    captionFont: CSSProperties
    detailsFont: CSSProperties
    style?: CSSProperties
}

const FALLBACK = [
    "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
    "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
    "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
    "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",
]

/**
 * Carousel
 *
 * @framerIntrinsicWidth 640
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Carousel(props: CarouselProps) {
    const {
        slides = [],
        slideWidth = 70,
        indicator = "auto",
        label = "Featured prints",
        printColor = "#fbf7ee",
        inkColor = "#4a3726",
        keyColor = "#f6eedb",
        keyText = "#2a1f16",
        activeDot = "#5a3d26",
        dotColor = "#d2b98f",
        flipToDetails = true,
        captionFont,
        detailsFont,
    } = props
    const n = slides.length
    const [index, setIndex] = useState(0)
    // Which slide is turned over to show its details (-1: none). A drag is not a click.
    const [flipped, setFlipped] = useState(-1)
    const dragged = useRef(false)
    const [width, setWidth] = useState(0)
    const viewport = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const reduce = useReducedMotion()
    const isStatic = useIsStaticRenderer()
    const step = (width * (slideWidth + 2)) / 100

    useEffect(() => {
        const el = viewport.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(() => setWidth(el.clientWidth))
        ro.observe(el)
        setWidth(el.clientWidth)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const target = -index * step
        if (reduce || isStatic) x.set(target)
        else {
            const controls = animate(x, target, { type: "spring", stiffness: 260, damping: 32 })
            return () => controls.stop()
        }
    }, [index, step, reduce, isStatic, x])

    function go(i: number) {
        startTransition(() => {
            setIndex(Math.max(0, Math.min(n - 1, i)))
            setFlipped(-1)
        })
    }
    function pressSlide(i: number) {
        if (dragged.current) return
        if (i !== index) return go(i)
        if (flipToDetails) startTransition(() => setFlipped(flipped === i ? -1 : i))
    }
    function onKeyDown(e: KeyboardEvent) {
        if (e.key === "ArrowRight") go(index + 1)
        if (e.key === "ArrowLeft") go(index - 1)
    }

    const useDots = indicator === "dots" || (indicator === "auto" && n <= 7)
    const keyStyle = (disabled: boolean): CSSProperties => ({
        width: 40,
        height: 40,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        border: 0,
        borderRadius: 6,
        background: keyColor,
        color: keyText,
        boxShadow: "inset 0 0 0 1px #d2b98f, 0 3px 0 #d2b98f",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.45 : 1,
        flex: "none",
    })

    return (
        <section aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown} style={{ position: "relative", width: "100%", ...props.style }}>
            <div ref={viewport} style={{ overflow: "hidden", padding: "10px 0 18px" }}>
                <motion.div
                    drag={isStatic ? false : "x"}
                    dragConstraints={{ left: -(n - 1) * step, right: 0 }}
                    dragElastic={0.12}
                    onDragStart={() => {
                        dragged.current = true
                    }}
                    onDragEnd={(_, info) => {
                        window.setTimeout(() => {
                            dragged.current = false
                        }, 0)
                        const moved = -info.offset.x / Math.max(1, step)
                        const fast = Math.abs(info.velocity.x) > 400 ? -Math.sign(info.velocity.x) : 0
                        go(Math.round(index + moved + (Math.abs(moved) < 0.5 ? fast : 0)))
                    }}
                    style={{ display: "flex", x, cursor: isStatic ? "default" : "grab", touchAction: "pan-y" }}
                >
                    {slides.map((slide, i) => {
                        const image = slide.image?.src ? slide.image : { src: FALLBACK[i % FALLBACK.length], alt: slide.caption }
                        const current = i === index
                        const turned = flipped === i
                        const face: CSSProperties = {
                            padding: "12px 12px 40px",
                            boxSizing: "border-box",
                            background: printColor,
                            boxShadow: "0 6px 16px rgba(40, 24, 10, 0.25)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                        }
                        return (
                            <figure
                                key={i}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${i + 1} of ${n}`}
                                aria-current={current ? "true" : undefined}
                                style={{
                                    flex: `0 0 ${slideWidth}%`,
                                    margin: i === n - 1 ? 0 : "0 2% 0 0",
                                    position: "relative",
                                    perspective: 1400,
                                    opacity: current ? 1 : 0.55,
                                    transition: "opacity 240ms ease",
                                }}
                            >
                                <motion.div
                                    role={current && flipToDetails ? "button" : undefined}
                                    tabIndex={current && flipToDetails ? 0 : -1}
                                    aria-pressed={current && flipToDetails ? turned : undefined}
                                    aria-label={current && flipToDetails ? `${turned ? "Show photo" : "Show details for"} ${slide.caption}` : undefined}
                                    onClick={() => pressSlide(i)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            pressSlide(i)
                                        }
                                    }}
                                    animate={{ rotateY: turned ? 180 : 0 }}
                                    transition={reduce || isStatic ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 18 }}
                                    style={{ position: "relative", transformStyle: "preserve-3d", cursor: current && flipToDetails ? "pointer" : "default" }}
                                >
                                    <div aria-hidden={turned} style={face}>
                                        <img src={image.src} srcSet={image.srcSet} alt={image.alt ?? ""} draggable={false} style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover", pointerEvents: "none" }} />
                                        <figcaption style={{ position: "absolute", left: 16, bottom: 8, color: inkColor, fontSize: 22, lineHeight: 1.2, ...captionFont }}>{slide.caption}</figcaption>
                                    </div>
                                    {/* the back of the print: its name, how it was made, and a few words about it */}
                                    <div
                                        aria-hidden={!turned}
                                        style={{
                                            ...face,
                                            position: "absolute",
                                            inset: 0,
                                            padding: "18px 20px",
                                            transform: "rotateY(180deg)",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 8,
                                            overflow: "hidden",
                                            textAlign: "left",
                                        }}
                                    >
                                        <span style={{ color: inkColor, fontSize: 26, lineHeight: 1.1, ...captionFont }}>{slide.caption}</span>
                                        {slide.details && (
                                            <span style={{ color: inkColor, opacity: 0.75, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", fontVariantNumeric: "tabular-nums", ...detailsFont }}>
                                                {slide.details}
                                            </span>
                                        )}
                                        <span style={{ color: inkColor, fontSize: 14, lineHeight: 1.55, ...detailsFont, letterSpacing: "normal", textTransform: "none" }}>{slide.description}</span>
                                    </div>
                                </motion.div>
                            </figure>
                        )
                    })}
                </motion.div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "8px 12px" }}>
                <button type="button" aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)} style={keyStyle(index === 0)}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                {useDots ? (
                    <div style={{ display: "flex", gap: 4, flex: "none" }}>
                        {slides.map((_, i) => (
                            <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={i === index ? "true" : undefined} onClick={() => go(i)} style={{ width: 32, height: 32, padding: 0, border: 0, background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ width: i === index ? 26 : 10, height: 10, borderRadius: 999, background: i === index ? activeDot : dotColor, boxShadow: "inset 0 1px 2px rgba(40, 24, 10, 0.25)", transition: "width 220ms cubic-bezier(.2,.8,.2,1)" }} />
                            </button>
                        ))}
                    </div>
                ) : null}
                <button type="button" aria-label="Next slide" disabled={index === n - 1} onClick={() => go(index + 1)} style={keyStyle(index === n - 1)}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                {!useDots && (
                    <div aria-live="polite" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 32, minWidth: 76, padding: "0 12px", borderRadius: 999, background: "#e4d3af", boxShadow: "inset 0 2px 4px rgba(40, 24, 10, 0.22)", color: keyText, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
                        <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>Slide </span>
                        <b>{index + 1}</b>
                        <span aria-hidden="true" style={{ opacity: 0.6, padding: "0 4px" }}>/</span>
                        <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}> of </span>
                        {n}
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(Carousel, {
    slides: {
        type: ControlType.Array,
        title: "Slides",
        control: {
            type: ControlType.Object,
            controls: {
                image: { type: ControlType.ResponsiveImage, title: "Photo" },
                caption: { type: ControlType.String, title: "Caption", defaultValue: "Otaru, dawn" },
                details: { type: ControlType.String, title: "Details", defaultValue: "Fujifilm X-T5 · 23mm · f/2 · 1/500s" },
                description: { type: ControlType.String, title: "Description", displayTextArea: true, defaultValue: "[A sentence or two about this photograph.]" },
            },
        },
        defaultValue: [
            { caption: "Otaru, dawn", details: "Fujifilm X-T5 · 23mm · f/2 · 1/500s", description: "First light over the canal, minutes before the boats went out." },
            { caption: "Harbour fog", details: "Leica Q2 · 28mm · f/5.6 · 1/250s", description: "The fog came in off the sea and swallowed the far pier." },
            { caption: "Birch line", details: "Fujifilm X-T5 · 56mm · f/1.4 · 1/1000s", description: "A row of birches along the coast road, shot from the car window." },
            { caption: "Last ferry", details: "Leica Q2 · 28mm · f/2.8 · 1/60s", description: "The last ferry of the night, lights on, half the seats empty." },
        ],
    },
    slideWidth: { type: ControlType.Number, title: "Slide Width", defaultValue: 70, min: 40, max: 100, unit: "%" },
    indicator: {
        type: ControlType.Enum,
        title: "Indicator",
        options: ["auto", "dots", "counter"],
        optionTitles: ["Auto", "Dots", "Counter"],
        defaultValue: "auto",
        displaySegmentedControl: true,
    },
    label: { type: ControlType.String, title: "Label", defaultValue: "Featured prints" },
    printColor: { type: ControlType.Color, title: "Print", defaultValue: "#fbf7ee" },
    inkColor: { type: ControlType.Color, title: "Caption", defaultValue: "#4a3726" },
    keyColor: { type: ControlType.Color, title: "Arrow Key", defaultValue: "#f6eedb" },
    keyText: { type: ControlType.Color, title: "Arrow", defaultValue: "#2a1f16" },
    activeDot: { type: ControlType.Color, title: "Active Dot", defaultValue: "#5a3d26" },
    dotColor: { type: ControlType.Color, title: "Dot", defaultValue: "#d2b98f" },
    flipToDetails: { type: ControlType.Boolean, title: "Flip for Details", defaultValue: true, description: "Clicking the current photo turns it over to show its details." },
    detailsFont: {
        type: ControlType.Font,
        title: "Details Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "14px", variant: "Regular", lineHeight: "1.55em" },
    },
    captionFont: {
        type: ControlType.Font,
        title: "Caption Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "22px", variant: "Medium", lineHeight: "1.2em" },
    },
})
