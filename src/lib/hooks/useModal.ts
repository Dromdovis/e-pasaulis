import { useState, useCallback } from 'react';
import { useFocusTrap } from './useFocusTrap';

interface ModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

export function useModal(options: ModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap(isOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    options.onOpen?.();
    document.body.style.overflow = 'hidden';
  }, [options]);

  const close = useCallback(() => {
    setIsOpen(false);
    options.onClose?.();
    document.body.style.overflow = '';
  }, [options]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (options.closeOnEscape && e.key === 'Escape') {
      close();
    }
  }, [close, options.closeOnEscape]);

  const handleOutsideClick = useCallback((e: React.MouseEvent) => {
    if (options.closeOnOutsideClick && e.target === e.currentTarget) {
      close();
    }
  }, [close, options.closeOnOutsideClick]);

  return {
    isOpen,
    open,
    close,
    containerRef,
    handleKeyDown,
    handleOutsideClick,
  };
} 