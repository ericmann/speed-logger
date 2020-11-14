import dayjs from 'dayjs';

export const getDashes = (n: number): string => Array.from(new Array(n), () => '-').join('');

export const getLogEntryHeader = (): string => {
    return `${getDashes(15)}[ ${dayjs().format('YYYY-MM-DD HH:mm:ss')} ]${getDashes(15)}`;
};