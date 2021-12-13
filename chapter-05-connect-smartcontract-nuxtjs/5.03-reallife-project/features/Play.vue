<template>
  <div class="wrapper">
    <Loading :loading="isLoading" />
    <LoginDialog v-model="isShowLogin" />
    <div class="form-items">
      <div class="form-item">
        <Field v-model="form" :options="playFormOptions" />
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onLogin">1. Login Metamask</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onAddChain">2. Add BSC Testnet chain to Metamask</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onAddTokenA">3. Add TokenA to Metamask</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onAddTokenB">4. Add TokenB to Metamask</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onAddThePoolToken">5. Add ThePool token to Metamask</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onMintTokenA">6. Mint TokenA</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onMintTokenB">7. Mint TokenB</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onApproveTokenA">8. Approve TokenA</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onApproveTokenB">9. Approve TokenB</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onAddLiquidity">10. Add Liquidity</ButtonPrimary>
      </div>
      <div class="form-item">
        <ButtonPrimary type="button" @click="onPrintSummary">11. Print Summary</ButtonPrimary>
      </div>
    </div>
    <div class="footer">
      <NuxtLink to="/">Go to Swap</NuxtLink>
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
    const switchChain = async () => {
      await this.switchChain(getChainId())
    }
    this.walletLoader(switchChain, switchChain).call({ reconnect: true })
  }

  onAddTokenA() {
    this.addToken(TokenNames.TokenA)
  }

  onAddTokenB() {
    this.addToken(TokenNames.TokenB)
  }

  onAddThePoolToken() {
    this.addToken(TokenNames.ThePool)
  }

  onAddChain() {
    this.addChain(getChainId())
  }

  onLogin() {
    this.showLoginDialog()
  }

  onMintTokenA() {
    if (!this.isLogin) {
      this.showLoginDialog()
      return
    }

    this.beginTransaction()
    const amount100k = '100000'
    this.mintTokenA(amount100k, this.endTransaction, this.endTransaction).call()
  }

  onMintTokenB() {
    if (!this.isLogin) {
      this.showLoginDialog()
      return
    }

    this.beginTransaction()
    const amount1m = '1000000'
    this.mintTokenB(amount1m, this.endTransaction, this.endTransaction).call()
  }

  onAddLiquidity() {
     if (!this.isLogin) {
      this.showLoginDialog()
      return
    }

    this.beginTransaction()
    const amount100k = '100000'
    const amount1m = '1000000'
    this.addLiquidity(amount100k, amount1m, this.endTransaction, this.endTransaction).call()
  }

  onApproveTokenA() {
     if (!this.isLogin) {
      this.showLoginDialog()
      return
    }

    this.beginTransaction()
    this.approveTokenA(this.endTransaction, this.endTransaction).call()
  }

  onApproveTokenB() {
     if (!this.isLogin) {
      this.showLoginDialog()
      return
    }

    this.beginTransaction()
    this.approveTokenB(this.endTransaction, this.endTransaction).call()
  }

  beginTransaction() {
    this.isLoading = true
  }

  endTransaction() {
    this.isLoading = false
  }

  async onPrintSummary() {
    const wg = new WaitGroup()
    wg.add(3)

    const tokenALoader = this.balanceOfTokenA()
    tokenALoader.call(wg)

    const tokenBLoader = this.balanceOfTokenB()
    tokenBLoader.call(wg)

    const thePoolTokenLoader = this.balanceOfThePoolToken()
    thePoolTokenLoader.call(wg)

    await wg.wait()

    const resA = `${tokenALoader.callItems[0]}`
    const resB = `${tokenBLoader.callItems[0]}`
    const resThePool = `${thePoolTokenLoader.callItems[0]}`

    const balA = fromWei(resA)
    const balB = fromWei(resB)
    const balThePool = fromWei(resThePool)

    const sb: string[] = []
    sb.push(`TokenA = ${balA}\n`)
    sb.push(`TokenB = ${balB}\n`)
    sb.push(`ThePool LP = ${balThePool}\n`)
    this.updateConsole(sb.join(''))
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

.footer {
  margin-top: 100px;
}
</style>