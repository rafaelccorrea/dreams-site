"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Seção: Título e Informações Principais */}
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                <Chip
                  label={getTypeLabel(property.type)}
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    height: 28,
                  }}
                />
                {property.isFeatured && (
                  <Chip
                    icon={<VerifiedUser sx={{ fontSize: 16 }} />}
                    label="Destaque"
                    sx={{
                      bgcolor: "#fff3e0",
                      color: "#f57c00",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      height: 28,
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
                      height: 28,
                    }}
                  />
                )}
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
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
                  mb: 3,
                }}
              >
                <LocationOn sx={{ color: "#1976d2", fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {property.address}, {property.neighborhood}, {property.city} -{" "}
                  {property.state}
                </Typography>
              </Box>

              {/* Preços */}
              <Box sx={{ mb: 4 }}>
                {property.salePrice && Number(property.salePrice) > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Preço de Venda
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "#1976d2",
                      }}
                    >
                      {formatPrice(property.salePrice)}
                    </Typography>
                  </Box>
                )}
                {property.rentPrice && Number(property.rentPrice) > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Aluguel Mensal
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "#4caf50",
                      }}
                    >
                      {formatPrice(property.rentPrice)}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Condomínio e IPTU */}
              {(property.condominiumFee || property.iptu) && (
                <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
                  {property.condominiumFee &&
                    Number(property.condominiumFee) > 0 && (
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "block",
                            mb: 0.5,
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
                            fontWeight: 600,
                          }}
                        >
                          {formatPrice(property.condominiumFee)}
                        </Typography>
                      </Box>
                    )}
                  {property.iptu && Number(property.iptu) > 0 && (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: "block",
                          mb: 0.5,
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
                          fontWeight: 600,
                        }}
                      >
                        {formatPrice(property.iptu)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Características do Imóvel */}
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Bed sx={{ fontSize: 28, color: "#1976d2" }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#212121", lineHeight: 1 }}
                    >
                      {property.bedrooms}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                    >
                      {property.bedrooms === 1 ? "quarto" : "quartos"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Bathtub sx={{ fontSize: 28, color: "#9c27b0" }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#212121", lineHeight: 1 }}
                    >
                      {property.bathrooms}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                    >
                      {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalParking sx={{ fontSize: 28, color: "#f57c00" }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#212121", lineHeight: 1 }}
                    >
                      {property.parkingSpaces}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                    >
                      {property.parkingSpaces === 1 ? "vaga" : "vagas"}
                    </Typography>
                  </Box>
                </Box>
                {property.totalArea && Number(property.totalArea) > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SquareFoot sx={{ fontSize: 28, color: "#4caf50" }} />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#212121", lineHeight: 1 }}
                      >
                        {formatArea(property.totalArea)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                      >
                        m²
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Seção: Descrição */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#212121",
                  mb: 2,
                }}
              >
                Descrição
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
            </Box>

            {property.features && property.features.length > 0 && (
              <>
                <Divider sx={{ my: 4 }} />
                {/* Seção: Características */}
                <Box sx={{ mb: 5 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#212121",
                      mb: 2,
                    }}
                  >
                    Características
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {property.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        sx={{
                          bgcolor: "white",
                          border: "1px solid #e0e0e0",
                          color: "#212121",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          height: 32,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Seção: Informações Adicionais */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#212121",
                  mb: 3,
                }}
              >
                Informações Adicionais
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    py: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      minWidth: 120,
                    }}
                  >
                    Status:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {property.status === "available"
                      ? "Disponível"
                      : "Alugado"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    py: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      minWidth: 120,
                    }}
                  >
                    Tipo:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {getTypeLabel(property.type)}
                  </Typography>
                </Box>
                {property.builtArea && Number(property.builtArea) > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      py: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        minWidth: 120,
                      }}
                    >
                      Área Construída:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatArea(property.builtArea)} m²
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Seção de Contato */}
            {property.company && (
              <Box
                sx={{
                  position: "sticky",
                  top: 80,
                }}
              >
                {/* Imobiliária */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Avatar
                      src={property.company.logo}
                      sx={{
                        width: 64,
                        height: 64,
                        border: "2px solid #e0e0e0",
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#212121",
                          mb: 0.5,
                        }}
                      >
                        {property.company.name}
                      </Typography>
                      <Chip
                        icon={<VerifiedUser sx={{ fontSize: 14 }} />}
                        label="Verificada"
                        size="small"
                        sx={{
                          bgcolor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </Box>
                  </Box>

                  <Stack spacing={2}>
                    {property.company.phone && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 1,
                        }}
                      >
                        <Phone sx={{ color: "#1976d2", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                          py: 1,
                        }}
                      >
                        <Email sx={{ color: "#1976d2", fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
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
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ mb: 4 }}>
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
                        }}
                      >
                        {property.responsibleUser.avatar ? (
                          <Avatar
                            src={property.responsibleUser.avatar}
                            sx={{
                              width: 48,
                              height: 48,
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: "#1976d2",
                              color: "white",
                              fontSize: "20px",
                              fontWeight: 700,
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
                              fontWeight: 600,
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

                      <Stack spacing={2}>
                        {property.responsibleUser.phone && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              py: 1,
                            }}
                          >
                            <Phone sx={{ color: "#1976d2", fontSize: 20 }} />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
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
                              py: 1,
                            }}
                          >
                            <Email sx={{ color: "#1976d2", fontSize: 20 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
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
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<WhatsApp />}
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      py: 1.5,
                      bgcolor: "#25d366",
                      "&:hover": {
                        bgcolor: "#20ba5a",
                      },
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
                      fontWeight: 600,
                      textTransform: "none",
                      py: 1.5,
                    }}
                  >
                    Solicitar Informações
                  </Button>
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
