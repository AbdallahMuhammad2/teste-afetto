import { useState, useEffect } from 'react';

type Persona = 'investor' | 'architect' | 'designer' | null;

interface PersonaContent {
  headline: string;
  subcopy: string;
  cta: string;
}

/**
 * Hook to manage enterprise persona based content
 * @returns Personalized content based on detected persona
 */
const useEnterprisePersona = (): PersonaContent => {
  const [persona, setPersona] = useState<Persona>(null);
  
  // Default corporate content
  const defaultContent: PersonaContent = {
    headline: "Redefinindo Espaços com Design Atemporal",
    subcopy: "Criamos ambientes que transcendem tendências e refletem a essência única de cada cliente.",
    cta: "Descubra Nossa Abordagem"
  };
  
  // Persona-specific content
  const personaContent: Record<string, PersonaContent> = {
    investor: {
      headline: "Investimentos Estratégicos em Design Premium",
      subcopy: "Oferecemos soluções que valorizam propriedades e garantem retorno superior ao mercado.",
      cta: "Conheça Nosso Portfolio"
    },
    architect: {
      headline: "Colaboração Que Eleva Projetos Arquitetônicos",
      subcopy: "Trabalhamos em sintonia com arquitetos, trazendo materialidade e precisão a cada detalhe.",
      cta: "Veja Nossas Parcerias"
    },
    designer: {
      headline: "Execução Impecável de Visões Criativas",
      subcopy: "Transformamos conceitos em realidade, com expertise técnica e acabamentos refinados.",
      cta: "Explore Nossos Processos"
    }
  };
  
  useEffect(() => {
    // Get persona from cookie or localStorage
    const detectPersona = (): Persona => {
      if (typeof document === 'undefined') return null;
      
      // Check cookie first
      const cookies = document.cookie.split(';');
      const personaCookie = cookies.find(cookie => cookie.trim().startsWith('persona='));
      
      if (personaCookie) {
        const value = personaCookie.split('=')[1];
        if (['investor', 'architect', 'designer'].includes(value)) {
          return value as Persona;
        }
      }
      
      // Check localStorage as fallback
      const storedPersona = localStorage.getItem('persona');
      if (storedPersona && ['investor', 'architect', 'designer'].includes(storedPersona)) {
        return storedPersona as Persona;
      }
      
      return null;
    };
    
    setPersona(detectPersona());
  }, []);
  
  return persona ? personaContent[persona] : defaultContent;
};

export default useEnterprisePersona;