<template>
  <div class="wrapper">
    <Loading :loading="isLoading" />
    <LoginDialog v-model="isShowLogin" />
    <div class="form-items">
      <div class="form-item">
        <Field v-model="form" :options="playFormOptions" />
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onLogin">Login Metamask</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onAddChain">Add BSC Testnet chain</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onMintTokenA">Mint TokenA</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onMintTokenB">Mint TokenB</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onPrintSummary">Print Summary</ButtonPrimary>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { BaseForm } from '~/core/BaseForm'
import LoginDialog from '~/features/LoginDialog.vue'
import { Component, Provide } from 'vue-property-decorator'
import { IFormOption, INPUT_TYPES } from '~/components/form/FormTypes'
import { getAddressOfToken, TokenNames } from '~/consts/config'
import { WaitGroup } from '~/utils/WaitGroup'
import { ContractLoader } from '~/loader/ContractLoader'
import { 
  fromWei,
  toWei, 
  toBasis, 
  toBytes32,
  toBN, 
  zeroAddr,
  getNetwork,
  getChainId } from '~/utils/util'

@Component({
  components: { 
    LoginDialog,
  },
})
export default class Play extends BaseForm<any> {
  @Provide('form_name') form_name = 'play_form'

  created() {
    // 1. Try to switch chain to the chainId receive from configuration (nuxt.config.js)
    const switchChain = async () => {
      await this.switchChain(getChainId())
    }
    // 2. Load wallet if user already login (send reconnect: true)
    this.walletLoader(switchChain, switchChain).call({ reconnect: true })
  }

  // 3. When click add chain
  onAddChain() {
    this.addChain(getChainId())
  }

  // 4. When click login with Metamask
  onLogin() {
    this.showLoginDialog()
  }

  // 5. When click mint token A
  onMintTokenA() {
    if (!this.isLogin) {
      this.showLoginDialog()
      return
    }

    this.beginTransaction()
    const amount = toWei('1000')
    this.mintTokenA(amount, this.endTransaction, this.endTransaction).call()
  }

  // 6. When click mint token B
  onMintTokenB() {
    if (!this.isLogin) {
      this.showLoginDialog()
      return
    }

    this.beginTransaction()
    const amount = toWei('1000')
    this.mintTokenB(amount, this.endTransaction, this.endTransaction).call()
  }

  beginTransaction() {
    this.isLoading = true
  }

  endTransaction() {
    this.isLoading = false
  }

  // 7. When click Print summary
  async onPrintSummary() {
    console.log('1')
    const wg = new WaitGroup()
    wg.add(2)

    const tokenALoader = this.balanceOfTokenA()
    tokenALoader.call(wg)

    const tokenBLoader = this.balanceOfTokenB()
    tokenBLoader.call(wg)

    await wg.wait()

    console.log('2')

    const resA = `${tokenALoader.callItems[0]}`
    const resB = `${tokenBLoader.callItems[0]}`

    const balA = fromWei(resA)
    const balB = fromWei(resB)

    this.updateConsole(`TokenA = ${balA}\nTokenB = ${balB}`)
  }

  updateConsole(txt: string) {
    this.formRepo.updateAttr(this.form_name, 'console', txt)
  }

  get playFormOptions(): IFormOption[] {
    return [
      {
        type: INPUT_TYPES.TEXTAREA,
        props: {
          name: 'console',
          rowsAmount: '10',
        }
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
.form-items {
  .form-item {
    padding: 5px;
  }
}
</style>