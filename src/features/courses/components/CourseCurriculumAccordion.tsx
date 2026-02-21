import * as React from "react";
import { useTranslation } from "react-i18next";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Topic } from "@/core/types/curriculumCourses.types";
import CourseElementRenderer from "./CourseElementRenderer";

interface CourseCurriculumAccordionProps {
    topics: Topic[];
    imageMap: Record<string, string>;
    type?: "single" | "multiple";
}

export function CourseCurriculumAccordion({
    topics,
    imageMap,
    type = "single",
}: CourseCurriculumAccordionProps) {

    const { i18n } = useTranslation()
    const lang = i18n.language === "ar" ? "ar" : "en"

    return (
        <Accordion.Root type={type} collapsible className="w-full space-y-4">
            {topics.map((topic, index) => (
                <Accordion.Item
                    key={topic.id}
                    value={topic.id}
                    className="
                        rounded-xl
                        overflow-hidden
                        border-border
                        bg-card
                        text-card-foreground
                        shadow-sm
                        transition-all
                        duration-200
                        hover:shadow-md
                        focus-within:ring-2
                        focus-within:ring-ring
                        focus-within:ring-offset-2
                        focus-within:ring-offset-background
                    "
                >
                    <Accordion.Header>
                        <Accordion.Trigger
                            className={cn(
                                "flex w-full items-center justify-between gap-4 px-6 py-5",
                                "text-left rtl:text-right transition-all duration-200",
                                "hover:bg-muted/50 hover:shadow-inner",
                                "focus:outline-none",
                                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                "group data-[state=open]:bg-muted/20",
                            )}
                        >
                            <div className="flex items-center gap-3 flex-1 [dir='rtl']:flex-row-reverse">
                                {/* Topic Number Badge */}
                                <span
                                    className="
                                        inline-flex items-center justify-center
                                        w-8 h-8 rounded-lg
                                        bg-gradient-to-br from-primary/10 to-primary/5
                                        text-primary font-bold text-sm
                                        group-data-[state=open]:from-primary group-data-[state=open]:to-primary/80 
                                        group-data-[state=open]:text-primary-foreground
                                        transition-all duration-200
                                        shadow-sm
                                    "
                                >
                                    {index + 1}
                                </span>

                                {/* Topic Title */}
                                <span
                                    className="
                                        text-foreground/90 font-semibold text-base lg:text-lg
                                        group-data-[state=open]:text-foreground
                                        transition-colors duration-200
                                        line-clamp-1
                                        flex-1
                                    "
                                >
                                    {lang === "ar" ? topic.title.ar : topic.title.en}
                                </span>
                            </div>

                            {/* Chevron with improved styling */}
                            <div
                                className="
                                    p-2 rounded-full
                                    bg-muted/30 group-hover:bg-muted/50
                                    group-data-[state=open]:bg-primary/10
                                    transition-all duration-200
                                    group-hover:scale-105
                                "
                            >
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5",
                                        "transition-all duration-300 ease-in-out",
                                        "group-data-[state=open]:rotate-180",
                                        "text-muted-foreground group-data-[state=open]:text-primary",
                                    )}
                                />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content
                        className={cn(
                            "overflow-hidden",
                            "data-[state=open]:animate-accordion-down",
                            "data-[state=closed]:animate-accordion-up",
                        )}
                    >
                        <div className="px-5 pb-5 pt-3 border-t border-border/50">
                            <CourseElementRenderer
                                elements={topic.elements}
                                imageMap={imageMap}
                            />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}
