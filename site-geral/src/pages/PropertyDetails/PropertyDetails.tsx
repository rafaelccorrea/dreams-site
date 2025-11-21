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
  WhatsApp,
  VerifiedUser,
  Home,
  CheckCircle,
} from "@mui/icons-material";
import {
  getPropertyById,
  type Property,
  getPropertyImages,
} from "../../services/propertyService";
import { getPublicPropertyById, getPublicPropertyImages } from "../../services/publicPropertyService";
import { formatPrice, formatArea } from "../../utils/formatPrice";
import { PropertyDetailsShimmer } from "../../components/Shimmer";
import { ImageCarousel } from "../../components/ImageCarousel";
import { useAuth } from "../../hooks/useAuth";
import { usePublicProperty } from "../../hooks/usePublicProperty";
import { usePageTitle } from "../../hooks/usePageTitle";
import { FavoriteButton } from "../../components/FavoriteButton";
import { ShareButton } from "../../components/ShareButton";

export const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { property: myProperty } = usePublicProperty();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsPublicProperty] = useState(false);
  
  // Verifica se a propriedade é do próprio usuário
  const isOwnProperty = isAuthenticated && myProperty && property && myProperty.id === property.id;

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Tenta primeiro buscar da API privada
      let data: Property | null = null;
      let isPublicProperty = false;
      
      try {
        data = await getPropertyById(propertyId);
      } catch (privateErr) {
        // Se não encontrar na API privada, tenta na API pública
        try {
          data = await getPublicPropertyById(propertyId);
          isPublicProperty = true;
          setIsPublicProperty(true);
        } catch (publicErr) {
          throw new Error("Propriedade não encontrada");
        }
      }

      if (!data) {
        throw new Error("Propriedade não encontrada");
      }

      setProperty(data);

      // Sempre busca todas as imagens se houver mais de uma
      if (data.imageCount > 0) {
        const mainImageUrl = data.mainImage?.url || data.mainImage?.thumbnailUrl;
        
        if (data.imageCount > 1) {
          try {
            // Usa a função apropriada baseado no tipo de propriedade
            const propertyImages = isPublicProperty 
              ? await getPublicPropertyImages(propertyId)
              : await getPropertyImages(propertyId);
            
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
        // Se não tem imageCount, tenta buscar imagens mesmo assim
        try {
          const propertyImages = isPublicProperty 
            ? await getPublicPropertyImages(propertyId)
            : await getPropertyImages(propertyId);
          
          if (propertyImages && propertyImages.length > 0) {
            const imageUrls = propertyImages.map((img) => {
              if (typeof img === 'string') return img;
              return (img as { url?: string; thumbnailUrl?: string }).url || 
                     (img as { url?: string; thumbnailUrl?: string }).thumbnailUrl || '';
            }).filter(url => url && url.trim() !== '');
            
            setImages(imageUrls);
          }
        } catch (imgErr) {
          setImages([]);
        }
      }
    } catch (err) {
      setError("Propriedade não encontrada");
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

  const handleWhatsApp = () => {
    const phone = property?.responsibleUser?.phone || property?.company?.phone;
    if (phone) {
      const phoneNumber = phone.replace(/\D/g, "");
      const propertyTitle = property?.title || "este imóvel";
      const message = encodeURIComponent(
        `Olá${property?.responsibleUser?.name ? ` ${property.responsibleUser.name}` : ""}${
          property?.company?.name ? ` da ${property.company.name}` : ""
        }, gostaria de mais informações sobre ${propertyTitle}.`
      );
      window.open(`https://wa.me/55${phoneNumber}?text=${message}`, "_blank");
    }
  };

  // Atualizar título da página dinamicamente
  usePageTitle(
    property ? `${property.title || getTypeLabel(property.type)} - Dream Keys` : undefined,
    property ? (() => {
      const priceText = property.salePrice && Number(property.salePrice) > 0
        ? formatPrice(property.salePrice)
        : property.rentPrice && Number(property.rentPrice) > 0
        ? formatPrice(property.rentPrice)
        : 'Preço sob consulta'
      return `${property.title || getTypeLabel(property.type)} - ${priceText}`
    })() : undefined
  )

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
            px: { xs: 2, sm: 3, md: "25px" },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: { xs: 1.5, sm: 2 },
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
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Voltar
          </Button>

          <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
            <FavoriteButton
              propertyId={property.id}
              size="medium"
              showTooltip={true}
              isOwnProperty={isOwnProperty || false}
            />
            <ShareButton
              propertyId={property.id}
              propertyTitle={property.title}
              size="medium"
              showTooltip={true}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          pt: { xs: 3, sm: 4, md: 6 },
          pb: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3, md: "25px" },
        }}
      >
        <Box
          sx={{
            borderRadius: { xs: 2, sm: 4 },
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
          pb: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 3, md: "25px" },
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={8}>
            {/* Seção: Título e Informações Principais */}
            <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
              <Box sx={{ display: "flex", gap: { xs: 0.75, sm: 1 }, mb: { xs: 1.5, sm: 2 }, flexWrap: "wrap" }}>
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
                {property.isAvailableForMCMV && (
                  <Chip
                    icon={<Home sx={{ fontSize: 16 }} />}
                    label="Minha Casa Minha Vida"
                    sx={{
                      bgcolor: "#4caf50",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      height: 28,
                      "& .MuiChip-icon": {
                        color: "white",
                      },
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
                  mb: { xs: 1.5, sm: 2 },
                  lineHeight: 1.3,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                }}
              >
                {property.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.75, sm: 1 },
                  color: "text.secondary",
                  mb: { xs: 2, sm: 3 },
                  flexWrap: "wrap",
                }}
              >
                <LocationOn sx={{ color: "#1976d2", fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {property.address}, {property.neighborhood}, {property.city} -{" "}
                  {property.state}
                </Typography>
              </Box>

              {/* Preços */}
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                {property.salePrice && Number(property.salePrice) > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
                        fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
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
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
                        fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                      }}
                    >
                      {formatPrice(property.rentPrice)}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Informações MCMV */}
              {property.isAvailableForMCMV && property.mcmv && (
                <Box
                  sx={{
                    mb: { xs: 3, sm: 4 },
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(69, 160, 73, 0.15) 100%)",
                    border: "2px solid rgba(76, 175, 80, 0.3)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, mb: { xs: 1.5, sm: 2 }, flexWrap: "wrap" }}>
                    <Home sx={{ color: "#4caf50", fontSize: { xs: 24, sm: 28 } }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#2e7d32",
                        fontSize: { xs: '1.1rem', sm: '1.5rem' },
                      }}
                    >
                      Financiamento Minha Casa Minha Vida Disponível
                    </Typography>
                  </Box>

                  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    {property.mcmv.incomeRange && (
                      <Grid item xs={12} sm={6}>
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
                          Faixa de Renda
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#2e7d32",
                            textTransform: "uppercase",
                          }}
                        >
                          {property.mcmv.incomeRange === "faixa1" ? "Faixa 1" :
                           property.mcmv.incomeRange === "faixa2" ? "Faixa 2" :
                           property.mcmv.incomeRange === "faixa3" ? "Faixa 3" :
                           property.mcmv.incomeRange}
                        </Typography>
                      </Grid>
                    )}

                    {property.mcmv.maxValue && (
                      <Grid item xs={12} sm={6}>
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
                          Valor Máximo
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1976d2",
                          }}
                        >
                          {formatPrice(property.mcmv.maxValue)}
                        </Typography>
                      </Grid>
                    )}

                    {property.mcmv.subsidy && (
                      <Grid item xs={12} sm={6}>
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
                          Subsídio Disponível
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#4caf50",
                          }}
                        >
                          {formatPrice(property.mcmv.subsidy)}
                        </Typography>
                      </Grid>
                    )}

                    {property.mcmv.documentation && property.mcmv.documentation.length > 0 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                            display: "block",
                            mb: 1,
                          }}
                        >
                          Documentos Necessários
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          {property.mcmv.documentation.map((doc, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CheckCircle sx={{ fontSize: 16, color: "#4caf50" }} />
                              <Typography variant="body2" sx={{ color: "text.primary" }}>
                                {doc}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    )}

                    {property.mcmv.notes && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.5,
                            bgcolor: "rgba(76, 175, 80, 0.1)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "text.primary", fontStyle: "italic" }}>
                            {property.mcmv.notes}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Condomínio e IPTU */}
              {(property.condominiumFee || property.iptu) && (
                <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 }, flexWrap: 'wrap' }}>
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
              <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, flexWrap: "wrap", mb: { xs: 3, sm: 4 } }}>
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

            <Divider sx={{ my: { xs: 3, sm: 4 } }} />

            {/* Seção: Descrição */}
            <Box sx={{ mb: { xs: 3, sm: 5 } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#212121",
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
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
                <Divider sx={{ my: { xs: 3, sm: 4 } }} />
                {/* Seção: Características */}
                <Box sx={{ mb: { xs: 3, sm: 5 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#212121",
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
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

            <Divider sx={{ my: { xs: 3, sm: 4 } }} />

            {/* Seção: Informações Adicionais */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#212121",
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Informações Adicionais
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: { xs: 1.5, sm: 2 },
                    py: 1,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      minWidth: { xs: "auto", sm: 120 },
                      width: { xs: "100%", sm: "auto" },
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
                    gap: { xs: 1.5, sm: 2 },
                    py: 1,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      minWidth: { xs: "auto", sm: 120 },
                      width: { xs: "100%", sm: "auto" },
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
                      gap: { xs: 1.5, sm: 2 },
                      py: 1,
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        minWidth: { xs: "auto", sm: 120 },
                        width: { xs: "100%", sm: "auto" },
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
                  position: { xs: "static", md: "sticky" },
                  top: { md: 80 },
                  mt: { xs: 3, md: 0 },
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
                {(property.responsibleUser?.phone || property.company?.phone) && (
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<WhatsApp />}
                      onClick={handleWhatsApp}
                      sx={{
                        fontWeight: 600,
                        textTransform: "none",
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        bgcolor: "#25d366",
                        "&:hover": {
                          bgcolor: "#20ba5a",
                        },
                      }}
                    >
                      WhatsApp
                    </Button>
                  </Stack>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
