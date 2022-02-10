import { Context } from "@verida/client-ts";
import { EventEmitter } from "events";
import {
  ICredentials,
  SchemaError,
} from "@/interfaces/veridaClient.interfaces";

const { VUE_APP_CONTEXT_NAME } = process.env;

class VeridaClient extends EventEmitter {
  private context: any;
  public did?: string;

  public async connectVault(context: Context): Promise<void> {
    this.context = context;
    this.did = await context.getAccount().did();

    console.log(this.did);
  }

  async createDIDJWT(data: ICredentials): Promise<string> {
    const contextName = VUE_APP_CONTEXT_NAME;
    const jwtDID = await this.context
      .getAccount()
      .createDidJwt(contextName, data);

    return jwtDID;
  }

  async validateSchema(
    data: ICredentials,
    schemaUrl: string
  ): Promise<SchemaError> {
    const schemas = await this.context.getClient().getSchema(schemaUrl);
    const isValid = await schemas.validate(data);
    const errors = schemas.errors;

    if (!isValid) {
      return {
        isValid,
        errors,
      };
    }

    return {
      isValid,
      errors: [],
    };
  }

  public async sendMessage(
    messageData: ICredentials,
    did: string
  ): Promise<boolean> {
    const type = "inbox/type/dataSend";

    const data = {
      data: [messageData],
    };
    const config = {
      recipientContextName: "Verida: Vault",
    };

    const messaging = await this.context.getMessaging();
    const subject = "New " + messageData.healthType + " Credential";
    await messaging.send(did, type, data, subject, config);
    return true;
  }

  async logout(): Promise<void> {
    this.context = null;
  }
}

const veridaClient = new VeridaClient();

export default veridaClient;
