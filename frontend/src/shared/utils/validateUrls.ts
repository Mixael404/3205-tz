const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export function validateUrls(value: string) {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return "Add at least one URL";
  }

  const invalidLines = lines.filter((line) => !URL_REGEX.test(line));

  if (invalidLines.length > 0) {
    return `Invalid URL${invalidLines.length > 1 ? "s" : ""}: ${invalidLines.join(", ")}`;
  }

  return true;
}
