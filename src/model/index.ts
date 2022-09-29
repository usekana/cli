type FeatureConfig = {
  id: string;
  name: string;
  type: "CONSUMABLE" | "BINARY";
};

type PackageOnFeatureConfig = {
  id: string;
  limit?: number | null;
  overage_enabled?: boolean;
  reset_period?: "YEAR" | "MONTH" | "DAY";
};

export type PackageConfig = {
  id: string;
  name: string;
  features: PackageOnFeatureConfig[];
};

type AddonConfig = PackageConfig & {
  base_packages: string[];
};

export type KanaConfig = {
  app: string;
  version: string;
  features: FeatureConfig[];
  packages: {
    draft: PackageConfig[];
    published: PackageConfig[];
  };
  addons: {
    draft: AddonConfig[];
    published: AddonConfig[];
  };
};
