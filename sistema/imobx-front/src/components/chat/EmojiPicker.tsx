import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MdEmojiEmotions } from 'react-icons/md';
import { Tooltip } from '../ui/Tooltip';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}

// Emojis mais comuns
const EMOJI_CATEGORIES = {
  Frequentes: ['😀', '😂', '❤️', '👍', '😊', '🎉', '🔥', '💯', '✨', '🙏'],
  Emoções: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '🥰',
    '😍',
    '🤩',
    '😘',
    '😗',
    '😚',
    '😙',
  ],
  Gestos: [
    '👍',
    '👎',
    '👌',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '✍️',
    '💪',
    '🦵',
    '🦶',
  ],
  Objetos: [
    '💎',
    '🎁',
    '🎈',
    '🎀',
    '🏆',
    '🥇',
    '🥈',
    '🥉',
    '⚽',
    '🏀',
    '🎮',
    '🎯',
    '🎲',
    '🃏',
    '🀄',
    '🎴',
    '🎭',
    '🖼️',
  ],
  Símbolos: [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '💔',
    '❣️',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
  ],
  Natureza: [
    '🌱',
    '🌲',
    '🌳',
    '🌴',
    '🌵',
    '🌶️',
    '🌷',
    '🌸',
    '🌹',
    '🌺',
    '🌻',
    '🌼',
    '🌽',
    '🌾',
    '🌿',
    '🍀',
    '🍁',
    '🍂',
  ],
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Frequentes');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    // Não fechar o picker para permitir múltiplos emojis
  };

  if (disabled) {
    return null;
  }

  return (
    <Container ref={pickerRef}>
      <Tooltip content='Adicionar emoji' placement='right'>
        <EmojiButton onClick={() => setIsOpen(!isOpen)} type='button'>
          <MdEmojiEmotions size={20} />
        </EmojiButton>
      </Tooltip>

      {isOpen && (
        <PickerContainer>
          <CategoryTabs>
            {Object.keys(EMOJI_CATEGORIES).map(category => (
              <CategoryTab
                key={category}
                $active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </CategoryTab>
            ))}
          </CategoryTabs>

          <EmojiGrid>
            {EMOJI_CATEGORIES[
              activeCategory as keyof typeof EMOJI_CATEGORIES
            ].map((emoji, index) => (
              <EmojiButton
                key={`${activeCategory}-${index}`}
                onClick={() => handleEmojiClick(emoji)}
                title={emoji}
                type='button'
              >
                {emoji}
              </EmojiButton>
            ))}
          </EmojiGrid>
        </PickerContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const EmojiButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;
  font-size: 20px;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  touch-action: manipulation;
  min-width: 36px;
  min-height: 36px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    padding: 6px;
    min-width: 36px;
    min-height: 36px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    padding: 5px;
    min-width: 32px;
    min-height: 32px;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 100%;
    height: 100%;
    max-width: 20px;
    max-height: 20px;

    @media (max-width: 480px) {
      max-width: 18px;
      max-height: 18px;
    }
  }
`;

const PickerContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 320px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 480px) {
    width: calc(100vw - 40px);
    max-width: 320px;
    left: 50%;
    transform: translateX(-50%);
    max-height: 300px;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border: none;
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props =>
    props.$active ? '#fff' : props.theme.colors.textSecondary};
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${props => (props.$active ? 600 : 400)};
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.theme.colors.backgroundSecondary};
  }
`;

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  padding: 12px;
  overflow-y: auto;
  max-height: 300px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }

  button {
    width: 100%;
    aspect-ratio: 1;
    font-size: 24px;
    padding: 4px;
  }
`;
