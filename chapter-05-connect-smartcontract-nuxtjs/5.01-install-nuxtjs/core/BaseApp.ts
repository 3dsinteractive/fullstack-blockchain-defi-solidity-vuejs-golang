import { Base } from "./Base";
import { ObjectLoader } from '~/loader/ObjectLoader'

export class BaseApp extends Base {

  private getHelloPrivate(): string {
    return 'Hello world from base class private'
  }

  protected getHelloProtected(): string {
    return 'Hello world from base class protected'
  }

  protected getHelloPublic(): string {
    return 'Hello world from base class public'
  }

  get mockObjectLoader(): ObjectLoader {
    return new ObjectLoader(this, (_: any) => ({
      stateKey: `mock_object`,
    }))
  }

}