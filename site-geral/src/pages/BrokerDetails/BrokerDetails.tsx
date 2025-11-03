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
} from "@mui/material";
import {
  ArrowBack,
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
} from "@mui/icons-material";
import {
  getBrokerById,
  getBrokerProperties,
  type Broker,
  type Property,
} from "../../services/propertyService";
import { PropertyCard } from "../../components/PropertyCard";
import { PropertyCardShimmer } from "../../components/Shimmer";
import {
  HeaderSection,
  HeaderContent,
  ProfileCard,
  StyledAvatar,
  ActionButton,
  SectionTitle,
  InfoItem,
} from "./BrokerDetails.styles";

export const BrokerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadBroker(id);
    }
  }, [id]);

  const loadBroker = async (brokerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrokerById(brokerId);
      if (data) {
        setBroker(data);
      } else {
        setError("Corretor não encontrado");
      }
    } catch (err) {
      setError("Erro ao carregar corretor");
      console.error(err);
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
    } catch (err) {
      console.error("Erro ao carregar propriedades:", err);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    if (broker) {
      loadProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broker]);

  const handlePropertyClick = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: broker?.name,
        text: `Confira o perfil de ${broker?.name}`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 100px)",
          bgcolor: "#f8f9fa",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <PropertyCardShimmer count={6} />
        </Container>
      </Box>
    );
  }

  if (error || !broker) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 100px)",
          bgcolor: "#f8f9fa",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            {error || "Corretor não encontrado"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Voltar para Home
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 100px)",
        bgcolor: "#f8f9fa",
      }}
    >
      <HeaderSection>
        <HeaderContent maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                }}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <IconButton
                onClick={handleShare}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                }}
              >
                <Share />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ textAlign: "center", pb: 8 }}>
            <StyledAvatar src={broker.avatar} alt={broker.name}>
              {broker.name.charAt(0).toUpperCase()}
            </StyledAvatar>
          </Box>
        </HeaderContent>
      </HeaderSection>

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <ProfileCard elevation={0}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {broker.name}
              </Typography>
              <Verified sx={{ color: "#667eea", fontSize: 28 }} />
            </Box>

            {broker.company && (
              <Chip
                icon={<Business />}
                label={broker.company.name}
                sx={{
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  color: "#667eea",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  height: 36,
                  "& .MuiChip-icon": { color: "#667eea" },
                }}
              />
            )}
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {broker.city && (
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem>
                  <LocationOn sx={{ color: "#667eea" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontWeight: 600 }}
                    >
                      LOCALIZAÇÃO
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {broker.city}
                    </Typography>
                  </Box>
                </InfoItem>
              </Grid>
            )}
            {broker.phone && (
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem>
                  <Phone sx={{ color: "#667eea" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontWeight: 600 }}
                    >
                      TELEFONE
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {broker.phone}
                    </Typography>
                  </Box>
                </InfoItem>
              </Grid>
            )}
            {broker.email && (
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem>
                  <Email sx={{ color: "#667eea" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontWeight: 600 }}
                    >
                      EMAIL
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, fontSize: "0.85rem" }}
                    >
                      {broker.email}
                    </Typography>
                  </Box>
                </InfoItem>
              </Grid>
            )}
            {broker.propertyCount !== undefined && (
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem>
                  <Home sx={{ color: "#667eea" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontWeight: 600 }}
                    >
                      IMÓVEIS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {broker.propertyCount}{" "}
                      {broker.propertyCount === 1
                        ? "propriedade"
                        : "propriedades"}
                    </Typography>
                  </Box>
                </InfoItem>
              </Grid>
            )}
          </Grid>

          {broker.phone && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <ActionButton
                variant="contained"
                startIcon={<WhatsApp />}
                onClick={() => {
                  window.open(
                    `https://wa.me/${broker.phone?.replace(/\D/g, "")}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                sx={{
                  background:
                    "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
                  },
                }}
              >
                Entrar em Contato via WhatsApp
              </ActionButton>
            </Box>
          )}
        </ProfileCard>
      </Container>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box>
          <SectionTitle variant="h5">
            <Home />
            Propriedades Disponíveis
          </SectionTitle>
          {loadingProperties ? (
            <Grid container spacing={3}>
              <PropertyCardShimmer count={6} />
            </Grid>
          ) : properties.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
              <Home
                sx={{
                  fontSize: 80,
                  color: "text.secondary",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma propriedade encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Este corretor ainda não possui propriedades cadastradas.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard
                    property={property}
                    onClick={() => handlePropertyClick(property)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};
