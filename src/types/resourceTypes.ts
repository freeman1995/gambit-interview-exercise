export type Provider = 'AWS' | 'GCP' | 'Azure';
export type Environment = 'production' | 'staging' | 'development';
export type Criticality = 'low' | 'medium' | 'high' | 'critical';

export interface Resource {
  id: string;
  name: string;
  type: string; // e.g. "S3 Bucket", "IAM Role"
  provider: Provider;
  region: string;
  environment: Environment;
  criticality: Criticality;
  owner: string;
  tags: string[];
}
