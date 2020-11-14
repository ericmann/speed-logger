import { Configuration } from 'webpack';
import merge from 'webpack-merge';

import devConfig from './webpack.dev';

export default merge(devConfig, { mode: 'production' } as Configuration);