<template>
  <div class="wrapper">
    <div class="tutorials">
      <div class="tutorial-item">
        <h1>8. Attribute Binding Tutorial</h1>
        <h2>{{myBindingAttribute}}</h2>
        <SubTitle :subTitle="myBindingAttribute" />
        <div class="buttons">
          <a class="button-item" @click="onUpdateMyBindingAttributeClick">Update my binding attribute</a>
        </div>
      </div>

      <div class="tutorial-item">
        <h1>9. Computed Property Binding Tutorial</h1>
        <h2>{{myComputedProperty}}</h2>
        <SubTitle :subTitle="myComputedProperty" />
        <div class="buttons">
          <a class="button-item" @click="onUpdateMyComputedPropertyClick">Update my computed property</a>
        </div>
      </div>

      <div class="tutorial-item">
        <h1>10. Vuex Binding Tutorial</h1>
        <h2>{{vuexLoader.callItem.name}}</h2>
        <SubTitleVuex />
        <div class="buttons">
          <a class="button-item" @click="onUpdateVuexClick">Update Vuex</a>
        </div>
      </div>

      <div class="tutorial-item">
        <h1>11. Nuxt Event Lifecycle</h1>
        <h2>{{myEventName}}</h2>
        <div class="buttons">
          <NuxtLink class="button-item" to="page2">Go to page 2</NuxtLink>
        </div>
      </div>

      <div class="tutorial-item">
        <h1>12. Watch value</h1>
        <h2>{{watchValueMessage}}</h2>
        <div class="buttons">
          <a class="button-item" @click="onUpdateWatchValue">Update Watch Value</a>
        </div>
      </div>

      <div class="tutorial-item">
        <h1>13. Form</h1>
        <h2>{{submitResult}}</h2>
        <v-form @submit.prevent="validate(onSubmit, onTransform)" ref="form">
          <Field v-model="form" :options="formFields" />
          <div class="buttons">
            <ButtonPrimary class="button-item">Submit</ButtonPrimary>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 1. Import list
// 1.1 Import from root ~ of project
import { BaseApp } from '~/core/BaseApp'
import { BaseForm } from '~/core/BaseForm'
// 1.2 Import from library (eg. node_modules)
import { Component, Watch } from 'vue-property-decorator'
// 1.3 Import from relative path (eg ./ ../)
import SubTitle from './SubTitle.vue'
import SubTitleVuex from './SubTitleVuex.vue'
import { IFormOption, INPUT_TYPES } from '~/components/form/FormTypes'
import RuleHelper from '~/utils/RuleHelper'


// 2. Component annotation
@Component({
  components: { 
    SubTitle,
    SubTitleVuex
  },
})
// 3. Class declaration and extends
//    Class must be export to be used from caller
export default class Home extends BaseForm<MemberForm> {

  // 4. Types class instance scope
  theString: string = 'This is string'
  theNumber: number = 100
  theBoolean: boolean = true
  theStringArr: string[] = []

  // 4.2 Static Variable will be access via class name
  static theStaticString: string = ''

  // 5. Functions declaration
  myFunctionA(): void {
    // 5.1 Access the instance scope variables
    this.theString = 'New string'
    this.theNumber = 200
    this.theBoolean = false
    this.theStringArr.push('New string')

    Home.theStaticString = 'New static string'

    // 5.2 Function scope variables
    //    Notice that we don't need to declare type of variable if we initialize it when we declare
    //    This called Inferred Typing
    const theConstString = 'This is const string'
    const theConstNumber = 100
    const theConstBool = true

    // 5.3 We cannot modify const variables
    //     TRY uncomment and this will be compile error
    // theConstString = 'New string'
    // theConstNumber = 200
    // theConstBool = false

    // 5.4 Use let to declare mutable variable
    let theLetString = 'This is let string'
    let theLetNumber = 100
    let theLetBool = true

    theLetString = 'This is let string'
    theLetNumber = 100
    theLetBool = true
    
    // We cannot assign the wrong type to variable
    // Uncomment and this will be error
    // theLetNumber = '100'
  }

  // 6. Properties getter and setter
  private theGetSetString = 'The getter string'
  get myGetSetString(): string {
    return `My Getter ${this.theGetSetString}`
  }

  set myGetSetString(value: string) {
    this.theGetSetString = value
  }

  myFunctionB(): void {
    // We can get and set property like it is a class variable
    const val = this.myGetSetString
    this.myGetSetString = 'New string'
  }

  // 7. Access Modifier (private, protected and public)
  private thePrivateString = 'The private string'
  protected theProtectedString = 'The protected string'
  public thePublicString = 'The public string'
  theDefaultString = 'The default string' // Default access modifier is public

  private thePrivateFunction() {}
  protected theProtectedFunction() {}
  public thePublicFunction() {}
  theDefaultFunction() {} // Default access modifier is public

  // 8. Attribute binding
  myBindingAttribute = 'My binding attribute'
  onUpdateMyBindingAttributeClick() {
    if (this.myBindingAttribute != 'New binding attribute') {
      this.myBindingAttribute = 'New binding attribute'
    } else {
      this.myBindingAttribute = 'My binding attribute'
    }
  }
  
  // 9. Computed property binding
  myComputedPropertyAttr = 'property'
  get myComputedProperty() {
    return `Computed ${this.myComputedPropertyAttr}`
  }

  set myComputedProperty(val: string) {
    this.myComputedPropertyAttr = val
  }

  onUpdateMyComputedPropertyClick() {
    if (this.myComputedProperty != 'Computed New property') {
      this.myComputedProperty = 'New property'
    } else {
      this.myComputedProperty = 'property'
    }
  }

  // 10. Vuex binding
  onUpdateVuexClick() {
    if (this.vuexLoader.callItem.name != 'Chaiyapong') {
      this.vuexLoader.call({
        name: 'Chaiyapong',
        company: '3DS Interactive',
      })
    } else {
      this.vuexLoader.call({
        name: 'Elon Musk',
        company: 'Tesla',
      })
    }
  }

  // 11. Nuxt event lifecycle created and mounted
  static theEventCounter: number = 0
  myEventName: string = ''
  created() {
    Home.theEventCounter += 1
    this.myEventName += `< created(${Home.theEventCounter})`
  }

  mounted() {
    this.myEventName += `< mounted(${Home.theEventCounter})`
  }

  // 12. Watch Value
  watchValue: string = ''
  watchValueMessage: string = ''

  @Watch('watchValue')
  onWatchValueChanged(newValue: any, oldValue: any) {
    this.watchValueMessage = `watchValue change from '${oldValue}' to '${newValue}'`
  }

  onUpdateWatchValue() {
    if (this.watchValue != 'New watch value') {
      this.watchValue = 'New watch value'
    } else {
      this.watchValue = 'Watch value'
    }
  }

  // 13. Form
  form_name: string = 'member_form'
  submitResult: string = ''

  get formFields(): IFormOption[] {
    return [
      {
        type: INPUT_TYPES.TEXT,
        col: '12',
        props: {
          name: 'firstname',
          label: 'Firstname',
          rules: [RuleHelper.required],
        }
      },
      {
        type: INPUT_TYPES.TEXT,
        col: '12',
        props: {
          name: 'email',
          label: 'Email',
          rules: [RuleHelper.required],
        }
      },
    ]
  }
  onSubmit(val: MemberForm) {
    this.submitResult = JSON.stringify(val)
  }
  onTransform(val: any): any {
    val['created'] = new Date()
    return val
  }
}

interface MemberForm {
  firstname: string
  email: string
}
</script>

<style lang="scss" scoped>
.wrapper {

  h1, h2, h3 {
    text-align: center;
    font-size: 1.2em;
  }
  h2, h3 {
    color: gray;
  }

  padding: 30px;
  display: flex;
  flex-direction: column;
  min-width: 1000px;
}

.tutorials {
  display:flex;
  justify-content: center;
  flex-basis: 100%;
  flex-direction: column;

  .tutorial-item {
    align-self: center;
    width: 800px;
    padding: 10px;
    border: 1px solid lightgray;
  }
}
.buttons {
  display: flex;
  justify-content: center;
  flex-direction: column;
  
  .button-item {
    display: block;
    background-color: gray;
    color: white;
    text-align: center;
    width: 250px;
    align-self: center;
    margin-top: 10px;
    padding: 5px;
  }

  .button-item:hover {
    background-color: lightgray;
    color: gray;
  }
}
</style>