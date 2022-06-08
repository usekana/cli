interface FeatureConfig {
  id: string;
  name: string;
  type: "CONSUMABLE" | "BINARY";
}

interface PackageOnFeatureConfig {
  id: string;
  limit: number | null;
  overage_enabled: boolean;
}

interface PackageConfig {
  id: string;
  name: string;
  addon: boolean;
  addons: string[];
  features: PackageOnFeatureConfig[];
}

export interface KanaConfig {
  features: FeatureConfig[];
  packages: PackageConfig[];
}
