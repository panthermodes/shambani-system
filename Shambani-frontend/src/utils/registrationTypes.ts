/**
 * Registration Type Utilities
 * Handles both frontend and backend registration type formats
 */

export type RegistrationType = "normal" | "premier" | "silver" | "diamond";

/**
 * Normalizes registration type from backend format to frontend format
 * Backend: "normal_registration", "premier_registration", etc.
 * Frontend: "normal", "premier", etc.
 */
export function normalizeRegistrationType(
  type: string | undefined
): RegistrationType | null {
  if (!type) return null;

  // Remove '_registration' suffix if present
  const normalized = type.replace("_registration", "").toLowerCase();

  // Validate it's a known type
  const validTypes: RegistrationType[] = [
    "normal",
    "premier",
    "silver",
    "diamond",
  ];
  if (validTypes.includes(normalized as RegistrationType)) {
    return normalized as RegistrationType;
  }

  return null;
}

/**
 * Checks if registration type is a Talent Hub tier (not normal/school-based)
 */
export function isTalentHubTier(type: string | undefined): boolean {
  const normalized = normalizeRegistrationType(type);
  return (
    normalized === "premier" ||
    normalized === "diamond" ||
    normalized === "silver"
  );
}

/**
 * Gets registration type display name
 */
export function getRegistrationTypeName(type: string | undefined): string {
  const normalized = normalizeRegistrationType(type);

  switch (normalized) {
    case "premier":
      return "Premier - Talent Hub";
    case "diamond":
      return "Diamond 💎 - Talent Hub";
    case "silver":
      return "Silver - Talent Hub";
    case "normal":
      return "Normal - School Club";
    default:
      return "Unknown";
  }
}

/**
 * Gets registration type color classes for badges
 */
export function getRegistrationTypeColors(type: string | undefined): {
  gradient: string;
  border: string;
  text: string;
} {
  const normalized = normalizeRegistrationType(type);

  switch (normalized) {
    case "premier":
      return {
        gradient: "from-purple-600 to-pink-600",
        border: "border-purple-200",
        text: "text-purple-600",
      };
    case "diamond":
      return {
        gradient: "from-cyan-500 to-blue-600",
        border: "border-cyan-200",
        text: "text-cyan-600",
      };
    case "silver":
      return {
        gradient: "from-gray-500 to-gray-600",
        border: "border-gray-300",
        text: "text-gray-600",
      };
    case "normal":
    default:
      return {
        gradient: "from-blue-600 to-blue-700",
        border: "border-blue-200",
        text: "text-blue-600",
      };
  }
}

/**
 * Gets training location based on registration type
 */
export function getTrainingLocation(type: string | undefined): string {
  return isTalentHubTier(type) ? "EConnect Talent Hub" : "CTM Club at School";
}

/**
 * Gets benefits description based on registration type
 */
export function getBenefits(type: string | undefined): string {
  const normalized = normalizeRegistrationType(type);

  switch (normalized) {
    case "premier":
      return "Full Mentorship";
    case "diamond":
      return "Premium Access";
    case "silver":
      return "Standard Access";
    case "normal":
      return "School Training";
    default:
      return "Basic Access";
  }
}
