import { Credentials } from "@verida/verifiable-credentials";

class VeridaClient {
  private context: any;
  public did?: string;
  public errors?: any;
  public credentials?: Credentials;

  public async connectVault(context: any): Promise<void> {
    this.context = context;
    this.credentials = new Credentials(context);
    this.did = await context.getAccount().did();
  }

  async createDIDJwt(data: any): Promise<any> {
    if (this.did && this.credentials) {
      const credentialData = await this.credentials.createCredentialJWT(
        this.did,
        data
      );

      return credentialData;
    }
  }

  public async sendMessage(messageData: any, did: string): Promise<boolean> {
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
