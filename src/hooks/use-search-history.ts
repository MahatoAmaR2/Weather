
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

//Define what a single search history looks
interface SearchHistoryItem {
    id: string;      //unique identifier for each search
    query: string;   //the search string typed by the user
    lat: number;     //latitude of the city
    lon: number;     //longitude of the city
    name: string;    //name of the city
    country: string; //country of the city
    state?: string;  //optional state/region of the city
    searchdAt: number; //timestamp when the search was made
}

export function useSearchHistory() {

    //keep search history in local storage so it persists across reloads
    const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(
        "search-history",
        []
    );

    const queryClient = useQueryClient();

    const historyQuery = useQuery({
        queryKey: ["search-history"],
        queryFn: () => history,
        initialData: history,
    });

    const addToHistory=useMutation({
        mutationFn:async(
            Search:Omit<SearchHistoryItem, "id" | "searchdAt">
        )=>{
            const newSearch:SearchHistoryItem={
                ...Search,
                id:`${Search.lat}-${Search.lon}-${Date.now()}`,
                searchdAt:Date.now(),
            };

            //Remove duplicates and keep only last 10 searches
            const filteredHistory=history.filter(
                (item)=>!(item.lat===Search.lat && item.lon===Search.lon)
            );

            const newHistory=[newSearch, ...filteredHistory].slice(0,10);

            setHistory(newHistory);
            return newHistory;
        },
        onSuccess:(newHistory)=>{
            queryClient.setQueryData(["search-history"], newHistory);
        },
    });

    const clearHistory=useMutation({
        mutationFn:async()=>{
            setHistory([]);
            return [];
        },
        onSuccess:()=>{
            queryClient.setQueryData(["search-history"], []);
        },
    });

    return {
        history: historyQuery.data??  [],
        addToHistory,
        clearHistory,
    };
}
