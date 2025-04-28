import { createContext } from 'react';

type LanguageContextType = {
  language: 'pt' | 'es';
  setLanguage: (language: 'pt' | 'es') => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
});

export default LanguageContext;