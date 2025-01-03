// src/utils/getTimeSpan.ts

export function getTimeSpan(currentDate: Date, lastModifiedDate: Date): string {
  const diffInMs = currentDate.getTime() - lastModifiedDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 3600 * 24)) // Convert milliseconds to days

  // Handle the case for "today"
  if (diffInDays === 0) {
    return "today"
  }

  // Handle the case for 1 day and 2 days
  if (diffInDays === 1) {
    return "yesterday"
  } else if (diffInDays === 2) {
    return "day before yesterday"
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else if (diffInDays < 30) {
    const diffInWeeks = Math.floor(diffInDays / 7)
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`
  } else if (diffInDays < 365) {
    const diffInMonths = Math.floor(diffInDays / 30)
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`
  } else {
    const diffInYears = Math.floor(diffInDays / 365)
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`
  }
}
