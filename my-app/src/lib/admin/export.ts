/**
 * Export utilities for admin dashboard
 */

/**
 * Convert data to CSV format and trigger download
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) {
    return;
  }

  // Use provided columns or auto-detect from first row
  const cols = columns || Object.keys(data[0]).map((key) => ({ key, label: key }));

  // Create CSV header
  const header = cols.map((col) => col.label).join(",");

  // Create CSV rows
  const rows = data.map((row) => {
    return cols
      .map((col) => {
        const value = row[col.key];
        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value ?? "");
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });

  // Combine header and rows
  const csv = [header, ...rows].join("\n");

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Convert data to JSON format and trigger download
 */
export function exportToJSON<T>(data: T[], filename: string): void {
  if (data.length === 0) {
    return;
  }

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
