import { config } from "@/config";
import { IContext, IMessaging } from "@verida/types"
import { Credentials } from "@verida/verifiable-credentials";
import store from "store";

class VeridaClient {
  private context: IContext | undefined;
  public did: string | undefined;
  public connected?: boolean;
  public errors?: any;
  public credentials?: Credentials;
  public messagingInstance: IMessaging | undefined;

  public async connectVault(context: IContext): Promise<void> {
    this.context = context;
    this.connected = true;
    store.set(config.veridaContextName, true);
    this.credentials = new Credentials();
    this.did = await context.getAccount().did();
  }

  public async initialiseMessagingInstance(): Promise<IMessaging> {
    if (this.messagingInstance) {
      return this.messagingInstance;
    }
    if (!this.context) {
      throw new Error("Context not available");
    }
    this.messagingInstance = await this.context.getMessaging({});
    return this.messagingInstance;
  }

  async createDIDJwt(data: any, subjectDid: string): Promise<any> {
    if (this.credentials && this.context) {
      const credentialData = await this.credentials.createCredentialJWT({
        subjectId: subjectDid,
        data: data,
        context: this.context,
        schema: config.veridaCredentialSchema!
      });
      return credentialData;
    }
  }

  public async sendMessage(messageData: any, did: string): Promise<boolean> {
    const type = "inbox/type/dataSend";
    const recipientContextName = "Verida: Vault";
    const data = {
      data: [messageData],
    };
    const config = {
      did,
      recipientContextName,
    };
    const subject = `New ${messageData.healthType} ${Credential}`;
    const messaging = await this.initialiseMessagingInstance();
    await messaging.send(did, type, data, subject, config);
    return true;
  }

  logout() {
    this.did = undefined;
    this.context = undefined;
    this.connected = false;
    store.remove(config.veridaContextName);
  }
}

const veridaClient = new VeridaClient();

export default veridaClient;
