import { Options } from './types/index';

const defaultOptions: Options = {
  // Interval of test in second
  interval: 1,
  // Name of file to save history
  loggerFileName: 'log.csv',
  // Port of web interface
  webInterfacePort: 3131,
  // IP to start server
  webInterfaceListenIp: 'localhost',
};

export const getDefaultOptions = (): Options => defaultOptions;

export type ArgvModes = 'simple' | 'web'