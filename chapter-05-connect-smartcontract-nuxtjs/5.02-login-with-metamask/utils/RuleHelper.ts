import { _isEmpty, _isNil, _isUndefined } from '~/utils/lodash'

export default class RuleHelper {
  static email = (value: string) => {
    return (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      ) || 'Email is not valid'
    )
  }

  static alias = (value: string) => {
    return isAlias(value) || 'Alias is invalid'
  }

  static required = (value: any) => {
    return (
      (!!value && !_isUndefined(value) && !_isNil(value)) ||
      'This field is required'
    )
  }

  static multipleRequired = (value: Array<any>) => {
    return (
      (!!value && !_isUndefined(value) && !_isNil(value) && value.length > 0) ||
      'This field is required'
    )
  }

  static fileRequired = (value: File) => {
    return (
      (!!value?.name &&
        !_isUndefined(value.name) &&
        !_isNil(value.name) &&
        !_isEmpty(value.name)) ||
      'This field is required'
    )
  }

  static url = (value: any) => {
    return (
      (!!value && !_isUndefined(value) && isURL(value)) ||
      'This field must be URL'
    )
  }

  static decimal = (value: any) => {
    return (
      (!!value && !_isUndefined(value) && isDemical(value)) ||
      'This field must be numeric may contain decimal points'
    )
  }

  static min = (min: number) => {
    return (value: any) =>
      (!!value && value.length >= min) ||
      `This field value must more than ${min}`
  }

  static max = (max: number) => {
    return (value: any) =>
      (!!value && value.length <= max) ||
      `This field value must less than ${max}`
  }

  static confirm = (pass: string) => {
    return (value: any) =>
      (!!value && pass === value) || 'This field confirmation does not match'
  }

  static num = (value: any) => {
    return (
      (!!value && !_isUndefined(value) && isNum(value)) ||
      'This field must be numeric'
    )
  }

  static numMin = (min: number) => {
    return (value: number) =>
      !(value < min) || `This field value must more than ${min}`
  }

  static numMax = (max: number) => {
    return (value: number) =>
      !(value > max) || `This field value must less than ${max}`
  }

  static numMinIf = (condition: boolean, min1: number, min2: number) => {
    let min: number
    condition ? (min = min1) : (min = min2)
    return (value: number) =>
      !(value < min) || `This field value must more than ${min}`
  }

  static json = (value: string) => {
    try {
      JSON.parse(value)
    } catch (e) {
      return 'JSON format is invalid'
    }
    return true
  }
}

const isAlias = (text: any): boolean => {
  return /^[a-z0-9][a-z0-9\-\_]*$[^\s]*/.test(text)
}

const isURL = (text: any): boolean => {
  return /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
    text
  )
}

const isNum = (text: any): boolean => {
  return /^[0-9]*$/.test(text)
}

const isDemical = (test: any): boolean => {
  return /^\d*\.?\d*$/.test(test)
}
