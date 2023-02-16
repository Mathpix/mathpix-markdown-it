/**
 * Configuration file for the Array package.
 */

import { Configuration } from 'mathjax-full/js/input/tex/Configuration.js';
import './ArrayMappings';

export const ArrayConfiguration = Configuration.create(
  'array',
  {
    handler: {
      environment: ['array-environment']
    }
  }
);


