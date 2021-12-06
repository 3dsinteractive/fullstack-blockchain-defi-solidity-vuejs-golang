
export const TokenNames = {
  TokenA: 'TOKENA',
  TokenB: 'TOKENB',
  ThePool: 'THEPOOL',
}

export const getAddressOfToken = (tokenName: string): string => {
  switch (tokenName) {
    case TokenNames.TokenA: return process.env.TOKENA_ADDR
    case TokenNames.TokenB: return process.env.TOKENB_ADDR
    case TokenNames.ThePool: return process.env.THEPOOL_ADDR
  }
  return 'unknown'
}