import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 12px;
  margin-right: -12px;

  /* Esconder scrollbar padrão */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CustomScrollbarTrack = styled.div`
  position: absolute;
  right: 2px;
  top: 0;
  bottom: 0;
  width: 6px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 3px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;

  ${ScrollContainer}:hover & {
    opacity: 1;
  }
`;

const CustomScrollbarThumb = styled.div<{ $height: number; $top: number }>`
  position: absolute;
  right: 0;
  top: ${props => props.$top}px;
  width: 6px;
  height: ${props => props.$height}px;
  background: ${props => props.theme.colors.primary}80;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    width: 8px;
    right: -1px;
  }

  &:active {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const ScrollIndicator = styled.div<{ $show: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  opacity: ${props => (props.$show ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 20;
`;

export const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  className,
}) => {
  const [scrollState, setScrollState] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    thumbHeight: 0,
    thumbTop: 0,
  });
  const [showIndicator, setShowIndicator] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const updateScrollState = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

    if (scrollHeight <= clientHeight) {
      setScrollState({
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        thumbHeight: 0,
        thumbTop: 0,
      });
      return;
    }

    const trackHeight = clientHeight;
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * trackHeight,
      20
    );
    const thumbTop =
      (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - thumbHeight);

    setScrollState({
      scrollTop,
      scrollHeight,
      clientHeight,
      thumbHeight,
      thumbTop,
    });
  };

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      updateScrollState();
      setIsScrolling(true);
      setShowIndicator(true);

      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        setShowIndicator(false);
      }, 1000);
    };

    const handleResize = () => {
      updateScrollState();
    };

    content.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Verificar estado inicial
    updateScrollState();

    return () => {
      content.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.scrollTimeout);
    };
  }, []);

  const handleThumbClick = (e: React.MouseEvent) => {
    if (!contentRef.current || !trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const trackHeight = trackRect.height;
    const thumbHeight = scrollState.thumbHeight;

    const newScrollTop =
      (clickY / (trackHeight - thumbHeight)) *
      (scrollState.scrollHeight - scrollState.clientHeight);

    contentRef.current.scrollTo({
      top: newScrollTop,
      behavior: 'smooth',
    });
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: scrollState.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollBy = (amount: number) => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!contentRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

      switch (e.key) {
        case 'Home':
          if (e.ctrlKey) {
            e.preventDefault();
            scrollToTop();
          }
          break;
        case 'End':
          if (e.ctrlKey) {
            e.preventDefault();
            scrollToBottom();
          }
          break;
        case 'PageUp':
          e.preventDefault();
          scrollBy(-clientHeight * 0.8);
          break;
        case 'PageDown':
          e.preventDefault();
          scrollBy(clientHeight * 0.8);
          break;
        case 'ArrowUp':
          if (e.ctrlKey) {
            e.preventDefault();
            scrollBy(-50);
          }
          break;
        case 'ArrowDown':
          if (e.ctrlKey) {
            e.preventDefault();
            scrollBy(50);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollPercentage =
    scrollState.scrollHeight > 0
      ? Math.round(
          (scrollState.scrollTop /
            (scrollState.scrollHeight - scrollState.clientHeight)) *
            100
        )
      : 0;

  return (
    <ScrollContainer className={className}>
      <Content ref={contentRef}>{children}</Content>

      {scrollState.scrollHeight > scrollState.clientHeight && (
        <>
          <CustomScrollbarTrack ref={trackRef} onClick={handleThumbClick}>
            <CustomScrollbarThumb
              ref={thumbRef}
              $height={scrollState.thumbHeight}
              $top={scrollState.thumbTop}
            />
          </CustomScrollbarTrack>

          <ScrollIndicator $show={showIndicator}>
            {scrollPercentage}%
          </ScrollIndicator>
        </>
      )}
    </ScrollContainer>
  );
};
