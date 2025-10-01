/**
 * Smart refetch logic for CNB daily rates
 * CNB updates rates once per business day at 14:30 Czech time
 */

export function shouldRefetchRates(cnbDataDate?: string): boolean {
  console.group("[CNB Refetch] Evaluating refetch decision");
  console.log("[CNB Refetch] CNB data date:", cnbDataDate || "none");

  if (!cnbDataDate) {
    console.log("[CNB Refetch] Decision: REFETCH - No existing data");
    console.groupEnd();
    return true;
  }

  const czechNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Prague" }),
  );
  console.log(
    "[CNB Refetch] Current Czech time:",
    czechNow.toLocaleString("cs-CZ"),
  );

  if (isWeekend(czechNow)) {
    console.log("[CNB Refetch] Decision: NO REFETCH - Weekend (CNB closed)");
    console.groupEnd();
    return false;
  }

  // Parse CNB date (format: "26 Sep 2025") and set to 14:30 Czech time
  const cnbDate = parseCnbDate(cnbDataDate);
  if (!cnbDate) {
    console.log(
      "[CNB Refetch] Decision: REFETCH - Invalid date format, refetching for safety",
    );
    console.groupEnd();
    return true;
  }

  const cnbPublishTime = new Date(cnbDate);
  cnbPublishTime.setHours(14, 30, 0, 0);

  const todayPublishTime = new Date(czechNow);
  todayPublishTime.setHours(14, 30, 0, 0);

  console.log(
    "[CNB Refetch] Data published on:",
    cnbPublishTime.toLocaleDateString("cs-CZ"),
  );
  console.log(
    "[CNB Refetch] Today publish time:",
    todayPublishTime.toLocaleString("cs-CZ"),
  );

  // If current Czech time is before today's publish time, don't refetch yet
  if (czechNow < todayPublishTime) {
    console.log("[CNB Refetch] Decision: NO REFETCH - Before 14:30 today");
    console.groupEnd();
    return false;
  }

  // If we have today's data (published after 14:30), don't refetch
  if (isSameDay(czechNow, cnbPublishTime)) {
    console.log(
      "[CNB Refetch] Decision: NO REFETCH - Already have current data",
    );
    console.groupEnd();
    return false;
  }

  console.log(
    "[CNB Refetch] Decision: REFETCH - Data is outdated and new data available",
  );
  console.groupEnd();
  return true;
}

function parseCnbDate(dateString: string): Date | null {
  try {
    // CNB format: "26 Sep 2025"
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}
