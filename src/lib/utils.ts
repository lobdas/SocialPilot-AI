import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | number, formatStyle: "short" | "medium" | "long" | "time" = "medium"): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

  if (formatStyle === "time") {
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  if (formatStyle === "short") {
    return `${month} ${day}`;
  }

  if (formatStyle === "long") {
    return `${month} ${day}, ${year} at ${formattedHours}:${minutes} ${ampm}`;
  }

  return `${month} ${day}, ${formattedHours}:${minutes} ${ampm}`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
