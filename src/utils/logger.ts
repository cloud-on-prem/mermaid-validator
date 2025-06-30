import chalk from 'chalk';

export const logger = {
  success: (message: string) => {
    console.log(chalk.green(message));
  },
  error: (message: string) => {
    console.error(chalk.red(message));
  },
  info: (message: string) => {
    console.info(chalk.blue(message));
  },
};
