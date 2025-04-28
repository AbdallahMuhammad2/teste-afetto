import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import LanguageContext from '../../context/LanguageContext';
import { translations } from '../../data/translations';

const Footer: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-serif mb-6">Mobilia</h3>
            <p className="text-neutral-400 mb-6 max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">{t.footer.navigation}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-neutral-400 hover:text-white transition-colors">
                  {t.nav.portfolio}
                </Link>
              </li>
              <li>
                <Link to="/customization" className="text-neutral-400 hover:text-white transition-colors">
                  {t.nav.customization}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">{t.footer.collections}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/portfolio?category=living" className="text-neutral-400 hover:text-white transition-colors">
                  {t.categories.living}
                </Link>
              </li>
              <li>
                <Link to="/portfolio?category=dining" className="text-neutral-400 hover:text-white transition-colors">
                  {t.categories.dining}
                </Link>
              </li>
              <li>
                <Link to="/portfolio?category=bedroom" className="text-neutral-400 hover:text-white transition-colors">
                  {t.categories.bedroom}
                </Link>
              </li>
              <li>
                <Link to="/portfolio?category=office" className="text-neutral-400 hover:text-white transition-colors">
                  {t.categories.office}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">{t.footer.contact}</h4>
            <address className="not-italic text-neutral-400 space-y-3">
              <p>Av. Paulista, 1000</p>
              <p>São Paulo, SP - Brasil</p>
              <p>+55 11 5555-5555</p>
              <p>contato@mobilia.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} Mobilia. {t.footer.rights}
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-neutral-500 hover:text-white transition-colors text-sm">
              {t.footer.terms}
            </Link>
            <Link to="/privacy" className="text-neutral-500 hover:text-white transition-colors text-sm">
              {t.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;