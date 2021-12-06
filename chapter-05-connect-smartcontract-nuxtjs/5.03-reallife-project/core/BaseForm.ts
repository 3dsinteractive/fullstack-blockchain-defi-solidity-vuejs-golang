import { Component, Prop, Provide } from 'vue-property-decorator'
import SweetAlertOptions from 'vue-sweetalert2'
import { BaseApp } from './BaseApp'
import FormRepository from '~/repositories/FormRepository'
import { FormInvalid } from '~/consts/alerts'

// BaseForm<T> provide access to formRepo which can be used to manage vuex form['form_name']
// by override custom form_name from the inherited class, this form_name will provide value to
// every form element that is the child of the BaseForm class
@Component
export class BaseForm<T> extends BaseApp {

  @Provide('form_name') form_name = 'default'

  public async validate(submitFunc: Function, transformFunc?: Function) {
    return new Promise<boolean>(async (resolve, reject) => {
      const isValid = await (this.$refs.form as any).validate()
      if (isValid) {
        if (transformFunc) {
          submitFunc(transformFunc(this.formRepo.get(this.form_name)))
          return resolve(true)
        } else {
          submitFunc(this.formRepo.get(this.form_name))
          return resolve(true)
        }
      } else {
        await this.$swal(FormInvalid() as SweetAlertOptions)
        // focus at the first invalid element
        const el = document.getElementsByClassName('error--text').item(0)
        el?.scrollIntoView(false)
      }

      return resolve(false)
    })
  }

  get form(): T {
    return this.formRepo.get(this.form_name)
  }

  get formRepo(): FormRepository {
    return new FormRepository(this)
  }
}