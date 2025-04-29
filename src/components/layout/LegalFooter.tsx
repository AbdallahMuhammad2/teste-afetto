import React from 'react';

const LegalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-16 bg-carbon border-t border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="font-serif text-lg mb-4">Afetto Design</h3>
            <p className="text-neutral-400 text-sm mb-6">
              Criando ambientes que transcendem o ordinário e elevam a experiência humana.
            </p>
            <p className="text-neutral-500 text-xs">
              © {currentYear} Afetto Design. <br />
              CNPJ 00.000.000/0001-00
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-medium mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="text-neutral-400 text-sm">
                <a href="mailto:contato@afetto.com.br" className="hover:text-copper transition-colors duration-300">
                  contato@afetto.com.br
                </a>
              </li>
              <li className="text-neutral-400 text-sm">
                <a href="tel:+5511999999999" className="hover:text-copper transition-colors duration-300">
                  +55 (11) 99999-9999
                </a>
              </li>
              <li className="text-neutral-400 text-sm">
                São Paulo, SP - Brasil
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-medium mb-4">Links</h4>
            <ul className="space-y-3">
              <li className="text-neutral-400 text-sm">
                <a href="/sobre" className="hover:text-copper transition-colors duration-300">
                  Sobre
                </a>
              </li>
              <li className="text-neutral-400 text-sm">
                <a href="/projetos" className="hover:text-copper transition-colors duration-300">
                  Projetos
                </a>
              </li>
              <li className="text-neutral-400 text-sm">
                <a href="/processo" className="hover:text-copper transition-colors duration-300">
                  Processo
                </a>
              </li>
              <li className="text-neutral-400 text-sm">
                <a href="/contato" className="hover:text-copper transition-colors duration-300">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              <li className="text-neutral-400 text-sm">
                <a href="/privacidade" className="hover:text-copper transition-colors duration-300">
                  Política de Privacidade
                </a>
              </li>
              <li className="text-neutral-400 text-sm">
                <a href="/termos" className="hover:text-copper transition-colors duration-300">
                  Termos de Uso
                </a>
              </li>
              <li className="text-neutral-400 text-sm">
                <a href="/lgpd" className="hover:text-copper transition-colors duration-300">
                  LGPD
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-xs mb-4 md:mb-0">
            Comprometidos com acessibilidade e privacidade
          </p>
          
          <div className="flex space-x-6">
            <a href="https://linkedin.com" aria-label="LinkedIn" className="text-neutral-400 hover:text-copper transition-colors duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-neutral-400 hover:text-copper transition-colors duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;