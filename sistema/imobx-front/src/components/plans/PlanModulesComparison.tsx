/**
 * Componente de exemplo para comparar módulos dos planos Básico e Pro
 * Baseado na documentação: Guia Frontend - Módulos por Plano
 */

import React from 'react';
import { usePlanModules } from '../../hooks/usePlanModules';
import * as S from '../../styles/components/PlanModulesComparisonStyles';

export const PlanModulesComparison: React.FC = () => {
  const { data, loading, error } = usePlanModules();

  if (loading) {
    return (
      <S.Container>
        <S.LoadingMessage>Carregando módulos dos planos...</S.LoadingMessage>
      </S.Container>
    );
  }

  if (error) {
    return (
      <S.Container>
        <S.ErrorMessage>Erro: {error}</S.ErrorMessage>
      </S.Container>
    );
  }

  if (!data) {
    return null;
  }

  const { basic, pro } = data;

  // Criar um mapa de módulos do Pro para verificação rápida
  const proModuleCodes = new Set(pro.modules.map(m => m.code));

  return (
    <S.Container>
      <S.Title>Comparação de Planos</S.Title>

      <S.PlansGrid>
        {/* Plano Básico */}
        <S.PlanCard>
          <S.PlanHeader>
            <S.PlanName>{basic.planName}</S.PlanName>
            <S.PlanPrice>R$ {basic.price.toFixed(2)}/mês</S.PlanPrice>
          </S.PlanHeader>

          <S.ModulesList>
            <S.ModulesCount>
              {basic.modules.length} módulos incluídos
            </S.ModulesCount>
            {basic.modules.map(module => (
              <S.ModuleItem key={module.code}>
                <S.CheckIcon>✓</S.CheckIcon>
                <div>
                  <S.ModuleCode>{module.code}</S.ModuleCode>
                  <S.ModuleName>{module.name}</S.ModuleName>
                </div>
              </S.ModuleItem>
            ))}
          </S.ModulesList>
        </S.PlanCard>

        {/* Plano Pro */}
        <S.PlanCard $highlighted>
          <S.PlanHeader>
            <S.PlanName>{pro.planName}</S.PlanName>
            <S.PlanPrice>R$ {pro.price.toFixed(2)}/mês</S.PlanPrice>
          </S.PlanHeader>

          <S.ModulesList>
            <S.ModulesCount>
              {pro.modules.length} módulos incluídos
            </S.ModulesCount>
            {pro.modules.map(module => {
              const isProExclusive = !basic.modules.some(
                m => m.code === module.code
              );

              return (
                <S.ModuleItem key={module.code} $exclusive={isProExclusive}>
                  <S.CheckIcon>✓</S.CheckIcon>
                  <div>
                    <S.ModuleCode>{module.code}</S.ModuleCode>
                    <S.ModuleName>{module.name}</S.ModuleName>
                    {isProExclusive && (
                      <S.ExclusiveBadge>Exclusivo Pro</S.ExclusiveBadge>
                    )}
                  </div>
                </S.ModuleItem>
              );
            })}
          </S.ModulesList>
        </S.PlanCard>
      </S.PlansGrid>

      {/* Tabela de Comparação */}
      <S.ComparisonTable>
        <thead>
          <tr>
            <S.TableHeader>Módulo</S.TableHeader>
            <S.TableHeader>Básico</S.TableHeader>
            <S.TableHeader>Pro</S.TableHeader>
          </tr>
        </thead>
        <tbody>
          {pro.modules.map(module => {
            const hasInBasic = basic.modules.some(m => m.code === module.code);

            return (
              <tr key={module.code}>
                <S.TableCell>
                  <S.ModuleCodeSmall>{module.code}</S.ModuleCodeSmall>
                  <div>{module.name}</div>
                </S.TableCell>
                <S.TableCell $center>
                  {hasInBasic ? (
                    <S.CheckMark>✅</S.CheckMark>
                  ) : (
                    <S.CrossMark>❌</S.CrossMark>
                  )}
                </S.TableCell>
                <S.TableCell $center>
                  <S.CheckMark>✅</S.CheckMark>
                </S.TableCell>
              </tr>
            );
          })}
        </tbody>
      </S.ComparisonTable>
    </S.Container>
  );
};
