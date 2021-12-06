
export interface IState {
  app: IAppState,
  form: IFormState
}

export interface IAppState {
  state: object
}

export interface IFormState {
  data: {
    [key: string]: object
  }
}

export declare interface IMutation {
  readonly type: string
  payload?: any
}