import { GetArchRO } from '../types/index';
import { exec as terminalExec } from 'child_process';

export const exec = (command: string): Promise<GetArchRO> => {
  return new Promise((resolve, reject) => {
    terminalExec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stderr) {
        reject(stderr);
      }

      resolve(stdout as unknown as GetArchRO);
    });
  });
};