/**
 * Core Modules
 */

import fs from 'fs';
import express from 'express';
import http from 'http';
import path from 'path';
import socketio from 'socket.io';
import dayjs from 'dayjs';
import yargs from 'yargs';
import delay from 'delay';

/**
 * Engine Modules
 */

import { SpeedtestJsonResult } from './types/index';

import { formatBytes } from './libs/formatBytes';
import { exec } from './libs/helpers';
import { getLogEntryHeader, getDashes } from './libs/logger';
import { getDefaultOptions, ArgvModes } from './options';
import { SpeedtestData } from '../client/interfaces/socket.interface';

/**
 * Logic
 */

const options = getDefaultOptions();
const pathToBinaries = path.resolve(__dirname, `../../binaries/`);

const typeChoices: ReadonlyArray<ArgvModes> = ['simple', 'web'];
const argv = yargs.options({
  server: { type: 'number' },
  type: { choices: typeChoices },
  interval: { type: 'number' },
  log: { type: 'string' },
  'web-port': { type: 'number' },
  'web-host': { type: 'string' },
}).argv;

const logSpeed = async (arch: string, io: socketio.Server) => {
  try {
    const result = await exec(`${path.join(pathToBinaries, arch)} --format=json ${argv.server ? `--server-id=${argv.server}` : ''} --accept-license`);
    const out: SpeedtestJsonResult = JSON.parse(result);

    const date = dayjs(out.timestamp).format('YYYY-MM-DD HH:mm:ss');
    const ping = out.ping.latency;
    const jitter = out.ping.jitter;
    const downloadSpeed = formatBytes(out.download.bandwidth * 8.4);
    const uploadSpeed = formatBytes(out.upload.bandwidth * 8.4);

    if (!argv.type || argv.type === 'simple') {
      console.log(`${date} => Ping: ${ping}ms | Jitter: ${jitter}ms | Download: ${downloadSpeed}ps | Upload: ${uploadSpeed}ps | Server: ${out.server.name}`);
    } else {
      const clientData: SpeedtestData = {
        date: date.toString(),
        ping,
        jitter,
        download: out.download.bandwidth,
        upload: out.upload.bandwidth,
        server_name: out.server.name,
      };

      io.emit('entry', JSON.stringify(clientData));
    }

    await fs.promises.appendFile(argv.log || options.loggerFileName, `${date},${ping},${jitter},${out.download.bandwidth},${out.upload.bandwidth},${out.server.name},${out.result.url}\n`);
  } catch (error) {
    console.error(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} => Test failed, see dump at error.log`);
    fs.appendFileSync('error.log', `${getLogEntryHeader()}\n${error}\n${getDashes(53)}\n`);
  }

  await delay(options.interval * 1000);
  await logSpeed(arch, io);
};

const init = async () => {
  const arch = (await exec('arch')).replace(/\n/g, '');
  const binaries = fs.readdirSync(pathToBinaries);

  if (!binaries.includes(arch)) {
    throw new Error('No binary matching your system arch found!');
  }

  const host = argv['web-host'] || options.webInterfaceListenIp;
  const port = argv['web-port'] || options.webInterfacePort;
  const content = await fs.promises.readFile(path.resolve(__dirname, '../../index.html'), { encoding: 'utf-8' });

  let io: socketio.Server | null;

  if (argv.type === 'web') {
    const app = express();
    const server = http.createServer(app);
    io = socketio(server);

    app.use(express.static(path.resolve(__dirname, '../../dist/client/')));
    app.get('*', (req, res) => {
      res.send(content);
    });

    server.listen(port, host, () => {
      const fullUri = `http://${host}:${port}`;
      console.log(`Webserver listening at ${fullUri}`);
    });

    io.on('connection', (socket: socketio.Server) => {
      socket.on('ready-for-history', async () => {
        const history = await fs.promises.readFile(path.resolve(__dirname, '../../log.csv'), { encoding: 'utf-8' });
        const entries = history.split('\n');
        const datas: Array<SpeedtestData> = entries.map((entry) => {
          const splitted = entry.split(',');

          const clientData: SpeedtestData = {
            date: splitted[0],
            ping: parseFloat(splitted[1]),
            jitter: parseFloat(splitted[2]),
            download: parseFloat(splitted[3]),
            upload: parseFloat(splitted[4]),
            server_name: splitted[5],
          };
  
          return clientData;
        });
  
        socket.emit('history', datas);
      });
    });
  }

  logSpeed(arch, io);
};

init().catch((e) => console.error(e));
