import { Box, Container, Grid, Stack, Skeleton, Card } from "@mui/material";
import { ShimmerBase } from "./Shimmer";
import styled from "styled-components";

const ShimmerAvatar = styled(ShimmerBase)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;

const ShimmerTitle = styled(ShimmerBase)`
  height: 32px;
  width: 200px;
  border-radius: 4px;
`;

const ShimmerText = styled(ShimmerBase)`
  height: 16px;
  width: 150px;
  border-radius: 4px;
`;

const ShimmerButton = styled(ShimmerBase)`
  height: 40px;
  width: 100%;
  border-radius: 8px;
`;

export const CompanyDetailsShimmer = () => {
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          position: "relative",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 4,
          mb: 4,
          overflow: "hidden",
        }}
      >
        {/* Banner Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/background-companies.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))",
              zIndex: 1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "50%",
              background: "linear-gradient(to left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), transparent)",
              zIndex: 1,
            },
          }}
        />
        
        {/* Overlay branco semi-transparente */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.2)",
            zIndex: 2,
          }}
        />
        
        {/* Conteúdo */}
        <Box sx={{ position: "relative", zIndex: 3 }}>
          <Container maxWidth="xl">
            <Skeleton variant="rectangular" width={100} height={36} sx={{ mb: 3, borderRadius: 1 }} />

            <Box sx={{ pt: 6 }}>
              <Grid container spacing={4} alignItems="flex-start">
                {/* Avatar e Nome - dentro de Card */}
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                      mx: "auto",
                      maxWidth: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <ShimmerAvatar sx={{ mb: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <ShimmerTitle />
                        <ShimmerBase
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                      <ShimmerText sx={{ width: 250, mb: 2 }} />
                      <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "center" }}>
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

                      {/* Estatísticas como rede social */}
                      <Stack direction="row" spacing={3} sx={{ mt: 3, width: "100%", justifyContent: "center" }}>
                        <Box sx={{ textAlign: "center" }}>
                          <ShimmerBase
                            sx={{
                              width: 40,
                              height: 28,
                              borderRadius: 1,
                              mx: "auto",
                              mb: 0.5,
                            }}
                          />
                          <ShimmerBase
                            sx={{
                              width: 60,
                              height: 14,
                              borderRadius: 1,
                              mx: "auto",
                            }}
                          />
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <ShimmerBase
                            sx={{
                              width: 40,
                              height: 28,
                              borderRadius: 1,
                              mx: "auto",
                              mb: 0.5,
                            }}
                          />
                          <ShimmerBase
                            sx={{
                              width: 70,
                              height: 14,
                              borderRadius: 1,
                              mx: "auto",
                            }}
                          />
                        </Box>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>

                {/* Botões */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
                    <Box sx={{ flex: 1 }} />
                    <Box sx={{ minWidth: 200 }}>
                      <Stack spacing={1.5}>
                        <ShimmerButton />
                        <ShimmerButton />
                        <ShimmerButton />
                        <ShimmerButton />
                      </Stack>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

