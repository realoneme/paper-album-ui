// Paper Album UI · Toast for Framer
// A button that pops paper toasts into a corner of the screen. Toasts sit on card paper and carry their tone in a
// round icon disc; warning and error also hang a bookmark ribbon from the top edge. New toasts land in front and
// the older ones tuck behind; hovering the stack fans it out and pauses the timers; swipe or × dismisses one.
// On the Framer canvas a sample toast is shown under the button instead.
import { useEffect, useLayoutEffect, useRef, useState, startTransition, type CSSProperties, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type Tone = "success" | "info" | "warning" | "error"
type Position = "bottom-right" | "bottom-center" | "bottom-left" | "top-right" | "top-center" | "top-left"

interface ToastProps {
    buttonLabel: string
    tone: Tone | "cycle"
    title: string
    description: string
    actionLabel: string
    duration: number
    position: Position
    cardColor: string
    textColor: string
    mutedColor: string
    edgeColor: string
    buttonColor: string
    buttonText: string
    successColor: string
    infoColor: string
    warningColor: string
    errorColor: string
    font: CSSProperties
    onAction?: () => void
    style?: CSSProperties
}

interface Item {
    id: number
    tone: Tone
}

const CYCLE: Tone[] = ["success", "info", "warning", "error"]
const GAP = 12
const PEEK = 14
const VISIBLE = 3
const WIDTH = 356

// "Cycle all four" shows one sample of each tone in turn, for previews.
const SAMPLES: Record<Tone, { title: string; description: string }> = {
    success: { title: "Uploaded", description: "24 photos added to Winter in Hokkaido." },
    info: { title: "Processing", description: "Web-size copies will be ready in a minute." },
    warning: { title: "Storage almost full", description: "1.8 of 2 GB used. Archive an album to make room." },
    error: { title: "Upload failed", description: "IMG_2041.CR3 is over 80 MB." },
}

const ICON: Record<Tone, ReactNode> = {
    success: <path d="M20 6 9 17l-5-5" />,
    info: (
        <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
        </>
    ),
    warning: (
        <>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4M12 17h.01" />
        </>
    ),
    error: (
        <>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4M12 17h.01" />
        </>
    ),
}

/**
 * Toast
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Toast(props: ToastProps) {
    const {
        buttonLabel = "Upload photos",
        tone = "cycle",
        title = "Uploaded",
        description = "24 photos added to Winter in Hokkaido.",
        actionLabel = "Undo",
        duration = 4,
        position = "bottom-right",
        cardColor = "#f6eedb",
        textColor = "#2a1f16",
        mutedColor = "#6a5642",
        edgeColor = "#d2b98f",
        buttonColor = "#5a3d26",
        buttonText = "#f6eedb",
        successColor = "#426331",
        infoColor = "#3c5e77",
        warningColor = "#e3721c",
        errorColor = "#9e3b2b",
        font,
        onAction,
    } = props
    const onCanvas = RenderTarget.current() === RenderTarget.canvas || RenderTarget.current() === RenderTarget.thumbnail
    const reduce = useReducedMotion()
    const [items, setItems] = useState<Item[]>([])
    const [expanded, setExpanded] = useState(false)
    const [heights, setHeights] = useState<Record<number, number>>({})
    const [mounted, setMounted] = useState(false)
    const next = useRef(0)
    const cycle = useRef(0)
    useEffect(() => setMounted(true), [])

    const tones: Record<Tone, { fill: string; on: string }> = {
        success: { fill: successColor, on: "#fff8ec" },
        info: { fill: infoColor, on: "#fff8ec" },
        warning: { fill: warningColor, on: "#ffffff" },
        error: { fill: errorColor, on: "#fff8ec" },
    }

    function add() {
        const t = tone === "cycle" ? CYCLE[cycle.current++ % CYCLE.length] : tone
        const id = ++next.current
        startTransition(() => setItems((list) => [{ id, tone: t }, ...list].slice(0, 6)))
    }
    function remove(id: number) {
        startTransition(() => setItems((list) => list.filter((i) => i.id !== id)))
    }

    const top = position.startsWith("top")
    const dir = top ? 1 : -1
    // Each toast's offset from the edge: collapsed they peek out behind the front one; expanded they fan out.
    const offset = (index: number) => {
        if (!expanded) return index * PEEK * dir
        let y = 0
        for (let i = 0; i < index; i++) y += (heights[items[i]?.id] ?? 72) + GAP
        return y * dir
    }

    const card = (item: Item, live: boolean) => (
        <ToastCard
            key={item.id}
            item={item}
            live={live}
            tone={tones[item.tone]}
            title={tone === "cycle" ? SAMPLES[item.tone].title : title}
            description={tone === "cycle" ? SAMPLES[item.tone].description : description}
            actionLabel={actionLabel}
            colors={{ cardColor, textColor, mutedColor, edgeColor, errorColor }}
            font={font}
            onAction={() => {
                onAction?.()
                remove(item.id)
            }}
            onClose={() => remove(item.id)}
        />
    )

    const region =
        mounted && !onCanvas && typeof document !== "undefined"
            ? createPortal(
                  <section
                      aria-label="Notifications"
                      onMouseEnter={() => setExpanded(true)}
                      onMouseLeave={() => setExpanded(false)}
                      onFocus={() => setExpanded(true)}
                      onBlur={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false)
                      }}
                      style={{
                          position: "fixed",
                          zIndex: 9999,
                          [top ? "top" : "bottom"]: 24,
                          ...(position.endsWith("right") ? { right: 24 } : position.endsWith("left") ? { left: 24 } : { left: "50%", marginLeft: -WIDTH / 2 }),
                          width: `min(${WIDTH}px, calc(100vw - 32px))`,
                          height: heights[items[0]?.id] ?? 0,
                          pointerEvents: items.length ? "auto" : "none",
                      }}
                  >
                      <ol style={{ position: "relative", listStyle: "none", margin: 0, padding: 0 }}>
                          <AnimatePresence initial={false}>
                              {items.map((item, index) => (
                                  <motion.li
                                      key={item.id}
                                      layout={false}
                                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 * -dir, scale: 1 }}
                                      animate={{
                                          opacity: index < VISIBLE ? 1 : 0,
                                          y: offset(index),
                                          scale: expanded ? 1 : 1 - index * 0.05,
                                      }}
                                      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
                                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                                      style={{
                                          position: "absolute",
                                          left: 0,
                                          right: 0,
                                          [top ? "top" : "bottom"]: 0,
                                          zIndex: 100 - index,
                                          transformOrigin: top ? "50% 100%" : "50% 0%",
                                          pointerEvents: index < VISIBLE ? "auto" : "none",
                                      }}
                                  >
                                      <Measured id={item.id} onHeight={(h) => setHeights((m) => (m[item.id] === h ? m : { ...m, [item.id]: h }))}>
                                          <Timer seconds={duration} paused={expanded} onDone={() => remove(item.id)} />
                                          {/* Behind the front toast only the edge shows, so its text is hidden until the stack fans out. */}
                                          <div style={{ opacity: expanded || index === 0 ? 1 : 0, transition: "opacity 160ms" }}>{card(item, true)}</div>
                                      </Measured>
                                  </motion.li>
                              ))}
                          </AnimatePresence>
                      </ol>
                  </section>,
                  document.body
              )
            : null

    return (
        <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 20, ...props.style }}>
            <motion.button
                type="button"
                onClick={add}
                whileHover={reduce ? undefined : { y: -1 }}
                whileTap={reduce ? undefined : { y: 2, boxShadow: "0 1px 0 #3a2716, 0 3px 8px rgba(40, 24, 10, 0.22)" }}
                transition={{ duration: 0.15 }}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 44,
                    padding: "0 20px",
                    border: 0,
                    borderRadius: 6,
                    background: buttonColor,
                    color: buttonText,
                    boxShadow: "0 3px 0 #3a2716, 0 8px 16px rgba(40, 24, 10, 0.25)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    fontFamily: '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif',
                    ...font,
                    fontSize: 15,
                    fontWeight: 600,
                }}
            >
                {buttonLabel}
            </motion.button>
            {onCanvas ? <div style={{ width: WIDTH }}>{card({ id: 0, tone: tone === "cycle" ? "success" : tone }, false)}</div> : null}
            {region}
        </div>
    )
}

function Measured({ id, onHeight, children }: { id: number; onHeight: (h: number) => void; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(() => onHeight(Math.round(el.getBoundingClientRect().height)))
        ro.observe(el)
        onHeight(Math.round(el.getBoundingClientRect().height))
        return () => ro.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    return <div ref={ref}>{children}</div>
}

/** Counts down while not paused; resumes where it stopped. */
function Timer({ seconds, paused, onDone }: { seconds: number; paused: boolean; onDone: () => void }) {
    const left = useRef(seconds * 1000)
    const done = useRef(onDone)
    done.current = onDone
    useEffect(() => {
        if (paused || seconds <= 0) return
        const start = Date.now()
        const t = window.setTimeout(() => done.current(), left.current)
        return () => {
            window.clearTimeout(t)
            left.current -= Date.now() - start
        }
    }, [paused, seconds])
    return null
}

interface CardProps {
    item: Item
    live: boolean
    tone: { fill: string; on: string }
    title: string
    description: string
    actionLabel: string
    colors: { cardColor: string; textColor: string; mutedColor: string; edgeColor: string; errorColor: string }
    font?: CSSProperties
    onAction: () => void
    onClose: () => void
}

function ToastCard({ item, live, tone, title, description, actionLabel, colors, font, onAction, onClose }: CardProps) {
    const [hover, setHover] = useState(false)
    const ribbon = item.tone === "warning" || item.tone === "error"
    return (
        <motion.div
            role={item.tone === "error" ? "alert" : "status"}
            drag={live ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.6}
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 600) onClose()
            }}
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 16,
                minHeight: 72,
                padding: "14px 16px",
                boxSizing: "border-box",
                width: "100%",
                borderRadius: 8,
                background: colors.cardColor,
                color: colors.textColor,
                boxShadow: `0 2px 0 ${colors.edgeColor}, 0 22px 38px rgba(40, 24, 10, 0.30)`,
                touchAction: "pan-y",
                fontFamily: '"Instrument Sans", "Helvetica Neue", system-ui, sans-serif',
                ...font,
            }}
        >
            {ribbon ? (
                <>
                    <span aria-hidden="true" style={{ position: "absolute", top: -5, right: 32, width: 4, height: 5, background: "#3a2716", opacity: 0.5, clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            top: -5,
                            right: 18,
                            width: 14,
                            height: 21,
                            background: `linear-gradient(90deg, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.12)), ${tone.fill}`,
                            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                        }}
                    />
                </>
            ) : null}
            <span aria-hidden="true" style={{ width: 34, height: 34, flex: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: tone.fill, color: tone.on }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {ICON[item.tone]}
                </svg>
            </span>
            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, color: item.tone === "error" ? colors.errorColor : colors.textColor }}>{title}</span>
                {description ? <span style={{ fontSize: 13, lineHeight: "18px", color: colors.mutedColor }}>{description}</span> : null}
            </span>
            {actionLabel ? (
                <button
                    type="button"
                    onClick={onAction}
                    style={{ flex: "none", minHeight: 36, padding: "0 12px", border: 0, borderRadius: 6, background: colors.cardColor, color: colors.textColor, boxShadow: `inset 0 0 0 1px ${colors.edgeColor}, 0 3px 0 ${colors.edgeColor}`, fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                >
                    {actionLabel}
                </button>
            ) : null}
            {live ? (
                <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        width: 24,
                        height: 24,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        border: 0,
                        borderRadius: 999,
                        background: colors.cardColor,
                        color: colors.textColor,
                        boxShadow: `inset 0 0 0 1px ${colors.edgeColor}, 0 2px 0 ${colors.edgeColor}`,
                        cursor: "pointer",
                        transform: "translate(-40%, -40%)",
                        opacity: hover ? 1 : 0,
                        transition: "opacity 140ms",
                    }}
                >
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            ) : null}
        </motion.div>
    )
}

addPropertyControls(Toast, {
    buttonLabel: { type: ControlType.String, title: "Button", defaultValue: "Upload photos" },
    tone: {
        type: ControlType.Enum,
        title: "Tone",
        options: ["cycle", "success", "info", "warning", "error"],
        optionTitles: ["Cycle all four", "Success", "Info", "Warning", "Error"],
        defaultValue: "cycle",
    },
    title: { type: ControlType.String, title: "Title", defaultValue: "Uploaded", hidden: (p) => p.tone === "cycle" },
    description: { type: ControlType.String, title: "Description", defaultValue: "24 photos added to Winter in Hokkaido.", hidden: (p) => p.tone === "cycle" },
    actionLabel: { type: ControlType.String, title: "Action", defaultValue: "Undo", description: "Leave empty for no action button." },
    duration: { type: ControlType.Number, title: "Seconds", defaultValue: 4, min: 0, max: 20, step: 0.5, description: "0 keeps toasts until dismissed." },
    position: {
        type: ControlType.Enum,
        title: "Position",
        options: ["bottom-right", "bottom-center", "bottom-left", "top-right", "top-center", "top-left"],
        optionTitles: ["Bottom right", "Bottom centre", "Bottom left", "Top right", "Top centre", "Top left"],
        defaultValue: "bottom-right",
    },
    cardColor: { type: ControlType.Color, title: "Card", defaultValue: "#f6eedb" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#2a1f16" },
    mutedColor: { type: ControlType.Color, title: "Muted", defaultValue: "#6a5642" },
    edgeColor: { type: ControlType.Color, title: "Edge", defaultValue: "#d2b98f" },
    buttonColor: { type: ControlType.Color, title: "Button", defaultValue: "#5a3d26" },
    buttonText: { type: ControlType.Color, title: "Button Text", defaultValue: "#f6eedb" },
    successColor: { type: ControlType.Color, title: "Success", defaultValue: "#426331" },
    infoColor: { type: ControlType.Color, title: "Info", defaultValue: "#3c5e77" },
    warningColor: { type: ControlType.Color, title: "Warning", defaultValue: "#e3721c" },
    errorColor: { type: ControlType.Color, title: "Error", defaultValue: "#9e3b2b" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", displayFontSize: false, defaultValue: { variant: "Regular" } },
    onAction: { type: ControlType.EventHandler, title: "On Action" },
})
