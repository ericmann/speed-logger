import { useState, useEffect, useRef } from 'react';
import { SpeedtestData } from '../interfaces/socket.interface';

export const useData = (socket: SocketIOClient.Socket): SpeedtestData[] => {
  const [data, setData] = useState<SpeedtestData[]>([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current === true) {
      socket.emit('ready-for-history');

      socket.on('history', (entries: SpeedtestData[]) => {
        setData(entries);
      });

      isInitialMount.current = false;
    } else {
      socket.on('entry', (entry: SpeedtestData) => {
        console.log('new entry', data, entry);
        const newData = [...data];
        newData.push(entry);
        setData(newData);
      });
    }
  }, []);

  return data;
};