export interface IObjectState<T> {
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
  isLoaded: boolean
  errorData: any | null
  options: any
  data: T

  [key: string]: any
}

export interface IListState<T> {
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
  isLoaded: boolean
  errorData: any | null
  options: IPageOption | any
  items: T[]
}

export interface IStatus {
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
  isLoaded: boolean
  errorData: any | null
}

export interface IPageOption {
  currentPage: number | string
  nextPage: string
  prevPage: number
  totalItem: number
  limit: number
}

export const commonObjectState = (): IObjectState<any> => ({
  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoaded: false,
  errorData: null,
  options: {},
  data: null
})

export const commonListState = (): IListState<any> => ({
  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoaded: false,
  errorData: null,
  options: {},
  items: []
})
