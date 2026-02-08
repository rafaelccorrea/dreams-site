export * from './api';
export * from './propertyApi';
export * from './publicPropertyApi';
export * from './propertyOffersApi';
export * from './addressApi';
export * from './permissionsApi';
export * from './tagsApi';
export * from './companyApi';
export * from './authStorage';
export * from './websocketService';
export * from './vistoriaApi';
export * from './galleryApi';
export * from './dashboardApi';
export * from './kanbanApi';
export * from './kanbanSocketService';
export * from './matchApi';
export * from './uploadTokenApi';
export * from './assetApi';
export * from './mcmvApi';
export * from './chatApi';
export * from './chatSocketService';

// Auth: expomos o objeto authApi (com login, register, refreshToken, etc) via ./api
// e os tipos via ./authApi quando necessário
export { authApi } from './api';
export {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RefreshTokenRequest,
} from './authApi';
export {
  usersApi,
  type User,
  type CreateUserData,
  type UpdateUserData,
} from './usersApi';
export {
  companyMembersApi,
  type CompanyMember,
  type CompanyMemberSimple,
  type CompanyMembersResponse,
  type CompanyMembersOptions,
} from './companyMembersApi';
export { storageApi } from './storageApi';
export { addonsApi } from './addonsApi';
