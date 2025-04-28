export type Project = {
  id: number;
  title: string;
  category: string; 
  image: string;
  featured?: boolean;
  description: {
    pt: string;
    es: string;
  };
};

export const projects: Project[] = [
  {
    id: 1,
    title: 'Villa Serena',
    category: 'living',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    featured: true,
    description: {
      pt: 'Sala de estar contemporânea com elementos em madeira nobre e detalhes em latão.',
      es: 'Sala de estar contemporánea con elementos en madera noble y detalles en latón.'
    }
  },
  {
    id: 2,
    title: 'Casa Moderna',
    category: 'dining',
    image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    featured: true,
    description: {
      pt: 'Mesa de jantar em madeira maciça com cadeiras estofadas em veludo azul.',
      es: 'Mesa de comedor en madera maciza con sillas tapizadas en terciopelo azul.'
    }
  },
  {
    id: 3,
    title: 'Loft Industrial',
    category: 'office',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: {
      pt: 'Escritório com estantes suspensas e mesa em madeira e metal.',
      es: 'Oficina con estanterías suspendidas y mesa en madera y metal.'
    }
  },
  {
    id: 4,
    title: 'Suite Master',
    category: 'bedroom',
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    featured: true,
    description: {
      pt: 'Quarto com cabeceira estofada e criados-mudos em madeira escura.',
      es: 'Dormitorio con cabecero tapizado y mesitas de noche en madera oscura.'
    }
  },
  {
    id: 5,
    title: 'Espaço Gourmet',
    category: 'dining',
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: {
      pt: 'Cozinha integrada com ilha central e banquetas altas.',
      es: 'Cocina integrada con isla central y taburetes altos.'
    }
  },
  {
    id: 6,
    title: 'Living Contemporâneo',
    category: 'living',
    image: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: {
      pt: 'Sala de estar com sofá em L e mesa de centro em mármore.',
      es: 'Sala de estar con sofá en L y mesa de centro en mármol.'
    }
  },
  {
    id: 7,
    title: 'Home Office',
    category: 'office',
    image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: {
      pt: 'Escritório em casa com estante integrada e mesa em madeira clara.',
      es: 'Oficina en casa con estantería integrada y mesa en madera clara.'
    }
  },
  {
    id: 8,
    title: 'Studio Moderno',
    category: 'bedroom',
    image: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: {
      pt: 'Quarto de solteiro com cama suspensa e escrivaninha integrada.',
      es: 'Dormitorio individual con cama suspendida y escritorio integrado.'
    }
  }
];