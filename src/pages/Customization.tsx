import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import LanguageContext from '../context/LanguageContext';
import { translations } from '../data/translations';
import FadeInSection from '../components/ui/FadeInSection';
import { Pencil, Palette, Hammer, Truck } from 'lucide-react';

const Customization: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  
  const steps = [
    {
      id: 1,
      title: t.customization.step1,
      description: t.customization.step1Desc,
      icon: <Pencil size={24} />,
      image: 'https://images.pexels.com/photos/5699521/pexels-photo-5699521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 2,
      title: t.customization.step2,
      description: t.customization.step2Desc,
      icon: <Palette size={24} />,
      image: 'https://images.pexels.com/photos/5089178/pexels-photo-5089178.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 3,
      title: t.customization.step3,
      description: t.customization.step3Desc,
      icon: <Hammer size={24} />,
      image: 'https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 4,
      title: t.customization.step4,
      description: t.customization.step4Desc,
      icon: <Truck size={24} />,
      image: 'https://images.pexels.com/photos/6312072/pexels-photo-6312072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];
  
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
            src="https://images.pexels.com/photos/4207079/pexels-photo-4207079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Customization" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative text-white text-center">
          <FadeInSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">{t.customization.title}</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">{t.customization.subtitle}</p>
          </FadeInSection>
        </div>
      </section>
      
      {/* Process Steps */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <FadeInSection key={step.id} delay={index * 150}>
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                  <div className="md:w-1/2">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="rounded-md shadow-lg w-full"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mr-4">
                        {step.icon}
                      </div>
                      <h2 className="text-2xl font-serif">{step.title}</h2>
                    </div>
                    <p className="text-neutral-600 mb-6">{step.description}</p>
                    <div className="w-16 h-1 bg-accent"></div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section className="section bg-neutral-100">
        <div className="container-narrow">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                {language === 'pt' ? 'Pronto para começar seu projeto?' : '¿Listo para comenzar su proyecto?'}
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                {language === 'pt' 
                  ? 'Preencha o formulário abaixo e entraremos em contato para discutir seu projeto personalizado.' 
                  : 'Complete el formulario a continuación y nos pondremos en contacto para discutir su proyecto personalizado.'}
              </p>
            </div>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <form className="bg-white p-8 rounded-md shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                  {t.contact.form.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
              
              <div className="mb-6">
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
                className="w-full p-3 bg-accent text-white hover:bg-accent-dark transition-colors"
              >
                {t.customization.cta}
              </button>
            </form>
          </FadeInSection>
        </div>
      </section>
    </motion.div>
  );
};

export default Customization;