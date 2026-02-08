import React, { useEffect, useRef, useState } from 'react';

interface PropertyMapProps {
  address: string;
  zipCode?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  address,
  zipCode,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Detectar tema atual
  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        document.documentElement.classList.contains('dark-theme') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkTheme(isDark);
    };

    checkTheme();

    // Observar mudanças no tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || isMapLoaded) return;

    // Limpar mapa anterior se existir
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Função para inicializar o mapa
    const initializeMap = () => {
      if (!window.L || !mapRef.current || mapInstanceRef.current) return;

      // CSS para Leaflet (adicionar apenas se não existir)
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(style);
      }

      // Criar mapa
      const map = window.L.map(mapRef.current).setView(
        [-23.5505, -46.6333],
        13
      );
      mapInstanceRef.current = map;

      // Escolher tiles baseado no tema
      const tileUrl = isDarkTheme
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const attribution = isDarkTheme
        ? '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
        : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

      // Adicionar tiles baseado no tema
      window.L.tileLayer(tileUrl, {
        attribution: attribution,
        subdomains: isDarkTheme ? 'abcd' : 'abc',
      }).addTo(map);

      // Geocoding para buscar coordenadas do endereço
      const geocodeAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
          );
          const data = await response.json();

          if (data.length > 0) {
            const { lat, lon } = data[0];
            map.setView([parseFloat(lat), parseFloat(lon)], 15);

            // Adicionar marcador
            const marker = window.L.marker([
              parseFloat(lat),
              parseFloat(lon),
            ]).addTo(map);

            // Popup com informações
            marker
              .bindPopup(
                `
              <div style="padding: 8px;">
                <strong>🏠 Propriedade</strong><br>
                ${address}<br>
                ${zipCode ? `CEP: ${zipCode}` : ''}
              </div>
            `
              )
              .openPopup();
          } else {
            // Fallback para São Paulo se não encontrar o endereço
            map.setView([-23.5505, -46.6333], 13);

            const marker = window.L.marker([-23.5505, -46.6333]).addTo(map);
            marker
              .bindPopup(
                `
              <div style="padding: 8px;">
                <strong>📍 Localização aproximada</strong><br>
                ${address}<br>
                <small>Endereço não encontrado</small>
              </div>
            `
              )
              .openPopup();
          }
        } catch (error) {
          console.error('Erro ao geocodificar endereço:', error);
          // Em caso de erro, mostrar mapa padrão
          map.setView([-23.5505, -46.6333], 13);
          const marker = window.L.marker([-23.5505, -46.6333]).addTo(map);
          marker
            .bindPopup(
              `
            <div style="padding: 8px;">
              <strong>⚠️ Erro ao carregar localização</strong><br>
              ${address}<br>
              <small>Mostrando localização padrão</small>
            </div>
          `
            )
            .openPopup();
        }
      };

      geocodeAddress();
      setIsMapLoaded(true);
    };

    // Carregar Leaflet se ainda não estiver carregado
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Erro ao carregar Leaflet');
        setIsMapLoaded(true); // Marcar como carregado para evitar loop
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup do mapa
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapLoaded(false);
      }
    };
  }, [address, zipCode]);

  // Atualizar tema do mapa sem recriar
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return;

    const map = mapInstanceRef.current;

    // Remover todas as camadas de tiles
    map.eachLayer((layer: any) => {
      if (layer instanceof window.L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Adicionar nova camada baseada no tema
    const tileUrl = isDarkTheme
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = isDarkTheme
      ? '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
      : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    window.L.tileLayer(tileUrl, {
      attribution: attribution,
      subdomains: isDarkTheme ? 'abcd' : 'abc',
    }).addTo(map);
  }, [isDarkTheme, isMapLoaded]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header do Mapa */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--color-text)',
            margin: '0 0 8px 0',
          }}
        >
          📍 Localização
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            margin: 0,
            wordBreak: 'break-word',
          }}
        >
          {address}
          {zipCode && ` - CEP: ${zipCode}`}
        </p>
      </div>

      {/* Container do Mapa */}
      <div
        ref={mapRef}
        style={{
          flex: 1,
          width: '100%',
          minHeight: '300px',
          background: 'var(--color-background-secondary)',
          position: 'relative',
        }}
      >
        {/* Loading state - só mostra se o mapa não foi carregado */}
        {!isMapLoaded && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-secondary)',
              zIndex: 1,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🗺️</div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                Carregando mapa...
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                Buscando localização...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer do Mapa */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
        }}
      >
        Mapa fornecido pelo {isDarkTheme ? 'CARTO Dark' : 'OpenStreetMap'}
      </div>
    </div>
  );
};

// Declaração global para TypeScript
declare global {
  interface Window {
    L: any;
  }
}

export default PropertyMap;
