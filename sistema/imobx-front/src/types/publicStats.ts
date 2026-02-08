export interface PublicStats {
  totalProperties: number;
  totalCompanies: number;
  citiesServed: number;
  partnerCompanies?: Array<{
    id: string;
    name: string;
    logo?: string;
    city?: string;
    state?: string;
  }>;
}
