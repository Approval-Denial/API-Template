const chalk = require("chalk");
function logger(opt) {
  const outputs = [];
  if (opt.title) outputs.push({ color: (opt.colors && opt.colors.title) ? opt.colors.title : "magenta", body: "[" + opt.title.toUpperCase() + "]" });
  if (opt.header) outputs.push({ color: (opt.colors && opt.colors.header) ? opt.colors.header : "greenBright", body: `${opt.header.charAt(0).toUpperCase()}${opt.header.slice(1)}` });
  if (opt.content) outputs.push({ color: (opt.colors && opt.colors.content) ? opt.colors.content : "blueBright", body: opt.content });
  if (!opt.args) opt.args = [];
  console.log(outputs.map(out => chalk[out.color](out.body)).join(chalk.blue(" / ")) + (opt.args.length > 0 ? chalk.blue(" / ") : "") + opt.args.map(d => chalk[d.color](d.body) + (d.slash ? chalk.blue(" / ") : "")).join(""));
};
module.exports = { logger }