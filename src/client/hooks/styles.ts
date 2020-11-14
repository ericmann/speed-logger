import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  grow: {
    flexGrow: 1,
  },
  main: {
    width: '100%',
    height: '100%',
    padding: '84px 20px 20px 20px',
    position: 'relative',
    backgroundColor: theme.palette.primary.light,
  },
  paper: {
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    overflow: 'hidden',
  },
}));
