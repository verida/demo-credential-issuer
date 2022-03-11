# Demo: Credential Issuing

A demonstration app showing how credentials are issued and sent to a person

Available at https://credential-issuer.demos.verida.io/


## Notes on build

We only support `yarn`.

If you build with `npm` you may get a runtime error similar to this when starting the web application:

```
Module parse failed: Unexpected token (1665:17)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
|               // TODO: should be able to use non base58 keys too
|               return key.type === 'X25519KeyAgreementKey2019' && Boolean(key.publicKeyBase58);
>             })) ?? [];
|             if (!pks.length && !controllerEncrypters.length) throw new Error(`no_suitable_keys: Could not find x25519 key for ${did}`);
|             return pks.map(pk => x25519Encrypter(base58ToBytes(pk.publicKeyBase58), pk.id)).concat(...controllerEncrypters);
```

We have fixed that in `yarn` by specifying the [resolution](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) like this:

```
	"resolutions": {
		"acorn": "8.0.1"
	},
```

It is unclear how to do the same in `npm` so for the moment only `yarn` builds are supported. 


## Install

```
yarn install
```


## Build

```
yarn build
```


## Run

```
yarn serve
```

# Deployment

Deployment to https://credential-issuer.demos.verida.io/ is automatically done via [AWS Amplify](https://us-east-2.console.aws.amazon.com/amplify/) for all new commits to the `main` branch. 

