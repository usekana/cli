import fs from "fs";
import YAML from "yaml";
import { KanaConfig } from "../model";

export const showArt = () => {
  const art = fs.readFileSync(
    new URL("../../assets/art.txt", import.meta.url),
    "utf8"
  );
  console.log(art);
};

export const parseYaml = (data: KanaConfig) => {
  const fDoc = new YAML.Document({ features: data.features });
  const pDoc = new YAML.Document({ packages: data.packages });

  const header = `# Updated: ${new Date()}

# PROJECT: ${data.app}
`;

  const fDocStr = YAML.stringify(fDoc);
  const pDocStr = YAML.stringify(pDoc);

  const fComment = `
# FEATURES
`;
  const pComment = `
# PACKAGES
`;

  const result = header + fComment + fDocStr + pComment + pDocStr;

  return result;
};

export const cleanConfig = (data: KanaConfig) => {
  data.packages.draft = data.packages.draft.map((p) => ({
    ...p,
    features: p.features.map((f) => ({
      ...f,
      overage_enabled: !!f.overage_enabled ? f.overage_enabled : undefined,
    })),
  }));

  data.packages.published = data.packages.published.map((p) => ({
    ...p,
    features: p.features.map((f) => ({
      ...f,
      overage_enabled: !!f.overage_enabled ? f.overage_enabled : undefined,
    })),
  }));
  return data;
};
