import fs from "fs";

export const showArt = () => {
  const art = fs.readFileSync(
    new URL("../../assets/art.txt", import.meta.url),
    "utf8"
  );
  console.log(art);
};
