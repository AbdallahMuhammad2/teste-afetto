import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import { translations } from '../data/translations';
import FadeInSection from '../components/ui/FadeInSection';

const Contact: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <section className="h-96 bg-neutral-900 relative flex items-center">
        <div className="absolute inset-0 opacity-50">
          <img 
            src="https://images.pexels.com/photos/5089179/pexels-photo-5089179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Contact" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative text-white text-center">
          <FadeInSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">{t.contact.title}</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">{t.contact.subtitle}</p>
          </FadeInSection>
        </div>
      </section>
      
      {/* Contact Content */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <div className="lg:w-7/12">
              <FadeInSection>
                <h2 className="text-3xl font-serif mb-8">
                  {language === 'pt' ? 'Envie uma mensagem' : 'Envíe un mensaje'}
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t.contact.form.name}
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t.contact.form.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t.contact.form.subject}
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t.contact.form.phone}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t.contact.form.message}
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent text-white hover:bg-accent-dark transition-colors"
                  >
                    {t.contact.form.send}
                  </button>
                </form>
              </FadeInSection>
            </div>
            
            {/* Contact Info */}
            <div className="lg:w-5/12">
              <FadeInSection delay={200}>
                <h2 className="text-3xl font-serif mb-8">{t.contact.info.title}</h2>
                <div className="space-y-8">
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mr-4">
                        <MapPin size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{t.contact.info.address}</h3>
                      <p className="text-neutral-600">Av. Paulista, 1000</p>
                      <p className="text-neutral-600">São Paulo, SP - Brasil</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mr-4">
                        <Phone size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{t.contact.info.phone}</h3>
                      <p className="text-neutral-600">+55 11 5555-5555</p>
                      <p className="text-neutral-600">+55 11 9999-9999</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mr-4">
                        <Mail size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{t.contact.info.email}</h3>
                      <p className="text-neutral-600">contato@mobilia.com</p>
                      <p className="text-neutral-600">info@mobilia.com</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mr-4">
                        <Clock size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{t.contact.info.hours}</h3>
                      <p className="text-neutral-600">
                        {language === 'pt' ? 'Segunda a Sexta: 9h às 18h' : 'Lunes a Viernes: 9h a 18h'}
                      </p>
                      <p className="text-neutral-600">
                        {language === 'pt' ? 'Sábado: 10h às 14h' : 'Sábado: 10h a 14h'}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map */}
      <section className="h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0954493250244!2d-46.6548677!3d-23.5646162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1688492323278!5m2!1spt-BR!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </motion.div>
  );
};

export default Contact;