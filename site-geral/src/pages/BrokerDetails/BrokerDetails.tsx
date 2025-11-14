"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Container,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  Divider,
  alpha,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Business,
  Verified,
  WhatsApp,
  Share,
  Favorite,
  FavoriteBorder,
  Home,
  Call,
  MailOutline,
} from "@mui/icons-material";
import {
  getBrokerById,
  getBrokerProperties,
  type Broker,
  type Property,
} from "../../services/propertyService";
import { PropertyCard } from "../../components/PropertyCard";
import { PropertyCardShimmer, BrokerDetailsShimmer } from "../../components/Shimmer";
import { usePageTitle } from "../../hooks/usePageTitle";

export const BrokerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (id) loadBroker(id);
  }, [id]);

  const loadBroker = async (brokerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrokerById(brokerId);
      if (data) setBroker(data);
      else setError("Corretor não encontrado");
    } catch (err) {
      setError("Erro ao carregar corretor");
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    if (!broker) return;
    setLoadingProperties(true);
    try {
      const result = await getBrokerProperties(broker.id, 1, 12);
      setProperties(result.properties);
      setTotalProperties(result.total);
    } catch (err) {
      setProperties([]);
      setTotalProperties(0);
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    if (broker) loadProperties();
  }, [broker]);

  const handleWhatsApp = () => {
    if (broker?.phone) {
      const phoneNumber = broker.phone.replace(/\D/g, "");
      const message = encodeURIComponent(
        `Olá ${broker.name}${
          broker.company ? ` da ${broker.company.name}` : ""
        }, gostaria de mais informações sobre seus imóveis.`
      );
      window.open(`https://wa.me/55${phoneNumber}?text=${message}`, "_blank");
    }
  };

  const handlePhone = () =>
    broker?.phone && (window.location.href = `tel:${broker.phone}`);

  const handleEmail = () => {
    if (broker?.email) {
      const subject = encodeURIComponent("Interesse em imóveis");
      const body = encodeURIComponent(
        `Olá ${broker.name},\n\nGostaria de mais informações sobre seus imóveis disponíveis.\n\nAtenciosamente`
      );
      window.location.href = `mailto:${broker.email}?subject=${subject}&body=${body}`;
    }
  };

  const shouldShowEmail = (email: string) =>
    !email.includes("@teste.") &&
    !email.includes("master.") &&
    !email.includes("user");

  // Atualizar título da página dinamicamente
  usePageTitle(
    broker ? `${broker.name} - Corretor - Dream Keys` : undefined,
    broker ? `Perfil do corretor ${broker.name}${broker.company ? ` da ${broker.company.name}` : ''}. Veja imóveis disponíveis e entre em contato.` : undefined
  )

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${broker?.name}`,
          text: `Confira o perfil do corretor ${broker?.name}`,
          url: window.location.href,
        });
      } catch {
        // Usuário cancelou o compartilhamento
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const getGoogleMapsUrl = () => {
    if (!broker?.city) return "";
    const location =
      broker.city + (broker.company?.state ? `, ${broker.company.state}` : "");
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dN6ba0W8iEgGyE&q=${encodeURIComponent(
      location
    )}`;
  };

  if (loading) return <BrokerDetailsShimmer />;

  if (error || !broker)
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          {error || "Corretor não encontrado"}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate("/corretores")}
        >
          Voltar
        </Button>
      </Container>
    );

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      {/* Seção do Perfil */}
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
          <Avatar
            src={broker.avatar}
            alt={broker.name}
            sx={{
                        width: 140,
                        height: 140,
                        border: "4px solid",
                        borderColor: "primary.main",
            }}
          >
            {broker.name.charAt(0).toUpperCase()}
          </Avatar>
                    <Box
              sx={{
                        position: "absolute",
                        bottom: 5,
                        right: 5,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                        p: 0.5,
                        display: "flex",
                        border: "3px solid white",
                      }}
                    >
                      <Verified sx={{ color: "white", fontSize: 24 }} />
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      {broker.name}
          </Typography>

          {broker.company && (
            <Chip
                        icon={<Business sx={{ fontSize: 18 }} />}
              label={broker.company.name}
              sx={{
                          bgcolor: alpha("#667eea", 0.1),
                          color: "#667eea",
                fontWeight: 600,
              }}
            />
          )}
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Tooltip
              title={
                        isFavorite
                          ? "Remover dos favoritos"
                          : "Adicionar aos favoritos"
              }
            >
                      <IconButton
                        onClick={() => setIsFavorite(!isFavorite)}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                {isFavorite ? (
                  <Favorite sx={{ color: "#ff6b6b" }} />
                ) : (
                          <FavoriteBorder />
                )}
              </IconButton>
            </Tooltip>

                    <Tooltip title="Compartilhar">
                      <IconButton
                        onClick={handleShare}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Share />
              </IconButton>
            </Tooltip>
          </Stack>
                </Stack>
              </Grid>

              {/* Informações de Contato */}
              <Grid item xs={12} md={5}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  Informações de Contato
                </Typography>

                <Stack spacing={2.5}>
                  {broker.city && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        cursor: "pointer",
                        py: 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => setShowMap(true)}
                    >
                      <LocationOn
                        sx={{ color: "primary.main", fontSize: 24, mt: 0.5 }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          Localização
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {broker.city}
                        </Typography>
                      </Box>
                    </Box>
                  )}

            {broker.phone && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        py: 1,
                      }}
                    >
                      <Phone sx={{ color: "primary.main", fontSize: 24, mt: 0.5 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          Telefone
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {broker.phone}
                        </Typography>
                      </Box>
                    </Box>
            )}

            {broker.email && shouldShowEmail(broker.email) && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        py: 1,
                      }}
                    >
                      <Email sx={{ color: "primary.main", fontSize: 24, mt: 0.5 }} />
                      <Box sx={{ flex: 1, overflow: "hidden" }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          E-mail
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            wordBreak: "break-all",
                          }}
                        >
                          {broker.email}
                        </Typography>
                      </Box>
                    </Box>
            )}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      py: 1,
                    }}
                  >
                    <Home sx={{ color: "primary.main", fontSize: 24, mt: 0.5 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 0.5 }}
                      >
                        Portfólio
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {totalProperties}{" "}
                        {totalProperties === 1 ? "imóvel" : "imóveis"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
          </Grid>

              {/* Ações de Contato */}
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  Entre em Contato
                </Typography>

                <Stack spacing={2}>
            {broker.phone && (
              <Button
                      fullWidth
                variant="contained"
                      size="large"
                      startIcon={<WhatsApp />}
                onClick={handleWhatsApp}
                sx={{
                  bgcolor: "#25D366",
                  "&:hover": { bgcolor: "#128C7E" },
                        py: 2,
                        fontSize: "1rem",
                }}
              >
                      Conversar no WhatsApp
              </Button>
            )}

            {broker.phone && (
              <Button
                      fullWidth
                variant="outlined"
                      size="large"
                      startIcon={<Call />}
                onClick={handlePhone}
                      sx={{ py: 2 }}
              >
                      Ligar Agora
              </Button>
            )}

            {broker.email && shouldShowEmail(broker.email) && (
              <Button
                      fullWidth
                variant="outlined"
                      size="large"
                      startIcon={<MailOutline />}
                onClick={handleEmail}
                      sx={{ py: 2 }}
              >
                Enviar E-mail
              </Button>
            )}
          </Stack>
              </Grid>
            </Grid>
        </Paper>
      </Container>
      </Box>

      {/* Seção de Propriedades */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h4" fontWeight={700}>
                  Propriedades Disponíveis
                </Typography>
                <Chip
                  label={totalProperties}
          sx={{
                    bgcolor: alpha("#667eea", 0.1),
                    color: "#667eea",
            fontWeight: 700,
                    fontSize: "1rem",
                    height: 36,
          }}
                />
              </Box>
            </Stack>
            <Divider
              sx={{
                mt: 2,
                borderWidth: 2,
                borderColor: "primary.main",
                width: 100,
              }}
          />
          </Box>

        {loadingProperties ? (
          <PropertyCardShimmer count={6} />
        ) : properties.length > 0 ? (
          <Grid container spacing={3}>
            {properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
                <PropertyCard
                  property={property}
                  onClick={() => navigate(`/property/${property.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                py: 10,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Home
                sx={{
                  fontSize: 80,
                  color: "action.disabled",
                  mb: 3,
                }}
              />
            <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma propriedade disponível
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Este corretor ainda não possui imóveis cadastrados.
            </Typography>
          </Paper>
        )}
      </Container>
      </Box>

      {/* Dialog do Mapa */}
      <Dialog
        open={showMap}
        onClose={() => setShowMap(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn sx={{ color: "primary.main" }} />
            <Typography variant="h6">Localização de {broker.name}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="iframe"
            src={getGoogleMapsUrl()}
            width="100%"
            height="450"
            frameBorder="0"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowMap(false)} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
