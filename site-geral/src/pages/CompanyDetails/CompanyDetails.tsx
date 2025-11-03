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
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  Phone,
  Email,
  Language,
  Business,
  Home,
  People,
  Verified,
  Share,
  Favorite,
  FavoriteBorder,
  WhatsApp,
  TrendingUp,
} from "@mui/icons-material";
import {
  getCompanyById,
  type Company,
  searchProperties,
  type Property,
} from "../../services/propertyService";
import { PropertyCard } from "../../components/PropertyCard";
import { PropertyCardShimmer } from "../../components/Shimmer";
import { useLocation } from "../../contexts/LocationContext";
import {
  getAvailableBrokers,
  type Broker,
} from "../../services/propertyService";
import { BrokerCard } from "../../components/BrokerCard";
import {
  HeaderSection,
  HeaderContent,
  CompanyProfileCard,
  LogoContainer,
  LogoImage,
  StatCard,
  ActionButton,
  SectionTitle,
  InfoItem,
} from "./CompanyDetails.styles";

export const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { location } = useLocation();
  const [company, setCompany] = useState<Company | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBrokers, setShowBrokers] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadCompany(id);
    }
  }, [id]);

  useEffect(() => {
    if (company && location?.city) {
      loadProperties();
    }
  }, [company, location?.city]);

  const loadCompany = async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanyById(companyId);
      if (data) {
        setCompany(data);
      } else {
        setError("Imobiliária não encontrada");
      }
    } catch (err) {
      setError("Erro ao carregar imobiliária");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    if (!company || !location?.city) return;

    setLoadingProperties(true);
    try {
      const result = await searchProperties({
        city: location.city,
        companyId: company.id,
        page: 1,
        limit: 12,
      });
      setProperties(result.properties);
    } catch (err) {
      console.error("Erro ao carregar propriedades:", err);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadBrokers = async () => {
    if (!company || !location?.city || showBrokers) return;

    setLoadingBrokers(true);
    try {
      const data = await getAvailableBrokers(location.city, company.id);
      setBrokers(data);
      setShowBrokers(true);
    } catch (err) {
      console.error("Erro ao carregar corretores:", err);
      setBrokers([]);
    } finally {
      setLoadingBrokers(false);
    }
  };

  const handleShowBrokers = () => {
    if (!showBrokers && brokers.length === 0) {
      loadBrokers();
    } else {
      setShowBrokers(!showBrokers);
    }
  };

  const handlePropertyClick = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  const handleBrokerClick = (broker: Broker) => {
    navigate(`/broker/${broker.id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: company?.name,
        text: `Confira o perfil de ${company?.name}`,
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

  if (error || !company) {
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
            {error || "Imobiliária não encontrada"}
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

          <Box sx={{ textAlign: "center", pb: 10 }}>
            <LogoContainer>
              {company.logo ? (
                <LogoImage src={company.logo} alt={company.name} />
              ) : (
                <Business sx={{ fontSize: 80, color: "#667eea" }} />
              )}
            </LogoContainer>
          </Box>
        </HeaderContent>
      </HeaderSection>

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <CompanyProfileCard elevation={0}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {company.name}
              </Typography>
              <Verified sx={{ color: "#667eea", fontSize: 32 }} />
            </Box>

            {company.description && (
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.7,
                }}
              >
                {company.description}
              </Typography>
            )}
          </Box>

          {(company.propertyCount !== undefined ||
            company.brokerCount !== undefined) && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {company.propertyCount !== undefined && (
                <Grid item xs={12} sm={6}>
                  <StatCard>
                    <CardContent sx={{ position: "relative", zIndex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, opacity: 0.9 }}
                        >
                          Propriedades
                        </Typography>
                        <Home sx={{ fontSize: 32, opacity: 0.8 }} />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {company.propertyCount}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <TrendingUp fontSize="small" />
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Imóveis disponíveis
                        </Typography>
                      </Box>
                    </CardContent>
                  </StatCard>
                </Grid>
              )}
              {company.brokerCount !== undefined && (
                <Grid item xs={12} sm={6}>
                  <StatCard>
                    <CardContent sx={{ position: "relative", zIndex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, opacity: 0.9 }}
                        >
                          Corretores
                        </Typography>
                        <People sx={{ fontSize: 32, opacity: 0.8 }} />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {company.brokerCount}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <TrendingUp fontSize="small" />
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Profissionais ativos
                        </Typography>
                      </Box>
                    </CardContent>
                  </StatCard>
                </Grid>
              )}
            </Grid>
          )}

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {company.address && (
              <Grid item xs={12} md={6}>
                <InfoItem>
                  <LocationOn sx={{ color: "#667eea", mt: 0.5 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontWeight: 600, mb: 0.5 }}
                    >
                      ENDEREÇO
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {company.address}
                    </Typography>
                    {company.city && (
                      <Typography variant="body2" color="text.secondary">
                        {company.city}
                        {company.state ? `, ${company.state}` : ""}
                      </Typography>
                    )}
                  </Box>
                </InfoItem>
              </Grid>
            )}

            {company.phone && (
              <Grid item xs={12} md={6}>
                <InfoItem>
                  <Phone sx={{ color: "#667eea", mt: 0.5 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontWeight: 600, mb: 0.5 }}
                    >
                      TELEFONE
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {company.phone}
                    </Typography>
                  </Box>
                </InfoItem>
              </Grid>
            )}

            {company.email && (
              <Grid item xs={12} md={6}>
                <InfoItem>
                  <Email sx={{ color: "#667eea", mt: 0.5 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontWeight: 600, mb: 0.5 }}
                    >
                      EMAIL
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {company.email}
                    </Typography>
                  </Box>
                </InfoItem>
              </Grid>
            )}

            {(company.corporateName || company.cnpj) && (
              <Grid item xs={12} md={6}>
                <InfoItem>
                  <Business sx={{ color: "#667eea", mt: 0.5 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontWeight: 600, mb: 0.5 }}
                    >
                      DADOS CORPORATIVOS
                    </Typography>
                    {company.corporateName && (
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {company.corporateName}
                      </Typography>
                    )}
                    {company.cnpj && (
                      <Typography variant="body2" color="text.secondary">
                        CNPJ: {company.cnpj}
                      </Typography>
                    )}
                  </Box>
                </InfoItem>
              </Grid>
            )}
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {company.website && (
              <ActionButton
                variant="outlined"
                startIcon={<Language />}
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#764ba2",
                    bgcolor: "rgba(102, 126, 234, 0.05)",
                  },
                }}
              >
                Visitar Site
              </ActionButton>
            )}

            {company.phone && (
              <ActionButton
                variant="contained"
                startIcon={<WhatsApp />}
                href={`https://wa.me/${company.phone.replace(/\D/g, "")}`}
                target="_blank"
                sx={{
                  background:
                    "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
                  },
                }}
              >
                WhatsApp
              </ActionButton>
            )}

            <ActionButton
              variant="contained"
              startIcon={<People />}
              onClick={handleShowBrokers}
              disabled={loadingBrokers}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                },
              }}
            >
              {loadingBrokers
                ? "Carregando..."
                : showBrokers
                ? "Ocultar Corretores"
                : "Ver Corretores"}
            </ActionButton>
          </Box>
        </CompanyProfileCard>
      </Container>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {showBrokers && (
          <Box sx={{ mb: 6 }}>
            <SectionTitle variant="h5">
              <People />
              Nossa Equipe
            </SectionTitle>
            {loadingBrokers ? (
              <Grid container spacing={3}>
                <PropertyCardShimmer count={6} />
              </Grid>
            ) : brokers.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
                <People
                  sx={{
                    fontSize: 80,
                    color: "text.secondary",
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum corretor encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Esta imobiliária ainda não possui corretores cadastrados.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {brokers.map((broker) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={broker.id}>
                    <BrokerCard
                      broker={broker}
                      onClick={() => handleBrokerClick(broker)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

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
                Esta imobiliária ainda não possui propriedades cadastradas.
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
