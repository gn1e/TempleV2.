import chalk from 'chalk';

class Logger {
  static backend = (message) => {
    console.log(chalk.blue(`[BACKEND]: ${message}`));
  };

  static info = (message) => {
    console.log(chalk.green(`[INFO]: ${message}`));
  };

  static error = (message) => {
    console.log(chalk.red(`[ERROR]: ${message}`));
  };

  static warning = (message) => {
    console.log(chalk.yellow(`[WARNING]: ${message}`));
  };
}

export default Logger;