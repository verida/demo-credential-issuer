import { EnvironmentType, Network } from "@verida/client-ts";
import { VaultAccount } from "@verida/account-web-vault";

import { EventEmitter } from "events";
import {
  ICredentials,
  IProfileDetails,
} from "@/interfaces/veridaClient.interfaces";

const {
  VUE_APP_LOGO_URL,
  VUE_APP_CONTEXT_NAME,
  VUE_APP_VERIDA_TESTNET_DEFAULT_SERVER,
} = process.env;

export const VERIDA_ENVIRONMENT = EnvironmentType.TESTNET;

class VeridaClient extends EventEmitter {
  private context: any;
  private account: any;
  public did?: string;
  public profile?: IProfileDetails;

  async initApp(): Promise<void> {
    if (!this.context) {
      await this.connectVault();
    }
  }

  appInitialized(): boolean {
    if (this.context?.client?.did) {
      return true;
    }
    return false;
  }

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
        loginUri: VUE_APP_LOGO_URL,
      },
    });

    this.context = await Network.connect({
      client: {
        environment: VERIDA_ENVIRONMENT,
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
    try {
      const client = await this.context.getClient();
      const profile = await client.openPublicProfile(this.did, "Verida: Vault");
      const cb = async () => {
        const data = await profile.getMany();
        this.profile = {
          name: data.name,
          country: data.country,
          avatar: data?.avatar?.uri,
        };
        this.emit("profileChanged", this.profile);
      };
      profile.listen(cb);
      await cb();
    } catch (error) {
      console.log("User", { error });
    }
  }

  public async sendMessage(messageData: ICredentials): Promise<boolean> {
    const type = "inbox/type/dataSend";
    const contextName = VUE_APP_CONTEXT_NAME;
    const jwtDID = await this.context
      .getAccount()
      .createDidJwt(contextName, messageData);

    const data = {
      data: [
        {
          ...messageData,
          didJwtVc: jwtDID,
        },
      ],
    };
    const message = "Mapay Credential";
    const config = {
      recipientContextName: "Verida: Vault",
    };

    const messaging = await this.context.getMessaging();
    await messaging.send(messageData.did, type, data, message, config);
    return true;
  }

  async logout(): Promise<void> {
    await this.context.getAccount().disconnect(VUE_APP_CONTEXT_NAME);
    this.context = null;
    this.account = null;
    this.did = "";
    this.profile = {
      name: "",
      avatar: "",
      country: "",
    };
  }
}

const veridaClient = new VeridaClient();

export default veridaClient;
