const {
  spinners: { dsiSpinner, mechanicSpinner },
  colors: { success, fail },
  logo: { dsi, mechanic }
} = require("@designsystemsinternational/mechanic-utils");

console.log(dsi, "\n");

console.log(mechanic, "\n");

console.log(success("This is a success colored message."), "\n");

console.log(fail("This is a fail colored message."), "\n");

const trySpinner = async (spinner, option = "success", duration = 5000) => {
  spinner.start("Starting off spinner...");
  await new Promise(resolve => setTimeout(resolve, duration));
  switch (option) {
    case "success":
      spinner.succeed(option);
      break;
    case "fail":
      spinner.fail(option);
      break;
    case "warn":
      spinner.warn(option);
      break;
    default:
      spinner.stop();
      break;
  }
};

const trySpinners = async spinners => {
  for (const spinner of spinners) {
    await trySpinner(spinner, "success");
    await trySpinner(spinner, "warn");
    await trySpinner(spinner, "fail");
    console.log("");
  }
};

trySpinners([dsiSpinner, mechanicSpinner]);
