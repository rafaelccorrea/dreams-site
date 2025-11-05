"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SortIcon from "@mui/icons-material/Sort";
import { BrokerCard } from "../../components/BrokerCard";
import { BrokerCardShimmer } from "../../components/Shimmer";
import { ScrollToTop } from "../../components/ScrollToTop";
import {
  getAvailableBrokers,
  type Broker,
} from "../../services/propertyService";
import { useLocation } from "../../contexts/LocationContext";

type SortOption = "name" | "properties-desc" | "properties-asc";
type FilterOption = "all" | "most-properties";

export const BrokersPage = () => {
  const { location } = useLocation();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  useEffect(() => {
    const loadBrokers = async () => {
      if (!location?.city) {
        setLoading(false);
        setBrokers([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getAvailableBrokers(location.city);
        setBrokers(data);
      } catch (error) {
        console.error("Erro ao carregar corretores:", error);
        setBrokers([]);
      } finally {
        setLoading(false);
      }
    };

    loadBrokers();
  }, [location?.city]);

  // Filtrar e ordenar corretores
  const filteredAndSortedBrokers = useMemo(() => {
    let filtered = brokers.filter((broker) =>
      broker.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aplicar filtro "Mais Avaliados" (usando propriedades como proxy por enquanto)
    if (filterBy === "most-properties") {
      filtered = filtered.filter((broker) => broker.propertyCount > 0);
    }

    // Aplicar ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "properties-desc":
          return b.propertyCount - a.propertyCount;
        case "properties-asc":
          return a.propertyCount - b.propertyCount;
        case "name":
        default:
          return a.name.localeCompare(b.name, "pt-BR");
      }
    });

    return sorted;
  }, [brokers, searchTerm, sortBy, filterBy]);

  const totalBrokers = brokers.length;
  const displayedCount = filteredAndSortedBrokers.length;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 200px)",
        bgcolor: "background.default",
        pt: { xs: 7, sm: 8, md: 11 },
        pb: { xs: 3, sm: 4, md: 5 },
      }}
    >
      {/* Título e Badge de Localização - fora do container com padding */}
      <Box sx={{ mb: { xs: 2, sm: 3 }, px: { xs: 3, sm: 4, md: "40px" } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Corretores
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
              ? searchTerm || filterBy !== "all" || sortBy !== "name"
                ? `${displayedCount} ${displayedCount === 1 ? "corretor encontrado" : "corretores encontrados"} de ${totalBrokers} ${totalBrokers === 1 ? "disponível" : "disponíveis"} em ${location.city}, ${location.state}`
                : `${totalBrokers} ${totalBrokers === 1 ? "corretor disponível" : "corretores disponíveis"} em ${location.city}, ${location.state}`
              : "Encontre os melhores profissionais"}
          </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          px: { xs: 2, sm: 3, md: "25px" },
        }}
      >

        {/* Filtros e Busca */}
        {location?.city && brokers.length > 0 && (
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            {/* Barra de Busca */}
            <Box sx={{ mb: 2, maxWidth: "500px" }}>
              <TextField
                fullWidth
                placeholder="Buscar corretor por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
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
            </Box>

            {/* Filtros e Ordenação */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "center" },
                flexWrap: "wrap",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1, flex: 1 }}
              >
                <Chip
                  label="Todos"
                  onClick={() => setFilterBy("all")}
                  sx={{
                    bgcolor: filterBy === "all" ? "#3370A6" : "transparent",
                    color: filterBy === "all" ? "white" : "#3370A6",
                    border: filterBy === "all" ? "none" : "1px solid #3370A6",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: filterBy === "all" ? "#2a5a85" : "rgba(51, 112, 166, 0.08)",
                    },
                  }}
                />
                <Chip
                  label="Mais Propriedades"
                  icon={<StarIcon sx={{ fontSize: 18 }} />}
                  onClick={() => setFilterBy("most-properties")}
                  sx={{
                    bgcolor: filterBy === "most-properties" ? "#3370A6" : "transparent",
                    color: filterBy === "most-properties" ? "white" : "#3370A6",
                    border: filterBy === "most-properties" ? "none" : "1px solid #3370A6",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: filterBy === "most-properties" ? "#2a5a85" : "rgba(51, 112, 166, 0.08)",
                    },
                    "& .MuiChip-icon": {
                      color: filterBy === "most-properties" ? "white" : "#3370A6",
                    },
                  }}
                />
              </Stack>

              {/* Seletor de Ordenação */}
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 200 },
                  bgcolor: "background.paper",
                  borderRadius: 2,
                }}
              >
                <InputLabel id="sort-select-label">Ordenar por</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sortBy}
                  label="Ordenar por"
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  startAdornment={<SortIcon sx={{ mr: 1, color: "text.secondary" }} />}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3370A6",
                    },
                  }}
                >
                  <MenuItem value="name">Nome (A-Z)</MenuItem>
                  <MenuItem value="properties-desc">Mais Propriedades</MenuItem>
                  <MenuItem value="properties-asc">Menos Propriedades</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {/* Conteúdo Principal */}
        {loading ? (
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            <BrokerCardShimmer count={8} />
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
              <LocationOnIcon
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
                mb: 2,
              }}
            >
              Para visualizar os corretores disponíveis, selecione uma cidade primeiro.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                maxWidth: 400,
              }}
            >
              Clique no botão de localização no topo da página para escolher sua cidade.
            </Typography>
          </Box>
        ) : filteredAndSortedBrokers.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 8, sm: 10, md: 12 },
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/not_found.png"
              alt="Nenhum corretor encontrado"
              sx={{
                width: "100%",
                maxWidth: { xs: 300, sm: 400 },
                height: "auto",
                opacity: 0.8,
                mb: 3,
              }}
            />
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
                ? "Nenhum corretor encontrado"
                : filterBy === "most-properties"
                ? "Nenhum corretor com propriedades"
                : "Nenhum corretor disponível"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                maxWidth: 400,
                mb: 2,
              }}
            >
              {searchTerm
                ? `Não encontramos corretores com o termo "${searchTerm}". Tente outra busca.`
                : location?.city
                ? `Não há corretores disponíveis em ${location.city} no momento.`
                : "Não há corretores disponíveis no momento."}
            </Typography>
            {(searchTerm || filterBy !== "all") && (
              <Chip
                label="Limpar filtros"
                onClick={() => {
                  setSearchTerm("");
                  setFilterBy("all");
                  setSortBy("name");
                }}
                sx={{
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
            {filteredAndSortedBrokers.map((broker) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={broker.id}>
                <BrokerCard broker={broker} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <ScrollToTop />
    </Box>
  );
};
