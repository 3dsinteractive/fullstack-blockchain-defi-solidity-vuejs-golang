import { Base } from "./Base";
import { ObjectLoader } from '~/loader/ObjectLoader'

export class BaseApp extends Base {
  get vuexLoader(): ObjectLoader {
    return new ObjectLoader(this, (_: any) => ({
      stateKey: `vuex_loader`,
    }))
  }
}