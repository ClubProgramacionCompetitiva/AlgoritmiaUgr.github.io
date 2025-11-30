import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import MobileMenu from './MobileMenu';

const Aprende = ({ isMobileMenuOpen, onMobileMenuClose }) => {
  // Selector de modo: 'libre' | 'apuntes' | null
  const [learningMode, setLearningMode] = useState(null);

  // Contenido dinámico desde la API
  const [dynamicContents, setDynamicContents] = useState([]);
  const [sectionDescriptions, setSectionDescriptions] = useState({});
  const [sectionsMap, setSectionsMap] = useState({});
  const [aprendeIntroduction, setAprendeIntroduction] = useState('');

  // Contenido seleccionado: null hasta que el usuario elige algo en la sidebar
  const [selectedContent, setSelectedContent] = useState(null);
  // Estado de colapsables para secciones
  const [expanded, setExpanded] = useState({});
  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  // Cargar contenidos dinámicos al montar
  useEffect(() => {
    loadContents();
    loadSections();
    loadSectionDescriptions();
    loadAprendeIntroduction();
  }, []);

  const loadSections = async () => {
    try {
      const response = await fetch('/api/sections');
      const data = await response.json();
      
      if (data.success) {
        setSectionsMap(data.sections);
        
        // Inicializar estado de expanded para todas las secciones
        const initialExpanded = {};
        Object.entries(data.sections).forEach(([category, sections]) => {
          sections.forEach(section => {
            const sectionName = typeof section === 'string' ? section : section.name;
            const key = `${category}:${sectionName}`;
            initialExpanded[key] = false;
          });
        });
        setExpanded(initialExpanded);
      }
    } catch (error) {
      console.error('Error cargando secciones:', error);
    }
  };

  const loadAprendeIntroduction = async () => {
    try {
      const response = await fetch('/api/aprende/introduction');
      const data = await response.json();
      
      if (data.success && data.introduction) {
        setAprendeIntroduction(data.introduction);
      }
    } catch (error) {
      console.error('Error cargando introducción de aprende:', error);
    }
  };

  const loadSectionDescriptions = async () => {
    try {
      const response = await fetch('/api/sections/descriptions');
      const data = await response.json();
      
      if (data.success) {
        // Convertir array a objeto para fácil acceso
        const descriptionsMap = {};
        data.data.forEach(desc => {
          const key = `${desc.category}:${desc.section}`;
          descriptionsMap[key] = desc.description;
        });
        setSectionDescriptions(descriptionsMap);
      }
    } catch (error) {
      console.error('Error cargando descripciones:', error);
    }
  };

  const loadContents = async () => {
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      
      if (data.success) {
        const normalized = (data.data || []).map((item, index) => ({
          ...item,
          order: typeof item.order === 'number' ? item.order : index,
        }));

        setDynamicContents(normalized);
      }
    } catch (error) {
      console.error('Error cargando contenidos:', error);
    }
  };

  // Filtrar contenidos por categoría y sección
  const getContentsBySection = (category, section) => {
    const normalizedCategory = category || 'Aprendizaje Libre';

    return dynamicContents
      .filter(
        (content) => (content.category || 'Aprendizaje Libre') === normalizedCategory && content.section === section
      )
      .slice()
      .sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  };

  // Obtener descripción de una sección desde la base de datos
  const getSectionDescription = (category, section) => {
    const key = `${category}:${section}`;
    return sectionDescriptions[key] || '';
  };

  const isActive = (key) => selectedContent === key;
  const itemBtnClass = (active) =>
    `appearance-none border-0 block w-full text-xs font-semibold uppercase tracking-wider rounded-md px-3 py-2 transition-colors ${
      active
        ? 'bg-gradient-to-r from-warm-orange via-warm-pink to-warm-red text-white shadow'
        : 'bg-transparent text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10'
    }`;

  const renderSectionExplorer = () => {
    if (!learningMode) return null;

    const category = learningMode === 'libre' ? 'Aprendizaje Libre' : 'Universitario';

    return (sectionsMap[category] || [])
      .slice()
      .sort((a, b) => {
        const orderA = typeof a === 'object' ? a.order ?? 0 : 0;
        const orderB = typeof b === 'object' ? b.order ?? 0 : 0;
        return orderA - orderB;
      })
      .map((section) => {
        const sectionName = typeof section === 'string' ? section : section.name;
        const subsections = typeof section === 'object' ? section.subsections || [] : [];
        const sectionKey = `${category}:${sectionName}`;

        return (
          <div key={sectionName}>
            <button
              type="button"
              onClick={() => {
                toggle(sectionKey);
                setSelectedContent(sectionKey);
              }}
              className={`${itemBtnClass(isActive(sectionKey))} flex items-center justify-between`}
              aria-expanded={!!expanded[sectionKey]}
              aria-current={isActive(sectionKey) ? 'page' : undefined}
            >
              <span>{sectionName.toUpperCase()}</span>
              <span className="ml-2">{expanded[sectionKey] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
            </button>
            {expanded[sectionKey] && (
              <div className="mt-1 pl-3 space-y-1">
                {subsections.length > 0 && subsections.map((subsection) => {
                  const subsectionContents = getContentsBySection(category, sectionName).filter(
                    (c) => c.subsection === subsection
                  );

                  const subsectionKey = `${sectionKey}:${subsection}`;

                  return (
                    <div key={subsection} className="mb-2">
                      <button
                        type="button"
                        onClick={() => toggle(subsectionKey)}
                        className={`w-full flex items-center justify-between text-xs px-2 py-1 rounded-md transition-colors bg-transparent border-0 ${
                          expanded[subsectionKey]
                            ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white font-semibold'
                            : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        <span>{subsection}</span>
                        <span className="ml-1">{expanded[subsectionKey] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
                      </button>
                      {expanded[subsectionKey] && (
                        <div className="mt-1 pl-3 space-y-1">
                          {subsectionContents.length > 0 ? (
                            subsectionContents.map((content) => (
                              <button
                                key={content.id}
                                type="button"
                                onClick={() => setSelectedContent(`content-${content.id}`)}
                                className={`w-full text-left text-xs px-2 py-1 rounded-md transition-colors bg-transparent border-0 ${
                                  isActive(`content-${content.id}`)
                                    ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                                    : 'text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10'
                                }`}
                              >
                                {content.title}
                              </button>
                            ))
                          ) : (
                            <p className="text-xs text-black/60 dark:text-white/60 italic">
                              Aún no hay contenidos en esta subsección.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {getContentsBySection(category, sectionName)
                  .filter((c) => !c.subsection || subsections.length === 0)
                  .map((content) => (
                    <button
                      key={content.id}
                      type="button"
                      onClick={() => setSelectedContent(`content-${content.id}`)}
                      className={`w-full text-left text-xs px-2 py-1 rounded-md transition-colors bg-transparent border-0 ${
                        isActive(`content-${content.id}`)
                          ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                          : 'text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      {content.title}
                    </button>
                  ))}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="w-full">
      {/* Mobile Navigation Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={onMobileMenuClose}
      />

      {/* Sidebar fija bajo el header: solo tras elegir modo */}
      {learningMode && (
        <aside className="hidden lg:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-700 px-4 py-5 overflow-y-auto bg-transparent z-20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white mb-4 text-center">Secciones</h2>
          {learningMode === 'libre' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedContent('introduccion');
                  setTimeout(() => {
                    const el = document.getElementById('que-es');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className={`${itemBtnClass(isActive('introduccion'))} text-sm text-center`}
                aria-current={isActive('introduccion') ? 'page' : undefined}
              >
                Introducción
              </button>
            </div>
          )}
          <div className="space-y-2">{renderSectionExplorer()}</div>
        </aside>
      )}

      {/* Contenido principal (margina según sidebar) */}
      <div className={learningMode ? 'lg:ml-64' : undefined}>
        <div className={learningMode ? 'px-4 sm:px-6 lg:pl-[76px] lg:pr-10 py-10' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10'}>
          {learningMode && (
            <div className="lg:hidden mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-black dark:text-white mb-3">Explora las secciones</h2>
              {learningMode === 'libre' && (
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedContent('introduccion');
                      setTimeout(() => {
                        const el = document.getElementById('que-es');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 50);
                    }}
                    className={`${itemBtnClass(isActive('introduccion'))} text-sm text-center`}
                    aria-current={isActive('introduccion') ? 'page' : undefined}
                  >
                    Introducción
                  </button>
                </div>
              )}
              <div className="space-y-2">{renderSectionExplorer()}</div>
            </div>
          )}

          {!learningMode && (
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black dark:text-white mb-5 bg-gradient-to-r from-warm-orange via-warm-pink to-warm-red bg-clip-text text-transparent">Aprende</h1>
              <p className="text-lg sm:text-xl text-black/70 dark:text-white/70 max-w-3xl mx-auto leading-relaxed mb-6">Primeros pasos y conceptos básicos de programación competitiva.</p>
              <div className="flex justify-center mb-10"><div className="w-28 h-[3px] bg-gradient-to-r from-warm-orange via-warm-pink to-warm-red rounded-full"></div></div>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-center text-xl sm:text-2xl text-black dark:text-white font-light mb-6">Elige cómo quieres aprender</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <button onClick={() => setLearningMode('libre')} className="group relative overflow-hidden text-left rounded-2xl p-6 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-black/15 dark:border-white/10 ring-1 ring-black/10 dark:ring-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-orange/40">
                    <div className="text-base font-medium text-black dark:text-white mb-1">Aprendizaje libre</div>
                    <p className="text-sm text-black/70 dark:text-white/70">Ruta autodidacta para aprender por afán: desde lo más básico a técnicas avanzadas.</p>
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"><div className="absolute -inset-x-6 -top-8 h-16 bg-gradient-to-b from-white/40 to-transparent dark:from-white/10 blur-xl" /></div>
                  </button>
                  <button onClick={() => setLearningMode('apuntes')} className="group relative overflow-hidden text-left rounded-2xl p-6 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-black/15 dark:border-white/10 ring-1 ring-black/10 dark:ring-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-orange/40">
                    <div className="text-base font-medium text-black dark:text-white mb-1">Apuntes universitarios</div>
                    <p className="text-sm text-black/70 dark:text-white/70">Preparación de ED y Algorítmica con contenidos enfocados a asignaturas.</p>
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"><div className="absolute -inset-x-6 -top-8 h-16 bg-gradient-to-b from-white/40 to-transparent dark:from-white/10 blur-xl" /></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {learningMode && !selectedContent && (
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black dark:text-white mb-4 bg-gradient-to-r from-warm-orange via-warm-pink to-warm-red bg-clip-text text-transparent">Aprende</h1>
              <p className="text-lg sm:text-xl text-black/70 dark:text-white/70 leading-relaxed mb-2">Primeros pasos y conceptos básicos de programación competitiva.</p>
              <p className="text-base text-black/70 dark:text-white/70">
                {learningMode === 'libre'
                  ? 'Ruta autodidacta y práctica para avanzar a tu ritmo: empieza por la introducción y continúa con estructuras y algoritmos esenciales.'
                  : 'Apuntes organizados por bloques de la asignatura: Estructuras de Datos y Algorítmica, con enfoque académico y resúmenes claros.'}
              </p>
            </div>
          )}

          {learningMode === 'libre' && selectedContent === 'introduccion' && (
            <article>
              <header className="mb-6">
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-1">Introducción a la Programación Competitiva</h2>
              </header>
              {aprendeIntroduction ? (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {aprendeIntroduction}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-black/60 dark:text-white/60">
                  <p>No hay introducción configurada aún.</p>
                </div>
              )}
            </article>
          )}

          {/* Renderizar contenido dinámico de la base de datos */}
          {learningMode && selectedContent && selectedContent.startsWith('content-') && (() => {
            const contentId = selectedContent.replace('content-', '');
            const content = dynamicContents.find(c => c.id === contentId);
            if (!content) return null;
            
            return (
              <article>
                <header className="mb-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {content.category ? (
                        <span className="px-2 py-1 border border-red-500/20 text-red-500 text-xs font-light">
                          {content.category}
                        </span>
                      ) : null}
                      <span className="px-2 py-1 border border-black/10 dark:border-pure-white/10 text-black/60 dark:text-pure-white/60 text-xs font-light">
                        {content.section}
                      </span>
                    </div>
                    {content.pdfAttachment?.url && (
                      <a
                        href={content.pdfAttachment.url}
                        download={content.pdfAttachment.name || `${content.title || 'contenido'}.pdf`}
                        className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 dark:border-pure-white/10 bg-pure-white/80 dark:bg-white/10 px-3 py-1.5 text-xs font-medium text-black/80 dark:text-pure-white/80 transition-colors hover:border-red-500 dark:hover:border-red-400 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                        <span>Descargar PDF</span>
                      </a>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold text-black dark:text-white mb-1">{content.title}</h2>
                </header>
                <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-light prose-p:font-light prose-li:font-light prose-code:font-mono">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {content.content}
                  </ReactMarkdown>
                </div>
              </article>
            );
          })()}

          {/* Descripciones de secciones dinámicas desde la base de datos */}
          {learningMode && selectedContent && selectedContent !== 'introduccion' && !selectedContent.startsWith('content-') && (() => {
            // selectedContent ahora es del formato "category:section"
            const parts = selectedContent.split(':');
            if (parts.length < 2) return null;
            
            const category = parts[0];
            const sectionName = parts[1];
            
            const description = getSectionDescription(category, sectionName);
            
            if (!description) return (
              <article>
                <header className="mb-6">
                  <h2 className="text-2xl font-semibold text-black dark:text-white mb-1">{sectionName}</h2>
                  <p className="text-sm text-black/60 dark:text-white/60 italic">
                    No hay descripción para esta sección aún.
                  </p>
                </header>
              </article>
            );
            
            return (
              <article>
                <header className="mb-6">
                  <h2 className="text-2xl font-semibold text-black dark:text-white mb-1">{sectionName}</h2>
                </header>
                <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-light prose-p:font-light prose-li:font-light">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {description}
                  </ReactMarkdown>
                </div>
              </article>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Aprende;