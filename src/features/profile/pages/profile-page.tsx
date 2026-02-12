import { useParams } from "react-router-dom"

export default function ProfilePage() {
  const { username } = useParams()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Profile: {username}</h1>
      <p className="mt-4 text-muted-foreground">Profile page coming soon...</p>
    </div>
  )
}
