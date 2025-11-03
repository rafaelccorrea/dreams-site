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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedIcon from "@mui/icons-material/Verified";
import { CompanyCard } from "../../components/CompanyCard";
import { CompanyCardShimmer } from "../../components/Shimmer";
import {
  getAvailableCompanies,
  type Company,
} from "../../services/propertyService";
import { useLocation } from "../../contexts/LocationContext";

export const CompaniesPage = () => {
  const { location } = useLocation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          px: "25px",
        }}
      >
        <Box
          sx={{
            mb: { xs: 3, sm: 4, md: 5 },
            background:
              "linear-gradient(135deg, rgba(51, 112, 166, 0.08) 0%, rgba(139, 180, 217, 0.08) 100%)",
            borderRadius: 3,
            p: { xs: 3, sm: 4, md: 5 },
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #3370A6 0%, #8BB4D9 100%)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: 2,
                background: "linear-gradient(135deg, #3370A6 0%, #8BB4D9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(51, 112, 166, 0.3)",
              }}
            >
              <BusinessIcon
                sx={{ fontSize: { xs: 28, sm: 32 }, color: "white" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                }}
              >
                Imobiliárias Verificadas
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  mt: 0.5,
                }}
              >
                {location?.city
                  ? `${companies.length} imobiliárias em ${location.city}, ${location.state}`
                  : "Encontre as melhores imobiliárias"}
              </Typography>
            </Box>
          </Stack>

          {location?.city && companies.length > 0 && (
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
          )}

          {location?.city && companies.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
            >
              <Chip
                label="Todas"
                sx={{
                  bgcolor: "#3370A6",
                  color: "white",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2a5a85" },
                }}
              />
              <Chip
                label="Verificadas"
                icon={<VerifiedIcon sx={{ fontSize: 18 }} />}
                variant="outlined"
                sx={{
                  borderColor: "#3370A6",
                  color: "#3370A6",
                  fontWeight: 500,
                  "&:hover": { bgcolor: "rgba(51, 112, 166, 0.08)" },
                }}
              />
            </Stack>
          )}
        </Box>

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
              Para visualizar as imobiliárias disponíveis, selecione uma cidade
              primeiro.
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
