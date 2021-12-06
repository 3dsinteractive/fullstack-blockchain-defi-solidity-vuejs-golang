import { IStatus } from "~/types/states"

export default class ObjectHelper {
  static toStatus = (obj: IStatus): IStatus => ({
    isError: obj.isError,
    isSuccess: obj.isSuccess,
    isLoading: obj.isLoading,
    isLoaded: obj.isLoaded,
    errorData: obj.errorData,
  })
}