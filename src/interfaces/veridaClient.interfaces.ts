export interface IProfileDocument {
  _id: string;
  _rev?: string;
  key: string;
  value?: unknown;
}

export interface IProfileDetails {
  name: string;
  country: string;
  avatar: string;
}

export interface ICredentials {
  name: string;
  firstName: string;
  lastName: string;
  regNumber: string;
  healthType: string;
  regExpDate?: string;
  summary?: string;
  testTimestamp: string;
  didJwtVc: string;
  schema: string;
}
