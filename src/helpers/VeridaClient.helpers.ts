import { EnvironmentType, Network } from '@verida/client-ts';
import { VaultAccount } from '@verida/account-web-vault';

import { EventEmitter } from 'events';
import {
	ICredentials,
	IProfileDetails,
	SchemaError,
} from '@/interfaces/veridaClient.interfaces';


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
		if (this.did) {
			return true;
		}
		return false;
	}

	public async connectVault(): Promise<void> {
		this.account = new VaultAccount({
			request: {
				logoUrl: VUE_APP_LOGO_URL
			}
		})

		this.context = await Network.connect({
			client: {
				environment: VERIDA_ENVIRONMENT,
			},
			account: this.account,
			context: {
				name: VUE_APP_CONTEXT_NAME as string,
			},

		});

		this.did = await this.account.did();

		await this.initProfile();


		this.emit('initialized');
	}

	private async initProfile(): Promise<void> {
		try {
			const client = await this.context.getClient();
			const profile = await client.openPublicProfile(this.did, 'Verida: Vault');
			const cb = async () => {
				const data = await profile.getMany();
				this.profile = {
					name: data.name,
					country: data.country,
					avatar: data?.avatar?.uri,
				};
				this.emit('profileChanged', this.profile);
			};
			profile.listen(cb);
			await cb();
		} catch (error) {
			console.log('User', { error });
		}
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
		const type = 'inbox/type/dataSend';

		const data = {
			data: [messageData],
		};
		const config = {
			recipientContextName: 'Verida: Vault',
		};

		const messaging = await this.context.getMessaging();
		const subject = 'New ' + messageData.healthType + ' Credential';
		await messaging.send(did, type, data, subject, config);
		return true;
	}

	async logout(): Promise<void> {
		await this.context.getAccount().disconnect(VUE_APP_CONTEXT_NAME);
		this.context = null;
		this.account = null;
		this.did = '';
		this.profile = {
			name: '',
			avatar: '',
			country: '',
		};
	}
}

const veridaClient = new VeridaClient();

export default veridaClient;
