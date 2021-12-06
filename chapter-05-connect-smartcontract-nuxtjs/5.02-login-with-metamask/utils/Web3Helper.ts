
export class Web3Helper {
  static errorMessage = (err: any): string => {
    const errmsg = err.message.replace("Internal JSON-RPC error.\n", '');
    const errobj = JSON.parse(errmsg)
    return errobj.message
  }
}