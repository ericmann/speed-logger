import React, { Fragment } from 'react';
import { Container, Toolbar, AppBar } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { useSocket } from './hooks/socket';
import { useStyles } from './hooks/styles';
import { StatusIndicator } from './components/status-indicator';
import { Chart } from './components/chart';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#25253c',
      main: '#141526',
      dark: '#000',
      contrastText: '#fff',
    },
  },
});

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Application />
      </CssBaseline>
    </ThemeProvider>
  );
};

const Application = () => {
  const [socket, status] = useSocket();
  const { main } = useStyles();

  return (
    <Fragment>
      <AppBar>
        <Container>
          <Toolbar>
            <StatusIndicator status={status} />
          </Toolbar>
        </Container>
      </AppBar>
      <main className={main}>
        <Chart socket={socket} />
      </main>
    </Fragment>
  );
};

export default App;