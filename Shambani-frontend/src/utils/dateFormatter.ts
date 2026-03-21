/**
Safe date formatter for ECONNECT
Prevents .split() errors and handles null/undefined gracefully
 */

export const safeFormatDate = (
  dateString: string | undefined | null,
  fallback: string = "N/A"
): string => {
  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return fallback;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return fallback;
  }
};

export const safeFormatTime = (
  dateString: string | undefined | null,
  fallback: string = "N/A"
): string => {
  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return fallback;

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Time formatting error:", error);
    return fallback;
  }
};

export const safeFormatDateTime = (
  dateString: string | undefined | null,
  fallback: string = "N/A"
): string => {
  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return fallback;

    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("DateTime formatting error:", error);
    return fallback;
  }
};

// Safe alternative to dateString.split('T')[0]
export const safeExtractDate = (
  dateString: string | undefined | null
): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Date extraction error:", error);
    return "";
  }
};
