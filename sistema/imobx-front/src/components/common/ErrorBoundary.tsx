import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨🚨🚨 ========================================');
    console.error('🚨🚨🚨 ERROR BOUNDARY CAPTUROU UM ERRO:');
    console.error('🚨🚨🚨 ========================================');
    console.error('🚨 ERRO:', error);
    console.error('🚨 MENSAGEM:', error.message);
    console.error('🚨 STACK:', error.stack);
    console.error('🚨 ERROR INFO:', errorInfo);
    console.error('🚨 COMPONENT STACK:', errorInfo.componentStack);
    console.error('🚨🚨🚨 ========================================');

    this.setState({
      error,
      errorInfo,
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Se foi fornecido um fallback customizado, use ele
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
