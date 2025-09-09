import { Clock, Loader2, Search, Star, XCircle } from "lucide-react"
import { Button } from "./ui/button"
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
  CommandList,
  CommandSeparator,
} from "./ui/command"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLocationSearchQuery } from "@/hooks/use-weather"
import { format } from "date-fns"
import { useSearchHistory } from "@/hooks/use-search-history"
import { useFavorites } from "@/hooks/use-favorite"

export function CitySearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const { data: locations, isLoading } = useLocationSearchQuery(query)
  const { history, clearHistory, addToHistory } = useSearchHistory()
  const { favorites } = useFavorites()

  const handleSelect = (cityData: string) => {
    console.log("Selected cityData:", cityData) 

    const [lat, lon, name, country] = cityData.split("|")

    if (!lat || !lon || !name || !country) {
      console.error("Invalid city data:", cityData)
      return
    }

    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    })

    setOpen(false)
    console.log("Navigating to:", `/city/${name}?lat=${lat}&lon=${lon}`) 
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="search cities..."
            value={query}
            onValueChange={setQuery}
          />

          <CommandList>
            {query.length > 2 && !isLoading && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {/* Favorites */}
            {favorites.length > 0 && (
              <CommandGroup heading="Favorites">
                {favorites.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                    onSelect={handleSelect}
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>{city.name}</span>
                    {city.state && (
                      <span className="text-sm text-muted-foreground">
                        , {city.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {city.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Search History */}
            {history.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-muted-foreground">
                      Recent Searches
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearHistory.mutate()}
                    >
                      <XCircle className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>

                  {history.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                      onSelect={handleSelect}
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{item.name}</span>
                      {item.state && (
                        <span className="text-sm text-muted-foreground">
                          , {item.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        , {item.country}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(item.searchdAt, "MMM d, h:mm a")}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            <CommandSeparator />

            {locations && locations.length > 0 && (
              <CommandGroup heading="Suggestions">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}

                {locations.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default CitySearch
