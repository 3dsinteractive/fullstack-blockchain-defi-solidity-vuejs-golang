import { EventInput } from '~/core/BaseInput'

export const INPUT_TYPES = {
  BUTTON_GROUP: 'BUTTON_GROUP',
  INPUT_BUTTON_GROUP: 'INPUT_BUTTON_GROUP',
  TEXT: 'TEXT',
  FILE: 'FILE',
  IMAGE: 'IMAGE',
  ALIAS: 'ALIAS',
  PASSWORD: 'PASSWORD',
  TEXTAREA: 'TEXTAREA',
  SELECT: 'SELECT',
  AUTOCOMPLETE: 'AUTOCOMPLETE',
  COMBOBOX: 'COMBOBOX',
  CHECKBOOK: 'CHECKBOX',
  RADIO: 'RADIO',
  SWITCH_TOGGLE: 'SWITCH_TOGGLE',
  DATEPICKER: 'DATEPICKER',
  DATETIMEPICKER: 'DATETIMEPICKER',
  TIMEPICKER: 'TIMEPICKER',
  UPLOAD_IMAGE: 'UPLOAD_IMAGE',
  COLOR_PICKER_S: 'COLOR_PICKER_S',
  HTMLEDITOR: 'HTMLEDITOR',
  SELECTION: 'SELECTION',
  COMPONENT: 'COMPONENT'
}

export interface IOption {
  label?: string
  value: any
  header?: string
  subHeader?: string
  disabled?: boolean
  divider?: boolean
  icon?: string
}

export interface IFormOption {
  type: string
  component?: any
  description?: string
  className?: string
  col?: string
  isHide?: boolean
  children?: IFormOption[]
  permissionKey?: string
  props?: {
    rules?: Function[]
    className?: string
    explain?: string
    name: string
    transform?: (event: EventInput | any, oldValue: any) => any
    options?: IOption[] | any[]
    multiple?: boolean // auto complete
    direction?: { row?: boolean; column?: boolean } // radio
    range?: boolean // date picker
    defaultValue?: any
    label?: string
    placeholder?: string
    disabled?: boolean
    isActive?: boolean
    isLoading?: boolean
    height?: number
    on?: {
      [key: string]: Function
    }

    [key: string]: any
  }
}

export default {}
