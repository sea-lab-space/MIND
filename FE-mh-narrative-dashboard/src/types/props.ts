export interface HeaderProps {
  patientNames: string[];
  userName: string;
  retrospectHorizon: RetrospectOptions 
}


// TODO: support more granularities
// Now the value should be the number of days
export type RetrospectOptions = {
  [key: string]: number;
};