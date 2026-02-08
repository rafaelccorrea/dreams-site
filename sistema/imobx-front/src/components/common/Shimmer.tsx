import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação do shimmer — onda suave, mais realista
const shimmer = keyframes`
  0% {
    background-position: -160px 0;
  }
  100% {
    background-position: calc(160px + 100%) 0;
  }
`;

// Componente base do shimmer (gradiente suave tipo “luz passando”)
export const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
  $delay?: number;
}>`
  --shimmer-base: ${props =>
    props.theme?.mode === 'dark'
      ? (props.theme?.colors?.backgroundSecondary ?? '#2d3748')
      : '#e2e8f0'};
  --shimmer-mid: ${props =>
    props.theme?.mode === 'dark'
      ? (props.theme?.colors?.border ?? '#4a5568')
      : '#cbd5e1'};
  background: linear-gradient(
    90deg,
    var(--shimmer-base) 0%,
    var(--shimmer-base) 35%,
    var(--shimmer-mid) 50%,
    var(--shimmer-base) 65%,
    var(--shimmer-base) 100%
  );
  background-size: 160px 100%;
  animation: ${shimmer} 2s ease-in-out infinite;
  animation-delay: ${props => (props.$delay ?? 0) * 0.08}s;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '4px'};
  margin: ${props => props.$margin || '0'};
`;

// Shimmer para cards de anotação
const NoteCardShimmer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
`;

// Shimmer para header do card
const NoteHeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

// Shimmer para título
const TitleShimmer = styled(ShimmerBase)`
  width: 70%;
  height: 24px;
  border-radius: 6px;
`;

// Shimmer para badges
const BadgeShimmer = styled(ShimmerBase)`
  width: 60px;
  height: 20px;
  border-radius: 12px;
  margin-top: 8px;
`;

// Shimmer para conteúdo
const ContentShimmer = styled.div`
  margin-bottom: 16px;
`;

const ContentLineShimmer = styled(ShimmerBase)`
  height: 16px;
  margin-bottom: 8px;

  &:last-child {
    width: 50%;
    margin-bottom: 0;
  }
`;

// Shimmer para meta informações
const MetaShimmer = styled(ShimmerBase)`
  height: 14px;
  width: 120px;
  border-radius: 4px;
`;

// Shimmer para ações
const ActionsShimmer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionShimmer = styled(ShimmerBase)`
  width: 32px;
  height: 32px;
  border-radius: 8px;
`;

// Grid de shimmer para anotações
const NotesGridShimmer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

// Shimmer para header da página
const HeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TitleHeaderShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 32px;
  border-radius: 8px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 40px;
  border-radius: 8px;
`;

// Shimmer para controles
const ControlsShimmer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
`;

const SearchShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 40px;
  border-radius: 8px;
`;

const FilterShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 40px;
  border-radius: 8px;
`;

// Shimmer para estatísticas
const StatsShimmer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const StatShimmer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StatValueShimmer = styled(ShimmerBase)`
  width: 40px;
  height: 24px;
  border-radius: 6px;
`;

const StatLabelShimmer = styled(ShimmerBase)`
  width: 60px;
  height: 16px;
  border-radius: 4px;
`;

// Componente principal do shimmer para anotações
export const NotesShimmer: React.FC = () => {
  return (
    <div>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <div>
          <TitleHeaderShimmer />
          <StatsShimmer>
            <StatShimmer>
              <StatValueShimmer />
              <StatLabelShimmer />
            </StatShimmer>
            <StatShimmer>
              <StatValueShimmer />
              <StatLabelShimmer />
            </StatShimmer>
            <StatShimmer>
              <StatValueShimmer />
              <StatLabelShimmer />
            </StatShimmer>
            <StatShimmer>
              <StatValueShimmer />
              <StatLabelShimmer />
            </StatShimmer>
          </StatsShimmer>
        </div>
        <ButtonShimmer />
      </HeaderShimmer>

      {/* Controls Shimmer */}
      <ControlsShimmer>
        <SearchShimmer />
        <FilterShimmer />
      </ControlsShimmer>

      {/* Notes Grid Shimmer */}
      <NotesGridShimmer>
        {Array.from({ length: 6 }).map((_, index) => (
          <NoteCardShimmer key={index}>
            <NoteHeaderShimmer>
              <div>
                <TitleShimmer />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <BadgeShimmer />
                  <BadgeShimmer />
                </div>
              </div>
              <ActionsShimmer>
                <ActionShimmer />
                <ActionShimmer />
                <ActionShimmer />
                <ActionShimmer />
              </ActionsShimmer>
            </NoteHeaderShimmer>

            <ContentShimmer>
              <ContentLineShimmer />
              <ContentLineShimmer />
              <ContentLineShimmer />
            </ContentShimmer>

            <MetaShimmer />
          </NoteCardShimmer>
        ))}
      </NotesGridShimmer>
    </div>
  );
};

// Shimmer genérico para reutilização
export const Shimmer: React.FC<{
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
}> = ({ width, height, borderRadius, margin }) => (
  <ShimmerBase
    $width={width}
    $height={height}
    $borderRadius={borderRadius}
    $margin={margin}
  />
);

// Shimmer para página de usuários
export const UsersPageShimmer: React.FC = () => {
  const Card = styled.div`
    background: ${p => p.theme.colors.cardBackground};
    border-radius: 20px;
    border: 1px solid ${p => p.theme.colors.border};
    box-shadow: 0 4px 20px
      ${p => (p.theme.mode === 'dark' ? 'rgba(0,0,0,.3)' : 'rgba(0,0,0,.08)')};
    overflow: hidden;
  `;
  const SummaryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  `;
  const ActionsBarCard = styled(Card)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    gap: 16px;
    flex-wrap: wrap;
  `;
  const TableHeader = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 120px;
    gap: 16px;
    padding: 20px 24px;
    background: ${p => p.theme.colors.backgroundSecondary};
    border-bottom: 1px solid ${p => p.theme.colors.border};
    @media (max-width: 1024px) {
      grid-template-columns: 2fr 1fr 1fr 80px;
      gap: 12px;
      padding: 16px 20px;
    }
    @media (max-width: 768px) {
      display: none;
    }
  `;
  const TableRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 120px;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid ${p => p.theme.colors.border};
    align-items: center;
    @media (max-width: 1024px) {
      grid-template-columns: 2fr 1fr 1fr 80px;
      gap: 12px;
      padding: 16px 20px;
    }
    @media (max-width: 768px) {
      display: block;
      padding: 20px;
      border: 1px solid ${p => p.theme.colors.border};
      border-radius: 12px;
      margin: 16px;
    }
  `;
  const MobileOnly = styled.div`
    display: none;
    @media (max-width: 768px) {
      display: block;
    }
  `;
  const DesktopOnly = styled.div`
    @media (max-width: 768px) {
      display: none;
    }
  `;
  return (
    <div style={{ width: '100%' }}>
      <HeaderShimmer>
        <div>
          <TitleHeaderShimmer />
          <ShimmerBase
            $width='320px'
            $height='16px'
            $borderRadius='6px'
            $margin='8px 0 0 0'
          />
        </div>
        <ButtonShimmer />
      </HeaderShimmer>

      <SummaryGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} style={{ padding: 28, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'rgba(0,0,0,.06)',
              }}
            />
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: '#e5e7eb',
                marginBottom: 16,
              }}
            />
            <ShimmerBase
              $width='60px'
              $height='36px'
              $borderRadius='6px'
              $margin='0 0 6px 0'
            />
            <ShimmerBase $width='140px' $height='14px' $borderRadius='4px' />
          </Card>
        ))}
      </SummaryGrid>

      <ActionsBarCard>
        <ShimmerBase $width='320px' $height='44px' $borderRadius='12px' />
        <ShimmerBase $width='120px' $height='44px' $borderRadius='12px' />
      </ActionsBarCard>

      <Card>
        <DesktopOnly>
          <TableHeader>
            <ShimmerBase $width='160px' $height='16px' />
            <ShimmerBase $width='80px' $height='16px' />
            <ShimmerBase $width='80px' $height='16px' />
            <ShimmerBase $width='120px' $height='16px' />
            <ShimmerBase $width='80px' $height='16px' />
          </TableHeader>
        </DesktopOnly>

        {Array.from({ length: 6 }).map((_, row) => (
          <TableRow key={row}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShimmerBase $width='40px' $height='40px' $borderRadius='50%' />
              <div style={{ flex: 1 }}>
                <ShimmerBase
                  $width='180px'
                  $height='16px'
                  $borderRadius='6px'
                  $margin='0 0 6px 0'
                />
                <ShimmerBase
                  $width='220px'
                  $height='14px'
                  $borderRadius='4px'
                />
              </div>
            </div>
            <DesktopOnly>
              <ShimmerBase $width='90px' $height='24px' $borderRadius='8px' />
            </DesktopOnly>
            <DesktopOnly>
              <ShimmerBase $width='110px' $height='24px' $borderRadius='8px' />
            </DesktopOnly>
            <DesktopOnly>
              <ShimmerBase $width='90px' $height='16px' $borderRadius='6px' />
            </DesktopOnly>
            <DesktopOnly>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ShimmerBase $width='36px' $height='36px' $borderRadius='8px' />
              </div>
            </DesktopOnly>

            {/* Versão mobile como card */}
            <MobileOnly>
              <div
                style={{
                  marginTop: 12,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <ShimmerBase $width='90px' $height='24px' $borderRadius='8px' />
                <ShimmerBase
                  $width='110px'
                  $height='24px'
                  $borderRadius='8px'
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 12,
                }}
              >
                <ShimmerBase $width='36px' $height='36px' $borderRadius='8px' />
              </div>
            </MobileOnly>
          </TableRow>
        ))}
      </Card>
    </div>
  );
};

// Shimmer para edição de usuário
export const EditUserShimmer: React.FC = () => (
  <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
    {/* Page Header Shimmer */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '32px',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}
        >
          <ShimmerBase $width='32px' $height='32px' $borderRadius='8px' />
          <ShimmerBase $width='200px' $height='36px' $borderRadius='8px' />
        </div>
        <ShimmerBase $width='400px' $height='20px' $borderRadius='6px' />
      </div>
      <ShimmerBase $width='120px' $height='44px' $borderRadius='12px' />
    </div>

    {/* Cards Grid */}
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        marginBottom: '32px',
      }}
    >
      {/* Card Informações Básicas */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          <ShimmerBase $width='40px' $height='40px' $borderRadius='10px' />
          <ShimmerBase $width='180px' $height='24px' $borderRadius='6px' />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} style={{ marginBottom: '24px' }}>
            <ShimmerBase
              $width='120px'
              $height='16px'
              $borderRadius='4px'
              $margin='0 0 8px 0'
            />
            <ShimmerBase $width='100%' $height='44px' $borderRadius='12px' />
          </div>
        ))}
      </div>

      {/* Card Permissões */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          <ShimmerBase $width='40px' $height='40px' $borderRadius='10px' />
          <ShimmerBase $width='150px' $height='24px' $borderRadius='6px' />
        </div>

        {/* Info Box */}
        <div style={{ marginBottom: '24px' }}>
          <ShimmerBase $width='100%' $height='60px' $borderRadius='12px' />
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <ShimmerBase $width='100%' $height='44px' $borderRadius='12px' />
        </div>

        {/* Permissions Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {Array.from({ length: 3 }).map((_, catIndex) => (
            <div
              key={catIndex}
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <ShimmerBase $width='32px' $height='32px' $borderRadius='8px' />
                <ShimmerBase
                  $width='140px'
                  $height='18px'
                  $borderRadius='4px'
                />
              </div>
              {Array.from({ length: 3 }).map((_, permIndex) => (
                <div
                  key={permIndex}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <ShimmerBase
                    $width='18px'
                    $height='18px'
                    $borderRadius='4px'
                  />
                  <div style={{ flex: 1 }}>
                    <ShimmerBase
                      $width='150px'
                      $height='14px'
                      $borderRadius='4px'
                      $margin='0 0 4px 0'
                    />
                    <ShimmerBase
                      $width='100px'
                      $height='12px'
                      $borderRadius='4px'
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Card Tags */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          <ShimmerBase $width='40px' $height='40px' $borderRadius='10px' />
          <ShimmerBase $width='80px' $height='24px' $borderRadius='6px' />
        </div>

        {/* Info Box */}
        <div style={{ marginBottom: '24px' }}>
          <ShimmerBase $width='100%' $height='60px' $borderRadius='12px' />
        </div>

        {/* Tag Selector */}
        <ShimmerBase $width='100%' $height='120px' $borderRadius='12px' />
      </div>
    </div>

    {/* Action Bar */}
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px 32px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <ShimmerBase $width='200px' $height='20px' $borderRadius='4px' />
      <ShimmerBase $width='180px' $height='48px' $borderRadius='12px' />
    </div>
  </div>
);

// Shimmer moderno para perfil baseado no novo design
export const ProfileShimmer: React.FC = () => (
  <div
    style={{
      padding: '32px',
      minHeight: '100vh',
      maxWidth: '1400px',
      margin: '0 auto',
    }}
  >
    {/* Header Shimmer */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      {/* Header Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ShimmerBase $width='40px' $height='40px' $borderRadius='12px' />
        <ShimmerBase $width='200px' $height='40px' $borderRadius='8px' />
        <ShimmerBase $width='120px' $height='24px' $borderRadius='20px' />
      </div>

      {/* Edit Button */}
      <ShimmerBase $width='150px' $height='48px' $borderRadius='16px' />
    </div>

    {/* Controles Shimmer */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '32px',
        padding: '20px',
        background: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <ShimmerBase $width='300px' $height='48px' $borderRadius='16px' />
      <ShimmerBase $width='120px' $height='48px' $borderRadius='16px' />
    </div>

    {/* Estatísticas Grid Shimmer */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
            }}
          />
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#f0f0f0',
              marginBottom: '16px',
            }}
          />
          <div>
            <ShimmerBase
              $height='32px'
              $width='80px'
              $borderRadius='6px'
              $margin='0 0 4px 0'
            />
            <ShimmerBase $height='16px' $width='100px' $borderRadius='4px' />
          </div>
        </div>
      ))}
    </div>

    {/* Grid Principal Shimmer - apenas card de informações pessoais */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '32px',
        marginBottom: '32px',
      }}
    >
      {/* Card de Informações Pessoais */}
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShimmerBase $width='20px' $height='20px' $borderRadius='4px' />
            <ShimmerBase $width='150px' $height='18px' $borderRadius='6px' />
          </div>
          <ShimmerBase $width='80px' $height='32px' $borderRadius='8px' />
        </div>
        <div style={{ padding: '24px 28px' }}>
          {/* Avatar e informações básicas */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px 0',
              borderBottom: '2px solid #e5e7eb',
              marginBottom: '16px',
            }}
          >
            <ShimmerBase $width='80px' $height='80px' $borderRadius='20px' />
            <div style={{ flex: 1 }}>
              <ShimmerBase
                $width='80px'
                $height='14px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase
                $width='250px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase
                $width='60px'
                $height='14px'
                $borderRadius='4px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='150px' $height='18px' $borderRadius='6px' />
            </div>
          </div>

          {/* Outras informações */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 0',
                borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
              }}
            >
              <ShimmerBase $width='40px' $height='40px' $borderRadius='10px' />
              <div style={{ flex: 1 }}>
                <ShimmerBase
                  $width='80px'
                  $height='14px'
                  $borderRadius='4px'
                  $margin='0 0 2px 0'
                />
                <ShimmerBase
                  $width='200px'
                  $height='16px'
                  $borderRadius='6px'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Seção de Empresas Shimmer */}
    <div
      style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShimmerBase $width='20px' $height='20px' $borderRadius='4px' />
          <ShimmerBase $width='140px' $height='18px' $borderRadius='6px' />
        </div>
      </div>
      {/* Campo de busca shimmer */}
      <div
        style={{
          padding: '16px 28px 0 28px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <ShimmerBase $width='300px' $height='44px' $borderRadius='12px' />
      </div>

      <div style={{ padding: '24px 28px' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              marginBottom: '24px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShimmerBase $width='20px' $height='20px' $borderRadius='4px' />
                <ShimmerBase
                  $width='200px'
                  $height='18px'
                  $borderRadius='6px'
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <ShimmerBase $width='32px' $height='32px' $borderRadius='8px' />
                <ShimmerBase $width='32px' $height='32px' $borderRadius='8px' />
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              {Array.from({ length: 3 }).map((_, detailIndex) => (
                <div
                  key={detailIndex}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <ShimmerBase
                    $width='16px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                  <ShimmerBase
                    $width='250px'
                    $height='14px'
                    $borderRadius='4px'
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Shimmer para empresas
export const CompaniesShimmer: React.FC = () => (
  <div>
    <HeaderShimmer>
      <TitleHeaderShimmer />
      <ButtonShimmer />
    </HeaderShimmer>
    <div
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <NoteCardShimmer key={index}>
          <NoteHeaderShimmer>
            <TitleShimmer />
            <ActionsShimmer>
              <ActionShimmer />
              <ActionShimmer />
            </ActionsShimmer>
          </NoteHeaderShimmer>
          <ContentShimmer>
            <ContentLineShimmer />
            <ContentLineShimmer />
          </ContentShimmer>
        </NoteCardShimmer>
      ))}
    </div>
  </div>
);

// Shimmer para vistorias
export const VistoriaShimmer: React.FC = () => (
  <div style={{ padding: '24px' }}>
    {/* Header Shimmer */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ShimmerBase $width='40px' $height='40px' $borderRadius='8px' />
          <ShimmerBase $width='200px' $height='40px' $borderRadius='8px' />
        </div>
        <div style={{ marginTop: '8px' }}>
          <ShimmerBase $width='350px' $height='18px' $borderRadius='6px' />
        </div>
      </div>
      <ShimmerBase $width='160px' $height='48px' $borderRadius='16px' />
    </div>

    {/* Controls Shimmer */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        padding: '16px',
        background: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ShimmerBase $width='300px' $height='48px' $borderRadius='16px' />
        <ShimmerBase $width='120px' $height='48px' $borderRadius='12px' />
        <ShimmerBase $width='100px' $height='60px' $borderRadius='16px' />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShimmerBase $width='80px' $height='16px' $borderRadius='4px' />
          <ShimmerBase $width='80px' $height='40px' $borderRadius='12px' />
        </div>
      </div>
      <ShimmerBase $width='150px' $height='16px' $borderRadius='4px' />
    </div>

    {/* Vistoria Cards Grid Shimmer */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          style={{
            background: 'white',
            borderRadius: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px 16px 24px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShimmerBase $width='20px' $height='20px' $borderRadius='4px' />
              <ShimmerBase $width='200px' $height='20px' $borderRadius='6px' />
            </div>
            <div style={{ marginTop: '8px' }}>
              <ShimmerBase $width='80px' $height='16px' $borderRadius='4px' />
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '20px 24px' }}>
            <ShimmerBase
              $width='100%'
              $height='16px'
              $borderRadius='4px'
              $margin='0 0 8px 0'
            />
            <ShimmerBase
              $width='90%'
              $height='16px'
              $borderRadius='4px'
              $margin='0 0 8px 0'
            />
            <ShimmerBase
              $width='70%'
              $height='16px'
              $borderRadius='4px'
              $margin='0 0 16px 0'
            />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <ShimmerBase $width='60px' $height='24px' $borderRadius='12px' />
              <ShimmerBase $width='80px' $height='24px' $borderRadius='12px' />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ShimmerBase $width='120px' $height='14px' $borderRadius='4px' />
              <ShimmerBase $width='80px' $height='32px' $borderRadius='8px' />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Shimmer para detalhes de vistoria
export const VistoriaDetailShimmer: React.FC = () => (
  <div>
    {/* Header Shimmer */}
    <HeaderShimmer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ShimmerBase $width='40px' $height='40px' $borderRadius='8px' />
        <div>
          <TitleHeaderShimmer />
          <div style={{ marginTop: '8px' }}>
            <ShimmerBase $width='250px' $height='16px' $borderRadius='4px' />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <ButtonShimmer />
        <ButtonShimmer />
      </div>
    </HeaderShimmer>

    {/* Tabs Shimmer */}
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        padding: '0 4px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <ShimmerBase $width='120px' $height='40px' $borderRadius='8px' />
      <ShimmerBase $width='100px' $height='40px' $borderRadius='8px' />
      <ShimmerBase $width='80px' $height='40px' $borderRadius='8px' />
    </div>

    {/* Content Shimmer */}
    <div style={{ display: 'grid', gap: '24px' }}>
      <NoteCardShimmer>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <ShimmerBase $width='100px' $height='16px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='20px' />
          </div>
          <div>
            <ShimmerBase $width='80px' $height='16px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='20px' />
          </div>
          <div>
            <ShimmerBase $width='120px' $height='16px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='20px' />
          </div>
          <div>
            <ShimmerBase $width='90px' $height='16px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='20px' />
          </div>
        </div>
      </NoteCardShimmer>

      <NoteCardShimmer>
        <div>
          <ShimmerBase $width='150px' $height='20px' $margin='0 0 16px 0' />
          <ContentShimmer>
            <ContentLineShimmer />
            <ContentLineShimmer />
            <ContentLineShimmer />
            <ContentLineShimmer />
          </ContentShimmer>
        </div>
      </NoteCardShimmer>

      <NoteCardShimmer>
        <div>
          <ShimmerBase $width='100px' $height='20px' $margin='0 0 16px 0' />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '12px',
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <ShimmerBase
                key={index}
                $width='100%'
                $height='120px'
                $borderRadius='8px'
              />
            ))}
          </div>
        </div>
      </NoteCardShimmer>
    </div>
  </div>
);

// Shimmer para controle de chaves
export const KeysPageShimmer: React.FC = () => (
  <div>
    {/* Header Shimmer */}
    <HeaderShimmer>
      <div>
        <TitleHeaderShimmer />
        <div style={{ marginTop: '8px' }}>
          <ShimmerBase $width='200px' $height='16px' $borderRadius='4px' />
        </div>
      </div>
      <ButtonShimmer />
    </HeaderShimmer>

    {/* Stats Grid Shimmer */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <NoteCardShimmer key={index}>
          <div style={{ textAlign: 'center' }}>
            <ShimmerBase $width='120px' $height='16px' $margin='0 0 8px 0' />
            <ShimmerBase $width='60px' $height='32px' $borderRadius='6px' />
          </div>
        </NoteCardShimmer>
      ))}
    </div>

    {/* Tabs Shimmer */}
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        padding: '0 4px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <ShimmerBase $width='120px' $height='40px' $borderRadius='8px' />
      <ShimmerBase $width='140px' $height='40px' $borderRadius='8px' />
      <ShimmerBase $width='100px' $height='40px' $borderRadius='8px' />
    </div>

    {/* Keys Grid Shimmer */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <NoteCardShimmer key={index}>
          <NoteHeaderShimmer>
            <div>
              <TitleShimmer />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <BadgeShimmer />
                <BadgeShimmer />
              </div>
            </div>
            <ActionsShimmer>
              <ActionShimmer />
              <ActionShimmer />
            </ActionsShimmer>
          </NoteHeaderShimmer>

          <ContentShimmer>
            <ContentLineShimmer />
            <ContentLineShimmer />
            <ContentLineShimmer />
          </ContentShimmer>

          <div style={{ marginTop: '16px' }}>
            <ShimmerBase $width='100%' $height='36px' $borderRadius='8px' />
          </div>
        </NoteCardShimmer>
      ))}
    </div>
  </div>
);

// Shimmer para página de criação/edição de propriedades
export const PropertyFormShimmer: React.FC = () => (
  <div>
    {/* Header Shimmer */}
    <HeaderShimmer>
      <TitleHeaderShimmer />
      <ButtonShimmer />
    </HeaderShimmer>

    {/* Progress Steps Shimmer */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '32px',
        padding: '0 20px',
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <ShimmerBase
            $width='32px'
            $height='32px'
            $borderRadius='50%'
            $margin='0 0 8px 0'
          />
          <ShimmerBase $width='80px' $height='14px' $borderRadius='4px' />
        </div>
      ))}
    </div>

    {/* Form Shimmer */}
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* Section Title */}
      <ShimmerBase
        $width='200px'
        $height='24px'
        $borderRadius='6px'
        $margin='0 0 8px 0'
      />
      <ShimmerBase
        $width='300px'
        $height='16px'
        $borderRadius='4px'
        $margin='0 0 32px 0'
      />

      {/* Form Fields Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <ShimmerBase
              $width='120px'
              $height='16px'
              $borderRadius='4px'
              $margin='0 0 8px 0'
            />
            <ShimmerBase $width='100%' $height='40px' $borderRadius='8px' />
          </div>
        ))}
      </div>

      {/* Textarea Fields */}
      <div style={{ marginBottom: '32px' }}>
        <ShimmerBase
          $width='150px'
          $height='16px'
          $borderRadius='4px'
          $margin='0 0 8px 0'
        />
        <ShimmerBase $width='100%' $height='100px' $borderRadius='8px' />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <ShimmerBase $width='120px' $height='40px' $borderRadius='8px' />
        <ShimmerBase $width='140px' $height='40px' $borderRadius='8px' />
      </div>
    </div>
  </div>
);
