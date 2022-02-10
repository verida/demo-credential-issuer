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
