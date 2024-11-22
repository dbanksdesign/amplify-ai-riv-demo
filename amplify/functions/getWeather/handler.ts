import { env } from "$amplify/env/getWeather";
import type { Schema } from "../../data/resource";

export const handler: Schema["getWeather"]["functionHandler"] = async (
  event
) => {
  const res = await fetch(
    `http://api.weatherstack.com/current?access_key=${
      env.WEATHERSTACK_API_KEY
    }&units=f&query=${encodeURIComponent(event.arguments.city ?? "")}`
  );

  const weather = await res.json();

  return {
    temperature: weather.current.temperature,
    weatherCode: weather.current.weather_code,
    weatherDescriptions: weather.current.weather_descriptions,
    windSpeed: weather.current.wind_speed,
  };
};
