import axios from "axios" // -> es como fetch
// import { z } from "zod" // -> definición y validación de esquemas de datos
import type { SearchType } from "../types"
import { number, object, parse, string, type InferOutput, } from "valibot" // -> es mas liviano que Zod, ya que es modular
import { useMemo, useState } from "react";




// TYPE GUARD O ASSERTION
// function isWeatherResponse(weather : unknown) : weather is Weather {
//     return (
//         Boolean(weather) &&
//         typeof weather === 'object' &&
//         typeof (weather as Weather).name === 'string' && 
//         typeof (weather as Weather).main.temp === 'number' && 
//         typeof (weather as Weather).main.temp_min === 'number' && 
//         typeof (weather as Weather).main.temp_max === 'number'
//     )
// }

// Zod
// const Weather = z.object({
//     name: z.string(),
//     main: z.object({
//         temp : z.number(),
//         temp_max : z.number(),
//         temp_min : z.number()
//     })
// })
// type Weather = z.infer<typeof Weather>

const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0,
    }
}


// Valibot
const WeatherSchema = object({
    name: string(),
    main: object({
        temp : number(),
        temp_max : number(),
        temp_min : number()
    })
})

export type Weather = InferOutput<typeof WeatherSchema>

export const useWeather = () => {

    const [weather, setWeather] = useState<Weather>(initialState)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async (search : SearchType) => {

        const appId = import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(initialState)
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
            
            const {data} = await axios(geoUrl)

            // comprobar si existe
            if(!data[0]) {
                setNotFound(true)
                return
            }
            
            const lat = data[0].lat
            const lon = data[0].lon
            

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${appId}`


            // -- Castear el type --
            // const {data: weatherResult} = await axios<Weather>(weatherUrl)
            // console.log(weatherResult.temp)
            // console.log(weatherResult.name)

            // -- Type guards --
            // const {data: weatherResult} = await axios(weatherUrl)
            // const result = isWeatherResponse(weatherResult)
            // if (result) {
            //     console.log(weatherResult.name)
            // } else {
            //     console.log('Respuesta mal formada')
            // }

            // Zod
            // const {data: weatherResult} = await axios(weatherUrl)
            // const result = Weather.safeParse(weatherResult) // safeParse es una forma sencilla del TYPE GUARD
            // if (result.success) {
            //     console.log(result.data.name)
            // } else {
            //     console.log('Respuesta mal formada')
            // }

            // Valibot
            const {data: weatherResult} = await axios(weatherUrl)
            const result = parse(WeatherSchema, weatherResult)
            if (result) {
                setWeather(result)
                
                
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name, [weather])

    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData,
    }
}
