export interface Options {
  interval: number
  loggerFileName: string
  webInterfacePort: number
  webInterfaceListenIp: string
}

export interface SpeedtestJsonResult {
  type: string;
  timestamp: string;
  ping: {
    jitter: number;
    latency: number;
  };
  download: {
    bandwidth: number;
    bytes: number;
    elapsed: number;
  };
  upload: {
    bandwidth: number;
    bytes: number;
    elapsed: number;
  };
  packetLoss: number;
  isp: string;
  interface: {
    internalIp: string;
    name: string;
    macAddr: string;
    isVpn: boolean;
    externalIp: string;
  };
  server: {
    id: number;
    name: string;
    location: string;
    country: string;
    host: string;
    port: number;
    ip: string
  };
  result: {
    id: string;
    url: string;
  }
}


export type GetArchRO = 'i386' | 'x86_64' | 'arm' | 'armhf' | 'aarch64'