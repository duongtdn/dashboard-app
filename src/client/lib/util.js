"use strict"

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function ustring(ln) {
  return Math.random().toString(36).substr(2,ln)
}
