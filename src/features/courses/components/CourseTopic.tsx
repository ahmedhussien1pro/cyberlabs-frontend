import type { Topic } from "@/core/types/curriculumCourses.types"
import type { Language } from "@/core/types/common.types"
import CourseElementRenderer from "./CourseElementRenderer"

interface Props {
    topic: Topic
    lang: Language
    imageMap: Record<string, string>
}

export default function CourseTopic({
    topic,
    lang,
    imageMap
}: Props) {
    return (
        <div className="mb-8 bg-background/95 main-color border p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">
                {topic.title[lang]}
            </h2>

            <CourseElementRenderer
                elements={topic.elements}
                imageMap={imageMap}
            />
        </div>
    )
}