import axios from "axios"
import type { SearchType } from "../types"


export const useWeather = () => {

    const fetchWeather = async (search : SearchType) => {

        const appId = 'ef5c440f0b51081df6b487b9b489ef33'
        
        try {
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
            
            const {data} = await axios(geoUrl)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        fetchWeather
    }
}
