// Estilos de formulários
export * from './forms/FormStyles';

// Estilos de páginas
export * from './pages/AuthStyles';
export * from './pages/SettingsStyles';

// Estilos de componentes
export * from './components/AlertStyles';
export * from './components/DrawerStyles';
export * from './components/PageStyles';

// Exportações específicas do CommonStyles para evitar conflitos
export {
  Container,
  Title,
  Subtitle,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
  LoadingContainer,
  LoadingText,
} from './components/CommonStyles';

// Estilos globais e tema
export * from './GlobalStyle';
export * from './theme';

// Exportações específicas para evitar conflitos
export {
  DashboardContainer,
  UserInfo,
  UserTitle,
  UserDetail,
} from './pages/DashboardStyles';

export {
  ProfileContainer,
  ProfileContent,
  ProfileTitle,
  ProfileHeader,
  AvatarSection,
  AvatarContainer,
  AvatarImage,
  AvatarUploadButton,
  UserInfoHeader,
  UserName,
  UserRole,
  UserStats,
  StatItem,
  StatValue,
  StatLabel,
  ProfileGrid,
  ProfileSection,
  ProfileSectionTitle,
  InfoList,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoLabel,
  InfoValue,
  EditButton,
  CompanyCard,
  CompanyHeader,
  CompanyName,
  CompanyIcon,
  CompanyInfo,
  CompanyInfoItem,
  CompanyInfoIcon,
  CompanyInfoContent,
  CompanyInfoLabel,
  CompanyInfoValue,
  CompanyActions,
  CompanyActionButton,
  StatsGrid,
  StatCard,
  StatCardIcon,
  StatCardValue,
  StatCardLabel,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  ProfileErrorMessage,
} from './pages/ProfileStyles';

export {
  HeaderContainer,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
  Logo,
  LogoImage,
  LogoText,
  UserContainer,
  UserAvatar,
  UserInfo as HeaderUserInfo,
  UserName as HeaderUserName,
  UserRole as HeaderUserRole,
  LogoutButton,
  ModalOverlay,
  ModalContainer,
  ModalIcon,
  ModalTitle,
  ModalDescription,
  ModalButtons,
  ModalButton,
} from './components/HeaderStyles';
