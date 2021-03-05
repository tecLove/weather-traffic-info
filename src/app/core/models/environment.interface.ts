/**
 * Interface for app environment configurations
 */
export default interface Environment {
  production: boolean;
  appCntxt: string;
  accessKey: string;
  mock: boolean;
}
