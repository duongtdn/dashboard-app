"use strict"

import Order from './Page/Order'
import Report from './Page/Report'

export default {
  order: {
    Page: Order,
    href: '/order'
  },
  report: {
    Page: Report,
    href: '#'
  },
}
