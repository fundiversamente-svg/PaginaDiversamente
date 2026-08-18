export interface Program {
  id: string;
  title: string;
  category: 'Acompañamiento Familiar' | 'Terapia Individual' | 'Educación & Talleres' | 'Comunidad';
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string;
  targetAudience: string;
  format: 'Virtual' | 'Presencial' | 'Híbrido';
  duration: string;
  features: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  image: string;
  specialties: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Guía' | 'Herramientas' | 'Directorio' | 'Educación';
  description: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  featured: boolean;
}

export const PROGRAMS: Program[] = [
  {
    id: 'redes-de-apoyo',
    title: 'Redes de Apoyo Familiar',
    category: 'Acompañamiento Familiar',
    shortDescription: 'Grupos guiados por especialistas para compartir experiencias y construir herramientas conjuntas en un ambiente de total confianza.',
    fullDescription: 'Espacio seguro y confidencial donde padres, madres y cuidadores de personas neurodivergentes se encuentran para compartir vivencias, procesar emociones y construir estrategias comunitarias de crianza respetuosa.',
    icon: 'family_home',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0UoMgbm-L0B3fFm-nS_6cVmmOjbtSWe6hYQI3Q49E9TNd67GxcLDX1pJ_MCdRTxjLpgbMZ6plowwVV2lIMqhOCTYGkx8cLFyshdWD7snWaD9jed3ouhavSOk6wr_6CaWqPXeexD1fG54d7v6Q9PmXoZtin9Yq6uaLeTtuh9GPCOa7shCTHxYN6HAdtgP_5giZE2FVvxd1d-nXXFmE2jad4ZYgiQB_eZNuMcygJGQaanth7EJ51iSJhA',
    targetAudience: 'Padres, madres y cuidadores principales',
    format: 'Híbrido',
    duration: 'Sesiones quincenales de 90 min',
    features: [
      'Facilitación por psicólogos especializados en neurodiversidad',
      'Materiales de trabajo y guías de contención emocional',
      'Acceso a comunidad privada de apoyo por WhatsApp',
      'Sesiones grabadas y biblioteca de recursos familiares',
    ],
  },
  {
    id: 'terapia-individual',
    title: 'Terapia Individual y Orientación',
    category: 'Terapia Individual',
    shortDescription: 'Sesiones personalizadas enfocadas en el desarrollo de la autonomía y el bienestar emocional de Padres y Cuidadores.',
    fullDescription: 'Acompañamiento terapéutico uno a uno diseñado para abordar desafíos específicos en el manejo del estrés parental, aceptación diagnóstica y fortalecimiento de vínculos afectivos.',
    icon: 'psychiatry',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJ_feWV5fUxqWtviLwKlIJzcQG0etOZ8-uTViPJObjhPS7eLjXjgaF9YfV8SC_sipXGbykFAHQ3QkzHU8mNsYDW8ns6Kvl85gl139VIo83G6slmTANYPVSDsYHJKZdNk7ULUTxVQ8SKBZ55MyqXCWVOWFTMG_FJJmhK2NqAohoqDaV_VdMoHEWK2g97by1Nkd8sS4A7YNeBXwd_apExfq-VV_87U7bQcUiHeS1hbbYFGGeRqkpbRziQ',
    targetAudience: 'Adultos, jóvenes y cuidadores',
    format: 'Virtual',
    duration: 'Sesiones semanales de 50 min',
    features: [
      'Enfoque cognitivo-conductual y humanista adaptado',
      'Planes de intervención individualizados',
      'Flexibilidad de horarios diurnos y vespertinos',
      'Seguimiento mensual de metas de bienestar',
    ],
  },
  {
    id: 'talleres-educativos',
    title: 'Talleres Educativos y Capacitación',
    category: 'Educación & Talleres',
    shortDescription: 'Capacitaciones para profesionales e instituciones buscando fomentar la inclusión real y el proceso de duelo ante un diagnóstico.',
    fullDescription: 'Cursos y talleres formativos orientados a docentes, terapeutas y líderes organizacionales para crear entornos empáticos, accesibles e inclusivos basados en neurociencias aplicadas.',
    icon: 'school',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClnu3HXzz_MgBQNvfMBRzE-URVMwiiHUUJMCPQQkzV8xhTBdN_wXDww3-w6Y_OA9E81C2RZRNkSNK4y2EaT40070IOdv4IdbC93mgDhtLwxxUMpfhAcrFaQHirFozmEzmB5AUcaj9wFgPgZTuU3mqRl_OXyozjIcapdzHSQM_TDGEP_Cy7JOsdVmhv4lLLrdWBJLeJDdd-zO83ex8OlUfh6R5LF57OPKVCVQoOR3xngsKZ8wjhs7QYxA',
    targetAudience: 'Docentes, instituciones educativas y empresas',
    format: 'Presencial',
    duration: 'Módulos de 4 a 12 horas certificadas',
    features: [
      'Certificación institucional de asistencia y competencias',
      'Estrategias pedagógicas de diseño universal para el aprendizaje (DUA)',
      'Casos prácticos y dinámicas vivenciales',
      'Kit de herramientas descargable para el aula',
    ],
  },
  {
    id: 'coaching-familiar',
    title: 'Coaching Familiar y Parental',
    category: 'Acompañamiento Familiar',
    shortDescription: 'Sesiones de orientación personalizadas destinadas a fortalecer los lazos familiares y desarrollar estrategias colaborativas.',
    fullDescription: 'Programa práctico de acompañamiento centrado en soluciones para la convivencia diaria, estructuración de rutinas y fomento de la autonomía de personas neurodivergentes.',
    icon: 'family_star',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNkiVivC-BJEDIS5_LebPoMUechKRKR-VdLpBhvMMdIxblT7FySy7zG1Bohmmjs-23jnIgzdVC_JonaRl9ukLVfJya_Qm2FUnX2esA-KbgktEmWubOt6XmTGf5CZ5u6yuNyN4tJVH0zuwLRkp9GLisu-u6JN0e3qtKR1lFlRjbWaquPikTbNceYWttGr1WXrAOARjXShLCLUHq2bZJsVUWYCkk7V5CSiPzpr9ktpYMkU5RCNWiY8mxKg',
    targetAudience: 'Familias completas (padres, hermanos y abuelos)',
    format: 'Virtual',
    duration: 'Paquete de 6 sesiones estructuradas',
    features: [
      'Análisis de dinámicas y rutinas del hogar',
      'Estrategias sensoriales y de comunicación aumentativa',
      'Plan de acción familiar paso a paso',
      'Acompañamiento vía chat entre sesiones',
    ],
  },
  {
    id: 'grupos-comunitarios',
    title: 'Grupos Comunitarios de Encuentro',
    category: 'Comunidad',
    shortDescription: 'Círculos de apoyo entre pares que brindan un santuario seguro para compartir experiencias y sentido de pertenencia.',
    fullDescription: 'Encuentros mensuales recreativos, artísticos y reflexivos en espacios al aire libre para propiciar la socialización natural y el ocio inclusivo.',
    icon: 'groups',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs9JWr_zRvYyXnyTEV6z5mzg7dG6veg6ImK-xdms0EdMqGOIjvgWUE56fw9gN-zBmfYnYv3EckCwDL5tL1GHmZ3eDuHhHsiDeD6OLOk1JjVG255bnXOm1Tfa-cw5HQn_ZHKBPH1_Z8uzXZ13ZLy-mJKLDxhWx1Gpm4vgy37xrkhzBsUCOT6mDn_WYniKnQQi5p3oG855kP8V62JCdoWnp8MXGJ95Ou7paANOj0mWLSAHQUo8RcXvopqA',
    targetAudience: 'Comunidad en general y personas neurodivergentes',
    format: 'Presencial',
    duration: 'Sábados cada mes (3 horas)',
    features: [
      'Espacios accesibles y libres de sobrecarga sensorial',
      'Actividades artísticas, música y senderismo adaptado',
      'Ambiente libre de juicios y 100% acogedor',
      'Participación gratuita o con aporte voluntario',
    ],
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Elena Silva',
    role: 'Fundadora y Terapeuta Principal',
    credentials: 'MSc. Psicología Clínica Infantil - Especialista en Neurodesarrollo',
    bio: 'Con más de 14 años de experiencia acompañando a familias atípicas, Elena fundó Diversamente tras vivenciar la necesidad de una comunidad cálida, profesional y desprovista de estigmas.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1hKfIJcVsliwR_JY6eiYkJOKqQ_cnnibzuWt9EMQa-7nAi9-fqR3vx6ewpMc8A1XdmqsC5_PClQ8JsXgmPgIj7fzVwxyGtwfoQQnPmTUlTZ5OQju0xwa2rkuYneIAywugm7RVFkk8Gela9enXFjSU-X-spGekfaYYqwGGbJB_RWGbLxQk0nMqYfEuNaNGNtOq9VZc9yn0kKEIqBV8s_jmU2uzwq1HNb-DAqbqvnQXnA40OBx0vqC5-A',
    specialties: ['Acompañamiento en Duelo de Diagnóstico', 'Regulación Emocional', 'Crianza Neuroafirmativa'],
  },
  {
    name: 'David Chen',
    role: 'Director Comunitario',
    credentials: 'Trabajador Social y Mediador Comunitario',
    bio: 'Dedicado a articular redes solidarias y alianzas con instituciones educativas para derribar barreras de accesibilidad y garantizar que ninguna familia camine sola.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAumaX620_JGlDhA_iyWMS3agZZ0BbwVID10M63e8nhcYZvc3iocs6q1B8hO3tNzM5ytVaFx2ZRp2YD1WmdDpnupjo6VLZ7NV-uxyV8FjmCWm2dPC4ZGB3WgqBcIdiRqfzzj6NB2J85WzJNIEbK22SG1HeDXT42-JP9Zaw6ya3QCBijD2CdZ9xa21oGRR47oTQ7LBk7SiXFsh-urfmjQHubZUMUi8qvmw-IDH-FNqNaeTwaeXn4lU-VCA',
    specialties: ['Facilitación de Grupos', 'Inclusión Social', 'Gestión de Redes de Apoyo'],
  },
  {
    name: 'María Torres',
    role: 'Enlace Familiar y Pedagoga',
    credentials: 'Lic. en Educación Especial - Terapeuta Ocupacional',
    bio: 'Apasionada por crear puentes de comunicación asertiva entre el hogar, el colegio y los terapeutas, diseñando adaptaciones sensoriales personalizadas.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzOhBiAemWSfL_Ch6-QJlIxNkZOJCQICH5LFydMHG-kqh7jPBeg-yR9xq-dc6GXRitg5X_BZaXySEW2Y8CCUfR3JhR5SDHEiG_QB3F_CkTUakwuAJXFoD6GYCSdwIGSIbxOu7HqfGDGmNajF-uWN0fKPkUZ2wCkvyLB10gJzx3NxLgXYV6rAaCv9a09q8kJHiQl0bjxl63i8PkNvhKbSAhdNP4Kl8is6Xz0377EQs7UiSbinbB7Uowfw',
    specialties: ['Integración Sensorial', 'Adaptación Curricular', 'Autonomía en el Hogar'],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Familia Martínez Gómez',
    role: 'Participantes de Redes de Apoyo',
    content: 'Encontrar este espacio cambió la dinámica de nuestra casa. Nos sentimos escuchados, comprendidos y, sobre todo, dejamos de sentirnos solos. El abordaje humano y profesional nos dio la paz que necesitábamos para avanzar juntos.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOKtbcAm0nPeRnuwoJEFY8L_ufx9JUlQ4vwpxgfbbGUBPtIQRfXEghGZ_P0k7a4H5SrqNWGpJ_ZNRslMrhnpSYM9XobtrLxdOHQ4jL73Vv3G7NUJBjek3hfmoehDXb9mv9Ydf7JbMQCrH6r8PyecUFCVeuWSZSWPFJianuuDqWb9scc_UDpONL_cQLoQ1vLKBIa5avLXlFHL4sh5Fqy1Hin7ikNB8lC7d2CWU_KRUJAtYNIIJM1yFpOg',
    rating: 5,
  },
  {
    id: '2',
    author: 'Carlos y Valeria',
    role: 'Padres de Mateo (6 años)',
    content: 'Cuando recibimos el diagnóstico estábamos llenos de miedos e incertidumbres. En Diversamente no solo encontramos orientación técnica de primer nivel, sino una familia extendida que nos enseñó a celebrar cada logro a su propio ritmo.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    id: '3',
    author: 'Lic. Claudia Restrepo',
    role: 'Docente de Primaria - Colegio San Gabriel',
    content: 'Los talleres de capacitación que brindó el equipo de Diversamente en nuestra institución transformaron nuestra mirada hacia el aula. Hoy contamos con herramientas reales para brindar una educación verdaderamente inclusiva.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
];

export const RESOURCES_LIST: ResourceItem[] = [
  {
    id: 'guia-primeras-senales',
    title: 'Comprendiendo las Primeras Señales',
    category: 'Guía',
    description: 'Una guía completa para que los padres reconozcan los marcadores tempranos del desarrollo neurodivergente y sepan cuándo buscar asesoramiento profesional respetuoso.',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    downloadUrl: '/resources/guia-primeras-senales.pdf',
    featured: true,
  },
  {
    id: 'herramientas-apoyo-diario',
    title: 'Estrategias de Apoyo Diario en el Hogar',
    category: 'Herramientas',
    description: 'Pasos prácticos y viables para estructurar rutinas visuales, espacios de descompresión sensorial y regulación emocional familiar.',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    downloadUrl: '/resources/estrategias-apoyo-diario.pdf',
    featured: true,
  },
  {
    id: 'directorio-especialistas',
    title: 'Red de Especialistas y Terapeutas Locales',
    category: 'Directorio',
    description: 'Directorio verificado de terapeutas ocupacionales, fonoaudiólogos, neurólogos infantiles y centros de apoyo en Colombia.',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    downloadUrl: '/resources/directorio-especialistas.pdf',
    featured: true,
  },
  {
    id: 'guia-aulas-inclusivas',
    title: 'Guía Pedagógica: Creando Aulas Inclusivas',
    category: 'Educación',
    description: 'Estrategias basadas en Diseño Universal para el Aprendizaje (DUA) dirigidas a directivos docentes y profesores de educación básica.',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    downloadUrl: '/resources/guia-aulas-inclusivas.pdf',
    featured: false,
  },
  {
    id: 'kit-derechos-salud',
    title: 'Cartilla de Derechos en Salud y Educación Inclusiva',
    category: 'Guía',
    description: 'Conoce los marcos legales, rutas de atención en el sistema de salud (EPS/IPS) y tutelas para garantizar los apoyos terapéuticos necesarios.',
    fileType: 'PDF',
    fileSize: '2.0 MB',
    downloadUrl: '/resources/cartilla-derechos.pdf',
    featured: false,
  },
];

export const IMPACT_STATS = [
  { value: '+450', label: 'Familias acompañadas', description: 'En procesos terapéuticos y redes comunitarias' },
  { value: '1,200+', label: 'Horas de orientación', description: 'Brindadas con calidez y enfoque neuroafirmativo' },
  { value: '35+', label: 'Talleres educativos', description: 'En colegios, universidades y empresas' },
  { value: '98%', label: 'Satisfacción y alivio', description: 'Reportado por las familias en su primera etapa' },
];
