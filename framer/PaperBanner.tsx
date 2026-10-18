// Paper Album UI · Paper Banner for Framer
// A full-screen paper-cut landscape for the top of a page. On load the layers rise one after another, from the far
// mountains to the dark ground in front; then the photographs float up from below and settle between the hills, where
// they keep bobbing gently. The studio name sits on a torn paper label in the sky. Reduced motion: everything in place.
import { useId, useMemo, type CSSProperties, type ReactNode } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

interface Img {
    src: string
    srcSet?: string
    alt?: string
}

interface PaperBannerProps {
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
    photo4?: Img
    caption1: string
    caption2: string
    caption3: string
    caption4: string
    fullScreen: boolean
    offset: number
    height: number
    fireflies: number
    animate: boolean
    skyColor: string
    glowColor: string
    paperColor: string
    printColor: string
    farColor: string
    midColor: string
    woodColor: string
    deepColor: string
    edgeColor: string
    sealColor: string
    sealText: string
    textColor: string
    mutedText: string
    inkColor: string
    nameFont: CSSProperties
    taglineFont: CSSProperties
    font: CSSProperties
    style?: CSSProperties
}

const SERIF = '"Fraunces", "Iowan Old Style", Georgia, serif'
const SANS = '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif'
const HAND = '"Caveat", "Bradley Hand", cursive'
const VB = 1600 // viewBox width of every layer

function rng(seed: number) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
// Two big, gentle mountains far away, one behind the other: broad rounded shoulders, a soft summit and a small
// cap of snow, with a little scissor wobble on the outline.
function bigMountains(h: number) {
    const r = rng(311)
    const peaks = [
        { x: VB * 0.5, y: h * 0.16, w: VB * 0.7 },
        { x: VB * 0.88, y: h * 0.32, w: VB * 0.56 },
    ]
    // a bell: flat-ish near the top, long gentle slopes
    const bell = (t: number) => 1 - Math.exp(-Math.pow(t / 0.6, 2) * 2.4)
    const height = (x: number) => {
        let best = h
        for (const p of peaks) {
            const t = Math.abs(x - p.x) / p.w
            best = Math.min(best, p.y + (h - p.y) * bell(t))
        }
        return best
    }
    let d = `M0 ${h}`
    const top: [number, number][] = []
    for (let x = 0; x <= VB; x += 10) {
        const y = height(x) + (r() - 0.5) * 4
        top.push([x, y])
        d += ` L${x} ${y.toFixed(1)}`
    }
    d += ` L${VB} ${h} Z`
    const snow = peaks
        .map((p, i) => {
            const line = top.filter(([x]) => Math.abs(x - p.x) < p.w * 0.17)
            if (!line.length) return ""
            const down = line
                .slice()
                .reverse()
                .map(([x, y], k) => {
                    const edge = 1 - Math.abs(x - p.x) / (p.w * 0.17)
                    const depth = h * (0.05 + 0.025 * Math.sin(k * 1.3 + i)) * Math.max(0.15, edge)
                    return `L${x} ${(y + Math.max(3, depth)).toFixed(1)}`
                })
                .join(" ")
            return `M${line[0][0]} ${line[0][1].toFixed(1)} ` + line.map(([x, y]) => `L${x} ${y.toFixed(1)}`).join(" ") + " " + down + " Z"
        })
        .join(" ")
    return { d, snow }
}
// A hand-cut ridge: two sine swells and a little scissor wobble.
function ridge(seed: number, h: number, base: number, amp: number, freq: number) {
    const r = rng(seed)
    const p1 = r() * 6.28
    const p2 = r() * 6.28
    let d = `M0 ${h}`
    for (let x = 0; x <= VB; x += 16) {
        const u = (x / VB) * 6.2832 * freq
        const y = h - (base + amp * (0.62 * Math.sin(u + p1) + 0.38 * Math.sin(u * 2.3 + p2))) + (r() - 0.5) * 5
        d += ` L${x} ${y.toFixed(1)}`
    }
    return d + ` L${VB} ${h} Z`
}

/**
 * Paper Banner
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 860
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function PaperBanner(props: PaperBannerProps) {
    const {
        eyebrow = "Wedding · Family · Portrait photography",
        name = "[Studio Name]",
        tagline = "Photographs, tucked in by hand.",
        primaryLabel = "Book a session",
        primaryLink = "/book",
        secondaryLabel = "See the albums",
        secondaryLink = "/albums",
        note = "replies within 2 days",
        photo1,
        photo2,
        photo3,
        photo4,
        caption1 = "her mother, first",
        caption2 = "Sunday picnic",
        caption3 = "barefoot by eight",
        caption4 = "window light",
        fullScreen = true,
        offset = 64,
        height = 860,
        fireflies = 16,
        animate = true,
        skyColor = "#ede2c8",
        glowColor = "#f3c77e",
        paperColor = "#f6eedb",
        printColor = "#fbf7ee",
        farColor = "#e4d3af",
        midColor = "#d2b98f",
        woodColor = "#a9784a",
        deepColor = "#5a3d26",
        edgeColor = "#3a2716",
        sealColor = "#9e3b2b",
        sealText = "#fff8ec",
        textColor = "#2a1f16",
        mutedText = "#6a5642",
        inkColor = "#4a3726",
        nameFont,
        taglineFont,
        font,
    } = props
    const isStatic = useIsStaticRenderer()
    const live = animate && !isStatic
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const c = `pbn-${uid}`

    const geo = useMemo(() => {
        const fr = rng(97)
        return {
            big: bigMountains(600),
            r1: ridge(13, 420, 300, 40, 1.2),
            r2: ridge(19, 380, 250, 44, 1.7),
            hills: ridge(29, 360, 220, 46, 1.5),
            front: ridge(41, 300, 150, 40, 2.1),
            ground: ridge(53, 200, 92, 22, 3.1),
            flies: Array.from({ length: Math.max(0, Math.min(30, fireflies)) }, () => ({
                x: (5 + fr() * 90).toFixed(1) + "%",
                y: (48 + fr() * 42).toFixed(1) + "%",
                dx: Math.round(-40 + fr() * 80) + "px",
                dy: Math.round(-60 + fr() * 60) + "px",
                d: (5 + fr() * 6).toFixed(1) + "s",
                delay: (-fr() * 6).toFixed(1) + "s",
            })),
        }
    }, [fireflies])

    // Each layer rises from below, back to front; then the photographs float up.
    const RISE = 0.35
    const STEP = 0.32
    // order, front to back: ground, deep wood, hills, two ranges, the far mountains
    const ORDER = { ground: 0, deep: 1, hills: 2, r2: 3, r1: 4, far: 5 }
    const PHOTOS_AT = RISE + STEP * 5 + 0.6
    const layer = (i: number, h: string, children: ReactNode, z: number, extra: CSSProperties = {}) => (
        <div
            aria-hidden="true"
            className={`${c}-layer`}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, zIndex: z, animationDelay: `${RISE + i * STEP}s`, ...extra }}
        >
            {children}
        </div>
    )
    const art = (d: string, fill: string, h: number, shadow: number, snow?: string) => (
        <svg viewBox={`0 0 ${VB} ${h}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%", overflow: "visible", filter: `drop-shadow(0 -2px 0 rgba(255, 226, 170, 0.4)) drop-shadow(0 -10px 16px rgba(40, 24, 10, ${shadow}))` }}>
            <g filter={`url(#${c}-cut)`}>
                <path d={d} fill={fill} />
                {snow ? <path d={snow} fill={printColor} /> : null}
            </g>
        </svg>
    )
    const photos = [
        { img: photo1, cap: caption1, fb: "linear-gradient(180deg, #e2ae74 0%, #b8734a 52%, #5b3a2a 100%)", left: "9%", bottom: "14%", w: "clamp(130px, 15vw, 230px)", rot: -7, cls: "" },
        { img: photo2, cap: caption2, fb: "linear-gradient(180deg, #cfd7d2 0%, #93a8a5 48%, #42585c 100%)", left: "31%", bottom: "17%", w: "clamp(120px, 13vw, 200px)", rot: 4, cls: `${c}-wide` },
        { img: photo3, cap: caption3, fb: "linear-gradient(180deg, #e6d6aa 0%, #9c9b6b 50%, #3f4b30 100%)", left: "55%", bottom: "15%", w: "clamp(130px, 15vw, 230px)", rot: -3, cls: "" },
        { img: photo4, cap: caption4, fb: "linear-gradient(180deg, #b9a88a 0%, #7e6a52 50%, #3b2f25 100%)", left: "77%", bottom: "18%", w: "clamp(120px, 13vw, 200px)", rot: 6, cls: `${c}-wide` },
    ]
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
        background: dark ? sealColor : paperColor,
        color: dark ? sealText : textColor,
        boxShadow: dark ? `0 3px 0 ${edgeColor}, 0 10px 18px rgba(40, 24, 10, 0.25)` : `inset 0 0 0 1px ${midColor}, 0 3px 0 ${midColor}`,
    })

    return (
        <section
            aria-label={name}
            style={{
                position: "relative",
                width: "100%",
                height: fullScreen ? `calc(100svh - ${offset}px)` : height,
                minHeight: 620,
                maxHeight: fullScreen ? 1100 : undefined,
                overflow: "hidden",
                perspective: 1300,
                perspectiveOrigin: "50% 20%",
                background: `radial-gradient(ellipse 45% 50% at 72% 26%, ${glowColor} 0%, rgba(0,0,0,0) 72%), ${skyColor}`,
                color: textColor,
                fontFamily: SANS,
                ...font,
                ...props.style,
            }}
        >
            <style>{`
                .${c}-layer, .${c}-far { transform-origin: 50% 100%; ${live ? `animation: ${c}-stand 1.25s cubic-bezier(.3,.7,.4,1) both;` : ""} }
                @keyframes ${c}-stand { 0% { transform: rotateX(88deg); opacity: 0; } 12% { opacity: 1; } 68% { transform: rotateX(-7deg); } 84% { transform: rotateX(3deg); } 100% { transform: rotateX(0deg); opacity: 1; } }
                .${c}-sky { ${live ? `animation: ${c}-fade 1.6s ease-out both;` : ""} }
                @keyframes ${c}-fade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
                .${c}-cloud { ${live ? `animation: ${c}-float 16s ease-in-out infinite alternate;` : ""} }
                @keyframes ${c}-float { to { transform: translateX(46px); } }
                .${c}-up { ${live ? `animation: ${c}-up 1.3s cubic-bezier(.18,.9,.3,1.12) both;` : ""} }
                @keyframes ${c}-up { 0% { transform: translateY(var(--from)) rotate(var(--r0)); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateY(0) rotate(var(--r)); opacity: 1; } }
                .${c}-bob { transform: rotate(var(--r)); ${live ? `animation: ${c}-bob var(--bd) ease-in-out infinite alternate;` : ""} }
                @keyframes ${c}-bob { from { transform: translateY(0) rotate(var(--r)); } to { transform: translateY(-9px) rotate(calc(var(--r) + 1.2deg)); } }
                .${c}-title { ${live ? `animation: ${c}-fade 1.1s cubic-bezier(.2,.8,.2,1) ${PHOTOS_AT + 0.4}s both;` : ""} }
                .${c}-fly { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: ${glowColor}; box-shadow: 0 0 10px 3px ${glowColor}; opacity: .7; ${live ? `animation: ${c}-drift var(--d) ease-in-out infinite alternate, ${c}-flicker 2.6s ease-in-out infinite;` : ""} }
                @keyframes ${c}-drift { to { transform: translate(var(--dx), var(--dy)); } }
                @keyframes ${c}-flicker { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
                .${c}-key { transition: transform .15s ease, box-shadow .15s ease; }
                .${c}-key:hover { transform: translateY(-1px); }
                .${c}-key:active { transform: translateY(2px); }
                @media (max-width: 809px) { .${c}-wide { display: none; } .${c}-p0 { left: 6% !important; } .${c}-p2 { left: 52% !important; } .${c}-name { font-size: clamp(40px, 11vw, 60px) !important; } }
                @media (prefers-reduced-motion: reduce) { .${c}-layer, .${c}-far, .${c}-sky, .${c}-cloud, .${c}-up, .${c}-bob, .${c}-title, .${c}-fly { animation: none !important; } }
            `}</style>
            <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
                <filter id={`${c}-cut`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={7} />
                    <feDisplacementMap in="SourceGraphic" scale={8} />
                </filter>
                <filter id={`${c}-grain`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
                    <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.9 0" />
                </filter>
            </svg>

            {/* sky */}
            <div aria-hidden="true" className={`${c}-sky`} style={{ position: "absolute", inset: 0 }}>
                <div style={{ position: "absolute", right: "20%", top: "12%", width: "clamp(80px, 9vw, 140px)", aspectRatio: "1", borderRadius: "50%", background: printColor, boxShadow: `0 0 0 10px rgba(255, 240, 210, 0.3), 0 0 90px 34px ${glowColor}` }} />
                <svg className={`${c}-cloud`} viewBox="0 0 260 90" style={{ position: "absolute", left: "44%", top: "16%", width: "clamp(150px, 18vw, 260px)", filter: "drop-shadow(0 6px 8px rgba(40, 24, 10, 0.16))" }}>
                    <path d="M18 78 C 4 78 2 58 18 54 C 14 34 40 26 52 40 C 60 16 98 12 108 36 C 120 20 150 22 156 44 C 172 30 204 36 204 56 C 226 52 248 64 240 78 Z" fill={paperColor} />
                </svg>
                <svg className={`${c}-cloud`} viewBox="0 0 200 70" style={{ position: "absolute", right: "5%", top: "30%", width: "clamp(110px, 13vw, 200px)", animationDuration: "20s", filter: "drop-shadow(0 6px 8px rgba(40, 24, 10, 0.16))" }}>
                    <path d="M14 62 C 2 62 2 46 14 44 C 12 28 34 22 44 34 C 52 14 84 12 92 32 C 104 20 128 24 132 42 C 150 36 176 44 172 62 Z" fill={paperColor} />
                </svg>
            </div>

            {/* the landscape, back to front */}
            {/* two big snow mountains far away, soft with distance */}
            <div aria-hidden="true" className={`${c}-far`} style={{ position: "absolute", left: "-4%", right: "-4%", bottom: "18%", height: "min(70%, 55vw)", zIndex: 1, animationDelay: `${RISE + ORDER.far * STEP}s` }}>
                <svg viewBox={`0 0 ${VB} 600`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%", filter: "blur(0.8px)", opacity: 0.95 }}>
                    <defs>
                        <linearGradient id={`${c}-haze`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={`color-mix(in srgb, ${midColor} 85%, ${woodColor})`} />
                            <stop offset="70%" stopColor={`color-mix(in srgb, ${farColor} 60%, ${midColor})`} />
                            <stop offset="100%" stopColor={skyColor} />
                        </linearGradient>
                    </defs>
                    <path d={geo.big.d} fill={`url(#${c}-haze)`} />
                    <path d={geo.big.snow} fill={printColor} opacity="0.92" />
                </svg>
            </div>
            {layer(ORDER.r1, "50%", art(geo.r1, `color-mix(in srgb, ${farColor} 55%, ${midColor})`, 420, 0.14), 2)}
            {layer(ORDER.r2, "44%", art(geo.r2, midColor, 380, 0.2), 2)}
            {layer(ORDER.hills, "38%", art(geo.hills, `color-mix(in srgb, ${midColor} 30%, ${woodColor})`, 360, 0.28), 3)}
            {/* the photographs float up and settle between the hills */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
                {photos.map((p, i) => (
                    <div
                        key={i}
                        className={`${c}-up ${c}-p${i} ${p.cls}`}
                        style={{ position: "absolute", left: p.left, bottom: p.bottom, width: p.w, ["--from" as string]: "140%", ["--r0" as string]: `${p.rot + 8}deg`, ["--r" as string]: "0deg", animationDelay: `${PHOTOS_AT + i * 0.16}s` }}
                    >
                        <div className={`${c}-bob`} style={{ position: "relative", ["--r" as string]: `${p.rot}deg`, ["--bd" as string]: `${3.6 + i * 0.7}s`, animationDelay: `${-i * 1.1}s` }}>
                            <div style={{ boxSizing: "border-box", padding: "10px 10px 34px", background: printColor, boxShadow: "0 6px 16px rgba(40, 24, 10, 0.3), 0 1px 0 rgba(255,255,255,0.6) inset" }}>
                                <div style={{ aspectRatio: "4 / 5", overflow: "hidden" }}>
                                    {p.img?.src ? (
                                        <img src={p.img.src} srcSet={p.img.srcSet} alt="" draggable={false} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", background: p.fb }} />
                                    )}
                                </div>
                            </div>
                            {p.cap ? <span style={{ position: "absolute", left: 12, bottom: 6, fontFamily: HAND, fontSize: "clamp(15px, 1.4vw, 20px)", color: inkColor }}>{p.cap}</span> : null}
                        </div>
                    </div>
                ))}
            </div>
            {layer(ORDER.deep, "28%", art(geo.front, deepColor, 300, 0.34), 5)}
            {layer(ORDER.ground, "15%", art(geo.ground, edgeColor, 200, 0.32), 6)}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none" }}>
                {geo.flies.map((f, i) => (
                    <span key={i} className={`${c}-fly`} style={{ left: f.x, top: f.y, ["--dx" as string]: f.dx, ["--dy" as string]: f.dy, ["--d" as string]: f.d, animationDelay: `${f.delay}, ${f.delay}` }} />
                ))}
            </div>

            {/* the title, on a torn paper label in the sky */}
            <div className={`${c}-title`} style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "clamp(36px, 7vh, 80px) clamp(20px, 4vw, 40px) 0", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
                {eyebrow ? <p style={{ margin: "0 0 0 4px", fontSize: 12, fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: mutedText }}>{eyebrow}</p> : null}
                <div style={{ display: "inline-block", maxWidth: "100%", filter: `drop-shadow(0 3px 0 ${midColor}) drop-shadow(0 16px 22px rgba(40, 24, 10, 0.28))` }}>
                    <div style={{ padding: "16px 32px 20px 28px", background: printColor, clipPath: "polygon(0 8%, 4% 0, 22% 5%, 41% 0, 63% 6%, 82% 1%, 100% 7%, 98% 48%, 100% 92%, 81% 100%, 59% 94%, 37% 100%, 17% 95%, 2% 100%, 0 62%)" }}>
                        <h1 className={`${c}-name`} style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(52px, 6.4vw, 92px)", lineHeight: 1.02, color: deepColor, textShadow: `0 3px 0 ${edgeColor}`, ...nameFont }}>
                            {name}
                        </h1>
                    </div>
                </div>
                <p style={{ margin: "8px 0 0 4px", fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1.25, color: textColor, ...taglineFont }}>{tagline}</p>
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
                    {note ? <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, letterSpacing: "0.01em", color: inkColor, opacity: 0.75, marginLeft: 4 }}>{note}</span> : null}
                </div>
            </div>

            <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 30, pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.16 }}>
                <rect width="100%" height="100%" filter={`url(#${c}-grain)`} />
            </svg>
        </section>
    )
}

addPropertyControls(PaperBanner, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "Wedding · Family · Portrait photography" },
    name: { type: ControlType.String, title: "Name", defaultValue: "[Studio Name]" },
    tagline: { type: ControlType.String, title: "Tagline", defaultValue: "Photographs, tucked in by hand." },
    primaryLabel: { type: ControlType.String, title: "Button", defaultValue: "Book a session" },
    primaryLink: { type: ControlType.Link, title: "Button Link", defaultValue: "/book" },
    secondaryLabel: { type: ControlType.String, title: "Second Button", defaultValue: "See the albums" },
    secondaryLink: { type: ControlType.Link, title: "Second Link", defaultValue: "/albums" },
    note: { type: ControlType.String, title: "Note", defaultValue: "replies within 2 days" },
    photo1: { type: ControlType.ResponsiveImage, title: "Photo 1" },
    caption1: { type: ControlType.String, title: "Caption 1", defaultValue: "her mother, first" },
    photo2: { type: ControlType.ResponsiveImage, title: "Photo 2", description: "Hidden on phones." },
    caption2: { type: ControlType.String, title: "Caption 2", defaultValue: "Sunday picnic" },
    photo3: { type: ControlType.ResponsiveImage, title: "Photo 3" },
    caption3: { type: ControlType.String, title: "Caption 3", defaultValue: "barefoot by eight" },
    photo4: { type: ControlType.ResponsiveImage, title: "Photo 4", description: "Hidden on phones." },
    caption4: { type: ControlType.String, title: "Caption 4", defaultValue: "window light" },
    fullScreen: { type: ControlType.Boolean, title: "Full Screen", defaultValue: true, description: "Fills the window below the navigation." },
    offset: { type: ControlType.Number, title: "Nav Height", defaultValue: 64, min: 0, max: 200, step: 1, unit: "px", hidden: (p) => !p.fullScreen },
    height: { type: ControlType.Number, title: "Height", defaultValue: 860, min: 560, max: 1400, step: 10, unit: "px", hidden: (p) => !!p.fullScreen },
    fireflies: { type: ControlType.Number, title: "Fireflies", defaultValue: 16, min: 0, max: 30, step: 1 },
    animate: { type: ControlType.Boolean, title: "Animate", defaultValue: true, description: "Layers rise, then the photographs float up." },
    skyColor: { type: ControlType.Color, title: "Sky", defaultValue: "#ede2c8" },
    glowColor: { type: ControlType.Color, title: "Glow", defaultValue: "#f3c77e" },
    paperColor: { type: ControlType.Color, title: "Paper", defaultValue: "#f6eedb" },
    printColor: { type: ControlType.Color, title: "Print", defaultValue: "#fbf7ee" },
    farColor: { type: ControlType.Color, title: "Far Mountains", defaultValue: "#e4d3af" },
    midColor: { type: ControlType.Color, title: "Mountains", defaultValue: "#d2b98f" },
    woodColor: { type: ControlType.Color, title: "Hills", defaultValue: "#a9784a" },
    deepColor: { type: ControlType.Color, title: "Deep Wood", defaultValue: "#5a3d26" },
    edgeColor: { type: ControlType.Color, title: "Ground", defaultValue: "#3a2716" },
    sealColor: { type: ControlType.Color, title: "Seal", defaultValue: "#9e3b2b" },
    sealText: { type: ControlType.Color, title: "On Seal", defaultValue: "#fff8ec" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    mutedText: { type: ControlType.Color, title: "Muted Text", defaultValue: "#6a5642" },
    inkColor: { type: ControlType.Color, title: "Ink", defaultValue: "#4a3726" },
    nameFont: { type: ControlType.Font, title: "Name Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1em" } },
    taglineFont: { type: ControlType.Font, title: "Tagline Font", controls: "extended", defaultFontType: "serif", displayFontSize: false, defaultValue: { lineHeight: "1.25em" } },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", displayFontSize: false, defaultValue: { variant: "Regular" } },
})
