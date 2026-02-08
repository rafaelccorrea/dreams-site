import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetPath } from '../utils/pathUtils';
import LoadingScreen from '../components/common/LoadingScreen';
import { API_BASE_URL } from '../config/apiConfig';
import { getPublicPlans, type PublicPlan } from '../services/publicPlansApi';
import { TEXT_SECONDARY } from './LandingPage.styles';
import {
  MdHome,
  MdBusiness,
  MdLocationCity,
  MdArrowForward,
  MdCheck,
  MdMenu,
  MdClose,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdSecurity,
  MdSpeed,
  MdGroup,
  MdTrendingUp,
  MdCloudDone,
  MdDashboard,
  MdCalendarToday,
  MdAttachMoney,
  MdLogin,
  MdRocketLaunch,
  MdInfo,
  MdPriceCheck,
  MdSend,
  MdChat,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdEdit,
} from 'react-icons/md';
import * as S from './LandingPage.styles';

// Valores mockados - sem APIs
interface MockStats {
  totalProperties: number;
  totalCompanies: number;
  citiesServed: number;
}

// Features do carrossel
const features = [
  {
    icon: <MdDashboard />,
    title: 'Dashboard Intuitivo',
    description:
      'Visualize todas as informações importantes do seu negócio em um único lugar. Gráficos, métricas e relatórios em tempo real.',
  },
  {
    icon: <MdHome />,
    title: 'Gestão de Propriedades',
    description:
      'Gerencie todas as suas propriedades de forma eficiente. Cadastro completo, fotos, documentos e histórico de negociações.',
  },
  {
    icon: <MdGroup />,
    title: 'Gestão de Clientes',
    description:
      'Mantenha um cadastro completo de clientes, com histórico de interações, preferências e pipeline de vendas organizado.',
  },
  {
    icon: <MdCalendarToday />,
    title: 'Agenda Integrada',
    description:
      'Organize visitas, reuniões e compromissos. Sincronize com sua agenda pessoal e receba lembretes automáticos.',
  },
  {
    icon: <MdAttachMoney />,
    title: 'Controle Financeiro',
    description:
      'Acompanhe receitas, despesas, comissões e relatórios financeiros completos para tomar decisões mais assertivas.',
  },
  {
    icon: <MdSecurity />,
    title: 'Segurança Total',
    description:
      'Seus dados protegidos com criptografia de ponta a ponta. Backup automático e controle de acesso por permissões.',
  },
  {
    icon: <MdEdit />,
    title: 'Assinatura Digital de Documentos',
    description:
      'Envie documentos para assinatura digital de forma rápida e segura. Acompanhe o status em tempo real, receba notificações e gerencie múltiplos signatários com integração Assinafy.',
  },
];

// Valores mockados
const MOCK_STATS: MockStats = {
  totalProperties: 1250000, // Mais de 1 milhão
  totalCompanies: 45,
  citiesServed: 150, // Mais de 150 cidades
};

// Dados das imagens do sistema
const systemImagesData = [
  {
    title: 'Dashboard',
    description:
      'Visualize todas as informações importantes do seu negócio em um único lugar. Estatísticas, gráficos de vendas, performance da equipe, tarefas urgentes e métricas em tempo real para tomar decisões mais assertivas.',
  },
  {
    title: 'Funil de Vendas',
    description:
      'Acompanhe todo o processo de conversão de leads em vendas. Analise cada etapa do funil, identifique gargalos, visualize taxas de conversão e receba insights automáticos para otimizar seus resultados.',
  },
  {
    title: 'Metas',
    description:
      'Defina e acompanhe metas de vendas, receita e conversão para sua empresa, equipe ou individualmente. Visualize progresso em tempo real, receba alertas e projeções automáticas para manter sua imobiliária sempre no caminho certo.',
  },
  {
    title: 'Propriedades',
    description:
      'Gerencie todas as suas propriedades de forma completa e organizada. Cadastro detalhado, galeria de fotos, documentos, histórico de negociações, status atualizado e informações completas de cada imóvel em um só lugar.',
  },
  {
    title: 'Matches',
    description:
      'Sistema inteligente de compatibilidade que conecta automaticamente clientes com propriedades ideais. Visualize scores de compatibilidade, aceite ou ignore matches e deixe o sistema criar tarefas e agendamentos automaticamente para você.',
  },
  {
    title: 'Financeiro',
    description:
      'Controle completo das finanças da sua imobiliária. Acompanhe receitas, despesas, comissões, relatórios detalhados e tenha visão clara de toda a movimentação financeira para tomar decisões mais assertivas.',
  },
  {
    title: 'Assinatura Digital',
    description:
      'Envie documentos para assinatura digital de forma rápida e segura. Gerencie múltiplos signatários, acompanhe o status em tempo real, receba notificações automáticas e integre com a plataforma Assinafy para assinaturas válidas juridicamente.',
  },
  {
    title: 'Chat',
    description:
      'Comunicação em tempo real com sua equipe e clientes. Envie mensagens, compartilhe arquivos e imagens, crie grupos de conversa e mantenha toda a comunicação da sua imobiliária organizada em um só lugar.',
  },
];

// Função para extrair features do plano da API pública
// A API pode retornar features como array de strings ou como objeto/string JSON
const extractPlanFeatures = (plan: PublicPlan): string[] => {
  // Se features for array de strings, usar diretamente
  if (Array.isArray(plan.features)) {
    return plan.features;
  }

  // Se features for string JSON, tentar fazer parse
  if (typeof plan.features === 'string') {
    try {
      const parsed = JSON.parse(plan.features);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // Se for objeto, pode ter uma propriedade 'list' ou 'features'
      if (typeof parsed === 'object' && parsed !== null) {
        if (Array.isArray(parsed.list)) {
          return parsed.list;
        }
        if (Array.isArray(parsed.features)) {
          return parsed.features;
        }
      }
    } catch {
      // Se não conseguir fazer parse, continuar
    }
  }

  // Se features for objeto, tentar extrair array
  if (typeof plan.features === 'object' && plan.features !== null) {
    if (Array.isArray((plan.features as any).list)) {
      return (plan.features as any).list;
    }
    if (Array.isArray((plan.features as any).features)) {
      return (plan.features as any).features;
    }
  }

  // Se não tiver features, retornar array vazio (a UI pode usar description como fallback)
  return [];
};

// Logos das empresas parceiras (duplicadas para criar loop infinito)
const partnerLogos = [
  'intellisys.png',
  'intellisys.png',
  'intellisys.png',
  'intellisys.png',
  'intellisys.png',
  'intellisys.png',
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [displayedStats, setDisplayedStats] = useState({
    totalProperties: 0,
    totalCompanies: 0,
    citiesServed: 0,
  });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; isBot: boolean; isTyping?: boolean }>
  >([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chatAutoOpenedRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigatingToLogin, setIsNavigatingToLogin] = useState(false);
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Verificar se está em modo BETA
  const isBeta = import.meta.env.VITE_IS_BETA === 'true';

  // Perguntas sugeridas
  const suggestedQuestions = [
    'Quais são os planos disponíveis',
    'Quanto custa o sistema',
    'Quais funcionalidades o sistema oferece',
    'Como funciona o sistema',
    'Posso testar o sistema',
  ];

  // Animação de contagem crescente
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let hasAnimated = false;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;

            // Animar os números quando a seção entrar na viewport
            const duration = 2000; // 2 segundos
            const steps = 60;
            const stepDuration = duration / steps;

            Object.keys(MOCK_STATS).forEach(key => {
              const target = MOCK_STATS[key as keyof MockStats];
              let current = 0;
              const increment = target / steps;

              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                setDisplayedStats(prev => ({
                  ...prev,
                  [key]: Math.floor(current),
                }));
              }, stepDuration);

              timers.push(timer);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentStatsRef = statsRef.current;
    if (currentStatsRef) {
      observer.observe(currentStatsRef);
    }

    return () => {
      timers.forEach(timer => clearInterval(timer));
      if (currentStatsRef) {
        observer.unobserve(currentStatsRef);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloqueia o scroll do body quando o menu mobile estiver aberto
  useEffect(() => {
    if (menuOpen && window.innerWidth <= 768) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';

      return () => {
        const scrollValue = Math.abs(
          parseInt(document.body.style.top || '0', 10)
        );
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollValue);
      };
    }
  }, [menuOpen]);

  // Carregar planos da API pública
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setPlansLoading(true);
        setPlansError(null);
        const apiPlans = await getPublicPlans();
        if (apiPlans.length > 0) {
          // Usar os planos diretamente da API, apenas filtrando e ordenando
          const activePlans = apiPlans
            .filter(plan => plan.isActive)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setPlans(activePlans);
        } else {
          setPlansError('Nenhum plano disponível no momento');
        }
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        setPlansError('Erro ao carregar planos. Tente novamente mais tarde.');
      } finally {
        setPlansLoading(false);
      }
    };

    loadPlans();
  }, []);

  // Loading inicial da página - só desaparece após carregar os planos
  useEffect(() => {
    // Só desativar o loading quando os planos terminarem de carregar
    if (!plansLoading) {
      setIsLoading(false);
    }
  }, [plansLoading]);

  const handleNavigateToLogin = () => {
    setIsNavigatingToLogin(true);
    setTimeout(() => {
      navigate('/login');
    }, 500); // Pequeno delay para mostrar o loading
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const scrollToTop = () => {
    // Fechar o menu se estiver aberto
    setMenuOpen(false);

    // Verificar se o body está bloqueado (menu mobile aberto)
    const isBodyLocked = document.body.style.position === 'fixed';
    const scrollValue = isBodyLocked
      ? Math.abs(parseInt(document.body.style.top || '0', 10))
      : window.scrollY;

    // Função para fazer scroll suave em todos os elementos possíveis
    const performSmoothScroll = () => {
      // Tentar no window
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Tentar no documentElement
      if (document.documentElement && document.documentElement.scrollTo) {
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Tentar no body
      if (document.body && document.body.scrollTo) {
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Tentar no container principal (LandingContainer)
      const container = document.querySelector(
        '[class*="LandingContainer"]'
      ) as HTMLElement;
      if (container && container.scrollTo) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Tentar no root
      const root = document.getElementById('root');
      if (root && root.scrollTo) {
        root.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Se o body estava bloqueado, restaurar primeiro
    if (isBodyLocked) {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';

      // Aguardar um frame para garantir que o DOM foi atualizado
      requestAnimationFrame(() => {
        // Restaurar posição atual instantaneamente
        window.scrollTo(0, scrollValue);

        // Aguardar mais um frame antes de fazer scroll suave
        requestAnimationFrame(() => {
          setTimeout(() => {
            performSmoothScroll();
          }, 150);
        });
      });
    } else {
      // Se o body não estava bloqueado, fazer scroll suave imediatamente
      performSmoothScroll();
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Verificar se o body está bloqueado (menu mobile aberto)
    const isBodyLocked = document.body.style.position === 'fixed';
    const scrollValue = isBodyLocked
      ? Math.abs(parseInt(document.body.style.top || '0', 10))
      : window.scrollY;

    // Fechar o menu primeiro
    setMenuOpen(false);

    // Função para fazer o scroll usando scrollIntoView que respeita scroll-margin-top
    const performScroll = () => {
      // scrollIntoView respeita automaticamente o scroll-margin-top definido no CSS
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    };

    // Se o body estava bloqueado, restaurar antes de fazer scroll
    if (isBodyLocked) {
      // Restaurar o body imediatamente
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';

      // Aguardar um frame para garantir que o DOM foi atualizado
      requestAnimationFrame(() => {
        // Restaurar a posição de scroll atual
        window.scrollTo(0, scrollValue);

        // Aguardar mais um frame antes de fazer o scroll suave para a seção
        requestAnimationFrame(() => {
          setTimeout(() => {
            performScroll();
          }, 100);
        });
      });
    } else {
      // Se o body não estava bloqueado, aguardar um pouco para o menu fechar
      setTimeout(() => {
        performScroll();
      }, 100);
    }
  };

  // Efeito para permitir scroll na landing page
  useEffect(() => {
    // Permitir scroll no body quando estiver na landing page
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    const root = document.getElementById('root');
    if (root) {
      root.style.overflow = 'auto';
      root.style.height = 'auto';
    }

    return () => {
      // Restaurar quando sair da página
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (root) {
        root.style.overflow = '';
        root.style.height = '';
      }
    };
  }, []);

  // Abrir chat automaticamente após 15 segundos (apenas uma vez)
  useEffect(() => {
    // Só abre automaticamente se ainda não foi aberto automaticamente antes
    if (chatAutoOpenedRef.current) return;

    const timer = setTimeout(() => {
      // Verifica se ainda não foi aberto automaticamente (pode ter sido aberto manualmente)
      if (!chatAutoOpenedRef.current) {
        chatAutoOpenedRef.current = true;
        setChatOpen(true);
        // Mensagem de boas-vindas automática - sem delay
        setChatMessages([
          {
            text: 'Olá! 👋 Sou o assistente virtual da Intellisys. Como posso ajudá-lo hoje?',
            isBot: true,
          },
        ]);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll automático para última mensagem
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fechar modal com ESC, navegar com setas e controlar scroll
  useEffect(() => {
    if (selectedImageIndex === null) {
      // Garantir que o scroll esteja habilitado quando o modal não estiver aberto
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        // Imagem anterior
        setSelectedImageIndex(prev => {
          if (prev === null) return null;
          return prev > 0 ? prev - 1 : systemImagesData.length - 1;
        });
      } else if (e.key === 'ArrowRight') {
        // Próxima imagem
        setSelectedImageIndex(prev => {
          if (prev === null) return null;
          return prev < systemImagesData.length - 1 ? prev + 1 : 0;
        });
      }
    };

    // Bloquear scroll apenas quando o modal estiver aberto
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restaurar scroll quando o modal fechar
      const scrollYValue = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';

      if (scrollYValue) {
        const parsedScrollY = parseInt(scrollYValue.replace('-', ''), 10);
        if (!isNaN(parsedScrollY)) {
          window.scrollTo(0, parsedScrollY);
        }
      }
    };
  }, [selectedImageIndex]);

  // Resposta fallback caso a API não funcione
  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('preço') ||
      lowerMessage.includes('valor') ||
      lowerMessage.includes('custo') ||
      lowerMessage.includes('quanto')
    ) {
      return 'Nossos planos começam em R$ 97,90/mês. Temos opções para todos os tamanhos de imobiliária! Quer saber mais sobre nossos planos?';
    }

    if (lowerMessage.includes('plano') || lowerMessage.includes('planos')) {
      return 'Oferecemos 3 planos: Básico (R$ 97,90), Profissional (R$ 247,90) e Personalizado (a partir de R$ 147,90). Cada um com recursos específicos para atender sua necessidade.';
    }

    if (
      lowerMessage.includes('funcionalidade') ||
      lowerMessage.includes('recurso') ||
      lowerMessage.includes('faz')
    ) {
      return 'A Intellisys oferece gestão completa: propriedades, clientes, equipe, agenda, controle financeiro, relatórios e muito mais!';
    }

    if (
      lowerMessage.includes('suporte') ||
      lowerMessage.includes('ajuda') ||
      lowerMessage.includes('problema')
    ) {
      return 'Nosso suporte está disponível por email, WhatsApp e chat. Para contato direto, ligue para (14) 98831-2283 ou envie um email para contato@dreamkeys.com.br';
    }

    if (
      lowerMessage.includes('cadastro') ||
      lowerMessage.includes('registro') ||
      lowerMessage.includes('criar conta')
    ) {
      return 'Para criar sua conta, clique no botão "Entrar" no canto superior direito e depois em "Criar conta". É rápido e fácil!';
    }

    if (
      lowerMessage.includes('demo') ||
      lowerMessage.includes('teste') ||
      lowerMessage.includes('experimentar')
    ) {
      return 'Você pode criar uma conta gratuita e testar todas as funcionalidades! Não é necessário cartão de crédito para começar.';
    }

    if (
      lowerMessage.includes('contato') ||
      lowerMessage.includes('falar') ||
      lowerMessage.includes('telefone')
    ) {
      return 'Entre em contato conosco pelo WhatsApp: (14) 98831-2283 ou email: contato@dreamkeys.com.br. Estamos prontos para ajudar!';
    }

    return 'Entendi! Para mais informações, você pode navegar pelo site ou entrar em contato conosco pelo WhatsApp: (14) 98831-2283. Como mais posso ajudar?';
  };

  // Chamar API de IA
  const getBotResponse = async (message: string): Promise<string> => {
    try {
      // Validação básica no frontend
      const trimmedMessage = message.trim();
      if (trimmedMessage.length < 10) {
        return 'Por favor, faça uma pergunta com pelo menos 10 caracteres.';
      }
      if (trimmedMessage.length > 500) {
        return 'Por favor, faça uma pergunta com no máximo 500 caracteres.';
      }

      const response = await fetch(`${API_BASE_URL}/public/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: trimmedMessage,
        }),
      });

      if (!response.ok) {
        // Se for rate limit, retorna mensagem específica
        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({}));
          return (
            errorData.message ||
            'Muitas perguntas! Por favor, aguarde um momento antes de fazer outra pergunta.'
          );
        }

        // Se for erro de validação (400), tenta extrair a mensagem
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.message) {
            // Se message é um array, pega o primeiro item
            const errorMessage = Array.isArray(errorData.message)
              ? errorData.message[0]
              : errorData.message;
            return (
              errorMessage ||
              'Por favor, verifique sua pergunta e tente novamente.'
            );
          }
        }

        // Para outros erros, usa fallback
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Se a pergunta foi bloqueada, retorna a resposta da API
      if (data.blocked) {
        return (
          data.answer ||
          'Desculpe, só posso responder perguntas sobre nosso sistema de gestão imobiliária, planos, funcionalidades e valores.'
        );
      }

      return data.answer || getFallbackResponse(message);
    } catch (error) {
      console.error('Erro ao chamar API de IA:', error);
      // Em caso de erro, usa resposta fallback
      return getFallbackResponse(message);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || chatInput.trim();
    if (!messageToSend || isChatLoading) return;

    setChatMessages(prev => [...prev, { text: messageToSend, isBot: false }]);
    setChatInput('');
    setIsChatLoading(true);

    // Adiciona mensagem de "digitando..."
    setChatMessages(prev => [
      ...prev,
      { text: 'Digitando...', isBot: true, isTyping: true },
    ]);

    try {
      const botResponse = await getBotResponse(messageToSend);

      // Remove mensagem de "digitando..." e adiciona resposta
      setChatMessages(prev =>
        prev
          .filter(msg => !(msg as any).isTyping)
          .concat([{ text: botResponse, isBot: true }])
      );
    } catch {
      // Remove mensagem de "digitando..." e adiciona resposta de erro
      setChatMessages(prev =>
        prev
          .filter(msg => !(msg as any).isTyping)
          .concat([
            {
              text: 'Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato pelo WhatsApp: (14) 98831-2283',
              isBot: true,
            },
          ])
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendClick = () => {
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <LoadingScreen
        isVisible={isLoading || isNavigatingToLogin}
        text={isNavigatingToLogin ? 'Redirecionando...' : 'Carregando...'}
      />
      <S.LandingContainer>
        <S.MenuOverlay isOpen={menuOpen} onClick={() => setMenuOpen(false)} />
        <S.HeaderWrapper scrolled={scrolled}>
          <S.HeaderContent>
            <S.Logo
              src={getAssetPath('intellisys.png')}
              alt='Intellisys'
              role='button'
              tabIndex={0}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                scrollToTop();
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollToTop();
                }
              }}
            />
            <S.Nav isOpen={menuOpen}>
              <S.NavLink
                href='#recursos'
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('recursos');
                }}
              >
                <MdDashboard style={{ marginRight: '0.5rem' }} /> Recursos
              </S.NavLink>
              <S.NavLink
                href='#beneficios'
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('beneficios');
                }}
              >
                <MdTrendingUp style={{ marginRight: '0.5rem' }} /> Benefícios
              </S.NavLink>
              <S.NavLink
                href='#planos'
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('planos');
                }}
              >
                <MdPriceCheck style={{ marginRight: '0.5rem' }} /> Planos
              </S.NavLink>
              <S.NavLink
                href='#sobre'
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('sobre');
                }}
              >
                <MdInfo style={{ marginRight: '0.5rem' }} /> Sobre
              </S.NavLink>
              <S.LoginButton
                onClick={() => {
                  setMenuOpen(false);
                  handleNavigateToLogin();
                }}
              >
                <MdLogin /> Entrar
              </S.LoginButton>
            </S.Nav>
            <S.MenuButton onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <MdClose /> : <MdMenu />}
            </S.MenuButton>
          </S.HeaderContent>
        </S.HeaderWrapper>

        <S.HeroSection>
          <S.VideoBackground>
            <video autoPlay loop muted playsInline>
              <source src={getAssetPath('background.mp4')} type='video/mp4' />
            </video>
          </S.VideoBackground>
          <S.HeroContent>
            <S.HeroTitle>
              INTELLI<S.HeroTitlePrimary>S</S.HeroTitlePrimary>YS
            </S.HeroTitle>
            <S.HeroSubtitle>
              Sistema completo para gestão imobiliária. Gerencie propriedades,
              clientes, equipes e muito mais em uma única plataforma moderna e
              intuitiva.
            </S.HeroSubtitle>
            <S.CTAButton onClick={handleNavigateToLogin}>
              <MdRocketLaunch /> Começar Agora <MdArrowForward />
            </S.CTAButton>
          </S.HeroContent>
        </S.HeroSection>

        {/* Seção de Recursos - O que o sistema faz */}
        <S.FeaturesSection id='recursos'>
          <S.SectionTitle>Recursos Poderosos</S.SectionTitle>
          <S.SectionSubtitle>
            Tudo que você precisa para gerenciar sua imobiliária com eficiência
          </S.SectionSubtitle>
          <S.ResourcesGrid>
            {features.map((feature, index) => (
              <S.ResourceCard key={index}>
                <S.ResourceIcon>{feature.icon}</S.ResourceIcon>
                <S.ResourceTitle>{feature.title}</S.ResourceTitle>
                <S.ResourceDescription>
                  {feature.description}
                </S.ResourceDescription>
              </S.ResourceCard>
            ))}
          </S.ResourcesGrid>
        </S.FeaturesSection>

        {/* Seção de Benefícios - Por que escolher */}
        <S.BenefitsSection id='beneficios'>
          <S.SectionTitle>Por que escolher a Intellisys?</S.SectionTitle>
          <S.SectionSubtitle>
            Descubra os benefícios que fazem a diferença no seu dia a dia
          </S.SectionSubtitle>
          <S.BenefitsGrid>
            <S.BenefitCard>
              <S.BenefitIcon>
                <MdSpeed />
              </S.BenefitIcon>
              <S.BenefitTitle>Economia de Tempo</S.BenefitTitle>
              <S.BenefitDescription>
                Automatize processos repetitivos e ganhe horas de produtividade
                todos os dias. Foque no que realmente importa: fechar negócios.
              </S.BenefitDescription>
            </S.BenefitCard>
            <S.BenefitCard>
              <S.BenefitIcon>
                <MdTrendingUp />
              </S.BenefitIcon>
              <S.BenefitTitle>Aumento de Vendas</S.BenefitTitle>
              <S.BenefitDescription>
                Organize seu pipeline, acompanhe leads e nunca perca uma
                oportunidade. Nossas ferramentas ajudam a converter mais e
                vender mais rápido.
              </S.BenefitDescription>
            </S.BenefitCard>
            <S.BenefitCard>
              <S.BenefitIcon>
                <MdGroup />
              </S.BenefitIcon>
              <S.BenefitTitle>Gestão de Equipe</S.BenefitTitle>
              <S.BenefitDescription>
                Controle a performance da sua equipe, distribua tarefas e
                acompanhe resultados em tempo real. Trabalhe em equipe de forma
                mais eficiente.
              </S.BenefitDescription>
            </S.BenefitCard>
            <S.BenefitCard>
              <S.BenefitIcon>
                <MdAttachMoney />
              </S.BenefitIcon>
              <S.BenefitTitle>Controle Financeiro</S.BenefitTitle>
              <S.BenefitDescription>
                Tenha visão completa das suas finanças, comissões, receitas e
                despesas. Tome decisões baseadas em dados reais e precisos.
              </S.BenefitDescription>
            </S.BenefitCard>
            <S.BenefitCard>
              <S.BenefitIcon>
                <MdSecurity />
              </S.BenefitIcon>
              <S.BenefitTitle>Segurança e Backup</S.BenefitTitle>
              <S.BenefitDescription>
                Seus dados protegidos com criptografia de ponta. Backup
                automático diário garante que você nunca perca informações
                importantes.
              </S.BenefitDescription>
            </S.BenefitCard>
            <S.BenefitCard>
              <S.BenefitIcon>
                <MdCloudDone />
              </S.BenefitIcon>
              <S.BenefitTitle>Acesso em Qualquer Lugar</S.BenefitTitle>
              <S.BenefitDescription>
                Acesse seu sistema de qualquer dispositivo, a qualquer hora.
                Trabalhe de casa, escritório ou em campo com total mobilidade.
              </S.BenefitDescription>
            </S.BenefitCard>
          </S.BenefitsGrid>
        </S.BenefitsSection>

        {/* Seção de Estatísticas - Credibilidade */}
        <S.StatsSection ref={statsRef}>
          <S.SectionTitle>Números que Impressionam</S.SectionTitle>
          <S.SectionSubtitle>
            A Intellisys está transformando o mercado imobiliário com números
            que falam por si só
          </S.SectionSubtitle>
          <S.StatsGrid>
            <S.StatCard>
              <S.StatIcon>
                <MdHome />
              </S.StatIcon>
              <S.StatNumber>
                {displayedStats.totalProperties >= 1000000
                  ? `+${(displayedStats.totalProperties / 1000000).toFixed(1)}M`
                  : displayedStats.totalProperties >= 1000
                    ? `+${(displayedStats.totalProperties / 1000).toFixed(0)}K`
                    : displayedStats.totalProperties.toLocaleString('pt-BR')}
              </S.StatNumber>
              <S.StatLabel>Propriedades Cadastradas</S.StatLabel>
            </S.StatCard>
            <S.StatCard>
              <S.StatIcon>
                <MdBusiness />
              </S.StatIcon>
              <S.StatNumber>
                {displayedStats.totalCompanies.toLocaleString('pt-BR')}
              </S.StatNumber>
              <S.StatLabel>Imobiliárias Parceiras</S.StatLabel>
            </S.StatCard>
            <S.StatCard>
              <S.StatIcon>
                <MdLocationCity />
              </S.StatIcon>
              <S.StatNumber>
                {displayedStats.citiesServed >= 100
                  ? `+${displayedStats.citiesServed}`
                  : displayedStats.citiesServed.toLocaleString('pt-BR')}
              </S.StatNumber>
              <S.StatLabel>Cidades Atendidas</S.StatLabel>
            </S.StatCard>
          </S.StatsGrid>
        </S.StatsSection>

        {/* Seção de Imagens do Sistema */}
        <S.SystemImagesSection id='imagens-sistema'>
          <S.SectionTitle>Conheça o Sistema</S.SectionTitle>
          <S.SectionSubtitle>
            Veja como a Intellisys pode transformar a gestão da sua imobiliária
          </S.SectionSubtitle>
          <S.SystemImagesSampleNote>
            <S.SystemImagesSampleIcon>✨</S.SystemImagesSampleIcon>
            <S.SystemImagesSampleText>
              <strong>Estas são apenas algumas amostras!</strong> A Intellisys
              oferece muito mais funcionalidades para transformar completamente
              a gestão da sua imobiliária.
            </S.SystemImagesSampleText>
          </S.SystemImagesSampleNote>
          <S.SystemImagesContainer>
            <S.SystemImagesGrid>
              {systemImagesData.map((item, index) => {
                const imageNumber = String(index + 1).padStart(2, '0');
                const imageName = `landing${imageNumber}.png`;
                return (
                  <S.SystemImageCard
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <S.SystemImageWrapper>
                      <S.SystemImage
                        src={getAssetPath(imageName)}
                        alt={`${item.title} - Intellisys`}
                        loading='lazy'
                      />
                    </S.SystemImageWrapper>
                    <S.SystemImageLabel>
                      <S.SystemImageTitle>{item.title}</S.SystemImageTitle>
                      <S.SystemImageDescription>
                        {item.description}
                      </S.SystemImageDescription>
                    </S.SystemImageLabel>
                  </S.SystemImageCard>
                );
              })}
            </S.SystemImagesGrid>
          </S.SystemImagesContainer>
        </S.SystemImagesSection>

        {/* Modal Fullscreen de Imagem */}
        {selectedImageIndex !== null &&
          (() => {
            const imageData = systemImagesData[selectedImageIndex];
            const imageNumber = String(selectedImageIndex + 1).padStart(2, '0');
            const imageName = `landing${imageNumber}.png`;

            const goToPrevious = () => {
              setSelectedImageIndex(prev => {
                if (prev === null) return null;
                return prev > 0 ? prev - 1 : systemImagesData.length - 1;
              });
            };

            const goToNext = () => {
              setSelectedImageIndex(prev => {
                if (prev === null) return null;
                return prev < systemImagesData.length - 1 ? prev + 1 : 0;
              });
            };

            return (
              <S.SystemImageModalOverlay
                isOpen={selectedImageIndex !== null}
                onClick={() => setSelectedImageIndex(null)}
              >
                <S.SystemImageModalContainer onClick={e => e.stopPropagation()}>
                  <S.SystemImageModalCloseButton
                    onClick={() => setSelectedImageIndex(null)}
                  >
                    <MdClose />
                  </S.SystemImageModalCloseButton>

                  <S.SystemImageModalNavigationButton
                    $position='left'
                    onClick={e => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    aria-label='Imagem anterior'
                  >
                    <MdKeyboardArrowLeft />
                  </S.SystemImageModalNavigationButton>

                  <S.SystemImageModalNavigationButton
                    $position='right'
                    onClick={e => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    aria-label='Próxima imagem'
                  >
                    <MdKeyboardArrowRight />
                  </S.SystemImageModalNavigationButton>

                  <S.SystemImageModalImageContainer>
                    <S.SystemImageModalImage
                      src={getAssetPath(imageName)}
                      alt={`${imageData.title} - Intellisys`}
                    />
                  </S.SystemImageModalImageContainer>

                  <S.SystemImageModalContent>
                    <S.SystemImageModalTitle>
                      {imageData.title}
                    </S.SystemImageModalTitle>
                    <S.SystemImageModalDescription>
                      {imageData.description}
                    </S.SystemImageModalDescription>
                    <S.SystemImageModalCounter>
                      {selectedImageIndex + 1} / {systemImagesData.length}
                    </S.SystemImageModalCounter>
                  </S.SystemImageModalContent>
                </S.SystemImageModalContainer>
              </S.SystemImageModalOverlay>
            );
          })()}

        {/* Seção de Parceiros - Prova Social */}
        <S.PartnersSection id='parceiros'>
          <S.PartnersTitle>Imobiliárias Parceiras</S.PartnersTitle>
          <S.PartnersSubtitle>
            Empresas que confiam na Intellisys para gerenciar seus negócios
          </S.PartnersSubtitle>
          <S.LogosCarousel>
            <S.LogosTrack>
              {/* Primeira passagem */}
              {partnerLogos.map((logo, index) => (
                <S.LogoItem key={`first-${index}`}>
                  <img src={getAssetPath(logo)} alt={`Parceiro ${index + 1}`} />
                </S.LogoItem>
              ))}
              {/* Segunda passagem (para loop infinito) */}
              {partnerLogos.map((logo, index) => (
                <S.LogoItem key={`second-${index}`}>
                  <img src={getAssetPath(logo)} alt={`Parceiro ${index + 1}`} />
                </S.LogoItem>
              ))}
            </S.LogosTrack>
          </S.LogosCarousel>
        </S.PartnersSection>

        {/* Seção Sobre - Mais informações */}
        <S.AboutSection id='sobre'>
          <S.AboutContent>
            <S.AboutText>
              <S.AboutTitle>Sobre a Intellisys</S.AboutTitle>
              <S.AboutDescription>
                A Intellisys é uma plataforma moderna e intuitiva desenvolvida
                especialmente para imobiliárias que desejam otimizar seus
                processos e aumentar sua produtividade. Com ferramentas
                poderosas de gestão, você pode controlar propriedades, clientes,
                equipes, documentos e muito mais.
              </S.AboutDescription>
              <S.AboutDescription>
                Nossa missão é simplificar a gestão imobiliária, oferecendo uma
                solução completa que se adapta às necessidades do seu negócio.
                Seja você uma imobiliária pequena ou uma grande rede, a
                Intellisys tem o plano ideal para você.
              </S.AboutDescription>
            </S.AboutText>
            <S.FeaturesGrid>
              <S.FeatureItem>
                <S.FeatureItemIcon>
                  <MdSpeed />
                </S.FeatureItemIcon>
                <S.FeatureItemContent>
                  <S.FeatureItemTitle>Performance</S.FeatureItemTitle>
                  <S.FeatureItemDescription>
                    Sistema rápido e responsivo para máxima produtividade
                  </S.FeatureItemDescription>
                </S.FeatureItemContent>
              </S.FeatureItem>
              <S.FeatureItem>
                <S.FeatureItemIcon>
                  <MdCloudDone />
                </S.FeatureItemIcon>
                <S.FeatureItemContent>
                  <S.FeatureItemTitle>Cloud</S.FeatureItemTitle>
                  <S.FeatureItemDescription>
                    Acesse seus dados de qualquer lugar, a qualquer hora
                  </S.FeatureItemDescription>
                </S.FeatureItemContent>
              </S.FeatureItem>
              <S.FeatureItem>
                <S.FeatureItemIcon>
                  <MdTrendingUp />
                </S.FeatureItemIcon>
                <S.FeatureItemContent>
                  <S.FeatureItemTitle>Crescimento</S.FeatureItemTitle>
                  <S.FeatureItemDescription>
                    Escale seu negócio com ferramentas profissionais
                  </S.FeatureItemDescription>
                </S.FeatureItemContent>
              </S.FeatureItem>
              <S.FeatureItem>
                <S.FeatureItemIcon>
                  <MdSecurity />
                </S.FeatureItemIcon>
                <S.FeatureItemContent>
                  <S.FeatureItemTitle>Segurança</S.FeatureItemTitle>
                  <S.FeatureItemDescription>
                    Seus dados protegidos com tecnologia de ponta
                  </S.FeatureItemDescription>
                </S.FeatureItemContent>
              </S.FeatureItem>
            </S.FeaturesGrid>
          </S.AboutContent>
        </S.AboutSection>

        {/* Seção de Planos - CTA Final */}
        <S.PlansSection id='planos'>
          <S.SectionTitle>Planos e Preços</S.SectionTitle>
          <S.SectionSubtitle>
            Escolha o plano ideal para sua imobiliária
          </S.SectionSubtitle>

          {isBeta && (
            <S.BetaWarningCard>
              <S.BetaWarningIcon>🚀</S.BetaWarningIcon>
              <S.BetaWarningContent>
                <S.BetaWarningTitle>Período de Lançamento</S.BetaWarningTitle>
                <S.BetaWarningMessage>
                  Estamos em fase de lançamento e aprimoramento contínuo do
                  sistema. Durante este período inicial, oferecemos acesso
                  completo <strong>sem custos de assinatura</strong>. Para
                  validar seu cartão, será realizada uma cobrança simbólica de{' '}
                  <strong>R$ 5,00</strong> que será estornada automaticamente
                  logo após a confirmação. O período de teste acaba em{' '}
                  <strong>11 de março</strong>. Nossos usuários serão
                  notificados com <strong>30 dias de antecedência</strong> sobre
                  o início da cobrança, garantindo transparência total no
                  processo de transição.
                </S.BetaWarningMessage>
              </S.BetaWarningContent>
            </S.BetaWarningCard>
          )}

          {plansLoading ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: TEXT_SECONDARY,
              }}
            >
              Carregando planos...
            </div>
          ) : plansError ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#ef4444',
              }}
            >
              {plansError}
            </div>
          ) : (
            <S.PlansGrid>
              {plans.map(plan => {
                const price =
                  typeof plan.price === 'string'
                    ? parseFloat(plan.price)
                    : plan.price;
                const features = extractPlanFeatures(plan);

                return (
                  <S.PlanCard key={plan.id}>
                    <S.PlanName>{plan.name}</S.PlanName>
                    <S.PlanPrice>
                      {plan.type === 'custom' && (
                        <S.PlanPricePrefix>A partir de</S.PlanPricePrefix>
                      )}
                      <S.PlanPriceValue $isBeta={isBeta}>
                        {isBeta ? (
                          <>
                            <S.PlanPriceStrikethrough>
                              {formatPrice(price)}
                            </S.PlanPriceStrikethrough>
                            <S.PlanPriceBeta>Acesso Liberado</S.PlanPriceBeta>
                          </>
                        ) : (
                          <>
                            {formatPrice(price)}
                            <span>/mês</span>
                          </>
                        )}
                      </S.PlanPriceValue>
                      {isBeta && (
                        <S.PlanPriceNote>
                          Durante o período de lançamento. Cobrança iniciará
                          após notificação com 30 dias de antecedência.
                        </S.PlanPriceNote>
                      )}
                    </S.PlanPrice>
                    <S.PlanFeatures>
                      {features.length > 0 ? (
                        features.map((feature, index) => (
                          <S.PlanFeature key={index}>
                            <MdCheck />
                            {feature}
                          </S.PlanFeature>
                        ))
                      ) : plan.description ? (
                        <S.PlanFeature>
                          <MdCheck />
                          {plan.description}
                        </S.PlanFeature>
                      ) : null}
                    </S.PlanFeatures>
                    <S.PlanButton onClick={handleNavigateToLogin}>
                      <MdRocketLaunch /> Começar Agora
                    </S.PlanButton>
                  </S.PlanCard>
                );
              })}
            </S.PlansGrid>
          )}
        </S.PlansSection>

        <S.Footer>
          <S.FooterContent>
            <S.FooterSection>
              <S.FooterTitle>Intellisys</S.FooterTitle>
              <S.FooterText>
                Sistema completo para gestão imobiliária. Simplifique seus
                processos e aumente sua produtividade.
              </S.FooterText>
            </S.FooterSection>
            <S.FooterSection>
              <S.FooterTitle>Links Rápidos</S.FooterTitle>
              <S.FooterLink
                href='#recursos'
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('recursos');
                }}
              >
                Recursos
              </S.FooterLink>
              <S.FooterLink
                href='#beneficios'
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('beneficios');
                }}
              >
                Benefícios
              </S.FooterLink>
              <S.FooterLink
                href='#planos'
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('planos');
                }}
              >
                Planos
              </S.FooterLink>
              <S.FooterLink
                href='#sobre'
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('sobre');
                }}
              >
                Sobre
              </S.FooterLink>
              <S.FooterLink onClick={handleNavigateToLogin}>
                Entrar
              </S.FooterLink>
            </S.FooterSection>
            <S.FooterSection>
              <S.FooterTitle>Contato</S.FooterTitle>
              <S.FooterLink href='mailto:contato@dreamkeys.com.br'>
                <MdEmail /> contato@dreamkeys.com.br
              </S.FooterLink>
              <S.FooterLink href='tel:+5514988312283'>
                <MdPhone /> (14) 98831-2283
              </S.FooterLink>
              <S.FooterLink
                href='https://wa.me/5514988312283'
                target='_blank'
                rel='noopener noreferrer'
              >
                <MdPhone /> WhatsApp: (14) 98831-2283
              </S.FooterLink>
              <S.FooterLink>
                <MdLocationOn /> São Paulo, SP
              </S.FooterLink>
            </S.FooterSection>
          </S.FooterContent>
          <S.FooterBottom>
            <S.DeveloperInfo>
              <p>
                Desenvolvido com <span className='heart'>❤️</span> por{' '}
                <strong>Next Innovation Technologies LTDA</strong>
              </p>
              <p style={{ fontSize: '0.9em', opacity: 0.9 }}>
                CNPJ: 52.497.027/0001-35
              </p>
              <p style={{ fontSize: '0.9em', opacity: 0.9 }}>
                Rua Wanderley Rodrigues Pereira, 79 - Marília, SP
              </p>
            </S.DeveloperInfo>
            <S.Copyright>
              &copy; {new Date().getFullYear()} Intellisys. Todos os direitos
              reservados.
            </S.Copyright>
          </S.FooterBottom>
        </S.Footer>

        {/* Chat de Suporte */}
        {chatOpen ? (
          <S.ChatContainer isOpen={chatOpen}>
            <S.ChatHeader>
              <S.ChatHeaderInfo>
                <S.ChatAvatar>🤖</S.ChatAvatar>
                <S.ChatHeaderText>
                  <h3>Suporte Intellisys</h3>
                  <p>Online agora</p>
                </S.ChatHeaderText>
              </S.ChatHeaderInfo>
              <S.ChatCloseButton onClick={() => setChatOpen(false)}>
                <MdClose />
              </S.ChatCloseButton>
            </S.ChatHeader>
            <S.ChatMessages>
              {chatMessages.map((msg, index) => (
                <S.Message key={index} isBot={msg.isBot}>
                  <S.MessageBubble isBot={msg.isBot}>
                    {msg.text}
                  </S.MessageBubble>
                </S.Message>
              ))}
              <S.SuggestedQuestions>
                {suggestedQuestions.map((question, index) => (
                  <S.SuggestedQuestionButton
                    key={index}
                    onClick={e => {
                      e.preventDefault();
                      handleSendMessage(question);
                    }}
                    disabled={isChatLoading}
                  >
                    {question}
                  </S.SuggestedQuestionButton>
                ))}
              </S.SuggestedQuestions>
              <div ref={chatMessagesEndRef} />
            </S.ChatMessages>
            <S.ChatInputContainer>
              <S.ChatInput
                type='text'
                placeholder={
                  isChatLoading ? 'Aguarde...' : 'Digite sua mensagem...'
                }
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isChatLoading}
              />
              <S.ChatSendButton
                onClick={handleSendClick}
                disabled={isChatLoading}
              >
                <MdSend />
              </S.ChatSendButton>
            </S.ChatInputContainer>
          </S.ChatContainer>
        ) : (
          <S.ChatToggleButton
            onClick={() => setChatOpen(true)}
            aria-label='Abrir chat de suporte'
          >
            <MdChat />
          </S.ChatToggleButton>
        )}

        {/* Botão Flutuante WhatsApp */}
        {!chatOpen && (
          <S.WhatsAppButton
            href='https://wa.me/5514988312283'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Fale conosco no WhatsApp'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='white'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
            </svg>
          </S.WhatsAppButton>
        )}
      </S.LandingContainer>
    </>
  );
};

export default LandingPage;
