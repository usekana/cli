type FeatureConfig = {
  id: string;
  name: string;
  type: "CONSUMABLE" | "BINARY";
};

type PackageOnFeatureConfig = {
  id: string;
  limit?: number | null;
  overage_enabled?: boolean;
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
