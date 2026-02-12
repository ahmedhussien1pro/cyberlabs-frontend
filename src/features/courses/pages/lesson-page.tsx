import { useParams } from "react-router-dom"

export default function LessonPage() {
  const { courseId, lessonId } = useParams()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Lesson</h1>
      <p className="mt-4 text-muted-foreground">Course: {courseId}</p>
      <p className="text-muted-foreground">Lesson: {lessonId}</p>
      <p className="text-muted-foreground">Lesson page coming soon...</p>
    </div>
  )
}
