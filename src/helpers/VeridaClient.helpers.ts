import { Network } from "@verida/client-ts";
import { VaultAccount } from "@verida/account-web-vault";
import {
  IErrorMessages,
  ICredentials,
  IProfileDetails,
  IProfileDocument,
} from "@/interfaces";

import { EventEmitter } from "events";

const {
  VUE_APP_LOGO_URL,
  VUE_APP_CERAMIC_URL,
  VUE_APP_CONTEXT_NAME,
  VUE_APP_VERIDA_TESTNET_DEFAULT_SERVER,
} = process.env;

class VeridaClient extends EventEmitter {
  private connection: any;
  private profileInstance: any;
  private account: any;
  public did?: string;
  private error = {};
  public profile = {};

  /**
   * Public method for initializing this app
   */
  async initApp(): Promise<void> {
    if (!this.connection) {
      await this.connectVault();
    }
  }

  appInitialized(): boolean {
    if (this.connection) {
      return true;
    }
    return false;
  }

  /**
   * Private method for connecting to the vault
   */
  public async connectVault(): Promise<void> {
    this.account = new VaultAccount({
      defaultDatabaseServer: {
        type: "VeridaDatabase",
        endpointUri: VUE_APP_VERIDA_TESTNET_DEFAULT_SERVER,
      },
      defaultMessageServer: {
        type: "VeridaMessage",
        endpointUri: VUE_APP_VERIDA_TESTNET_DEFAULT_SERVER,
      },
      vaultConfig: {
        logoUrl: VUE_APP_LOGO_URL,
      },
    });

    this.connection = await Network.connect({
      client: {
        ceramicUrl: VUE_APP_CERAMIC_URL,
      },
      account: this.account,
      context: {
        name: VUE_APP_CONTEXT_NAME,
      },
    });

    this.did = await this.account.did();
    await this.initProfile();

    this.emit("initialized");
  }

  private async initProfile(): Promise<void> {
    const services = this;
    const client = this.connection.getClient();
    this.profileInstance = await client.openPublicProfile(
      this.did,
      "Verida: Vault"
    );

    const cb = async function (): Promise<void> {
      const data = await services.profileInstance.getMany();
      services.profile = data.reduce(
        (result: any, item: IProfileDocument): IProfileDetails => {
          result[item.key] = item.value;
          return result;
        },
        {}
      );
      services.emit("profileChanged", services.profile);
    };

    this.profileInstance.listen(cb);
    cb();
  }

  public async sendMessage(messageData: ICredentials): Promise<boolean> {
    const type = "inbox/type/dataSend";

    try {
      const data = {
        data: [messageData],
      };

      const message = "New Message: New Credential";
      const config = {
        recipientContextName: "Verida: Vault",
      };
      const messaging = await this.connection.getMessaging();
      await messaging.send(this.did, type, data, message, config);

      return true;
    } catch (error: any) {
      return false;
    }
  }

  handleErrors(error: IErrorMessages) {
    this.error = error;
    this.emit("error", error);
  }

  async logout(): Promise<void> {
    await this.account.disconnect();
    this.connection = null;
    this.profileInstance = null;
    this.account = null;
    this.did = "";
    this.error = {};
    this.profile = {};
  }
}

const veridaClient = new VeridaClient();

export default veridaClient;
