export type AIGeneratePropertyType =
  | 'apartment'
  | 'house'
  | 'commercial'
  | 'land'
  | 'rural';

export interface GenerateDescriptionRequest {
  type: AIGeneratePropertyType;
  city: string;
  neighborhood?: string;
  totalArea: number;
  builtArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  salePrice?: number;
  rentPrice?: number;
  condominiumFee?: number;
  iptu?: number;
  features?: string[];
  additionalInfo?: string;
  // Campos MCMV (Minha Casa Minha Vida)
  mcmvEligible?: boolean;
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3';
  mcmvMaxValue?: number;
  mcmvSubsidy?: number;
  mcmvNotes?: string;
}

export interface GeneratedDescription {
  title: string;
  description: string;
  highlights: string[];
}
