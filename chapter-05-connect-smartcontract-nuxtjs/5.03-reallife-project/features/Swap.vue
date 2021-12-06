<template>
  <div class="wrapper">
    <Loading :loading="isLoading" />
    <LoginDialog v-model="isShowLogin" />
    <div class="content">
      <div class="swap">
        <h1>Super Swap</h1>
        <div class="form-items">
          <v-form @submit.prevent="validate(onSubmit, onTransform)" ref="form">
            <Field v-model="form" :options="swapFormOptions" />
            <div class="buttons">
              <ButtonPrimary 
                v-if="isApproved" 
                class="btn-primary-alternative btn-swap">Swap</ButtonPrimary>
              <ButtonPrimary 
                v-else 
                class="btn-primary-alternative btn-approve">Approve</ButtonPrimary>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BaseForm } from '~/core/BaseForm'
import LoginDialog from '~/features/LoginDialog.vue'
import { Component, Provide, Watch } from 'vue-property-decorator'
import { IFormOption, INPUT_TYPES } from '~/components/form/FormTypes'
import RuleHelper from '~/utils/RuleHelper'
import { fromWei, toWei, getChainId } from '~/utils/util'
import { _debounce } from '~/utils/lodash'

@Component({
  components: { 
    LoginDialog,
  },
})
export default class Swap extends BaseForm<SwapForm> {
  @Provide('form_name') form_name = 'swap_form'

  isApproved: boolean = true

  checkAllowance: () => void
  updateQuotePrice: () => void

  created() {
    this.checkAllowance = _debounce(() => {
      this._onCheckAllowance()
    }, 300)

    this.updateQuotePrice = _debounce(() => {
      this._updateQuotePrice()
    }, 300)

    const switchChain = async () => {
      await this.switchChain(getChainId())
      await this._onCheckAllowance()
    }
    this.walletLoader(switchChain, switchChain).call({ reconnect: true })
  }

  async _updateQuotePrice() {
    const form = this.form
    if (parseFloat(form.fromAmount) <= 0) {
      this.formRepo.updateAttr(this.form_name, 'toAmount', '')
      return
    }

    const quotePriceLoader = this.amountBByA(form.fromAmount)
    await quotePriceLoader.call()

    const res = `${quotePriceLoader.callItems[0]}`
    let amountB = parseFloat(fromWei(res))
    const slippage = 0.02;
    amountB = amountB * (1-slippage)
    this.formRepo.updateAttr(this.form_name, 'toAmount', `${amountB}`)
  }

  async _onCheckAllowance() {
    const form = this.form
    if (!form.fromToken || form.fromToken.length == 0) {
      this.isApproved = true
      return
    }
    if (!form.fromAmount || form.fromAmount.length == 0) {
      this.isApproved = true
      return
    }

    const allowanceLoader = this.allowanceOfTokenA()
    await allowanceLoader.call()

    const res = `${allowanceLoader.callItems[0]}`
    const allowance = toWei(fromWei(res))
    this.isApproved = allowance >= toWei(form.fromAmount)
  }

  onSubmit(value: SwapForm) {
    if (!this.isLogin) {
      this.showLoginDialog()
      return
    }

    this.beginTransaction()
    if (!this.isApproved) {
      this.approveTokenA(this.endTransaction, this.endTransaction).call()
    } else {
      this.swapAForB(value.fromAmount, value.toAmount, this.endTransaction, this.endTransaction).call()
    }
  }

  onTransform(value: SwapForm) {
    return value
  }

  @Watch('form', { deep: true })
  onFormUpdated() {
    this.checkAllowance()
    this.updateQuotePrice()
  }

  beginTransaction() {
    this.isLoading = true
  }

  endTransaction() {
    this.isLoading = false
    this.checkAllowance()
  }

  get swapFormOptions(): IFormOption[] {
    return [
      {
        type: INPUT_TYPES.TEXT,
        col: '5',
        props: {
          name: 'fromAmount',
          label: 'From',
          rules: [RuleHelper.required, RuleHelper.num],
        }
      },
      {
        type: INPUT_TYPES.SELECT,
        col: '5',
        props: {
          name: 'fromToken',
          placeholder: '',
          defaultValue: 'TokenA',
          className: 'select-token',
          rules: [RuleHelper.required],
          options: [
            {
              value: 'TokenA',
              label: 'TokenA'
            },
          ],
          on: {
            change: (value: any) => {
              // do nothing
            }
          }
        }
      },{
        type: INPUT_TYPES.TEXT,
        col: '5',
        props: {
          name: 'toAmount',
          label: 'To',
          rules: [RuleHelper.required, RuleHelper.num],
        }
      },
      {
        type: INPUT_TYPES.SELECT,
        col: '5',
        props: {
          name: 'toToken',
          placeholder: '',
          disabled: true,
          rules: [RuleHelper.required],
          defaultValue: 'TokenB',
          className: 'select-token',
          options: [
            {
              value: 'TokenB',
              label: 'TokenB'
            }
          ]
        }
      }
    ]
  }
}

interface SwapForm {
  fromAmount: string
  fromToken: string
  toAmount: string
  toToken: string
}
</script>

<style lang="scss">
.select-token {
  margin-top: 25px !important;
}
</style>

<style lang="scss" scoped>
@import '~/assets/styles/variables.scss';

.wrapper {
  display: flex;
  flex-direction: column;
}
.btn-primary-alternative {
  display: block;
  background-color: $secondary;
  width: 280px;
  height: 50px;
  text-align: center;
  font-size: 1.2em;
  padding-top: 10px;
  border-radius: 5px;
  color: $primaryButton;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;

  .swap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h1 {
      font-size: $titleFontSize;
      margin-top: 20px;
    }

    .form-items {
      display: flex;
      flex-direction: column;
      margin-top: 30px;

      .form-item {
        display: flex;
        flex-wrap: wrap;

        label {
          flex-basis: 100%;
          display: block;
          height: 25px;
        }
        input {
          flex-basis: 100px;
          border-radius: 5px;
        }
        select {
          flex-basis: 100px;
          border-radius: 5px;
        }
      }
      .buttons {
        .btn-swap {
          margin-top: 20px;
        }
      }
    }
  }
}
@media (min-width: 800px) {
.content {
  flex-direction: row;
  justify-content: space-evenly;
}
}
</style>