"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CompanyCard } from "../../components/CompanyCard";
import { CompanyCardShimmer } from "../../components/Shimmer";
import {
  getAvailableCompanies,
  type Company,
} from "../../services/propertyService";
import { useLocation } from "../../contexts/LocationContext";

type SortOption = "name" | "properties" | "brokers";

export const CompaniesPage = () => {
  const { location } = useLocation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterVerified, setFilterVerified] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      if (!location?.city) {
        setCompanies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getAvailableCompanies(location.city);
        setCompanies(data);
      } catch (error) {
        console.error("Erro ao carregar imobiliárias:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    if (location?.city) {
      loadCompanies();
    }
  }, [location?.city]);

  // Função para verificar se email é técnico/teste
  const shouldShowCompany = (company: Company) => {
    if (company.email) {
      const email = company.email.toLowerCase();
      return !email.includes("@teste.") && !email.includes("master.") && !email.includes("@user");
    }
    return true;
  };

  // Filtrar e ordenar empresas
  let filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = !filterVerified || company.name?.includes("Verificada"); // Ajustar conforme necessário
    const shouldShow = shouldShowCompany(company);
    return matchesSearch && matchesVerified && shouldShow;
  });

  // Ordenar empresas
  filteredCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      case "properties":
        return (b.propertyCount || 0) - (a.propertyCount || 0);
      case "brokers":
        return (b.brokerCount || 0) - (a.brokerCount || 0);
      default:
        return 0;
    }
  });

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 200px)",
        bgcolor: "background.default",
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          px: { xs: 2, sm: 3, md: "25px" },
        }}
      >
        {/* Título e Badge de Localização */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              Imobiliárias
            </Typography>
            {location?.city && (
              <Chip
                icon={<LocationOnIcon />}
                label={`${location.city}, ${location.state}`}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 600,
                  height: 32,
                  "& .MuiChip-icon": {
                    color: "white",
                  },
                }}
              />
            )}
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {location?.city
              ? searchTerm || filterVerified || sortBy !== "name"
                ? `${filteredCompanies.length} ${filteredCompanies.length === 1 ? "imobiliária encontrada" : "imobiliárias encontradas"} de ${companies.length} ${companies.length === 1 ? "disponível" : "disponíveis"} em ${location.city}, ${location.state}`
                : `${companies.length} ${companies.length === 1 ? "imobiliária disponível" : "imobiliárias disponíveis"} em ${location.city}, ${location.state}`
              : "Encontre as melhores imobiliárias"}
          </Typography>
        </Box>

        {/* Filtros e Busca */}
        {location?.city && companies.length > 0 && (
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <TextField
                fullWidth
                placeholder="Buscar imobiliária por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  mt: 3,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3370A6",
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3370A6",
                        borderWidth: 2,
                      },
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 2 }}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap", gap: 1 }}
                  flex={1}
                >
                  <Chip
                    label="Todas"
                    onClick={() => setFilterVerified(false)}
                    sx={{
                      bgcolor: !filterVerified ? "#3370A6" : "transparent",
                      color: !filterVerified ? "white" : "text.primary",
                      fontWeight: 600,
                      border: !filterVerified ? "none" : "1px solid",
                      borderColor: !filterVerified ? "transparent" : "#3370A6",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: !filterVerified ? "#2a5a85" : "rgba(51, 112, 166, 0.08)",
                      },
                    }}
                  />
                  <Chip
                    label="Verificadas"
                    icon={<VerifiedIcon sx={{ fontSize: 18 }} />}
                    onClick={() => setFilterVerified(true)}
                    sx={{
                      bgcolor: filterVerified ? "#3370A6" : "transparent",
                      color: filterVerified ? "white" : "#3370A6",
                      border: filterVerified ? "none" : "1px solid",
                      borderColor: "#3370A6",
                      fontWeight: filterVerified ? 600 : 500,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: filterVerified ? "#2a5a85" : "rgba(51, 112, 166, 0.08)",
                      },
                    }}
                  />
                </Stack>

                <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={sortBy}
                    label="Ordenar por"
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    sx={{
                      bgcolor: "background.paper",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3370A6",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2a5a85",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3370A6",
                      },
                    }}
                  >
                    <MenuItem value="name">Nome (A-Z)</MenuItem>
                    <MenuItem value="properties">Mais Propriedades</MenuItem>
                    <MenuItem value="brokers">Mais Corretores</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          )}

        {loading ? (
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            <CompanyCardShimmer count={8} />
          </Grid>
        ) : !location?.city ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 8, sm: 10, md: 12 },
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(51, 112, 166, 0.1) 0%, rgba(139, 180, 217, 0.1) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <BusinessIcon
                sx={{ fontSize: { xs: 40, sm: 50 }, color: "#3370A6" }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 2,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Selecione uma cidade
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                maxWidth: 400,
              }}
            >
              Para visualizar as imobiliárias disponíveis, selecione uma cidade primeiro.
            </Typography>
          </Box>
        ) : filteredCompanies.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 8, sm: 10, md: 12 },
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(51, 112, 166, 0.1) 0%, rgba(139, 180, 217, 0.1) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <SearchIcon
                sx={{ fontSize: { xs: 40, sm: 50 }, color: "#3370A6" }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 2,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              {searchTerm
                ? "Nenhuma imobiliária encontrada"
                : "Nenhuma imobiliária disponível"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                maxWidth: 400,
              }}
            >
              {searchTerm
                ? `Não encontramos imobiliárias com o termo "${searchTerm}". Tente outra busca.`
                : location?.city
                ? `Não há imobiliárias disponíveis em ${location.city} no momento.`
                : "Não há imobiliárias disponíveis no momento."}
            </Typography>
            {searchTerm && (
              <Chip
                label="Limpar busca"
                onClick={() => setSearchTerm("")}
                sx={{
                  mt: 3,
                  bgcolor: "#3370A6",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#2a5a85" },
                }}
              />
            )}
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {filteredCompanies.map((company) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
                <CompanyCard company={company} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
