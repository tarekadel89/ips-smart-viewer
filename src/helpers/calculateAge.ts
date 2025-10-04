export default function calculateAge(birthDate: string): string {
  const today = new Date();
  const birth = new Date(birthDate);

  const diffMs = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths =
    today.getMonth() -
    birth.getMonth() +
    12 * (today.getFullYear() - birth.getFullYear());
  const diffYears = today.getFullYear() - birth.getFullYear();

  if (diffDays < 28) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  } else if (diffDays < 60) {
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""}`;
  } else if (diffMonths < 24) {
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
    } else {
      const months = diffMonths % 12;
      return `${diffYears} year${diffYears !== 1 ? "s" : ""}${
        months > 0 ? `, ${months} month${months !== 1 ? "s" : ""}` : ""
      }`;
    }
  } else {
    return `${diffYears} year${diffYears !== 1 ? "s" : ""}`;
  }
}
