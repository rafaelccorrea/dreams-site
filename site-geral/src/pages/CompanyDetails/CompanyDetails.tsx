"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Avatar,
  IconButton,
  Button,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  Card,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  Phone,
  Email,
  Language,
  Business,
  Verified,
  Share,
  Favorite,
  FavoriteBorder,
  WhatsApp,
  MailOutline,
  People,
} from "@mui/icons-material";
import {
  getCompanyById,
  searchProperties,
  getAvailableBrokers,
  type Company,
  type Property,
  type Broker,
} from "../../services/propertyService";
import { PropertyCard } from "../../components/PropertyCard";
import { PropertyCardShimmer, CompanyDetailsShimmer } from "../../components/Shimmer";
import { BrokerCard } from "../../components/BrokerCard";
import { useLocation } from "../../contexts/LocationContext";
import { usePageTitle } from "../../hooks/usePageTitle";

export const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { location } = useLocation();
  const [company, setCompany] = useState<Company | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [showBrokers, setShowBrokers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) loadCompany(id);
  }, [id]);

  useEffect(() => {
    if (company && location?.city) {
      loadProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, location?.city]);

  const loadCompany = async (companyId: string) => {
    setLoading(true);
    try {
      const data = await getCompanyById(companyId);
        setCompany(data);
    } catch {
      setError("Erro ao carregar imobiliária");
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    if (!location?.city || !company?.id) return;
    setLoadingProperties(true);
    try {
      const result = await searchProperties({
        city: location.city,
        companyId: company.id,
        page: 1,
        limit: 12,
      });
      setProperties(result.properties);
      setTotalProperties(result.total);
    } catch {
      setProperties([]);
      setTotalProperties(0);
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadBrokers = async () => {
    if (!location?.city || !company?.id) return;
    setLoadingBrokers(true);
    try {
      const result = await getAvailableBrokers(location.city, company.id);
      setBrokers(result);
    } catch {
      setBrokers([]);
    } finally {
      setLoadingBrokers(false);
    }
  };

  const handleShowBrokers = () => {
    if (!showBrokers && brokers.length === 0) {
      loadBrokers();
    }
      setShowBrokers(!showBrokers);
  };

  const handleWhatsApp = () => {
    const phone = company?.phone?.replace(/\D/g, "");
    window.open(
      `https://wa.me/55${phone}?text=Olá! Gostaria de saber mais sobre os imóveis da ${company?.name}`,
      "_blank"
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${company?.name}`,
          text: `Confira o perfil da imobiliária ${company?.name}`,
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

  const shouldShowEmail = (email: string) => {
    if (!email) return false;
    const emailLower = email.toLowerCase();
    return !emailLower.includes("@teste.") && !emailLower.includes("master.") && !emailLower.includes("@user");
  };

  const getGoogleMapsUrl = () => {
    if (!company?.address) return "";
    const address = `${company.address}, ${company.city || ""}, ${
      company.state || ""
    }`;
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dN6ba0W8iEgGyE&q=${encodeURIComponent(
      address
    )}`;
  };

  // Atualizar título da página dinamicamente
  usePageTitle(
    company ? `${company.name} - Imobiliária - Dream Keys` : undefined,
    company ? `Perfil da imobiliária ${company.name}. Veja imóveis disponíveis e entre em contato.` : undefined
  )

  if (loading) return <CompanyDetailsShimmer />;

  if (error || !company)
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          {error || "Imobiliária não encontrada"}
        </Typography>
        <Button sx={{ mt: 3 }} onClick={() => navigate(-1)} variant="contained">
          Voltar
        </Button>
        </Container>
    );

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
        
        {/* Overlay branco semi-transparente para legibilidade */}
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
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
            >
            Voltar
          </Button>

          <Box sx={{ pt: { xs: 12, md: 6 } }}>
            <Grid container spacing={4} alignItems="flex-start">
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
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "center" } }}>
                  <Avatar
                    src={company.logo || undefined}
                    alt={company.name}
                        sx={{
                      width: 120,
                      height: 120,
                      border: "3px solid",
                      borderColor: "primary.main",
                      bgcolor: alpha("#667eea", 0.1),
                      mb: 2,
                    }}
                  >
                    {!company.logo && (
                      <Business sx={{ fontSize: 50, color: "primary.main" }} />
                    )}
                  </Avatar>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h5" fontWeight={700}>
                      {company.name}
                    </Typography>
                    <Verified sx={{ color: "primary.main", fontSize: 24 }} />
                  </Box>
                  {company.description && (
                    <Typography
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mt: 1, textAlign: "center" }}
                    >
                      {company.description}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "center" }}>
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
                    <IconButton
                      onClick={handleShare}
                      sx={{ 
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Stack>

                  {/* Estatísticas como rede social */}
                  <Stack direction="row" spacing={3} sx={{ mt: 3, width: "100%", justifyContent: "center" }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {totalProperties}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Imóveis
                      </Typography>
                    </Box>
                    {company.brokerCount !== undefined && (
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                          {company.brokerCount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Corretores
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                  </Box>
              </Card>
          </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "flex-start" } }}>
                <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />

                <Box sx={{ minWidth: { xs: "100%", md: 200 }, width: { xs: "100%", md: "auto" } }}>
                  <Stack spacing={1.5}>
            {company.phone && (
                      <Button
                        fullWidth
                  variant="contained"
                        size="medium"
                        startIcon={<WhatsApp />}
                  sx={{
                          bgcolor: "#25D366",
                          "&:hover": { bgcolor: "#128C7E" },
                  }}
                  onClick={handleWhatsApp}
                >
                  WhatsApp
                      </Button>
            )}
            {company.email && shouldShowEmail(company.email) && (
                      <Button
                        fullWidth
                variant="contained"
                        size="medium"
                        startIcon={<MailOutline />}
                        onClick={() =>
                          (window.location.href = `mailto:${company.email}`)
                        }
                sx={{
                          border: "none",
                          boxShadow: "none",
                  "&:hover": {
                            boxShadow: "none",
                  },
                }}
              >
                        E-mail
                      </Button>
            )}
            {company.website && (
                      <Button
                        fullWidth
                        variant="contained"
                        size="medium"
                startIcon={<Language />}
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                          border: "none",
                          boxShadow: "none",
                  "&:hover": {
                            boxShadow: "none",
                  },
                }}
              >
                Visitar Site
                      </Button>
            )}
                    <Button
                      fullWidth
              variant="contained"
                      size="medium"
              startIcon={<People />}
              onClick={handleShowBrokers}
              disabled={loadingBrokers}
              sx={{
                        border: "none",
                        boxShadow: "none",
                "&:hover": {
                          boxShadow: "none",
                },
              }}
            >
              {loadingBrokers
                ? "Carregando..."
                : showBrokers
                ? "Ocultar Corretores"
                : "Ver Corretores"}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
          </Box>
      </Container>
        </Box>
      </Box>

      {/* Propriedades */}
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            Imóveis Disponíveis
          </Typography>
          <Chip
            label={properties.length}
                  sx={{
              bgcolor: alpha("#667eea", 0.1),
              color: "#667eea",
              fontWeight: 700,
                  }}
                />
        </Stack>

        {loadingProperties ? (
          <PropertyCardShimmer count={6} />
        ) : properties.length > 0 ? (
              <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
                <PropertyCard
                  property={property}
                  onClick={() => navigate(`/imovel/${property.id}`)}
                    />
                  </Grid>
                ))}
              </Grid>
        ) : (
          <Typography color="text.secondary">
            Nenhum imóvel disponível no momento.
          </Typography>
        )}
      </Container>

      {/* Corretores */}
      {brokers.length > 0 && (
        <>
          <Divider sx={{ my: 8 }} />
          <Container maxWidth="xl">
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Typography variant="h5" fontWeight={700}>
                Nossa Equipe
              </Typography>
              <Chip
                label={brokers.length}
                sx={{
                  bgcolor: alpha("#667eea", 0.1),
                  color: "#667eea",
                  fontWeight: 700,
                }}
              />
            </Stack>
            <Grid container spacing={3}>
              {brokers.map((broker) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={broker.id}>
                  <BrokerCard
                    broker={broker}
                    onClick={() => navigate(`/corretor/${broker.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      )}

      {/* Divisor */}
      <Divider sx={{ my: 8 }} />

      {/* Informações */}
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Informações da Empresa
            </Typography>
            <Stack spacing={2.5}>
              {company.corporateName && (
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Business sx={{ color: "primary.main", fontSize: 22, mt: 0.5, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {company.corporateName}
                    </Typography>
                    {company.cnpj && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                        CNPJ: {company.cnpj}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Informações de Contato
            </Typography>
            <Stack spacing={2.5}>
              {company.address && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    cursor: "pointer",
                    py: 0.5,
                    transition: "all 0.2s",
                    "&:hover": { opacity: 0.8 },
                  }}
                  onClick={() => setShowMap(true)}
                >
                  <LocationOn sx={{ color: "primary.main", fontSize: 22, mt: 0.5, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {company.address}
                    </Typography>
                    {company.city && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                        {company.city}{company.state ? `, ${company.state}` : ""}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
              {company.phone && (
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Phone sx={{ color: "primary.main", fontSize: 22, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {company.phone}
                  </Typography>
                </Box>
              )}
              {company.email && shouldShowEmail(company.email) && (
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Email sx={{ color: "primary.main", fontSize: 22, mt: 0.5, flexShrink: 0 }} />
                  <Typography 
                    variant="body2" 
                    fontWeight={500}
                    sx={{ wordBreak: "break-all" }}
                  >
                    {company.email}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Localização
            </Typography>
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                component="iframe"
                src={getGoogleMapsUrl()}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                />
              </Box>
                  </Grid>
              </Grid>
      </Container>

      {/* Dialog Mapa */}
      <Dialog
        open={showMap}
        onClose={() => setShowMap(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Localização</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="iframe"
            src={getGoogleMapsUrl()}
            width="100%"
            height="450"
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
