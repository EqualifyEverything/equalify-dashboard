import Hotjar from '@hotjar/browser';

const siteId = 5060699;
const hotjarVersion = 6;

export const initHotjar = () => {
  Hotjar.init(siteId, hotjarVersion);
};