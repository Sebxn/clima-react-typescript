import type { Weather } from "../../hooks/useWeather"
// import { formatTemperature } from '../../helpers/index';
import styles from "./WeatherDetail.module.css"

type WeatherDetailProps = {
    weather: Weather
}

export const WeatherDetail = ({weather} : WeatherDetailProps) => {
    return (
        <div className={styles.container}>
            <h2>Clima de: {weather.name}</h2>
            <p className={styles.current}>{parseInt(weather.main.temp.toString())}&deg;C</p>
            {/* <p>{formatTemperature(weather.main.temp)}</p> */}
            <div className={styles.temperatures}>
                <p>Min: <span>{parseInt(weather.main.temp_min.toString())}&deg;C</span></p>
                <p>Max: <span>{parseInt(weather.main.temp_max.toString())}&deg;C</span></p>
            </div>
        </div>
    )
}
