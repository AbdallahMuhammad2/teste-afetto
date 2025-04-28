import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import LanguageContext from '../context/LanguageContext';
import { translations } from '../data/translations';
import FadeInSection from '../components/ui/FadeInSection';
import { Medal, Paintbrush, Leaf, PenTool as Tool } from 'lucide-react';

const About: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  
  const values = [
    {
      id: 1,
      title: t.about.quality,
      icon: <Medal size={28} />,
      description: language === 'pt' 
        ? 'Utilizamos apenas os melhores materiais e técnicas refinadas para criar móveis que duram gerações.' 
        : 'Utilizamos solo los mejores materiales y técnicas refinadas para crear muebles que duran generaciones.'
    },
    {
      id: 2,
      title: t.about.design,
      icon: <Paintbrush size={28} />,
      description: language === 'pt' 
        ? 'Cada peça é desenhada com atenção meticulosa aos detalhes e tendências contemporâneas.' 
        : 'Cada pieza es diseñada con atención meticulosa a los detalles y tendencias contemporáneas.'
    },
    {
      id: 3,
      title: t.about.sustainability,
      icon: <Leaf size={28} />,
      description: language === 'pt' 
        ? 'Comprometidos com práticas sustentáveis e uso responsável de recursos naturais.' 
        : 'Comprometidos con prácticas sostenibles y uso responsable de recursos naturales.'
    },
    {
      id: 4,
      title: t.about.craftsmanship,
      icon: <Tool size={28} />,
      description: language === 'pt' 
        ? 'Nossos artesãos combinam técnicas tradicionais com tecnologia moderna para criar peças únicas.' 
        : 'Nuestros artesanos combinan técnicas tradicionales con tecnología moderna para crear piezas únicas.'
    }
  ];
  
  const team = [
    {
      id: 1,
      name: 'Carlos Mendes',
      role: language === 'pt' ? 'Fundador & Designer Principal' : 'Fundador & Diseñador Principal',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 2,
      name: 'Ana Soares',
      role: language === 'pt' ? 'Diretora Criativa' : 'Directora Creativa',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 3,
      name: 'Roberto Ferreira',
      role: language === 'pt' ? 'Mestre Marceneiro' : 'Maestro Carpintero',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
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
            src="https://images.pexels.com/photos/4207707/pexels-photo-4207707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="About Us" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative text-white text-center">
          <FadeInSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">{t.about.title}</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">{t.about.subtitle}</p>
          </FadeInSection>
        </div>
      </section>
      
      {/* Story */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <FadeInSection>
                <h2 className="text-3xl font-serif mb-6">{t.about.title}</h2>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {t.about.story}
                </p>
                <p className="leading-relaxed text-neutral-600">
                  {language === 'pt' 
                    ? 'Com uma equipe de designers talentosos e artesãos experientes, criamos móveis que não apenas são bonitos, mas também funcionais e duradouros. Cada peça conta uma história e reflete nossa paixão pelo design e pela qualidade.'
                    : 'Con un equipo de diseñadores talentosos y artesanos experimentados, creamos muebles que no solo son hermosos, sino también funcionales y duraderos. Cada pieza cuenta una historia y refleja nuestra pasión por el diseño y la calidad.'}
                </p>
              </FadeInSection>
            </div>
            <div className="md:w-1/2">
              <FadeInSection delay={200}>
                <img 
                  src="https://images.pexels.com/photos/5089159/pexels-photo-5089159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Workshop" 
                  className="rounded-md shadow-lg w-full h-auto"
                />
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission */}
      <section className="section bg-neutral-100">
        <div className="container-narrow">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif mb-4">{t.about.mission}</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                {t.about.missionDesc}
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <FadeInSection key={value.id} delay={index * 100}>
                <div className="bg-white p-8 rounded-md shadow-sm border border-neutral-200 h-full">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                  <p className="text-neutral-600">{value.description}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="section bg-white">
        <div className="container-narrow">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif mb-4">{t.about.team}</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                {t.about.teamDesc}
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <FadeInSection key={member.id} delay={index * 100}>
                <div className="text-center">
                  <div className="mb-4 relative overflow-hidden rounded-md">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-auto aspect-square object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium">{member.name}</h3>
                  <p className="text-neutral-500">{member.role}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* Workshop */}
      <section className="section bg-neutral-900 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif mb-4">
                {language === 'pt' ? 'Nosso Ateliê' : 'Nuestro Taller'}
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                {language === 'pt' 
                  ? 'Visite nosso ateliê e conheça o lugar onde a magia acontece.' 
                  : 'Visite nuestro taller y conozca el lugar donde ocurre la magia.'}
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FadeInSection delay={100}>
              <img 
                src="https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Workshop 1" 
                className="w-full h-72 object-cover rounded-md"
              />
            </FadeInSection>
            <FadeInSection delay={200}>
              <img 
                src="https://images.pexels.com/photos/6231830/pexels-photo-6231830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Workshop 2" 
                className="w-full h-72 object-cover rounded-md"
              />
            </FadeInSection>
            <FadeInSection delay={300}>
              <img 
                src="https://images.pexels.com/photos/6195035/pexels-photo-6195035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Workshop 3" 
                className="w-full h-72 object-cover rounded-md"
              />
            </FadeInSection>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;