export class ArrayHelper {
  static toArray<T>(value: any): (T | any)[] {
    return Array.from(value || [])
  }

  static isEmpty(value: any): boolean {
    return this.toArray(value).length === 0
  }

  static isExist(data: any[], value: any): boolean {
    let isHas = false

    ArrayHelper.toArray(data).forEach((item) => {
      if (item === value) {
        isHas = true
      }
    })

    return isHas
  }
}
