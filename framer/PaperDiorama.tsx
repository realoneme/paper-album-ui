// Paper Album UI · Paper Diorama for Framer
// A pop-up paper scene for the top of a page: hand-cut hills in layers, a paper moon and drifting clouds, prints and a
// sealed envelope standing between the hills, and fireflies. On load each layer folds up from the page like a pop-up
// book, then the scene dollies slowly. The studio name sits on a torn paper label above it. Reduced motion: still.
import { useId, useMemo, type CSSProperties } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

interface Img {
    src: string
    srcSet?: string
    alt?: string
}

interface PaperDioramaProps {
    eyebrow: string
    name: string
    tagline: string
    primaryLabel: string
    primaryLink: string
    secondaryLabel: string
    secondaryLink: string
    note: string
    photo1?: Img
    photo2?: Img
    photo3?: Img
    showEnvelope: boolean
    fireflies: number
    animate: boolean
    sceneHeight: number
    groundColor: string
    glowColor: string
    paperColor: string
    printColor: string
    mutedColor: string
    borderColor: string
    woodColor: string
    primaryColor: string
    edgeColor: string
    sealColor: string
    sealText: string
    textColor: string
    mutedText: string
    nameFont: CSSProperties
    taglineFont: CSSProperties
    font: CSSProperties
    style?: CSSProperties
}

const SERIF = '"Fraunces", "Iowan Old Style", Georgia, serif'
const SANS = '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif'
const HAND = '"Caveat", "Bradley Hand", cursive'

// Small deterministic random, so the hills are the same on every render.
function rng(seed: number) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// A hand-cut ridge: two sine swells and a little scissor wobble, in a 1600 × 600 box.
function hill(seed: number, base: number, amp: number, freq: number) {
    const r = rng(seed)
    const p1 = r() * 6.28
    const p2 = r() * 6.28
    let d = "M0 600"
    for (let x = 0; x <= 1600; x += 16) {
        const u = (x / 1600) * 6.2832 * freq
        const y = 600 - (base + amp * (0.62 * Math.sin(u + p1) + 0.38 * Math.sin(u * 2.3 + p2))) + (r() - 0.5) * 5
        d += ` L${x} ${y.toFixed(1)}`
    }
    return d + " L1600 600 Z"
}

/**
 * Paper Diorama
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function PaperDiorama(props: PaperDioramaProps) {
    const {
        eyebrow = "Wedding · Family · Portrait photography",
        name = "[Studio Name]",
        tagline = "Photographs, tucked in by hand.",
        primaryLabel = "Book a session",
        primaryLink = "/book",
        secondaryLabel = "See the albums",
        secondaryLink = "/albums",
        note = "now booking spring 2027",
        photo1,
        photo2,
        photo3,
        showEnvelope = true,
        fireflies = 14,
        animate = true,
        sceneHeight = 900,
        groundColor = "#ede2c8",
        glowColor = "#f3c77e",
        paperColor = "#f6eedb",
        printColor = "#fbf7ee",
        mutedColor = "#e4d3af",
        borderColor = "#d2b98f",
        woodColor = "#a9784a",
        primaryColor = "#5a3d26",
        edgeColor = "#3a2716",
        sealColor = "#9e3b2b",
        sealText = "#fff8ec",
        textColor = "#2a1f16",
        mutedText = "#6a5642",
        nameFont,
        taglineFont,
        font,
    } = props
    const isStatic = useIsStaticRenderer()
    const live = animate && !isStatic
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const c = `pd-${uid}`

    const { back, front, flies } = useMemo(() => {
        const fr = rng(97)
        return {
            back: [
                { d: hill(11, 330, 60, 1.4), fill: mutedColor, z: -260, inset: "-12%", delay: 0.15 },
                { d: hill(23, 270, 70, 1.8), fill: borderColor, z: -180, inset: "-9%", delay: 0.3 },
            ],
            front: [
                { d: hill(37, 200, 60, 2.2), fill: woodColor, z: -50, inset: "-5%", delay: 0.6 },
                { d: hill(41, 128, 48, 1.6), fill: primaryColor, z: 30, inset: "-3%", delay: 0.75 },
                { d: hill(53, 62, 26, 3.1), fill: edgeColor, z: 100, inset: "-2%", delay: 0.9 },
            ],
            flies: Array.from({ length: Math.max(0, Math.min(30, fireflies)) }, () => ({
                x: (8 + fr() * 84).toFixed(1) + "%",
                y: (46 + fr() * 40).toFixed(1) + "%",
                dx: Math.round(-40 + fr() * 80) + "px",
                dy: Math.round(-50 + fr() * 60) + "px",
                d: (5 + fr() * 6).toFixed(1) + "s",
                delay: (-fr() * 6).toFixed(1) + "s",
            })),
        }
    }, [mutedColor, borderColor, woodColor, primaryColor, edgeColor, fireflies])

    const ridge = (h: { d: string; fill: string; z: number; inset: string; delay: number }, i: number, shadow: number) => (
        <div
            key={i}
            className={`${c}-layer`}
            style={{
                ["--z" as string]: `${h.z}px`,
                left: h.inset,
                right: h.inset,
                animationDelay: `${h.delay}s`,
                filter: `drop-shadow(0 -2px 0 rgba(255, 226, 170, 0.35)) drop-shadow(0 -8px 14px rgba(40, 24, 10, ${shadow}))`,
            }}
        >
            <svg viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice" style={{ display: "block", width: "100%", height: "100%" }}>
                <path d={h.d} fill={h.fill} filter={`url(#${c}-cut)`} />
            </svg>
        </div>
    )

    const print = (img: Img | undefined, fallback: string, cls: string, s: CSSProperties) => (
        <div className={cls} style={{ position: "absolute", boxSizing: "border-box", padding: "8px 8px 26px", background: printColor, boxShadow: "0 4px 10px rgba(40, 24, 10, 0.24)", ...s }}>
            {img?.src ? (
                <img src={img.src} srcSet={img.srcSet} alt="" draggable={false} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
                <div style={{ width: "100%", height: "100%", background: fallback }} />
            )}
        </div>
    )

    const key = (dark: boolean): CSSProperties => ({
        display: "inline-flex",
        alignItems: "center",
        minHeight: 48,
        padding: "0 26px",
        borderRadius: 6,
        textDecoration: "none",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 15,
        background: dark ? sealColor : paperColor,
        color: dark ? sealText : textColor,
        boxShadow: dark ? `0 3px 0 ${edgeColor}, 0 10px 18px rgba(40, 24, 10, 0.25)` : `inset 0 0 0 1px ${borderColor}, 0 3px 0 ${borderColor}`,
    })

    return (
        <section
            aria-label={name}
            style={{
                position: "relative",
                width: "100%",
                height: sceneHeight,
                overflow: "hidden",
                background: `radial-gradient(ellipse 42% 46% at 70% 28%, ${glowColor} 0%, rgba(0,0,0,0) 72%), ${groundColor}`,
                color: textColor,
                fontFamily: SANS,
                ...font,
                ...props.style,
            }}
        >
            <style>{`
                .${c}-scene { position: absolute; inset: 0; transform-style: preserve-3d; ${live ? `animation: ${c}-dolly 18s ease-in-out infinite alternate;` : "transform: rotateX(2.5deg) rotateY(-1.5deg);"} }
                @keyframes ${c}-dolly { 0% { transform: translate3d(0,0,0) rotateX(2.5deg) rotateY(-1.5deg); } 100% { transform: translate3d(-28px,-8px,80px) rotateX(.5deg) rotateY(1.5deg); } }
                .${c}-layer { position: absolute; bottom: 0; height: 600px; transform-origin: 50% 100%; transform: translateZ(var(--z)); ${live ? `animation: ${c}-pop 1.5s cubic-bezier(.2,.9,.25,1.12) both;` : ""} }
                @keyframes ${c}-pop { 0% { transform: translateZ(var(--z)) rotateX(86deg); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateZ(var(--z)) rotateX(0deg); opacity: 1; } }
                .${c}-cloud { ${live ? `animation: ${c}-float 14s ease-in-out infinite alternate;` : ""} }
                @keyframes ${c}-float { to { transform: translateX(36px); } }
                .${c}-fly { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: ${glowColor}; box-shadow: 0 0 10px 3px ${glowColor}; ${live ? `animation: ${c}-drift var(--d) ease-in-out infinite alternate, ${c}-flicker 2.6s ease-in-out infinite;` : "opacity: .7;"} }
                @keyframes ${c}-drift { to { transform: translate(var(--dx), var(--dy)); } }
                @keyframes ${c}-flicker { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
                .${c}-key { transition: transform .15s ease, box-shadow .15s ease; }
                .${c}-key:hover { transform: translateY(-1px); }
                .${c}-key:active { transform: translateY(2px); }
                .${c}-name { font-size: clamp(48px, 9vw, 96px); }
                @media (max-width: 809px) { .${c}-mid { display: none; } .${c}-p1 { left: 8% !important; } .${c}-p3 { left: 60% !important; } }
                @media (prefers-reduced-motion: reduce) { .${c}-scene, .${c}-layer, .${c}-cloud, .${c}-fly { animation: none !important; } }
            `}</style>

            {/* the scene */}
            <div aria-hidden="true" className={`${c}-art`} style={{ position: "absolute", inset: 0, perspective: 1400, perspectiveOrigin: "62% 30%" }}>
                <div className={`${c}-scene`}>
                    <div className={`${c}-layer`} style={{ ["--z" as string]: "-340px", left: "-14%", right: "-14%", animationDelay: "0.05s" }}>
                        <div style={{ position: "absolute", right: "26%", top: 70, width: 128, height: 128, borderRadius: "50%", background: printColor, boxShadow: `0 0 0 10px rgba(255, 240, 210, 0.25), 0 0 80px 30px ${glowColor}` }} />
                        <svg className={`${c}-cloud`} viewBox="0 0 260 90" style={{ position: "absolute", left: "30%", top: 110, width: 260, height: 90, filter: "drop-shadow(0 6px 8px rgba(40, 24, 10, 0.18))" }}>
                            <path d="M18 78 C 4 78 2 58 18 54 C 14 34 40 26 52 40 C 60 16 98 12 108 36 C 120 20 150 22 156 44 C 172 30 204 36 204 56 C 226 52 248 64 240 78 Z" fill={paperColor} />
                        </svg>
                        <svg className={`${c}-cloud`} viewBox="0 0 200 70" style={{ position: "absolute", right: "12%", top: 210, width: 200, height: 70, animationDuration: "18s", filter: "drop-shadow(0 6px 8px rgba(40, 24, 10, 0.18))" }}>
                            <path d="M14 62 C 2 62 2 46 14 44 C 12 28 34 22 44 34 C 52 14 84 12 92 32 C 104 20 128 24 132 42 C 150 36 176 44 172 62 Z" fill={paperColor} />
                        </svg>
                    </div>
                    {back.map((h, i) => ridge(h, i, 0.24))}
                    {/* prints and an envelope standing between the hills */}
                    <div className={`${c}-layer`} style={{ ["--z" as string]: "-110px", left: "-6%", right: "-6%", animationDelay: "0.45s" }}>
                        {print(photo1, "linear-gradient(180deg, #e2ae74 0%, #b8734a 52%, #5b3a2a 100%)", `${c}-p1`, { left: "18%", bottom: 170, width: 130, height: 162, transform: "rotate(-7deg)" })}
                        {print(photo2, "linear-gradient(180deg, #cfd7d2 0%, #93a8a5 48%, #42585c 100%)", `${c}-mid`, { left: "31%", bottom: 196, width: 112, height: 140, transform: "rotate(5deg)" })}
                        {showEnvelope ? (
                            <div className={`${c}-mid`} style={{ position: "absolute", left: "58%", bottom: 176, width: 176, height: 112, transform: "rotate(-5deg)", filter: "drop-shadow(0 6px 10px rgba(40, 24, 10, 0.28))" }}>
                                <div style={{ position: "absolute", inset: 0, borderRadius: 3, background: paperColor }} />
                                <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: mutedColor, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
                                <div style={{ position: "absolute", left: "50%", top: 46, width: 30, height: 30, marginLeft: -15, borderRadius: "50%", background: sealColor, boxShadow: `0 2px 0 ${edgeColor}` }} />
                            </div>
                        ) : null}
                        {print(photo3, "linear-gradient(180deg, #e6d6aa 0%, #9c9b6b 50%, #3f4b30 100%)", `${c}-p3`, { left: "74%", bottom: 150, width: 120, height: 150, transform: "rotate(8deg)" })}
                    </div>
                    {front.map((h, i) => ridge(h, i + 10, 0.32))}
                    <div style={{ position: "absolute", inset: 0, transform: "translateZ(60px)" }}>
                        {flies.map((f, i) => (
                            <span key={i} className={`${c}-fly`} style={{ left: f.x, top: f.y, ["--dx" as string]: f.dx, ["--dy" as string]: f.dy, ["--d" as string]: f.d, animationDelay: f.delay }} />
                        ))}
                    </div>
                </div>
            </div>
            <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
                <filter id={`${c}-cut`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={7} />
                    <feDisplacementMap in="SourceGraphic" scale={7} />
                </filter>
                <filter id={`${c}-grain`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
                    <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.9 0" />
                </filter>
            </svg>

            {/* the lockup */}
            <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "64px 32px 0", boxSizing: "border-box" }}>
                {eyebrow ? (
                    <p style={{ margin: "0 0 18px 4px", fontSize: 12, fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: mutedText }}>{eyebrow}</p>
                ) : null}
                <div style={{ display: "inline-block", maxWidth: "100%", filter: `drop-shadow(0 3px 0 ${borderColor}) drop-shadow(0 16px 22px rgba(40, 24, 10, 0.28))` }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "20px 34px 24px 30px",
                            background: paperColor,
                            clipPath: "polygon(0 7%, 4% 0, 22% 4%, 41% 0, 63% 5%, 82% 1%, 100% 6%, 98% 48%, 100% 93%, 81% 100%, 59% 95%, 37% 100%, 17% 96%, 2% 100%, 0 64%)",
                        }}
                    >
                        <h1 className={`${c}-name`} style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, lineHeight: 1, letterSpacing: "0.02em", color: primaryColor, textShadow: `0 3px 0 ${edgeColor}`, ...nameFont }}>
                            {name}
                        </h1>
                    </div>
                </div>
                <p style={{ margin: "26px 0 0 4px", fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.25, color: textColor, ...taglineFont }}>
                    {tagline}
                </p>
                <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
                    {primaryLabel ? (
                        <a className={`${c}-key`} href={primaryLink} style={key(true)}>
                            {primaryLabel}
                        </a>
                    ) : null}
                    {secondaryLabel ? (
                        <a className={`${c}-key`} href={secondaryLink} style={key(false)}>
                            {secondaryLabel}
                        </a>
                    ) : null}
                    {note ? <span style={{ fontFamily: HAND, fontSize: 22, color: woodColor, transform: "rotate(-3deg)", marginLeft: 6 }}>{note}</span> : null}
                </div>
            </div>

            {/* paper grain */}
            <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 11, pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.18 }}>
                <rect width="100%" height="100%" filter={`url(#${c}-grain)`} />
            </svg>
        </section>
    )
}

addPropertyControls(PaperDiorama, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "Wedding · Family · Portrait photography" },
    name: { type: ControlType.String, title: "Name", defaultValue: "[Studio Name]" },
    tagline: { type: ControlType.String, title: "Tagline", defaultValue: "Photographs, tucked in by hand." },
    primaryLabel: { type: ControlType.String, title: "Button", defaultValue: "Book a session" },
    primaryLink: { type: ControlType.Link, title: "Button Link", defaultValue: "/book" },
    secondaryLabel: { type: ControlType.String, title: "Second Button", defaultValue: "See the albums" },
    secondaryLink: { type: ControlType.Link, title: "Second Link", defaultValue: "/albums" },
    note: { type: ControlType.String, title: "Note", defaultValue: "now booking spring 2027" },
    photo1: { type: ControlType.ResponsiveImage, title: "Print 1" },
    photo2: { type: ControlType.ResponsiveImage, title: "Print 2" },
    photo3: { type: ControlType.ResponsiveImage, title: "Print 3" },
    showEnvelope: { type: ControlType.Boolean, title: "Envelope", defaultValue: true },
    fireflies: { type: ControlType.Number, title: "Fireflies", defaultValue: 14, min: 0, max: 30, step: 1 },
    animate: { type: ControlType.Boolean, title: "Animate", defaultValue: true, description: "Pop-up on load, slow dolly, drifting clouds and fireflies." },
    sceneHeight: { type: ControlType.Number, title: "Height", defaultValue: 900, min: 560, max: 1200, step: 10, unit: "px" },
    groundColor: { type: ControlType.Color, title: "Ground", defaultValue: "#ede2c8" },
    glowColor: { type: ControlType.Color, title: "Glow", defaultValue: "#f3c77e" },
    paperColor: { type: ControlType.Color, title: "Paper", defaultValue: "#f6eedb" },
    printColor: { type: ControlType.Color, title: "Print", defaultValue: "#fbf7ee" },
    mutedColor: { type: ControlType.Color, title: "Far Hill", defaultValue: "#e4d3af" },
    borderColor: { type: ControlType.Color, title: "Hill", defaultValue: "#d2b98f" },
    woodColor: { type: ControlType.Color, title: "Wood", defaultValue: "#a9784a" },
    primaryColor: { type: ControlType.Color, title: "Deep Wood", defaultValue: "#5a3d26" },
    edgeColor: { type: ControlType.Color, title: "Edge", defaultValue: "#3a2716" },
    sealColor: { type: ControlType.Color, title: "Seal", defaultValue: "#9e3b2b" },
    sealText: { type: ControlType.Color, title: "On Seal", defaultValue: "#fff8ec" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    mutedText: { type: ControlType.Color, title: "Muted Text", defaultValue: "#6a5642" },
    nameFont: { type: ControlType.Font, title: "Name Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1em" } },
    taglineFont: { type: ControlType.Font, title: "Tagline Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1.25em" } },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", displayFontSize: false, defaultValue: { variant: "Regular" } },
})
