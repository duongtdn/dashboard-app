"use strict"

const app = 'admin';
const urlAccount = 'http://localhost:3100';

const assets = {
  logo: {
    png_trans: '',
    png_bg: '',
    icon: 'assets/icon.png',
  },
};

const remote = {
  order: {
    fetch: 'api/order',
    push: 'api/order',
  }
};

const template = {
  avata: {
    female: 'https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100',
    male: 'https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100',
  },
};

export default { remote, app, urlAccount, assets, template }
