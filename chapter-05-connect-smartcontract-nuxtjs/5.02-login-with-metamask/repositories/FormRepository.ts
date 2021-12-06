import { BaseRepository } from '~/repositories/BaseRepository'
import { FormMutations } from '~/store/form'
import { _isEqual } from '~/utils/lodash'

export default class FormRepository extends BaseRepository {

  public get = <T>(formName: string): T => {
    return this.getters['form/getByName'](formName)
  }

  public getAttr = <T>(formName: string, attrName: string): T => {
    return this.getters['form/getFormValue'](formName, attrName)
  }

  public init = <T>(formName: string, value: T): void => {
    return this.commit(new FormMutations.InitForm(formName, value))
  }

  public updateAttr = <T>(formName: string, attrName: string, value: T): void => {
    if (!_isEqual(this.getAttr(formName, attrName), value)) {
      return this.commit(new FormMutations.UpdateValue(formName, attrName, value))
    }
  }

  public reset = (formName: string): void => {
    return this.commit(new FormMutations.RemoveForm(formName))
  }
}