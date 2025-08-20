import { User } from "@/db/models/auth.model";
import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { chatRouter } from "./chat.router";
import axios from "axios";
import z from "zod";
import mongoose from "mongoose";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  
  // Chat endpoints
  chat: chatRouter,

  weather: protectedProcedure.handler(async ({ context }) => {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const city = context.session?.user?.city;
    console.log("🚀 ~ context.session?.user:", context.session?.user)

    if (!city) {
      throw new Error("City not found in user profile");
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            q: city,
            units: "metric",
            appid: apiKey,
          },
        }
      );

      const data = response.data;

      const current = {
        temp: data.list[0].main.temp,
        condition: data.list[0].weather[0].description,
        icon: data.list[0].weather[0].icon,
        humidity: data.list[0].main.humidity,
        wind: data.list[0].wind.speed,
      };

      const hourly = data.list.slice(0, 8).map((item: any) => ({
        time: item.dt_txt,
        temp: item.main.temp,
        condition: item.weather[0].description,
        icon: item.weather[0].icon,
      }));

      const dailyMap: Record<string, any> = {};
      data.list.forEach((item: any) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyMap[date]) {
          dailyMap[date] = {
            date,
            tempMin: item.main.temp_min,
            tempMax: item.main.temp_max,
            condition: item.weather[0].description,
            icon: item.weather[0].icon,
          };
        } else {
          dailyMap[date].tempMin = Math.min(
            dailyMap[date].tempMin,
            item.main.temp_min
          );
          dailyMap[date].tempMax = Math.max(
            dailyMap[date].tempMax,
            item.main.temp_max
          );
        }
      });

      const daily = Object.values(dailyMap).slice(0, 7);

      return {
        city: data.city.name,
        country: data.city.country,
        current,
        hourly,
        daily,
      };
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch weather data"
      );
    }
  }),
  updateLocation: protectedProcedure
    .input(z.object({ city: z.string() }))
    .handler(async ({ input, context }) => {
      const { city } = input;

      const res = await User.findOneAndUpdate(
        { email: context.session.user.email },
        { city },
        { new: true }
      );
      console.log("🚀 ~ res:", res)

      // Also patch session object in memory
      context.session.user.city = city;

      return { success: true, city };
    }),
};
export type AppRouter = typeof appRouter;
