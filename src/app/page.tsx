import { Button } from "@/components/ui/button"
import { signout } from "@/actions/auth"

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button variant="outline" onClick={signout}>
        Sign Out
      </Button>
    </div>
  )
}
