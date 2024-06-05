import { endOfDay, format } from "date-fns";

// const todayDate = "2024-01-12";
const todayDate = format(endOfDay(new Date()), "yyyy-MM-dd");

export const urlOneNightLogGet = `http://localhost:8000/api/sleep-log?date=${todayDate}`;
export const urlOneNightLogPost = "http://localhost:8000/api/sleep-log";
export const ulrArgumentNightLog = "http://localhost:8000/api/sleep-avg-log";
