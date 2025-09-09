import type { Coordinates } from "@/api/types"
import { weatherAPI } from "@/api/weather"
// import { Corner } from "@radix-ui/react-scroll-area";
import {useQuery} from "@tanstack/react-query"


//Define query key generation function for different weather related request, These function create unique keys for react query's catching system.
//Passing coordinates ensures that data is cached separately fo each location.

export const WEATHER_KEYS={
    //Current weather key
    weather:(coords: Coordinates)=>["weather",coords] as const,
    //Forecast key
    forecast:(coords: Coordinates)=>["forecast",coords] as const,
    //Reverse Geocode key
    location:(coords: Coordinates)=>["location",coords] as const,

    //Search Location key
    search:(query:string)=>["location-search",query] as const,
}as const;

//Hook to fetch the current Weather data based on given coordinates
export function useWeatherQuery(coordinates: Coordinates | null){
    return useQuery({
        //Generate a unique key for caching, if no "coordinates", use dummy {lat:0, lon:0}, just to maintain type consistency
        queryKey: WEATHER_KEYS.weather(coordinates ?? {lat:0, lon:0}),
        //Fetch function: calls weatherAPI only of valid coordinates exists, else return null.
        queryFn:()=>coordinates ? weatherAPI.getCurrentWeather(coordinates):null,enabled:!!coordinates,
        //"enabled" ensures that the query only runs when coordinates are available
    });
}


//Hook to fetch the Weather Forecast data based on given coordinates
export function useForecastQuery(coordinates:Coordinates | null){
    return useQuery({
        queryKey: WEATHER_KEYS.forecast(coordinates ?? {lat:0, lon:0}),
        queryFn:()=>(coordinates ? weatherAPI.getForecast(coordinates):null),enabled: !!coordinates,
    });
}

export function useReverseGeocodeQuery(coordinates:Coordinates | null){
    return useQuery({
        queryKey:WEATHER_KEYS.location(coordinates ?? {lat:0, lon:0}),
        queryFn:()=>coordinates ? weatherAPI.reverseGeocode(coordinates):null, enabled: !!coordinates
    })
}

//Hook to search for locations based on a query string
export function useLocationSearchQuery(query:string){
    return useQuery({
        queryKey:WEATHER_KEYS.search(query),
        queryFn:()=>weatherAPI.searchLocation(query),
        enabled:query.length >= 3,
    });
}