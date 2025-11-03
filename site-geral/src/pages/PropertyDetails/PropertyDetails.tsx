"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  Avatar,
  Container,
  IconButton,
  Stack,
} from "@mui/material";
import {
  ArrowBack,
  Bed,
  Bathtub,
  SquareFoot,
  LocalParking,
  LocationOn,
  Phone,
  Email,
  Share,
  Favorite,
  FavoriteBorder,
  WhatsApp,
  VerifiedUser,
} from "@mui/icons-material";
import {
  getPropertyById,
  type Property,
  getPropertyImages,
} from "../../services/propertyService";
import { formatPrice, formatArea } from "../../utils/formatPrice";
import { PropertyDetailsShimmer } from "../../components/Shimmer";
import { ImageCarousel } from "../../components/ImageCarousel";

export const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertyById(propertyId);
      setProperty(data);

      // Sempre busca todas as imagens se houver mais de uma
      if (data.imageCount > 0) {
        const mainImageUrl = data.mainImage?.url || data.mainImage?.thumbnailUrl;
        
        if (data.imageCount > 1) {
          try {
            const propertyImages = await getPropertyImages(propertyId);
            
            // Garante que todas as imagens sejam incluídas
            // Mantém TODAS as imagens, mesmo que URLs sejam iguais
            const combinedImages: string[] = [];
            
            // Adiciona a mainImage primeiro na lista se existir
            if (mainImageUrl && mainImageUrl.trim() !== '') {
              combinedImages.push(mainImageUrl);
            }
            
            // Adiciona TODAS as imagens da API, mantendo a ordem e duplicatas
            if (propertyImages && propertyImages.length > 0) {
              propertyImages.forEach((img) => {
                let imgUrl: string;
                if (typeof img === 'string') {
                  imgUrl = img;
                } else {
                  // Prioriza url sobre thumbnailUrl
                  const imgObj = img as { url?: string; thumbnailUrl?: string };
                  imgUrl = imgObj.url || imgObj.thumbnailUrl || '';
                }
                
                if (imgUrl && imgUrl.trim() !== '') {
                  // Adiciona todas as URLs, mesmo que sejam iguais
                  combinedImages.push(imgUrl);
                }
              });
            }
            
            // Se não conseguiu combinar imagens, usa pelo menos a principal
            if (combinedImages.length === 0 && mainImageUrl) {
              combinedImages.push(mainImageUrl);
            }
            
            setImages(combinedImages);
          } catch (imgErr) {
            console.error('Erro ao carregar imagens:', imgErr);
            // Se falhar, usa a imagem principal se disponível
            if (mainImageUrl) {
              setImages([mainImageUrl]);
            } else {
              setImages([]);
            }
          }
        } else if (mainImageUrl) {
          // Se só tem uma imagem, usa a principal
          setImages([mainImageUrl]);
        } else {
          setImages([]);
        }
      } else {
        setImages([]);
      }
    } catch (err) {
      setError("Propriedade não encontrada");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      house: "Casa",
      apartment: "Apartamento",
      commercial: "Comercial",
      land: "Terreno",
      rural: "Rural",
    };
    return types[type] || type;
  };

  if (loading) {
    return <PropertyDetailsShimmer />;
  }

  if (error || !property) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 100px)",
          bgcolor: "background.default",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" gutterBottom>
              {error || "Propriedade não encontrada"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Voltar para Home
            </Button>
          </Box>
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
        position: "relative",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          py: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
            px: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 3,
            }}
          >
            Voltar
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              sx={{
                bgcolor: isFavorite ? "#ffebee" : "white",
                border: "1px solid #e0e0e0",
                "&:hover": { bgcolor: "#ffebee" },
              }}
            >
              {isFavorite ? (
                <Favorite sx={{ color: "#f44336" }} />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
            <IconButton
              sx={{
                bgcolor: "white",
                border: "1px solid #e0e0e0",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <Share />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          pt: 6,
          pb: 3,
          px: "25px",
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <ImageCarousel images={images} />
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          pb: 4,
          px: "25px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Card Principal do Imóvel */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                mb: 3,
                border: "1px solid #e0e0e0",
                bgcolor: "white",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                <Chip
                  label={getTypeLabel(property.type)}
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    height: 32,
                  }}
                />
                {property.isFeatured && (
                  <Chip
                    icon={<VerifiedUser sx={{ fontSize: 18 }} />}
                    label="Destaque"
                    sx={{
                      bgcolor: "#fff3e0",
                      color: "#f57c00",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      height: 32,
                    }}
                  />
                )}
                {property.code && (
                  <Chip
                    label={`#${property.code}`}
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: "#757575",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      height: 32,
                    }}
                  />
                )}
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#212121",
                  mb: 2,
                  lineHeight: 1.3,
                }}
              >
                {property.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  mb: 4,
                }}
              >
                <LocationOn sx={{ color: "#1976d2", fontSize: 22 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {property.address}, {property.neighborhood}, {property.city} -{" "}
                  {property.state}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                {property.salePrice && Number(property.salePrice) > 0 && (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Preço de Venda
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "white",
                        mt: 0.5,
                      }}
                    >
                      {formatPrice(property.salePrice)}
                    </Typography>
                  </Box>
                )}
                {property.rentPrice && Number(property.rentPrice) > 0 && (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Aluguel Mensal
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "white",
                        mt: 0.5,
                      }}
                    >
                      {formatPrice(property.rentPrice)}
                    </Typography>
                  </Box>
                )}
              </Box>

              {(property.condominiumFee || property.iptu) && (
                <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                  {property.condominiumFee &&
                    Number(property.condominiumFee) > 0 && (
                      <Box
                        sx={{
                          flex: 1,
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: "#f5f5f5",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "block",
                            mb: 1,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            fontSize: "0.7rem",
                          }}
                        >
                          Condomínio
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#212121",
                            fontWeight: 700,
                          }}
                        >
                          {formatPrice(property.condominiumFee)}
                        </Typography>
                      </Box>
                    )}
                  {property.iptu && Number(property.iptu) > 0 && (
                    <Box
                      sx={{
                        flex: 1,
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: "#f5f5f5",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: "block",
                          mb: 1,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                        }}
                      >
                        IPTU
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#212121",
                          fontWeight: 700,
                        }}
                      >
                        {formatPrice(property.iptu)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: "#e3f2fd",
                      textAlign: "center",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                  >
                    <Bed sx={{ fontSize: 36, color: "#1976d2", mb: 1 }} />
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "#1976d2",
                        lineHeight: 1,
                      }}
                    >
                      {property.bedrooms}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#1976d2",
                        mt: 0.5,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {property.bedrooms === 1 ? "quarto" : "quartos"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: "#f3e5f5",
                      textAlign: "center",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                  >
                    <Bathtub sx={{ fontSize: 36, color: "#9c27b0", mb: 1 }} />
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "#9c27b0",
                        lineHeight: 1,
                      }}
                    >
                      {property.bathrooms}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#9c27b0",
                        mt: 0.5,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: "#fff3e0",
                      textAlign: "center",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                  >
                    <LocalParking
                      sx={{ fontSize: 36, color: "#f57c00", mb: 1 }}
                    />
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "#f57c00",
                        lineHeight: 1,
                      }}
                    >
                      {property.parkingSpaces}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#f57c00",
                        mt: 0.5,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {property.parkingSpaces === 1 ? "vaga" : "vagas"}
                    </Typography>
                  </Box>
                </Grid>
                {property.totalArea && Number(property.totalArea) > 0 && (
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: "#e8f5e9",
                        textAlign: "center",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "translateY(-4px)" },
                      }}
                    >
                      <SquareFoot
                        sx={{ fontSize: 36, color: "#4caf50", mb: 1 }}
                      />
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          color: "#4caf50",
                          lineHeight: 1,
                        }}
                      >
                        {formatArea(property.totalArea)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#4caf50",
                          mt: 0.5,
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        m²
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                mb: 3,
                border: "1px solid #e0e0e0",
                bgcolor: "white",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#212121",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                📝 Descrição
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                  color: "#424242",
                  fontSize: "1rem",
                }}
              >
                {property.description || "Sem descrição disponível."}
              </Typography>
            </Paper>

            {property.features && property.features.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  mb: 3,
                  border: "1px solid #e0e0e0",
                  bgcolor: "white",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#212121",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  ✨ Características
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  {property.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      sx={{
                        bgcolor: "white",
                        border: "2px solid #1976d2",
                        color: "#1976d2",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        height: 36,
                        "&:hover": {
                          bgcolor: "#1976d2",
                          color: "white",
                        },
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: "1px solid #e0e0e0",
                bgcolor: "white",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#212121",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                ℹ️ Informações Adicionais
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={4}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mb: 1,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                      }}
                    >
                      Status
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700, color: "#212121" }}
                    >
                      {property.status === "available"
                        ? "Disponível"
                        : "Alugado"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mb: 1,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                      }}
                    >
                      Tipo
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700, color: "#212121" }}
                    >
                      {getTypeLabel(property.type)}
                    </Typography>
                  </Box>
                </Grid>
                {property.builtArea && Number(property.builtArea) > 0 && (
                  <Grid item xs={6} sm={4}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#f5f5f5",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: "block",
                          mb: 1,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                        }}
                      >
                        Área Construída
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 700, color: "#212121" }}
                      >
                        {formatArea(property.builtArea)} m²
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Card da Imobiliária */}
            {property.company && (
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  borderRadius: 4,
                  bgcolor: "white",
                  border: "1px solid #e0e0e0",
                  overflow: "hidden",
                  mb: 3,
                  position: "sticky",
                  top: 80,
                }}
              >
                {/* Header com gradiente */}
                <Box
                  sx={{
                    height: 100,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    position: "relative",
                  }}
                />

                {/* Avatar da empresa */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: -6,
                    px: 3,
                  }}
                >
                  <Avatar
                    src={property.company.logo}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "5px solid white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#212121",
                      textAlign: "center",
                      mb: 0.5,
                    }}
                  >
                    {property.company.name}
                  </Typography>

                  <Chip
                    icon={<VerifiedUser sx={{ fontSize: 16 }} />}
                    label="Verificada"
                    size="small"
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      fontWeight: 600,
                      mb: 3,
                    }}
                  />
                </Box>

                <Divider />

                {/* Informações de contato */}
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "text.secondary",
                      mb: 2,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                    }}
                  >
                    Informações de Contato
                  </Typography>

                  <Stack spacing={1.5}>
                    {property.company.phone && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          bgcolor: "#f5f5f5",
                          borderRadius: 2,
                          transition: "all 0.2s",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "#e3f2fd",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Phone sx={{ color: "#1976d2", fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: "#212121", fontWeight: 600 }}
                        >
                          {property.company.phone}
                        </Typography>
                      </Box>
                    )}
                    {property.company.email && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          bgcolor: "#f5f5f5",
                          borderRadius: 2,
                          transition: "all 0.2s",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "#e3f2fd",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Email sx={{ color: "#1976d2", fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#212121",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {property.company.email}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Corretor Responsável */}
                {property.responsibleUser && (
                  <>
                    <Divider />
                    <Box sx={{ p: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "text.secondary",
                          mb: 2,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                        }}
                      >
                        Corretor Responsável
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                          p: 2,
                          borderRadius: 3,
                          bgcolor: "#f5f5f5",
                        }}
                      >
                        {property.responsibleUser.avatar ? (
                          <Avatar
                            src={property.responsibleUser.avatar}
                            sx={{
                              width: 56,
                              height: 56,
                              border: "3px solid white",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: "#1976d2",
                              color: "white",
                              fontSize: "24px",
                              fontWeight: 700,
                              border: "3px solid white",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          >
                            {property.responsibleUser.name
                              .charAt(0)
                              .toUpperCase()}
                          </Avatar>
                        )}
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,
                              color: "#212121",
                            }}
                          >
                            {property.responsibleUser.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                            }}
                          >
                            Corretor de Imóveis
                          </Typography>
                        </Box>
                      </Box>

                      <Stack spacing={1.5}>
                        {property.responsibleUser.phone && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 2,
                              border: "1px solid #e0e0e0",
                              transition: "all 0.2s",
                              cursor: "pointer",
                              "&:hover": {
                                borderColor: "#1976d2",
                                transform: "translateX(4px)",
                              },
                            }}
                          >
                            <Phone sx={{ color: "#1976d2", fontSize: 20 }} />
                            <Typography
                              variant="body2"
                              sx={{ color: "#212121", fontWeight: 600 }}
                            >
                              {property.responsibleUser.phone}
                            </Typography>
                          </Box>
                        )}
                        {property.responsibleUser.email && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 2,
                              border: "1px solid #e0e0e0",
                              transition: "all 0.2s",
                              cursor: "pointer",
                              "&:hover": {
                                borderColor: "#1976d2",
                                transform: "translateX(4px)",
                              },
                            }}
                          >
                            <Email sx={{ color: "#1976d2", fontSize: 20 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#212121",
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {property.responsibleUser.email}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </>
                )}

                {/* Botões de ação */}
                <Box sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<WhatsApp />}
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      py: 1.5,
                      borderRadius: 3,
                      bgcolor: "#25d366",
                      mb: 1.5,
                      "&:hover": {
                        bgcolor: "#20ba5a",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(37, 211, 102, 0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    WhatsApp
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      py: 1.5,
                      borderRadius: 3,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Solicitar Informações
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
