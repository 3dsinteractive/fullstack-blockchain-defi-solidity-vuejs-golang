<template>
<div class="dialog">
  <v-dialog
      v-model="isShowDialog"
      max-width="80%"
      scrollable
    >
    <ButtonPrimary 
      type="button"
      class="btn-metamask"
      @click="onLoginMetamask">
        Login with Metamask
    </ButtonPrimary>
  </v-dialog>
</div>
</template>

<script lang="ts">
import { Component, Model, Prop, Watch } from 'vue-property-decorator'
import { BaseApp } from '~/core/BaseApp'

@Component
export default class LoginDialog extends BaseApp {

  @Prop(Boolean) readonly value!: boolean;

  isShowDialog = false

  @Watch("isShowDialog")
  public onDialogChanged(val: boolean) {
    this.$emit("input", val);
  }

  @Watch("value")
  public onValueChanged(val: boolean) {
    this.isShowDialog = val;
  }

  onLoginMetamask() {
    this.loginMetamask()
    this.isShowDialog = false
  }
}
</script>


<style lang="scss" scoped>
@import '~/assets/styles/variables.scss';
.dialog {
  background-color: $background;
}
</style>