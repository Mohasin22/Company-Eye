import type { KeyAspect } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export function KeyAspectsGrid({ aspects }: { aspects: KeyAspect[] }) {
  return (
    <div>
      <h3 className="text-2xl font-bold font-headline mb-4">Key Aspect Summary</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aspects.map((aspect) => (
          <Card key={aspect.aspect} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                {aspect.aspect}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{aspect.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
