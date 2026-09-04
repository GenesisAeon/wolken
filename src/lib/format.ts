/** German decimal comma for live readouts. Coefficients stay ASCII. */
export function formatDe(n: number, digits = 1): string {
  return n.toFixed(digits).replace(".", ",");
}
