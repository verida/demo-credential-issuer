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

export interface SchemaError {
  isValid: boolean;
  errors: any[];
}

export interface ICredentials {
  firstName: string;
  lastName: string;
  regNumber: string;
  healthType: string;
  regExpDate: string;
  name: string;
  summary?: string;
}
