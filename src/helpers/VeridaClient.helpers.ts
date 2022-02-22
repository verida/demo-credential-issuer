import {
  ICredentials,
  SchemaError,
} from "@/interfaces/veridaClient.interfaces";

const { VUE_APP_CONTEXT_NAME } = process.env;

class VeridaClient {
  private context: any;
  public did?: string;
  public errors?: any;

  public async connectVault(context: any): Promise<void> {
    this.context = context;
    this.did = await context.getAccount().did();
  }

  async createDIDJwt(data: ICredentials): Promise<string> {
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
      this.errors?.push(errors);
    }

    return isValid;
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

  logout() {
    this.context = null;
  }
}

const veridaClient = new VeridaClient();

export default veridaClient;
