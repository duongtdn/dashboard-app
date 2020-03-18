"use strict"

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function ustring(ln) {
  return Math.random().toString(36).substr(2,ln)
}

export function localeString(x, sep, grp) {
  const sx = (''+x).split('.');
  let s = '';
  let i, j;
  sep || (sep = '.'); // default seperator
  grp || grp === 0 || (grp = 3); // default grouping
  i = sx[0].length;
  while (i > grp) {
      j = i - grp;
      s = sep + sx[0].slice(j, i) + s;
      i = j;
  }
  s = sx[0].slice(0, i) + s;
  sx[0] = s;
  return sx.join('.');
}

export function getDay(timestamp, format = 'simple', seperator = '/') {
  const date = new Date(timestamp);
  const weekday = {
    long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    short:  ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
  };
  const dd = `${date.getDate()}${seperator}${date.getMonth()+1}${seperator}${date.getFullYear()}`;
  if (format === 'short') {
    return weekday.short[date.getDay()] + ' ' + dd;
  }
  if (format === 'long') {
    return weekday.long[date.getDay()] + ' ' + dd;
  }
  return dd;
}

export function getTime(timestamp) {
  const date = new Date(timestamp)
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
