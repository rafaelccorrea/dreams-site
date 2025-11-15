import { Box, Container, Grid, Stack, Paper } from "@mui/material";
import { ShimmerBase } from "./Shimmer";
import styled from "styled-components";

const ShimmerAvatar = styled(ShimmerBase)`
  width: 140px;
  height: 140px;
  border-radius: 50%;
`;

const ShimmerTitle = styled(ShimmerBase)`
  height: 40px;
  width: 250px;
  border-radius: 4px;
`;

const ShimmerChip = styled(ShimmerBase)`
  height: 32px;
  width: 180px;
  border-radius: 16px;
`;

const ShimmerText = styled(ShimmerBase)`
  height: 16px;
  width: 150px;
  border-radius: 4px;
`;

const ShimmerInfoItem = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 8px 0;
`;

const ShimmerIcon = styled(ShimmerBase)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
`;

const ShimmerBadge = styled(ShimmerBase)<{ $width?: number; $height?: number }>`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: ${({ $width }) => $width || 32}px;
  height: ${({ $height }) => $height || 32}px;
  border-radius: 50%;
`;

const ShimmerTitleCentered = styled(ShimmerTitle)`
  margin: 0 auto;
`;

const ShimmerChipCentered = styled(ShimmerChip)`
  margin: 0 auto;
`;

const ShimmerBoxSmall = styled(ShimmerBase)<{ $width?: number; $height?: number; $borderRadius?: number }>`
  width: ${({ $width }) => $width || 40}px;
  height: ${({ $height }) => $height || 40}px;
  border-radius: ${({ $borderRadius, theme }) => $borderRadius ? `${$borderRadius}px` : theme.borderRadius.sm};
`;

const ShimmerTitleCustom = styled(ShimmerBase)<{ $width?: number; $height?: number; $mb?: number }>`
  width: ${({ $width }) => $width || 220}px;
  height: ${({ $height }) => $height || 28}px;
  margin-bottom: ${({ $mb }) => $mb ? `${$mb * 8}px` : '0'};
`;

const ShimmerTextCustom = styled(ShimmerText)<{ $width?: number | string; $height?: number; $mb?: number }>`
  width: ${({ $width }) => typeof $width === 'number' ? `${$width}px` : $width || '150px'};
  height: ${({ $height }) => $height || 16}px;
  margin-bottom: ${({ $mb }) => $mb ? `${$mb * 8}px` : '0'};
`;

const ShimmerButtonFull = styled(ShimmerBase)`
  height: 40px;
  width: 100%;
  border-radius: 8px;
`;

export const BrokerDetailsShimmer = () => {
  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#f8f9fa", pt: 15, pb: 6 }}>
        <Container maxWidth="xl">
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Grid container spacing={5} alignItems="flex-start">
              {/* Avatar e Nome */}
              <Grid item xs={12} md={3}>
                <Stack alignItems="center" spacing={2}>
                  <Box sx={{ position: "relative" }}>
                    <ShimmerAvatar />
                    <ShimmerBadge />
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <ShimmerTitleCentered style={{ marginBottom: '16px' }} />
                    <ShimmerChipCentered />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <ShimmerBoxSmall />
                    <ShimmerBoxSmall />
                  </Stack>
                </Stack>
              </Grid>

              {/* Informações de Contato */}
              <Grid item xs={12} md={5}>
                <ShimmerTitleCustom $width={220} $height={28} $mb={3} />

                <Stack spacing={2.5}>
                  <ShimmerInfoItem>
                    <ShimmerIcon />
                    <Box>
                      <ShimmerTextCustom $width={80} $height={12} $mb={0.5} />
                      <ShimmerTextCustom $width={120} $height={20} />
                    </Box>
                  </ShimmerInfoItem>

                  <ShimmerInfoItem>
                    <ShimmerIcon />
                    <Box>
                      <ShimmerTextCustom $width={60} $height={12} $mb={0.5} />
                      <ShimmerTextCustom $width={150} $height={20} />
                    </Box>
                  </ShimmerInfoItem>

                  <ShimmerInfoItem>
                    <ShimmerIcon />
                    <Box sx={{ flex: 1 }}>
                      <ShimmerTextCustom $width={50} $height={12} $mb={0.5} />
                      <ShimmerTextCustom $width="90%" $height={20} />
                    </Box>
                  </ShimmerInfoItem>

                  <ShimmerInfoItem>
                    <ShimmerIcon />
                    <Box>
                      <ShimmerTextCustom $width={70} $height={12} $mb={0.5} />
                      <ShimmerTextCustom $width={100} $height={20} />
                    </Box>
                  </ShimmerInfoItem>
                </Stack>
              </Grid>

              {/* Botões de Ação */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <ShimmerButtonFull />
                  <ShimmerButtonFull />
                  <ShimmerButtonFull />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};







