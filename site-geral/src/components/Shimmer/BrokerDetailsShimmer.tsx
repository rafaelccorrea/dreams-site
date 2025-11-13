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
                    <ShimmerBase
                      sx={{
                        position: "absolute",
                        bottom: 5,
                        right: 5,
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <ShimmerTitle sx={{ mx: "auto", mb: 2 }} />
                    <ShimmerChip sx={{ mx: "auto" }} />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <ShimmerBase
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                      }}
                    />
                    <ShimmerBase
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                      }}
                    />
                  </Stack>
                </Stack>
              </Grid>

              {/* Informações de Contato */}
              <Grid item xs={12} md={5}>
                <ShimmerTitle sx={{ width: 220, height: 28, mb: 3 }} />

                <Stack spacing={2.5}>
                  <ShimmerInfoItem>
                    <ShimmerIcon />
                    <Box>
                      <ShimmerText sx={{ width: 80, height: 12, mb: 0.5 }} />
                      <ShimmerText sx={{ width: 120, height: 20 }} />
                    </Box>
                  </ShimmerInfoItem>

                  <ShimmerInfoItem>
                    <ShimmerIcon />
                    <Box>
                      <ShimmerText sx={{ width: 60, height: 12, mb: 0.5 }} />
                      <ShimmerText sx={{ width: 150, height: 20 }} />
                    </Box>
                  </ShimmerInfoItem>

                  <ShimmerInfoItem>
                    <ShimmerIcon />
                    <Box sx={{ flex: 1 }}>
                      <ShimmerText sx={{ width: 50, height: 12, mb: 0.5 }} />
                      <ShimmerText sx={{ width: "90%", height: 20 }} />
                    </Box>
                  </ShimmerInfoItem>

                  <ShimmerInfoItem>
                    <ShimmerIcon />
                    <Box>
                      <ShimmerText sx={{ width: 70, height: 12, mb: 0.5 }} />
                      <ShimmerText sx={{ width: 100, height: 20 }} />
                    </Box>
                  </ShimmerInfoItem>
                </Stack>
              </Grid>

              {/* Botões de Ação */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <ShimmerBase
                    sx={{
                      height: 40,
                      width: "100%",
                      borderRadius: 1,
                    }}
                  />
                  <ShimmerBase
                    sx={{
                      height: 40,
                      width: "100%",
                      borderRadius: 1,
                    }}
                  />
                  <ShimmerBase
                    sx={{
                      height: 40,
                      width: "100%",
                      borderRadius: 1,
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};







