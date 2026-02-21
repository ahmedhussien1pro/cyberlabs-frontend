import type { CourseElement } from "@/core/types/curriculumCourses.types"
import type { Language, TranslatedText } from "@/core/types/common.types"
import { useTranslation } from "react-i18next"


interface Props {
    elements: CourseElement[]
    imageMap: Record<string, string>
}

const getText = (text: TranslatedText, lang: Language) =>
    lang === "ar" ? text.ar : text.en

export default function CourseElementRenderer({
    elements,
    imageMap
}: Props) {
    const { i18n } = useTranslation()
    const lang = i18n.language === "ar" ? "ar" : "en"
    return (
        <>
            {elements.map((el, index) => {
                switch (el.type) {
                    /* ---------------- Title ---------------- */
                    case "title":
                        return (
                            <h3
                                key={index}
                                className="text-2xl lg:text-3xl font-bold mt-8 mb-4 text-primary scroll-m-20"
                            >
                                {getText(el.value, lang)}
                            </h3>
                        )

                    case "subtitle":
                        return (
                            <h4
                                key={index}
                                className="text-xl lg:text-2xl font-semibold mt-6 mb-3 text-foreground/90 scroll-m-18"
                            >
                                {getText(el.value, lang)}
                            </h4>
                        )

                    case "text":
                        return (
                            <p
                                key={index}
                                className="mb-4 text-foreground/90 leading-relaxed"
                            >
                                {getText(el.value, lang)}
                            </p>
                        )

                    /* ---------------- Image ---------------- */
                    case "image":
                        return (
                            <figure key={index} className="my-6 space-y-2">
                                <img
                                    src={imageMap[el.srcKey]}
                                    className="rounded-xl  border-border shadow-sm w-full h-auto object-cover"
                                    alt=""
                                />
                            </figure>
                        )

                    /* ---------------- Video ---------------- */
                    case "video":
                        return (
                            <div key={index} className="my-6 space-y-2">
                                <div className="relative rounded-xl overflow-hidden border border-border shadow-md">
                                    <iframe
                                        src={el.url}
                                        className="w-full aspect-video"
                                        allow={el.autoPlay ? "autoplay" : undefined}
                                        allowFullScreen
                                    />
                                </div>
                                {el.title && (
                                    <p className="text-sm text-muted-foreground px-1">
                                        {getText(el.title, lang)}
                                    </p>
                                )}
                            </div>
                        )

                    /* ---------------- List ---------------- */
                    case "list": {
                        const items =
                            Array.isArray(el.items)
                                ? el.items.map(item => getText(item, lang))
                                : lang === "ar"
                                    ? el.items.ar
                                    : el.items.en

                        return (
                            <ul key={index} className="list-disc ps-6 mb-4 space-y-2 [&_ul]:my-2 [&_ul]:ps-6">
                                {items.map((item, i) => (
                                    <li
                                        key={i}
                                        className="text-foreground/80 marker:text-primary"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )
                    }

                    /* ---------------- Ordered List ---------------- */
                    case "orderedList":
                        return (
                            <ol key={index} className="list-decimal ps-6 mb-6 space-y-6 [&_ol]:my-4 [&_ol]:ps-6">
                                {el.items.map((item, i) => (
                                    <li key={i} className="ps-2 marker:font-semibold marker:text-primary">
                                        <h5 className="font-semibold text-foreground mb-2">
                                            {getText(item.subtitle, lang)}
                                        </h5>

                                        <p className="text-foreground/80 mb-2">
                                            {getText(item.text, lang)}
                                        </p>

                                        {item.example && (
                                            <p className="text-sm text-muted-foreground mb-3 italic border-s-2 border-muted ps-4">
                                                {getText(item.example, lang)}
                                            </p>
                                        )}

                                        {item.image && (
                                            <img
                                                src={imageMap[item.image.srcKey]}
                                                className="rounded-lg border border-border shadow-sm mt-3 w-full h-auto"
                                                alt=""
                                            />
                                        )}
                                    </li>
                                ))}
                            </ol>
                        )

                    /* ---------------- Code ---------------- */
                    case "code":
                        return (
                            <div key={index} className="my-6 rounded-xl overflow-hidden border border-border">
                                <pre className="p-4 bg-card text-card-foreground overflow-x-auto text-sm font-mono">
                                    <code>{el.code}</code>
                                </pre>
                            </div>
                        )

                    /* ---------------- Terminal ---------------- */
                    case "terminal":
                        return (
                            <div
                                key={index}
                                className="my-6 rounded-xl overflow-hidden border border-border bg-card"
                            >
                                {el.label && (
                                    <div className="px-4 py-2 bg-muted/50 border-b border-border text-muted-foreground text-sm font-mono">
                                        {getText(el.label, lang)}
                                    </div>
                                )}
                                <pre className="p-4 text-destructive-foreground font-mono text-sm overflow-x-auto">
                                    {el.value}
                                </pre>
                            </div>
                        )

                    /* ---------------- Note ---------------- */
                    case "note":
                        return (
                            <div
                                key={index}
                                className="my-6 p-5 rounded-xl border-l-4 border-primary bg-secondary/30 text-secondary-foreground"
                            >
                                <p className="text-foreground/90">{getText(el.value, lang)}</p>

                                {el.link && (
                                    <a
                                        href={el.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-3 text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
                                    >
                                        {el.isLab ? "Open Lab" : el.link}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="rtl:rotate-180"
                                        >
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )

                    /* ---------------- Table ---------------- */
                    case "table":
                        return (
                            <div key={index} className="my-6 rounded-xl border border-border overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            {el.headers.map((header, i) => (
                                                <th
                                                    key={i}
                                                    className="border-b border-border p-3 text-left font-semibold text-muted-foreground rtl:text-right"
                                                >
                                                    {getText(header, lang)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {el.rows.map((row, rIndex) => (
                                            <tr key={rIndex} className="even:bg-muted/20">
                                                {row.map((cell, cIndex) => (
                                                    <td
                                                        key={cIndex}
                                                        className="border-b border-border p-3 text-card-foreground last:border-0"
                                                    >
                                                        {getText(cell, lang)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )

                    /* ---------------- HR ---------------- */
                    case "hr":
                        return (
                            <hr
                                key={index}
                                className="my-8 border-stone-400"
                            />
                        )

                    /* ---------------- Button ---------------- */
                    case "button":
                        return (
                            <a
                                key={index}
                                href={el.href}
                                target={el.newTab ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg my-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md font-medium"
                            >
                                {getText(el.label, lang)}
                                {el.newTab && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="rtl:rotate-180"
                                    >
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                )}
                            </a>
                        )

                    default:
                        return null
                }
            })}
        </>
    )
}