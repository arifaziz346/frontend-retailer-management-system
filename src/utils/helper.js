export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date)) return "";

  // Format: YYYY-MM-DD
  return date.toISOString().split("T")[0];
}

// Round any number safely
export function round(value, decimals = 2) {
  if (value === null || value === undefined || value === '') return 0;

  return Number(
    Math.round(parseFloat(value + "e" + decimals)) + "e-" + decimals
  );
}

// Calculate profit percentage safely


export function profitPercentage(sale, cost) {
  sale = Number(sale);
  cost = Number(cost);

  if (!cost || cost <= 0) return "0%";

  const percent = ((sale - cost) / cost) * 100;
  return round(percent, 2) + "%";
}

// Format price: 3000 → 3,000.00
export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return "0.00";
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
