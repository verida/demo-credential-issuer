import { CONTEXT_NAME } from "@/constants";
import { Credentials } from "@verida/verifiable-credentials";
import store from "store";

class VeridaClient {
  private context: any;
  public did = "";
  public connected?: boolean;
  public errors?: any;
  public credentials?: Credentials;

  public async connectVault(context: any): Promise<void> {
    this.context = context;
    this.connected = true;
    store.set(CONTEXT_NAME, true);
    this.credentials = new Credentials();
    this.did = await context.getAccount().did();
  }

  async createDIDJwt(data: any, subjectDid: string): Promise<any> {
    if (this.credentials) {
      const credentialData = await this.credentials.createCredentialJWT(
        subjectDid,
        data,
        this.context
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
    this.connected = false;
    store.remove(CONTEXT_NAME);
  }
}

const veridaClient = new VeridaClient();

export default veridaClient;
