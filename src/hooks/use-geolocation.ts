import { useState, useEffect  } from "react"
import type { Coordinates } from "@/api/types"

interface GeolocationState{
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

//define the custom hook
export function useGeolocation(){
    const [locationData, setlocationData]=
    useState<GeolocationState>({
        coordinates: null,
        error: null,
        isLoading:true,
    });
    //function to get the user's location
    const getLocation=()=>{
        //Reset loading and error before fetching
        setlocationData((prev)=>({...prev, isLoading:true, error:null}));
        //Check if the browser supports geolocation
        if(!navigator.geolocation){
            setlocationData({
                coordinates:null,
                error: "Geolocation is not supported by your browser",
                isLoading:false,
            });
            return;
        }
        //Request location from the browser
        navigator.geolocation.getCurrentPosition(
            //Success callback
            (position)=>{
                setlocationData({
                    coordinates:{
                        lat:position.coords.latitude,
                        lon:position.coords.longitude
                    },
                    error:null,
                    isLoading:false
                });
            },
            //Error callback
            (error)=>{
                let errorMessage: string;
                //Map browser error codes to readable message
                switch (error.code){
                    case error.PERMISSION_DENIED:
                        errorMessage="Location permition denied. Please enable location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage="Location information is unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage="Location request time out.";
                        break;
                    default:
                        errorMessage="An unknown error occurred.";
                }

                setlocationData({
                    coordinates:null,
                    error:errorMessage,
                    isLoading:false
                });
            },
            //Options for geolocation request
            {enableHighAccuracy:true, //try to get the most accurate position
                timeout:5000, //wait at most 5 secound
                maximumAge:0, //don't use cached location
            }
        )
    };
    //Automatically fetch location on first render
    useEffect(()=>{
        getLocation();
    },[]);
    //Return state + method for manual refresh
    return{
        ...locationData, //Coordinates, error, isLoading
        getLocation, // Allow re-fetching location on demand
    };
}