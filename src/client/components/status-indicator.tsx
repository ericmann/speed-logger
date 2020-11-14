import React from 'react';
import { Tooltip } from '@material-ui/core';
import { Lens } from '@material-ui/icons';
import red from '@material-ui/core/colors/red';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';

import { SocketStatus } from '../interfaces/socket.interface';

const colors: { [key in SocketStatus]: string } = {
  connected: green[500],
  updating: amber[500],
  disconnected: red[500],
};

export const StatusIndicator = ({ status }: { status: SocketStatus }): JSX.Element => (
  <Tooltip title={status.toUpperCase()}>
    <Lens style={{ color: colors[status] }} />
  </Tooltip>
);