import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        src="/videos/hero-background.mp4"
        autoPlay
        loop
        muted
      />

      {/* Layered Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      <div className="absolute inset-0 bg-gradient-radial from-black/60 via-transparent to-black/80"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-8">
        <motion.h1
          className="text-5xl md:text-7xl font-serif leading-tight mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Transforme sua <span className="text-accent">Visão</span> <br />
          em Realidade
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-neutral-300 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Projetos personalizados com design sofisticado e execução artesanal.
        </motion.p>

        {/* Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#process"
            className="inline-block px-8 py-4 text-lg font-medium text-white bg-accent rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
          >
            Descubra Mais
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;