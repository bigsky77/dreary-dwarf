export { getFormattedDate } from "./date";
export { elementHasClass, toggleClass, rootInDarkMode } from "./domElement";
export { generateToc, type TocItem } from "./generateToc";
export { getWebmentionsForUrl } from "./webmentions";

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
