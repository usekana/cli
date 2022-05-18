import inquirer from "inquirer";
import Conf from "conf";

export const getApiKey = async () => {
  const config = new Conf();
  let apikey = config.get("apikey");
  if (!apikey) {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "apikey",
        message: "Please provide your private API key",
      },
    ]);
    apikey = answer.apikey;
    config.set("apikey", apikey);

    if (!apikey) {
      throw "apikey is required";
    }
  }

  return apikey;
};

export const deleteApikey = () => {
  const config = new Conf();
  let apikey = config.delete("apikey");
  console.info("deleted:", apikey);
};
