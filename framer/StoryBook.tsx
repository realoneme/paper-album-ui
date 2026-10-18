// Paper Album UI · Story Book for Framer
// A thick storybook lies flat on the table and fills the banner; we look at it from its bottom edge. On load the
// cover swings open on the spine and, as the pages open, a paper landscape stands up across the spread like a pop-up
// fairy-tale book: far mountains, hills, a forest, and photographs slotted in between them. The title floats in the sky
// above. Static renders and reduced motion show the book already open.
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

interface Img {
    src: string
    srcSet?: string
    alt?: string
}

interface StoryBookProps {
    eyebrow: string
    name: string
    tagline: string
    coverNote: string
    primaryLabel: string
    primaryLink: string
    secondaryLabel: string
    secondaryLink: string
    note: string
    photo1?: Img
    photo2?: Img
    photo3?: Img
    photo4?: Img
    fireflies: number
    animate: boolean
    skyColor: string
    glowColor: string
    pageColor: string
    printColor: string
    farColor: string
    midColor: string
    woodColor: string
    coverColor: string
    edgeColor: string
    treeColor: string
    treeDark: string
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

// Design size of the open book (both pages) on its own plane: W wide, D deep (front edge to spine head).
const W = 1240
const D = 760
const TILT = 66 // how far the book lies back from facing us
const THICK = 50 // the page block at the fore-edge is thinner; at the spine it bulges (see hAt)
const BOARD = 9 // cover board thickness
const STRIPS = 26 // facets per half that make the curved page surface
const OPEN_AT = 0.6
const OPEN_FOR = 1.9

function rng(seed: number) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// Jagged paper mountains in a w × h box.
function peaks(seed: number, w: number, h: number, n: number, low: number) {
    const r = rng(seed)
    let d = `M0 ${h}`
    let x = 0
    const step = w / n
    d += ` L0 ${(h * (low + r() * 0.15)).toFixed(1)}`
    for (let i = 0; i < n; i++) {
        const peak = h * (0.04 + r() * 0.36)
        const mid = x + step * (0.35 + r() * 0.3)
        d += ` L${mid.toFixed(1)} ${peak.toFixed(1)} L${(x + step).toFixed(1)} ${(h * (low + r() * 0.2)).toFixed(1)}`
        x += step
    }
    return d + ` L${w} ${h} Z`
}
// Snow on the highest peaks: small caps following the same seed.
function snow(seed: number, w: number, h: number, n: number) {
    const r = rng(seed)
    r()
    let x = 0
    const step = w / n
    const caps: string[] = []
    for (let i = 0; i < n; i++) {
        const peak = h * (0.04 + r() * 0.36)
        const mid = x + step * (0.35 + r() * 0.3)
        r()
        if (peak < h * 0.22) {
            const s = h * 0.09
            caps.push(`M${(mid - s * 0.9).toFixed(1)} ${(peak + s).toFixed(1)} L${mid.toFixed(1)} ${peak.toFixed(1)} L${(mid + s * 0.9).toFixed(1)} ${(peak + s).toFixed(1)} L${(mid + s * 0.3).toFixed(1)} ${(peak + s * 0.7).toFixed(1)} L${(mid - s * 0.2).toFixed(1)} ${(peak + s * 1.05).toFixed(1)} Z`)
        }
        x += step
    }
    return caps.join(" ")
}
// Rolling hills in a w × h box.
function hills(seed: number, w: number, h: number, base: number, amp: number, freq: number) {
    const r = rng(seed)
    const p1 = r() * 6.28
    const p2 = r() * 6.28
    let d = `M0 ${h}`
    for (let x = 0; x <= w; x += 10) {
        const u = (x / w) * 6.2832 * freq
        const y = h - (base + amp * (0.62 * Math.sin(u + p1) + 0.38 * Math.sin(u * 2.3 + p2))) + (r() - 0.5) * 3
        d += ` L${x} ${y.toFixed(1)}`
    }
    return d + ` L${w} ${h} Z`
}

/**
 * Story Book
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 860
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function StoryBook(props: StoryBookProps) {
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
        photo1,
        photo2,
        photo3,
        photo4,
        fireflies = 14,
        animate = true,
        skyColor = "#ede2c8",
        glowColor = "#f3c77e",
        pageColor = "#f6eedb",
        printColor = "#fbf7ee",
        farColor = "#e4d3af",
        midColor = "#d2b98f",
        woodColor = "#a9784a",
        coverColor = "#5a3d26",
        edgeColor = "#3a2716",
        treeColor = "#5f7a45",
        treeDark = "#3f5a30",
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
    const c = `sb-${uid}`
    const root = useRef<HTMLElement>(null)
    const [width, setWidth] = useState(1200)

    useEffect(() => {
        const el = root.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(() => setWidth(Math.round(el.getBoundingClientRect().width)))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const narrow = width < 760
    // The book fills the banner; on a phone it bleeds off both sides so the middle of the landscape stays big.
    const k = narrow ? Math.max(0.56, (width * 1.55) / W) : Math.min(1.25, (width * 1.04) / W)
    const height = narrow ? Math.round(560 + 380 * k) : Math.round(Math.max(700, Math.min(940, width * 0.66)))

    const geo = useMemo(() => {
        const fr = rng(97)
        return {
            far: peaks(5, W, 330, 9, 0.62),
            farSnow: snow(5, W, 330, 9),
            mid: peaks(17, W, 270, 7, 0.55),
            hillsBack: hills(29, W, 260, 150, 36, 1.6),
            hillsFront: hills(41, W, 200, 96, 30, 2.3),
            ground: hills(53, W, 120, 56, 12, 3.2),
            flies: Array.from({ length: Math.max(0, Math.min(30, fireflies)) }, () => ({
                x: (6 + fr() * 88).toFixed(1) + "%",
                y: (10 + fr() * 70).toFixed(1) + "%",
                dx: Math.round(-40 + fr() * 80) + "px",
                dy: Math.round(-50 + fr() * 60) + "px",
                d: (5 + fr() * 6).toFixed(1) + "s",
                delay: (-fr() * 6).toFixed(1) + "s",
            })),
        }
    }, [fireflies])

    // Every standing piece: where it stands (distance from the front edge, % of D), how tall, and when it rises.
    const piece = (key: string, at: number, h: number, i: number, children: ReactNode, extra: CSSProperties = {}) => (
        <div
            key={key}
            aria-hidden="true"
            className={`${c}-stand`}
            style={{ bottom: `${at}%`, height: h, animationDelay: `${OPEN_AT + OPEN_FOR * 0.42 + i * 0.07}s`, ...extra }}
        >
            {children}
        </div>
    )
    const svgFill = (d: string, fill: string, h: number, shade = 0.28) => (
        <svg viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%", filter: `drop-shadow(0 -1px 0 rgba(255,226,170,0.45)) drop-shadow(0 -6px 10px rgba(40,24,10,${shade}))` }}>
            <path d={d} fill={fill} filter={`url(#${c}-cut)`} />
        </svg>
    )
    const pine = (x: number, s: number, fill: string, dark: string, key: string | number) => (
        <svg key={key} viewBox="0 0 60 120" style={{ position: "absolute", left: x, bottom: 0, width: 60 * s, height: 120 * s, overflow: "visible", filter: "drop-shadow(0 -4px 6px rgba(40,24,10,0.25))" }}>
            <rect x="27" y="96" width="6" height="24" fill={edgeColor} />
            <path d="M30 0 L52 40 L42 40 L58 70 L44 70 L60 100 L0 100 L16 70 L2 70 L18 40 L8 40 Z" fill={fill} />
            <path d="M30 0 L52 40 L42 40 L58 70 L44 70 L60 100 L30 100 Z" fill={dark} opacity="0.55" />
        </svg>
    )
    const roundTree = (x: number, s: number, fill: string, dark: string, key: string | number) => (
        <svg key={key} viewBox="0 0 80 110" style={{ position: "absolute", left: x, bottom: 0, width: 80 * s, height: 110 * s, overflow: "visible", filter: "drop-shadow(0 -4px 6px rgba(40,24,10,0.25))" }}>
            <rect x="36" y="64" width="8" height="46" fill={edgeColor} />
            <circle cx="40" cy="40" r="38" fill={fill} />
            <path d="M40 2 A38 38 0 0 1 40 78 Z" fill={dark} opacity="0.5" />
        </svg>
    )
    const print = (img: Img | undefined, fallback: string, s: CSSProperties) => (
        <div style={{ position: "absolute", bottom: 0, boxSizing: "border-box", padding: "9px 9px 30px", background: printColor, boxShadow: "0 -2px 10px rgba(40, 24, 10, 0.25)", ...s }}>
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
        padding: "0 24px",
        borderRadius: 6,
        textDecoration: "none",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 15,
        background: dark ? sealColor : pageColor,
        color: dark ? sealText : textColor,
        boxShadow: dark ? `0 3px 0 ${edgeColor}, 0 10px 18px rgba(40, 24, 10, 0.28)` : `inset 0 0 0 1px ${midColor}, 0 3px 0 ${midColor}, 0 10px 18px rgba(40, 24, 10, 0.18)`,
    })
    const linen = `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, rgba(0,0,0,0) 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 1px, rgba(0,0,0,0) 1px 4px), ${coverColor}`
        const half = W / 2
    // Height of the page surface above the board, from the spine (u = 0) to the fore-edge (u = 1): the pages of a
    // thick open book bulge near the spine and slope down to the outside edge, with a small dip in the gutter.
    const hAt = (u: number) => THICK * (0.34 + 0.95 * Math.pow(Math.cos((Math.min(1, Math.max(0, u)) * Math.PI) / 2), 1.25)) - THICK * 0.22 * Math.exp(-Math.pow(u / 0.04, 2))
    const strips = (side: "left" | "right") => {
        const out: ReactNode[] = []
        const dx = half / STRIPS
        for (let i = 0; i < STRIPS; i++) {
            const u0 = i / STRIPS
            const u1 = (i + 1) / STRIPS
            const z0 = hAt(u0) - THICK
            const z1 = hAt(u1) - THICK
            // right: from the spine outwards; left: from the fore-edge to the spine
            const [zl, zr] = side === "right" ? [z0, z1] : [z1, z0]
            const ang = (Math.atan2(zr - zl, dx) * 180) / Math.PI
            const len = Math.hypot(dx, zr - zl) + 0.8
            const left = side === "right" ? half + i * dx : half - (i + 1) * dx
            const slope = (zr - zl) / dx
            const shade = side === "right" ? Math.max(0, -slope) * 0.55 : Math.max(0, slope) * 0.25
            const gutter = u0 < 0.06 ? 0.16 : 0
            out.push(
                <div
                    key={`${side}${i}`}
                    style={{
                        position: "absolute",
                        left,
                        top: 0,
                        bottom: 0,
                        width: len,
                        transformOrigin: "0 50%",
                        transform: `translateZ(${zl.toFixed(2)}px) rotateY(${(-ang).toFixed(3)}deg)`,
                        background: `linear-gradient(180deg, rgba(60,40,20,0.07), rgba(0,0,0,0) 45%), linear-gradient(rgba(60,40,20,${(shade + gutter).toFixed(3)}), rgba(60,40,20,${(shade + gutter).toFixed(3)})), ${pageColor}`,
                        backfaceVisibility: "hidden",
                    }}
                />
            )
        }
        return out
    }
    const frontEdge = (side: "left" | "right") => {
        const top = Math.ceil(hAt(0.06)) + 2
        const H = top + BOARD
        const n = 40
        const pts = Array.from({ length: n + 1 }, (_, i) => {
            const u = i / n
            const x = side === "right" ? u * half : half - u * half
            return { x, h: hAt(u) }
        })
        const surf = (f: number) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${(top - p.h * f).toFixed(1)}`).join(" ")
        const body = `${surf(1)} L${side === "right" ? half : 0} ${top} L${side === "right" ? 0 : half} ${top} Z`
        const lines = Array.from({ length: 14 }, (_, i) => surf(0.1 + (i / 14) * 0.88))
        return (
            <svg
                viewBox={`0 0 ${half} ${H}`}
                preserveAspectRatio="none"
                style={{ position: "absolute", left: side === "right" ? half : 0, width: half, bottom: 0, height: H, overflow: "visible", transformOrigin: "50% 100%", transform: `translateZ(${top - THICK}px) rotateX(-90deg)` }}
            >
                <path d={body} fill={pageColor} />
                {lines.map((d, i) => (
                    <path key={i} d={d} fill="none" stroke={i % 3 === 0 ? woodColor : midColor} strokeOpacity={i % 3 === 0 ? 0.5 : 0.9} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
                <rect x="0" y={top} width={half} height={BOARD} fill={coverColor} />
                <rect x="0" y={top} width={half} height="2" fill="rgba(0,0,0,0.25)" />
            </svg>
        )
    }

    return (
        <section
            ref={root}
            aria-label={name}
            style={{
                position: "relative",
                width: "100%",
                height,
                overflow: "hidden",
                background: `radial-gradient(ellipse 60% 55% at 62% 30%, ${glowColor} 0%, rgba(0,0,0,0) 70%), linear-gradient(180deg, ${skyColor} 0%, ${skyColor} 100%)`,
                color: textColor,
                fontFamily: SANS,
                ...font,
                ...props.style,
            }}
        >
            <style>{`
                .${c}-cover { transform: rotateY(0deg); ${live ? `animation: ${c}-open ${OPEN_FOR}s cubic-bezier(.5,.05,.25,1) ${OPEN_AT}s both;` : ""} }
                @keyframes ${c}-open { 0% { transform: rotateY(180deg); } 100% { transform: rotateY(0deg); } }
                .${c}-slide { ${live ? `animation: ${c}-slide ${OPEN_FOR}s cubic-bezier(.5,.05,.25,1) ${OPEN_AT}s both;` : ""} }
                @keyframes ${c}-slide { 0% { transform: translateX(-${half / 2}px); } 100% { transform: translateX(0); } }
                .${c}-left { ${live ? `animation: ${c}-left ${OPEN_FOR}s steps(1, end) ${OPEN_AT}s both;` : ""} }
                @keyframes ${c}-left { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
                .${c}-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .${c}-stand { position: absolute; left: 0; right: 0; transform-origin: 50% 100%; transform: rotateX(-${TILT}deg); ${live ? `animation: ${c}-rise ${OPEN_FOR * 0.9}s cubic-bezier(.45,.1,.25,1.08) both;` : ""} }
                @keyframes ${c}-rise { 0% { transform: rotateX(0deg); opacity: 0; } 18% { opacity: 1; } 100% { transform: rotateX(-${TILT}deg); opacity: 1; } }
                .${c}-cloud { ${live ? `animation: ${c}-float 16s ease-in-out infinite alternate;` : ""} }
                @keyframes ${c}-float { to { transform: translateX(46px); } }
                .${c}-title { ${live ? `animation: ${c}-in 1s cubic-bezier(.2,.8,.2,1) ${OPEN_AT + OPEN_FOR * 0.7}s both;` : ""} }
                @keyframes ${c}-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
                .${c}-fly { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: ${glowColor}; box-shadow: 0 0 10px 3px ${glowColor}; opacity: .7; ${live ? `animation: ${c}-drift var(--d) ease-in-out infinite alternate, ${c}-flicker 2.6s ease-in-out infinite;` : ""} }
                @keyframes ${c}-drift { to { transform: translate(var(--dx), var(--dy)); } }
                @keyframes ${c}-flicker { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
                .${c}-key { transition: transform .15s ease, box-shadow .15s ease; }
                .${c}-key:hover { transform: translateY(-1px); }
                .${c}-key:active { transform: translateY(2px); }
                @media (prefers-reduced-motion: reduce) { .${c}-cover, .${c}-slide, .${c}-left, .${c}-stand, .${c}-cloud, .${c}-title, .${c}-fly { animation: none !important; } }
            `}</style>
            <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
                <filter id={`${c}-cut`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={7} />
                    <feDisplacementMap in="SourceGraphic" scale={5} />
                </filter>
                <filter id={`${c}-grain`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
                    <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.9 0" />
                </filter>
            </svg>

            {/* sky: moon and clouds behind the book */}
            <div aria-hidden="true" style={{ position: "absolute", right: "18%", top: "10%", width: 110, height: 110, borderRadius: "50%", background: printColor, boxShadow: `0 0 0 10px rgba(255, 240, 210, 0.3), 0 0 90px 34px ${glowColor}` }} />
            <svg aria-hidden="true" className={`${c}-cloud`} viewBox="0 0 260 90" style={{ position: "absolute", left: "8%", top: "16%", width: 230, height: 80, filter: "drop-shadow(0 6px 8px rgba(40, 24, 10, 0.16))" }}>
                <path d="M18 78 C 4 78 2 58 18 54 C 14 34 40 26 52 40 C 60 16 98 12 108 36 C 120 20 150 22 156 44 C 172 30 204 36 204 56 C 226 52 248 64 240 78 Z" fill={pageColor} />
            </svg>
            <svg aria-hidden="true" className={`${c}-cloud`} viewBox="0 0 200 70" style={{ position: "absolute", right: "6%", top: "28%", width: 170, height: 60, animationDuration: "20s", filter: "drop-shadow(0 6px 8px rgba(40, 24, 10, 0.16))" }}>
                <path d="M14 62 C 2 62 2 46 14 44 C 12 28 34 22 44 34 C 52 14 84 12 92 32 C 104 20 128 24 132 42 C 150 36 176 44 172 62 Z" fill={pageColor} />
            </svg>

            {/* the book on the table, seen from its bottom edge */}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: narrow ? 30 : 70, width: W, height: D, marginLeft: -W / 2, transform: `scale(${k})`, transformOrigin: "50% 100%", perspective: 1500, perspectiveOrigin: "50% -10%" }}>
                <div className={`${c}-slide`} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
                    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${TILT}deg)`, transformOrigin: "50% 100%" }}>
                        {/* table shadows */}
                        <div className={`${c}-left`} style={{ position: "absolute", left: -30, width: half + 30, top: -20, bottom: -40, borderRadius: "24px 0 0 24px", background: "rgba(40, 24, 10, 0.35)", filter: "blur(30px)", transform: `translateZ(-${THICK + BOARD + 2}px)` }} />
                        <div style={{ position: "absolute", left: half, right: -30, top: -20, bottom: -40, borderRadius: "0 24px 24px 0", background: "rgba(40, 24, 10, 0.35)", filter: "blur(30px)", transform: `translateZ(-${THICK + BOARD + 2}px)` }} />
                        {/* right half: back board, the curved page block, its front edge and the ribbon */}
                        <div style={{ position: "absolute", left: half, right: -8, top: -8, bottom: -6, borderRadius: "0 10px 10px 0", background: linen, transform: `translateZ(-${THICK}px)` }} />
                        {strips("right")}
                        {frontEdge("right")}
                        <div style={{ position: "absolute", left: half + 150, bottom: -2, width: 26, height: THICK + 54, transformOrigin: "50% 100%", transform: `translateZ(${hAt(150 / half) - THICK}px) rotateX(-90deg)`, background: sealColor, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 90%, 0 100%)" }} />
                        {/* left half: the front cover and the other half of the pages, which swing over on the spine */}
                        <div className={`${c}-cover`} style={{ position: "absolute", left: 0, width: half, top: 0, bottom: 0, transformOrigin: "100% 50%", transformStyle: "preserve-3d" }}>
                            <div style={{ position: "absolute", left: -8, right: 0, top: -8, bottom: -6, borderRadius: "10px 0 0 10px", background: linen, transform: `translateZ(-${THICK}px)` }} />
                            {/* the outside of the cover, facing the table when open and facing us when closed */}
                            <div className={`${c}-face`} style={{ left: -10, top: -10, bottom: -12, right: 0, borderRadius: "10px 2px 2px 10px", background: linen, transform: `translateZ(-${THICK + 1}px) rotateY(180deg)`, boxShadow: "inset -14px 0 18px -12px rgba(0,0,0,0.55)" }}>
                                <div style={{ position: "absolute", left: 48, right: 48, top: 48, bottom: 48, border: "1.5px solid rgba(246, 238, 219, 0.28)", borderRadius: 6 }} />
                                <div style={{ position: "absolute", left: 0, right: 0, top: "40%", textAlign: "center", padding: "0 60px" }}>
                                    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 64, lineHeight: 1.05, color: "rgba(246, 238, 219, 0.9)", textShadow: "0 -1px 0 rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.12)", ...nameFont }}>{name}</div>
                                    {coverNote ? <div style={{ marginTop: 18, fontFamily: HAND, fontSize: 34, color: "rgba(243, 199, 126, 0.85)" }}>{coverNote}</div> : null}
                                </div>
                            </div>
                            {strips("left")}
                            {frontEdge("left")}
                        </div>

                        {/* the pop-up landscape, standing across the spread */}
                        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(-${Math.round(THICK * 0.28)}px)` }}>
                            {piece("far", 86, 330, 0, (
                                <svg viewBox={`0 0 ${W} 330`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%", filter: "drop-shadow(0 -1px 0 rgba(255,226,170,0.45)) drop-shadow(0 -6px 10px rgba(40,24,10,0.2))" }}>
                                    <path d={geo.far} fill={farColor} filter={`url(#${c}-cut)`} />
                                    <path d={geo.farSnow} fill={printColor} />
                                </svg>
                            ), { left: "2%", right: "2%" })}
                            {piece("mid", 72, 270, 1, svgFill(geo.mid, midColor, 270, 0.24), { left: "4%", right: "4%" })}
                            {piece("hillsBack", 60, 260, 2, svgFill(geo.hillsBack, woodColor, 260, 0.28), { left: "3%", right: "3%" })}
                            {piece("forest", 52, 200, 3, (
                                <div style={{ position: "absolute", inset: 0 }}>
                                    {[40, 120, 190, 300, 820, 900, 980, 1080, 1150].map((x, i) =>
                                        i % 3 === 1 ? roundTree(x, 1.1 + (i % 2) * 0.2, treeColor, treeDark, i) : pine(x, 1.25 + (i % 3) * 0.25, treeColor, treeDark, i)
                                    )}
                                </div>
                            ))}
                            {piece("prints", 40, 260, 4, (
                                <div style={{ position: "absolute", inset: 0 }}>
                                    {print(photo1, "linear-gradient(180deg, #e2ae74 0%, #b8734a 52%, #5b3a2a 100%)", { left: 250, width: 170, height: 214, transform: "rotate(-6deg)" })}
                                    {print(photo2, "linear-gradient(180deg, #cfd7d2 0%, #93a8a5 48%, #42585c 100%)", { left: 470, width: 150, height: 188, transform: "rotate(4deg)" })}
                                    {print(photo3, "linear-gradient(180deg, #e6d6aa 0%, #9c9b6b 50%, #3f4b30 100%)", { left: 650, width: 160, height: 200, transform: "rotate(-3deg)" })}
                                    {print(photo4, "linear-gradient(180deg, #b9a88a 0%, #7e6a52 50%, #3b2f25 100%)", { left: 850, width: 140, height: 176, transform: "rotate(7deg)" })}
                                </div>
                            ))}
                            {piece("hillsFront", 30, 200, 5, svgFill(geo.hillsFront, coverColor, 200, 0.32), { left: "1%", right: "1%" })}
                            {piece("trees", 22, 170, 6, (
                                <div style={{ position: "absolute", inset: 0 }}>
                                    {[10, 90, 1060, 1140].map((x, i) => (i % 2 ? roundTree(x, 1.0, treeDark, edgeColor, i) : pine(x, 1.2, treeDark, edgeColor, i)))}
                                </div>
                            ))}
                            {piece("ground", 10, 120, 7, svgFill(geo.ground, edgeColor, 120, 0.3), { left: "0%", right: "0%" })}
                            {piece("flies", 18, 420, 8, (
                                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                                    {geo.flies.map((f, i) => (
                                        <span key={i} className={`${c}-fly`} style={{ left: f.x, top: f.y, ["--dx" as string]: f.dx, ["--dy" as string]: f.dy, ["--d" as string]: f.d, animationDelay: `${f.delay}, ${f.delay}` }} />
                                    ))}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* the title, floating in the sky */}
            <div className={`${c}-title`} style={{ position: "relative", zIndex: 20, maxWidth: 1200, margin: "0 auto", padding: narrow ? "36px 20px 0" : "48px 40px 0", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: narrow ? "flex-start" : "center", textAlign: narrow ? "left" : "center", gap: 16 }}>
                {eyebrow ? <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: mutedText }}>{eyebrow}</p> : null}
                <div style={{ display: "inline-block", maxWidth: "100%", filter: `drop-shadow(0 3px 0 ${midColor}) drop-shadow(0 16px 22px rgba(40, 24, 10, 0.28))` }}>
                    <div style={{ padding: "14px 30px 18px 26px", background: printColor, clipPath: "polygon(0 8%, 4% 0, 22% 5%, 41% 0, 63% 6%, 82% 1%, 100% 7%, 98% 48%, 100% 92%, 81% 100%, 59% 94%, 37% 100%, 17% 95%, 2% 100%, 0 62%)" }}>
                        <h1 style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: narrow ? "clamp(38px, 11vw, 56px)" : "clamp(52px, 6vw, 84px)", lineHeight: 1.02, color: coverColor, textShadow: `0 3px 0 ${edgeColor}`, ...nameFont }}>{name}</h1>
                    </div>
                </div>
                <p style={{ margin: "6px 0 0", fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: narrow ? 24 : 30, lineHeight: 1.25, color: textColor, ...taglineFont }}>{tagline}</p>
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: narrow ? "flex-start" : "center" }}>
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
                    {note ? <span style={{ fontFamily: HAND, fontSize: 22, color: woodColor, transform: "rotate(-3deg)", marginLeft: 4 }}>{note}</span> : null}
                </div>
            </div>

            <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 30, pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.16 }}>
                <rect width="100%" height="100%" filter={`url(#${c}-grain)`} />
            </svg>
        </section>
    )
}

addPropertyControls(StoryBook, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "Wedding · Family · Portrait photography" },
    name: { type: ControlType.String, title: "Name", defaultValue: "[Studio Name]" },
    tagline: { type: ControlType.String, title: "Tagline", defaultValue: "Photographs, tucked in by hand." },
    coverNote: { type: ControlType.String, title: "Cover Note", defaultValue: "photographs & albums" },
    primaryLabel: { type: ControlType.String, title: "Button", defaultValue: "Book a session" },
    primaryLink: { type: ControlType.Link, title: "Button Link", defaultValue: "/book" },
    secondaryLabel: { type: ControlType.String, title: "Second Button", defaultValue: "See the albums" },
    secondaryLink: { type: ControlType.Link, title: "Second Link", defaultValue: "/albums" },
    note: { type: ControlType.String, title: "Note", defaultValue: "now booking spring 2027" },
    photo1: { type: ControlType.ResponsiveImage, title: "Photo 1" },
    photo2: { type: ControlType.ResponsiveImage, title: "Photo 2" },
    photo3: { type: ControlType.ResponsiveImage, title: "Photo 3" },
    photo4: { type: ControlType.ResponsiveImage, title: "Photo 4" },
    fireflies: { type: ControlType.Number, title: "Fireflies", defaultValue: 14, min: 0, max: 30, step: 1 },
    animate: { type: ControlType.Boolean, title: "Animate", defaultValue: true, description: "The cover opens and the landscape stands up on load." },
    skyColor: { type: ControlType.Color, title: "Sky", defaultValue: "#ede2c8" },
    glowColor: { type: ControlType.Color, title: "Glow", defaultValue: "#f3c77e" },
    pageColor: { type: ControlType.Color, title: "Page", defaultValue: "#f6eedb" },
    printColor: { type: ControlType.Color, title: "Print", defaultValue: "#fbf7ee" },
    farColor: { type: ControlType.Color, title: "Far Mountains", defaultValue: "#e4d3af" },
    midColor: { type: ControlType.Color, title: "Mountains", defaultValue: "#d2b98f" },
    woodColor: { type: ControlType.Color, title: "Hills", defaultValue: "#a9784a" },
    coverColor: { type: ControlType.Color, title: "Cover", defaultValue: "#5a3d26" },
    edgeColor: { type: ControlType.Color, title: "Edge", defaultValue: "#3a2716" },
    treeColor: { type: ControlType.Color, title: "Trees", defaultValue: "#5f7a45" },
    treeDark: { type: ControlType.Color, title: "Trees Dark", defaultValue: "#3f5a30" },
    sealColor: { type: ControlType.Color, title: "Seal", defaultValue: "#9e3b2b" },
    sealText: { type: ControlType.Color, title: "On Seal", defaultValue: "#fff8ec" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    mutedText: { type: ControlType.Color, title: "Muted Text", defaultValue: "#6a5642" },
    nameFont: { type: ControlType.Font, title: "Name Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1em" } },
    taglineFont: { type: ControlType.Font, title: "Tagline Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1.25em" } },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", displayFontSize: false, defaultValue: { variant: "Regular" } },
})
