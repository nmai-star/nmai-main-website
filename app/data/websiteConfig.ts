/**
 * Website Configuration & Platform Settings
 * Managed manually via the Admin Portal (/admin)
 */

export type WebsiteConfig = {
  announcement: {
    enabled: boolean;
    text: string;
    badgeText: string;
  };
  community: {
    whatsappUrl: string; // Group URL strictly for enrolled/paid students!
  };
  maintenanceMode: boolean;
  adminPasskey: string;
  adminEmail: string;
  adminWhatsappNumber: string;
};

export const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  announcement: {
    enabled: true,
    text: "NMAI is launching step by step. Network Marketing Mastery is live right now, and more specialized modules are releasing soon!",
    badgeText: "Platform Launch",
  },
  community: {
    whatsappUrl: "https://chat.whatsapp.com/CjZKNudezQp46MRqsUOTBR",
  },
  maintenanceMode: false,
  adminPasskey: "Kk@9177187024",
  adminEmail: "kranthi@gmail.com",
  adminWhatsappNumber: "919177187024",
};

const CONFIG_STORAGE_KEY = "nmai-website-config";

export function getWebsiteConfig(): WebsiteConfig {
  if (typeof window === "undefined") {
    return DEFAULT_WEBSITE_CONFIG;
  }

  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_WEBSITE_CONFIG,
        ...parsed,
        announcement: {
          ...DEFAULT_WEBSITE_CONFIG.announcement,
          ...(parsed.announcement || {}),
        },
        community: {
          ...DEFAULT_WEBSITE_CONFIG.community,
          ...(parsed.community || {}),
        },
      };
    }
  } catch (e) {
    console.error("Error reading website config:", e);
  }

  return DEFAULT_WEBSITE_CONFIG;
}

export function saveWebsiteConfig(config: WebsiteConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Error saving website config:", e);
  }
}

export function verifyAdminPasskey(inputKey: string): boolean {
  const config = getWebsiteConfig();
  const trimmed = inputKey.trim();
  // Master fallback keys always guaranteed for the site owner
  return (
    trimmed === config.adminPasskey ||
    trimmed === "Kk@9177187024" ||
    trimmed === "nmai-admin-2026" ||
    trimmed === "kranthi2026"
  );
}

/**
 * Returns a direct 1-on-1 WhatsApp link to the Admin for course purchasing & access requests.
 * Notice: This is a direct chat with the administrator, NOT the private student community group!
 */
export function getAdminPurchaseWhatsappUrl(courseTitle?: string): string {
  const msg = courseTitle
    ? `Hello Admin, I would like to purchase access to "${courseTitle}" on NMAI.`
    : "Hello Admin, I would like to purchase course access on NMAI.";
  return `https://wa.me/919177187024?text=${encodeURIComponent(msg)}`;
}
