// Schemas
export * from '../schemas/validation';

// Hooks
export * from '../hooks/useAuth';
export * from '../hooks/useWelcomeMessage';
export * from '../hooks/useRegisterMessage';
export * from '../hooks/useProperties';
export * from '../hooks/useOwner';

// Form Components
export * from '../components/forms/FormFields';
export * from '../components/forms/SubmitButton';
export * from '../components/forms/AlertMessage';
export * from '../components/forms/PropertyFields';
export { PropertyForm } from '../components/forms/PropertyForm';
export { AddressFields } from '../components/forms/AddressFields';

// Auth Components
export { default as LoginForm } from '../components/auth/LoginForm';
export { default as RegisterForm } from '../components/auth/RegisterForm';

// Common Components
export { default as LoadingScreen } from '../components/common/LoadingScreen';
export { ProfileShimmer } from '../components/common/Shimmer';
export { ErrorBoundary } from '../components/common/ErrorBoundary';
export { ErrorFallback } from '../components/common/ErrorFallback';
export { GlobalErrorFallback } from '../components/common/GlobalErrorFallback';
export { InfoConfiguracao } from '../components/common/InfoConfiguracao';
export { default as ConnectionError } from '../components/common/ConnectionError';
export { NotFoundRedirect } from '../components/NotFoundRedirect';
export { PermissionButton } from '../components/common/PermissionButton';
export { AuthInitializer } from '../components/AuthInitializer';
export { Spinner } from '../components/common/Spinner';
export { DesiredFeaturesInput } from '../components/common/DesiredFeaturesInput';
export { FeaturesDisplay } from '../components/common/FeaturesDisplay';
export { MatchCard } from '../components/common/MatchCard';
export { MatchesBadge } from '../components/common/MatchesBadge';
export { MatchesWidget } from '../components/common/MatchesWidget';
export { IgnoreMatchModal } from '../components/common/IgnoreMatchModal';
export { UpgradePrompt } from '../components/common/UpgradePrompt';

// Owner Components
export {
  OwnerOnly,
  AdminOnly,
  OwnerBadge,
  OwnerIndicator,
  OwnerConditional,
} from '../components/common/OwnerComponents';

// UI Components
export { Tooltip } from '../components/ui/Tooltip';

// Modal Components
export { default as EditProfileModal } from '../components/modals/EditProfileModal';
export { default as EditCompanyModal } from '../components/modals/EditCompanyModal';
export { UserPreferencesModal } from '../components/modals/UserPreferencesModal';
export { ModuleUpgradeModal } from '../components/modals/ModuleUpgradeModal';
export { GlobalModuleUpgradeModal } from '../components/GlobalModuleUpgradeModal';

// Subscription Components
export { SubscriptionProtectedRoute } from '../components/SubscriptionProtectedRoute';
export { SubscriptionNotification } from '../components/SubscriptionNotification';
export { SubscriptionGuard } from '../components/SubscriptionGuardNew';

// Types
export * from '../types/auth';
export * from '../types/property';
export * from '../types/subscription';
export * from '../types/match';
