import { Box, Container, Paper, Card, Button, Typography } from '@mui/material'
import styled from 'styled-components'

export const HeaderSection = styled(Box)`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${({ theme }) => theme.spacing.xl} 0
    ${({ theme }) => theme.spacing["2xl"] || "80px"} 0;
  color: white;
  position: relative;
  overflow: visible;
  margin-top: -100px;
  padding-top: calc(100px + ${({ theme }) => theme.spacing.xl});
  z-index: 1;

  @media (max-width: 768px) {
    margin-top: -90px;
    padding-top: calc(90px + ${({ theme }) => theme.spacing.xl});
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 50%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      );
    z-index: 1;
  }
`;

export const HeaderContent = styled(Container)`
  position: relative;
  z-index: 1010;
`;

export const CompanyProfileCard = styled(Paper)`
  position: relative;
  margin-top: -120px;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.2);
  }
`;

export const LogoContainer = styled(Box)`
  width: 160px;
  height: 160px;
  margin: 0 auto;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const StatCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 70%
    );
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  }
`;

export const ActionButton = styled(Button)`
  border-radius: 50px !important;
  padding: 12px 32px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  font-size: 1rem !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
  }
`;

export const SectionTitle = styled(Typography)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-left: 0;
  margin-left: 0;

  &::before {
    content: "";
    width: 4px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
    margin-right: ${({ theme }) => theme.spacing.md};
  }
`;

export const InfoItem = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

