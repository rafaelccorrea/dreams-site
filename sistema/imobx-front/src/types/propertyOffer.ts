/**
 * Tipos relacionados a ofertas de propriedades
 */

export type OfferType = 'sale' | 'rental';

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  | 'expired';

export interface PublicUser {
  id: string;
  email: string;
  phone: string;
}

export interface PropertyOfferProperty {
  id: string;
  title: string;
  salePrice?: number;
  rentPrice?: number;
  minSalePrice?: number;
  minRentPrice?: number;
}

export interface PropertyOffer {
  id: string;
  propertyId: string;
  publicUserId: string;
  publicUser?: PublicUser;
  type: OfferType;
  status: OfferStatus;
  offeredValue: number;
  message?: string;
  responseMessage?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  respondedAt?: string; // ISO 8601
  respondedByUserId?: string;
  property?: PropertyOfferProperty;
}

export interface CreateOfferRequest {
  propertyId: string;
  type: OfferType;
  offeredValue: number;
  message?: string;
}

export interface UpdateOfferStatusRequest {
  status: 'accepted' | 'rejected';
  responseMessage?: string;
}
