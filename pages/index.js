import 'nodent-runtime';
import { injectGlobal } from 'styled-components';
import Application from '../src/containers/Application';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  body {
    margin: 0;
    font-size: 16px;
    color: #222;
    line-height: 22px;
    font-family: arial, sans-serif;
  }
`;

export default () => <Application />;
