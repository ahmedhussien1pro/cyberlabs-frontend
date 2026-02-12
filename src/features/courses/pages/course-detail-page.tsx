import { useParams } from "react-router-dom"

export default function CourseDetailPage() {
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Course Details</h1>
      <p className="mt-4 text-muted-foreground">Course ID: {id}</p>
      <p className="text-muted-foreground">Course detail page coming soon...</p>
    </div>
  )
}
