import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import AlertModal from '../components/AlertModal';
import type { AlertType } from '../components/AlertModal';

interface AlertOptions {
  type?: AlertType;
  title?: string;
  message: string;
  onConfirm?: () => void;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({
    message: '',
    type: 'info'
  });

  const showAlert = useCallback((newOptions: AlertOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (options.onConfirm) {
      options.onConfirm();
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        onClose={handleClose}
        type={options.type}
        title={options.title}
        message={options.message}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
