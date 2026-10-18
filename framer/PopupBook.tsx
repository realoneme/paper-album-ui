// Paper Album UI · Pop-up Book for Framer
// A linen album lies on the table. On load its cover swings open on the spine and becomes the title page (the studio
// name on a torn label, the tagline and the buttons); on the right page a paper landscape stands up layer by layer, like
// a pop-up book, with prints and a sealed envelope tucked between the hills. Then clouds drift and fireflies glow.
// Narrow screens get one page: the text sits above the book and the cover opens off to the side.
// Static renders and reduced motion show the book already open.
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

interface Img {
    src: string
    srcSet?: string
    alt?: string
}

interface PopupBookProps {
    eyebrow: string
    name: string
    tagline: string
    coverNote: string
    primaryLabel: string
    primaryLink: string
    secondaryLabel: string
    secondaryLink: string
    note: string
    photoCaption: string
    photo1?: Img
    photo2?: Img
    photo3?: Img
    showEnvelope: boolean
    fireflies: number
    animate: boolean
    tableColor: string
    glowColor: string
    pageColor: string
    printColor: string
    mutedColor: string
    borderColor: string
    woodColor: string
    coverColor: string
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

// Design size of one page; the whole book is scaled to fit.
const PW = 520
const PH = 600
const TILT = 34

function rng(seed: number) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// A hand-cut ridge in a 520 × 300 box: two sine swells and a little scissor wobble.
function ridge(seed: number, base: number, amp: number, freq: number) {
    const r = rng(seed)
    const p1 = r() * 6.28
    const p2 = r() * 6.28
    let d = "M0 300"
    for (let x = 0; x <= 520; x += 8) {
        const u = (x / 520) * 6.2832 * freq
        const y = 300 - (base + amp * (0.62 * Math.sin(u + p1) + 0.38 * Math.sin(u * 2.3 + p2))) + (r() - 0.5) * 3
        d += ` L${x} ${y.toFixed(1)}`
    }
    return d + " L520 300 Z"
}

/**
 * Pop-up Book
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 860
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function PopupBook(props: PopupBookProps) {
    const {
        eyebrow = "Wedding · Family · Portrait photography",
        name = "[Studio Name]",
        tagline = "Photographs, tucked in by hand.",
        coverNote = "photographs & albums",
        primaryLabel = "Book a session",
        primaryLink = "/book",
        secondaryLabel = "See the albums",
        secondaryLink = "/albums",
        note = "now booking spring 2027",
        photoCaption = "Tuscany, June",
        photo1,
        photo2,
        photo3,
        showEnvelope = true,
        fireflies = 12,
        animate = true,
        tableColor = "#ede2c8",
        glowColor = "#f3c77e",
        pageColor = "#f6eedb",
        printColor = "#fbf7ee",
        mutedColor = "#e4d3af",
        borderColor = "#d2b98f",
        woodColor = "#a9784a",
        coverColor = "#5a3d26",
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
    const c = `pb-${uid}`
    const root = useRef<HTMLElement>(null)
    const [width, setWidth] = useState(1200)

    useEffect(() => {
        const el = root.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(() => setWidth(Math.round(el.getBoundingClientRect().width)))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const wide = width >= 900
    const bookW = wide ? PW * 2 : PW
    const k = Math.min(wide ? 0.9 : 1, (width - (wide ? 160 : 32)) / bookW)
    const visibleH = PH * Math.cos((TILT * Math.PI) / 180)

    const layers = useMemo(
        () => [
            { d: ridge(11, 200, 34, 1.3), fill: mutedColor, base: 60, h: 300, delay: 0 },
            { d: ridge(23, 186, 40, 1.7), fill: borderColor, base: 48, h: 300, delay: 1 },
            { d: ridge(37, 168, 34, 2.1), fill: woodColor, base: 30, h: 300, delay: 3 },
            { d: ridge(41, 104, 24, 1.5), fill: coverColor, base: 12, h: 300, delay: 4 },
            { d: ridge(53, 62, 14, 2.9), fill: edgeColor, base: 0, h: 300, delay: 5 },
        ],
        [mutedColor, borderColor, woodColor, coverColor, edgeColor]
    )
    const flies = useMemo(() => {
        const fr = rng(97)
        return Array.from({ length: Math.max(0, Math.min(24, fireflies)) }, () => ({
            x: (6 + fr() * 88).toFixed(1) + "%",
            y: (30 + fr() * 50).toFixed(1) + "%",
            dx: Math.round(-30 + fr() * 60) + "px",
            dy: Math.round(-40 + fr() * 50) + "px",
            d: (5 + fr() * 6).toFixed(1) + "s",
            delay: (-fr() * 6).toFixed(1) + "s",
        }))
    }, [fireflies])

    const OPEN = 0.5 // cover starts
    const RISE = 1.35 // first layer starts standing
    const stand = (i: number): CSSProperties => ({ animationDelay: `${RISE + i * 0.13}s` })

    const printEl = (img: Img | undefined, fallback: string, s: CSSProperties, cls = "") => (
        <div className={cls} style={{ position: "absolute", boxSizing: "border-box", padding: "6px 6px 18px", background: printColor, boxShadow: "0 3px 8px rgba(40, 24, 10, 0.28)", ...s }}>
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
        minHeight: 46,
        padding: "0 22px",
        borderRadius: 6,
        textDecoration: "none",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 15,
        background: dark ? sealColor : pageColor,
        color: dark ? sealText : textColor,
        boxShadow: dark ? `0 3px 0 ${edgeColor}, 0 8px 14px rgba(40, 24, 10, 0.25)` : `inset 0 0 0 1px ${borderColor}, 0 3px 0 ${borderColor}`,
    })

    const titleBlock = (onPage: boolean): ReactNode => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: onPage ? 18 : 16 }}>
            {eyebrow ? <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: mutedText }}>{eyebrow}</p> : null}
            <div style={{ display: "inline-block", maxWidth: "100%", filter: `drop-shadow(0 3px 0 ${borderColor}) drop-shadow(0 12px 16px rgba(40, 24, 10, 0.24))` }}>
                <div
                    style={{
                        padding: onPage ? "14px 26px 18px 22px" : "12px 22px 14px 18px",
                        background: printColor,
                        clipPath: "polygon(0 8%, 4% 0, 22% 5%, 41% 0, 63% 6%, 82% 1%, 100% 7%, 98% 48%, 100% 92%, 81% 100%, 59% 94%, 37% 100%, 17% 95%, 2% 100%, 0 62%)",
                    }}
                >
                    <h1 style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: onPage ? 52 : "clamp(38px, 11vw, 56px)", lineHeight: 1.02, color: coverColor, textShadow: `0 2px 0 ${edgeColor}`, ...nameFont }}>{name}</h1>
                </div>
            </div>
            <p style={{ margin: "4px 0 0", fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: onPage ? 28 : 24, lineHeight: 1.25, color: textColor, ...taglineFont }}>{tagline}</p>
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
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
            </div>
            {note ? <span style={{ fontFamily: HAND, fontSize: 21, color: woodColor, transform: "rotate(-3deg)", transformOrigin: "0 50%" }}>{note}</span> : null}
        </div>
    )

    const pageShade = (side: "left" | "right") =>
        side === "right" ? "linear-gradient(90deg, rgba(60,40,20,0.22) 0%, rgba(0,0,0,0) 12%)" : "linear-gradient(270deg, rgba(60,40,20,0.22) 0%, rgba(0,0,0,0) 12%)"
    const linen = `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, rgba(0,0,0,0) 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.07) 0 1px, rgba(0,0,0,0) 1px 4px), ${coverColor}`

    return (
        <section
            ref={root}
            aria-label={name}
            style={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                background: `radial-gradient(ellipse 55% 50% at 50% 42%, ${glowColor} 0%, rgba(0,0,0,0) 70%), ${tableColor}`,
                color: textColor,
                fontFamily: SANS,
                padding: wide ? "110px 0 64px" : "36px 0 40px",
                boxSizing: "border-box",
                ...font,
                ...props.style,
            }}
        >
            <style>{`
                .${c}-cover { transform-origin: 0 50%; transform-style: preserve-3d; transform: rotateY(-178deg); ${live ? `animation: ${c}-open 1.6s cubic-bezier(.55,.06,.25,1) ${OPEN}s both;` : ""} }
                @keyframes ${c}-open { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(-178deg); ${wide ? "" : "opacity: 0;"} } }
                .${c}-slide { ${live && wide ? `animation: ${c}-slide 1.6s cubic-bezier(.55,.06,.25,1) ${OPEN}s both;` : ""} }
                @keyframes ${c}-slide { 0% { transform: translateX(-${PW / 2}px); } 100% { transform: translateX(0); } }
                .${c}-shadow { ${live && wide ? `animation: ${c}-shadow 1.6s cubic-bezier(.55,.06,.25,1) ${OPEN}s both;` : ""} }
                @keyframes ${c}-shadow { 0% { clip-path: inset(0 0 0 50%); } 100% { clip-path: inset(0 0 0 0); } }
                .${c}-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .${c}-stand { position: absolute; left: 0; right: 0; transform-origin: 50% 100%; transform: rotateX(-${TILT}deg); ${live ? `animation: ${c}-rise 1.1s cubic-bezier(.2,.9,.25,1.15) both;` : ""} }
                @keyframes ${c}-rise { 0% { transform: rotateX(0deg); opacity: 0; } 20% { opacity: 1; } 100% { transform: rotateX(-${TILT}deg); opacity: 1; } }
                .${c}-cloud { ${live ? `animation: ${c}-float 12s ease-in-out infinite alternate;` : ""} }
                @keyframes ${c}-float { to { transform: translateX(26px); } }
                .${c}-fly { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: ${glowColor}; box-shadow: 0 0 8px 3px ${glowColor}; opacity: 0; ${live ? `animation: ${c}-drift var(--d) ease-in-out infinite alternate, ${c}-flicker 2.6s ease-in-out ${RISE + 0.8}s infinite;` : "opacity: .7;"} }
                @keyframes ${c}-drift { to { transform: translate(var(--dx), var(--dy)); } }
                @keyframes ${c}-flicker { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
                .${c}-key { transition: transform .15s ease, box-shadow .15s ease; }
                .${c}-key:hover { transform: translateY(-1px); }
                .${c}-key:active { transform: translateY(2px); }
                @media (prefers-reduced-motion: reduce) { .${c}-cover, .${c}-stand, .${c}-cloud, .${c}-fly { animation: none !important; } .${c}-fly { opacity: .7; } }
            `}</style>
            <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
                <filter id={`${c}-cut`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={7} />
                    <feDisplacementMap in="SourceGraphic" scale={4} />
                </filter>
                <filter id={`${c}-grain`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
                    <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.9 0" />
                </filter>
            </svg>

            {!wide ? <div style={{ position: "relative", zIndex: 2, padding: "0 20px 72px" }}>{titleBlock(false)}</div> : null}

            {/* the book on the table, seen from the front and a little above */}
            <div style={{ position: "relative", height: visibleH * k + 60 * k, display: "flex", justifyContent: "center" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", width: bookW, height: PH, marginLeft: -bookW / 2, transform: `scale(${k})`, transformOrigin: "50% 0", perspective: 2200, perspectiveOrigin: "50% -20%" }}>
                    <div className={`${c}-slide`} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
                    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${TILT}deg)`, transformOrigin: "50% 0" }}>
                        {/* shadow on the table */}
                        <div aria-hidden="true" className={`${c}-shadow`} style={{ position: "absolute", left: -20, right: -20, top: 10, bottom: -30, borderRadius: 18, background: "rgba(40, 24, 10, 0.32)", filter: "blur(24px)", transform: "translateZ(-2px)" }} />
                        {/* the back cover (visible under the pages as a deep-wood rim) */}
                        <div aria-hidden="true" style={{ position: "absolute", left: wide ? PW - 6 : -6, right: -12, top: -10, bottom: -14, borderRadius: 8, background: linen, transform: "translateZ(-1px)" }} />

                        {/* right page with the pop-up landscape */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: wide ? PW : 0,
                                width: PW,
                                borderRadius: wide ? "0 4px 4px 0" : 4,
                                background: `${pageShade("right")}, ${pageColor}`,
                                boxShadow: `2px 2px 0 ${mutedColor}, 4px 4px 0 ${borderColor}, 6px 6px 0 ${mutedColor}, 8px 8px 0 ${borderColor}`,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {/* ribbon */}
                            <div aria-hidden="true" style={{ position: "absolute", right: 54, top: -4, width: 22, height: 120, background: sealColor, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))", transform: "translateZ(1px)" }} />
                            {/* backdrop with the moon and clouds */}
                            <div aria-hidden="true" className={`${c}-stand`} style={{ bottom: "78%", height: 260, ...stand(-1) }}>
                                <div style={{ position: "absolute", right: "22%", top: 60, width: 74, height: 74, borderRadius: "50%", background: printColor, boxShadow: `0 0 0 6px rgba(255, 240, 210, 0.3), 0 0 50px 18px ${glowColor}` }} />
                                <svg className={`${c}-cloud`} viewBox="0 0 260 90" style={{ position: "absolute", left: "16%", top: 96, width: 150, height: 52, filter: "drop-shadow(0 4px 6px rgba(40, 24, 10, 0.18))" }}>
                                    <path d="M18 78 C 4 78 2 58 18 54 C 14 34 40 26 52 40 C 60 16 98 12 108 36 C 120 20 150 22 156 44 C 172 30 204 36 204 56 C 226 52 248 64 240 78 Z" fill={pageColor} />
                                </svg>
                            </div>
                            {layers.slice(0, 2).map((l, i) => (
                                <div key={i} aria-hidden="true" className={`${c}-stand`} style={{ bottom: `${l.base}%`, height: l.h, filter: "drop-shadow(0 -1px 0 rgba(255,226,170,0.4)) drop-shadow(0 -6px 10px rgba(40,24,10,0.22))", ...stand(l.delay) }}>
                                    <svg viewBox="0 0 520 300" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
                                        <path d={l.d} fill={l.fill} filter={`url(#${c}-cut)`} />
                                    </svg>
                                </div>
                            ))}
                            {layers.slice(2, 3).map((l, i) => (
                                <div key={i + 2} aria-hidden="true" className={`${c}-stand`} style={{ bottom: `${l.base}%`, height: l.h, filter: "drop-shadow(0 -1px 0 rgba(255,226,170,0.32)) drop-shadow(0 -6px 10px rgba(40,24,10,0.3))", ...stand(l.delay) }}>
                                    <svg viewBox="0 0 520 300" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
                                        <path d={l.d} fill={l.fill} filter={`url(#${c}-cut)`} />
                                    </svg>
                                </div>
                            ))}
                            {/* prints and an envelope standing between the hills */}
                            <div aria-hidden="true" className={`${c}-stand`} style={{ bottom: "24%", height: 200, ...stand(3.5) }}>
                                {printEl(photo1, "linear-gradient(180deg, #e2ae74 0%, #b8734a 52%, #5b3a2a 100%)", { left: "8%", bottom: 40, width: 104, height: 128, transform: "rotate(-7deg)" })}
                                {wide ? null : printEl(photo2, "linear-gradient(180deg, #cfd7d2 0%, #93a8a5 48%, #42585c 100%)", { left: "30%", bottom: 60, width: 88, height: 110, transform: "rotate(5deg)" })}
                                {showEnvelope ? (
                                    <div style={{ position: "absolute", left: "52%", bottom: 46, width: 124, height: 80, transform: "rotate(-5deg)", filter: "drop-shadow(0 4px 8px rgba(40, 24, 10, 0.28))" }}>
                                        <div style={{ position: "absolute", inset: 0, borderRadius: 2, background: pageColor }} />
                                        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 46, background: mutedColor, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
                                        <div style={{ position: "absolute", left: "50%", top: 32, width: 22, height: 22, marginLeft: -11, borderRadius: "50%", background: sealColor, boxShadow: `0 2px 0 ${edgeColor}` }} />
                                    </div>
                                ) : null}
                                {printEl(photo3, "linear-gradient(180deg, #e6d6aa 0%, #9c9b6b 50%, #3f4b30 100%)", { left: "76%", bottom: 30, width: 96, height: 120, transform: "rotate(8deg)" })}
                            </div>
                            {layers.slice(3).map((l, i) => (
                                <div key={i + 3} aria-hidden="true" className={`${c}-stand`} style={{ bottom: `${l.base}%`, height: l.h, filter: "drop-shadow(0 -1px 0 rgba(255,226,170,0.32)) drop-shadow(0 -6px 10px rgba(40,24,10,0.3))", ...stand(l.delay) }}>
                                    <svg viewBox="0 0 520 300" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
                                        <path d={l.d} fill={l.fill} filter={`url(#${c}-cut)`} />
                                    </svg>
                                </div>
                            ))}
                            {/* fireflies in front of the landscape */}
                            <div aria-hidden="true" className={`${c}-stand`} style={{ bottom: "6%", height: 420, pointerEvents: "none", ...stand(6) }}>
                                {flies.map((f, i) => (
                                    <span key={i} className={`${c}-fly`} style={{ left: f.x, top: f.y, ["--dx" as string]: f.dx, ["--dy" as string]: f.dy, ["--d" as string]: f.d, animationDelay: `${f.delay}, ${RISE + 0.8}s` }} />
                                ))}
                            </div>
                        </div>

                        {/* the cover: linen outside, the title page inside */}
                        <div className={`${c}-cover`} style={{ position: "absolute", top: -6, bottom: -6, left: wide ? PW : 0, width: PW + 6, zIndex: 3 }}>
                            <div className={`${c}-face`} style={{ borderRadius: "2px 8px 8px 2px", background: linen, boxShadow: `inset 10px 0 14px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)` }}>
                                <div style={{ position: "absolute", left: 40, right: 40, top: 40, bottom: 40, border: `1px solid rgba(246, 238, 219, 0.28)`, borderRadius: 4 }} />
                                <div style={{ position: "absolute", left: 0, right: 0, top: "38%", textAlign: "center", padding: "0 48px" }}>
                                    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, lineHeight: 1.05, color: "rgba(246, 238, 219, 0.9)", textShadow: "0 -1px 0 rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.12)", ...nameFont }}>{name}</div>
                                    {coverNote ? <div style={{ marginTop: 14, fontFamily: HAND, fontSize: 24, color: "rgba(243, 199, 126, 0.85)" }}>{coverNote}</div> : null}
                                </div>
                            </div>
                            <div
                                className={`${c}-face`}
                                style={{
                                    transform: "rotateY(180deg)",
                                    borderRadius: "4px 0 0 4px",
                                    background: `${pageShade("left")}, ${pageColor}`,
                                    boxShadow: `-2px 2px 0 ${mutedColor}, -4px 4px 0 ${borderColor}, -6px 6px 0 ${mutedColor}, -8px 8px 0 ${borderColor}`,
                                    padding: "52px 52px 40px 46px",
                                    boxSizing: "border-box",
                                }}
                            >
                                {wide ? titleBlock(true) : null}
                                {wide ? (
                                    <figure style={{ position: "absolute", right: 44, bottom: 52, width: 200, margin: 0, transform: "rotate(2deg)" }}>
                                        <div style={{ position: "relative", aspectRatio: "4 / 3", boxShadow: "0 4px 10px rgba(40, 24, 10, 0.28)" }}>
                                            {photo2?.src ? (
                                                <img src={photo2.src} srcSet={photo2.srcSet} alt={photo2.alt ?? ""} draggable={false} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #cfd7d2 0%, #93a8a5 48%, #42585c 100%)" }} />
                                            )}
                                            {(["0 0, 100% 0, 0 100%", "0 0, 100% 0, 100% 100%", "100% 0, 100% 100%, 0 100%", "0 0, 0 100%, 100% 100%"] as const).map((poly, i) => (
                                                <span
                                                    key={i}
                                                    aria-hidden="true"
                                                    style={{
                                                        position: "absolute",
                                                        width: 34,
                                                        height: 34,
                                                        [i === 0 || i === 3 ? "left" : "right"]: -7,
                                                        [i < 2 ? "top" : "bottom"]: -7,
                                                        background: woodColor,
                                                        clipPath: `polygon(${poly})`,
                                                        filter: "drop-shadow(1px 1.5px 1.2px rgba(40,24,10,0.4))",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        {photoCaption ? <figcaption style={{ marginTop: 14, fontFamily: HAND, fontSize: 20, color: mutedText }}>{photoCaption}</figcaption> : null}
                                    </figure>
                                ) : null}
                                {wide ? (
                                    <div style={{ position: "absolute", left: 46, bottom: 26, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: mutedText }}>i</div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            
            <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 11, pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.16 }}>
                <rect width="100%" height="100%" filter={`url(#${c}-grain)`} />
            </svg>
        </section>
    )
}

addPropertyControls(PopupBook, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "Wedding · Family · Portrait photography" },
    name: { type: ControlType.String, title: "Name", defaultValue: "[Studio Name]" },
    tagline: { type: ControlType.String, title: "Tagline", defaultValue: "Photographs, tucked in by hand." },
    coverNote: { type: ControlType.String, title: "Cover Note", defaultValue: "photographs & albums" },
    primaryLabel: { type: ControlType.String, title: "Button", defaultValue: "Book a session" },
    primaryLink: { type: ControlType.Link, title: "Button Link", defaultValue: "/book" },
    secondaryLabel: { type: ControlType.String, title: "Second Button", defaultValue: "See the albums" },
    secondaryLink: { type: ControlType.Link, title: "Second Link", defaultValue: "/albums" },
    note: { type: ControlType.String, title: "Note", defaultValue: "now booking spring 2027" },
    photo1: { type: ControlType.ResponsiveImage, title: "Print 1" },
    photo2: { type: ControlType.ResponsiveImage, title: "Page Photo", description: "Tucked into corners on the title page." },
    photoCaption: { type: ControlType.String, title: "Page Caption", defaultValue: "Tuscany, June" },
    photo3: { type: ControlType.ResponsiveImage, title: "Print 3" },
    showEnvelope: { type: ControlType.Boolean, title: "Envelope", defaultValue: true },
    fireflies: { type: ControlType.Number, title: "Fireflies", defaultValue: 12, min: 0, max: 24, step: 1 },
    animate: { type: ControlType.Boolean, title: "Animate", defaultValue: true, description: "The cover opens and the landscape stands up on load." },
    tableColor: { type: ControlType.Color, title: "Table", defaultValue: "#ede2c8" },
    glowColor: { type: ControlType.Color, title: "Glow", defaultValue: "#f3c77e" },
    pageColor: { type: ControlType.Color, title: "Page", defaultValue: "#f6eedb" },
    printColor: { type: ControlType.Color, title: "Print", defaultValue: "#fbf7ee" },
    mutedColor: { type: ControlType.Color, title: "Far Hill", defaultValue: "#e4d3af" },
    borderColor: { type: ControlType.Color, title: "Hill", defaultValue: "#d2b98f" },
    woodColor: { type: ControlType.Color, title: "Wood", defaultValue: "#a9784a" },
    coverColor: { type: ControlType.Color, title: "Cover", defaultValue: "#5a3d26" },
    edgeColor: { type: ControlType.Color, title: "Edge", defaultValue: "#3a2716" },
    sealColor: { type: ControlType.Color, title: "Seal", defaultValue: "#9e3b2b" },
    sealText: { type: ControlType.Color, title: "On Seal", defaultValue: "#fff8ec" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    mutedText: { type: ControlType.Color, title: "Muted Text", defaultValue: "#6a5642" },
    nameFont: { type: ControlType.Font, title: "Name Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1em" } },
    taglineFont: { type: ControlType.Font, title: "Tagline Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1.25em" } },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", displayFontSize: false, defaultValue: { variant: "Regular" } },
})
