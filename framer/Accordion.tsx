// Paper Album UI · Accordion for Framer
// Stacked questions. Each panel opens and closes on its own (opening one never folds another away): it unfolds
// to its height while the sunken well settles in with a 4px drop, and folds away a little faster.
import { useId, useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

interface Item {
    question: string
    answer: string
}

interface AccordionProps {
    items: Item[]
    openFirst: boolean
    oneAtATime: boolean
    textColor: string
    answerColor: string
    wellColor: string
    ruleColor: string
    questionFont: CSSProperties
    answerFont: CSSProperties
    style?: CSSProperties
}

const EASE_PAPER = [0.2, 0.8, 0.2, 1] as const
const EASE_IN = [0.4, 0, 1, 1] as const

/**
 * Accordion
 *
 * @framerIntrinsicWidth 560
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Accordion(props: AccordionProps) {
    const {
        items = [],
        openFirst = true,
        oneAtATime = false,
        textColor = "#2a1f16",
        answerColor = "#6a5642",
        wellColor = "#e4d3af",
        ruleColor = "#d2b98f",
        questionFont,
        answerFont,
    } = props
    const [open, setOpen] = useState<number[]>(openFirst ? [0] : [])
    const isStatic = useIsStaticRenderer()
    const reduce = useReducedMotion()
    const animate = !isStatic && !reduce
    const base = useId()

    function toggle(i: number) {
        startTransition(() =>
            setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : oneAtATime ? [i] : [...prev, i]))
        )
    }

    return (
        <div style={{ position: "relative", width: "100%", ...props.style, color: textColor }}>
            {items.map((item, i) => {
                const isOpen = open.includes(i)
                const btnId = `${base}-q${i}`
                const panelId = `${base}-a${i}`
                return (
                    <div key={i} style={{ borderBottom: `1px solid ${ruleColor}` }}>
                        <h3 style={{ margin: 0 }}>
                            <button
                                id={btnId}
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => toggle(i)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 16,
                                    width: "100%",
                                    minHeight: 56,
                                    padding: "0 4px",
                                    border: 0,
                                    background: "transparent",
                                    color: "inherit",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    fontSize: 16,
                                    fontWeight: 600,
                                    ...questionFont,
                                }}
                            >
                                <span>{item.question}</span>
                                <motion.svg
                                    aria-hidden="true"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ flex: "none" }}
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={animate ? { duration: 0.22, ease: EASE_PAPER } : { duration: 0 }}
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </motion.svg>
                            </button>
                        </h3>
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    key="panel"
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={btnId}
                                    style={{ overflow: "hidden" }}
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto", transition: animate ? { duration: 0.22, ease: EASE_PAPER } : { duration: 0 } }}
                                    exit={{ height: 0, transition: animate ? { duration: 0.14, ease: EASE_IN } : { duration: 0 } }}
                                >
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0, transition: animate ? { duration: 0.22, ease: EASE_PAPER } : { duration: 0 } }}
                                        style={{
                                            margin: "0 0 18px",
                                            padding: "14px 16px",
                                            borderRadius: 6,
                                            background: wellColor,
                                            boxShadow: "inset 0 2px 4px rgba(40, 24, 10, 0.14)",
                                            color: answerColor,
                                            fontSize: 15,
                                            lineHeight: 1.65,
                                            ...answerFont,
                                        }}
                                    >
                                        {item.answer}
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}

addPropertyControls(Accordion, {
    items: {
        type: ControlType.Array,
        title: "Items",
        control: {
            type: ControlType.Object,
            controls: {
                question: { type: ControlType.String, title: "Question", defaultValue: "How soon will I see my photos?" },
                answer: { type: ControlType.String, title: "Answer", displayTextArea: true, defaultValue: "A preview gallery arrives within [3 days]." },
            },
        },
        defaultValue: [
            { question: "How soon will I see my photos?", answer: "A preview gallery arrives within [3 days]; the full edited album within [2 weeks]." },
            { question: "Can I order printed albums?", answer: "Yes. Linen-bound albums come in two sizes, printed on archival paper." },
            { question: "Do you travel for sessions?", answer: "Anywhere in [region]; travel costs are quoted with the booking." },
        ],
    },
    openFirst: { type: ControlType.Boolean, title: "Open First", defaultValue: true },
    oneAtATime: { type: ControlType.Boolean, title: "One at a Time", defaultValue: false },
    textColor: { type: ControlType.Color, title: "Question", defaultValue: "#2a1f16" },
    answerColor: { type: ControlType.Color, title: "Answer", defaultValue: "#6a5642" },
    wellColor: { type: ControlType.Color, title: "Well", defaultValue: "#e4d3af" },
    ruleColor: { type: ControlType.Color, title: "Rule", defaultValue: "#d2b98f" },
    questionFont: {
        type: ControlType.Font,
        title: "Question Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "16px", variant: "Semibold", lineHeight: "1.4em" },
    },
    answerFont: {
        type: ControlType.Font,
        title: "Answer Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "15px", variant: "Regular", lineHeight: "1.65em" },
    },
})
