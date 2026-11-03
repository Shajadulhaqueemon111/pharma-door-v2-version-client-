import { useEffect, useState } from "react";

export type PharmacistThemeConfig = {
  sidebarBg: string;
  accentColor: string;
  textColor: string;
  mode: "dark" | "light";
};

export const defaultPharmacistTheme: PharmacistThemeConfig = {
  sidebarBg: "#0f172a", // Sleek dark slate
  accentColor: "#0d9488", // Professional Medical Teal
  textColor: "#ffffff",
  mode: "light",
};

export const getPharmacistTheme = (): PharmacistThemeConfig => {
  if (typeof window === "undefined") return defaultPharmacistTheme;
  try {
    const saved = localStorage.getItem("pharmadoor_pharmacist_theme");
    if (saved) {
      return { ...defaultPharmacistTheme, ...JSON.parse(saved) };
    }
  } catch {
    // fallback
  }
  return defaultPharmacistTheme;
};

export const savePharmacistTheme = (theme: Partial<PharmacistThemeConfig>) => {
  const current = getPharmacistTheme();
  const updated = { ...current, ...theme };
  localStorage.setItem("pharmadoor_pharmacist_theme", JSON.stringify(updated));
  window.dispatchEvent(new Event("pharmacistThemeChanged"));
  return updated;
};

export const usePharmacistTheme = () => {
  const [themeConfig, setThemeConfig] = useState<PharmacistThemeConfig>(getPharmacistTheme());

  useEffect(() => {
    const handleUpdate = () => {
      setThemeConfig(getPharmacistTheme());
    };
    window.addEventListener("pharmacistThemeChanged", handleUpdate);
    return () => window.removeEventListener("pharmacistThemeChanged", handleUpdate);
  }, []);

  return {
    themeConfig,
    setThemeConfig: (cfg: Partial<PharmacistThemeConfig>) => savePharmacistTheme(cfg),
  };
};

