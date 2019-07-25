export interface Proxy {
  [index: string]: {
    target: string;
    changeOrigin?: boolean;
    pathRewrite?: { [index: string]: string };
  };
}

export default {
  '/api': {
    target: 'http://bs.jslesoft.com:8028', 
  },
} as Proxy;
