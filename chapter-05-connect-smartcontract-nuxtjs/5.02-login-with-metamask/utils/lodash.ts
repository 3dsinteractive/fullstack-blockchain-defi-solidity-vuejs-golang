import get from 'lodash/get'
import set from 'lodash/set'
import findIndex from 'lodash/findIndex'
import dropRight from 'lodash/dropRight'
import intersection from 'lodash/intersection'
import {
  castArray,
  debounce,
  difference,
  flatten,
  flattenDeep,
  head,
  isArray,
  isEmpty,
  isEqual,
  isNil,
  isObject,
  isUndefined,
  join,
  map,
  merge,
  omitBy,
  sortBy,
  uniq,
  uniqBy
} from 'lodash'

export const _get = (object: any, path: string, def: any): any => {
  return get(object, path, def)
}

export const _isUndefined = (value: any): boolean => {
  return isUndefined(value)
}

export const _dropRight = (value: any[], count = 1): any[] => {
  return dropRight(value, count)
}

export const _intersection = (value: any[], value2: any[]): any[] => {
  return intersection(value, value2)
}

export const _set = (object: any, path: string, def: any): any => {
  return set(object, path, def)
}

export const _map = (object: any, funn: Function): any[] => {
  return map(object, funn)
}

export const _flatten = (object: any[]): any => {
  return flatten(object)
}

export const _flatDeep = (object: any[]): any[] => {
  return flattenDeep(object)
}

export const _uniq = (object: any[]): any[] => {
  return uniq(object)
}

export const _sortBy = (object: any[], func?: (o: any) => boolean): any[] => {
  return func ? sortBy(object, func) : sortBy(object)
}

export const _uniqBy = (object: any[], func: Function): any[] => {
  return uniqBy(object, func)
}

export const _clone = (object: any): any => {
  try {
    return JSON.parse(JSON.stringify(object || {}))
  } catch (e) {
    return {}
  }
}

export const _isEmpty = (object: any): boolean => {
  return isEmpty(object)
}

export const _isObject = (object: any): boolean => {
  return isObject(object)
}
export const _isArray = (arr: any): boolean => {
  return isArray(arr)
}

export const _debounce = <T extends (...args: any[]) => any>(func: T, wait: number = 150) => {
  return debounce(func, wait)
}

export const _findIndex = (obj: any, fn: (item: any) => boolean): number => {
  return findIndex(obj, fn)
}
export const _isEqual = (value: any, other: any): boolean => {
  return isEqual(value, other)
}

export const _difference = (value: any[], other: any[]): any[] => {
  return difference(value, other)
}

export const _merge = (value: object, other: object): object => {
  return merge(value, other)
}

export const _isNil = (value: any): boolean => {
  return isNil(value)
}

export const _omitBy = (obj: any) => {
  return omitBy(obj, (v) => _isUndefined(v) || v === '')
}

export const _join = (value: any, separator: string): string => {
  return join(value, separator)
}

export const _castArray = (value: any): any[] => {
  return castArray(value)
}

export const _head = (value: any): any => {
  return head(value)
}
