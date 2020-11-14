export type SocketStatus = 'connected' | 'disconnected' | 'updating';

export interface SpeedtestData {
  date: string,
  ping: number,
  jitter: number,
  download: number,
  upload: number,
  server_name: string,
}