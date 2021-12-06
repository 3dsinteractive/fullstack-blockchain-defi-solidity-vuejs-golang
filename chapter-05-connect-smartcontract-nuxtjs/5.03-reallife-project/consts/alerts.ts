export const FormInvalid = (fieldName: string = 'Some input') => {
  return {
    title: 'Form field is invalid',
    text: `${fieldName} is invalid`,
    icon: 'warning'
  }
}