import type { WeatherData } from "@/api/types"
import { Button } from "./ui/button"
import { useFavorites } from "@/hooks/use-favorite"
import { toast } from "sonner"
import { Star } from "lucide-react"

interface FavoriteButtonProps {
  data: WeatherData
}

export function FavoriteButton({ data }: FavoriteButtonProps) {
  const { addFavorite, RemoveFavorite, isFavorite } = useFavorites()
  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon)

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      RemoveFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`)
      toast.error(`Removed ${data.name} from Favorites`)
    } else {
      addFavorite.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      })
      toast.success(`Added ${data.name} to Favorites`)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleFavorite}
      className={`transition-colors ${
        isCurrentlyFavorite
          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
          : "hover:bg-accent"
      }`}
    >
      <Star
        className="h-4 w-4"
        strokeWidth={2}
        fill={isCurrentlyFavorite ? "currentColor" : "none"} 
      />
    </Button>
  )
}
