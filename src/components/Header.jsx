import { Github } from 'lucide-react';
import { useRouter } from 'next/router';
import { memo, useMemo } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { prefixPath } from '../utils/basePath';

const Header = memo(() => {
  const router = useRouter();
  const { mounted } = useTheme();
  
  // Optimización: memoizar navItems para evitar recreación en cada render
  const navItems = useMemo(() => [
    { label: 'Aprende', path: '/aprende' },
    { label: 'Compite', path: '/compite' },
    { label: 'Comparte', path: '/comparte' },
  ], []);

  // Handler para navegar al home al hacer click en el logo
  const handleLogoClick = () => {
    router.push('/');
  };

  // Renderizamos siempre la cabecera para evitar diferencias SSR/CSR

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/5 dark:bg-pure-black/20 backdrop-blur-sm">
      <div className="w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo and Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            {/* Logo */}
            <div className="w-16 h-16 flex-shrink-0" suppressHydrationWarning>
              {/* Logo para modo claro */}
              <img 
                src={prefixPath('/imagenes/logo_claro.svg')} 
                alt="CPC UGR Logo" 
                className="w-full h-full block dark:hidden"
              />
              {/* Logo para modo oscuro */}
              <img 
                src={prefixPath('/imagenes/logo_oscuro.svg')} 
                alt="CPC UGR Logo" 
                className="w-full h-full hidden dark:block"
              />
            </div>
            {/* Brand Text */}
            <div className="text-lg font-light text-black dark:text-pure-white">
              CPC UGR
            </div>
          </div>

          {/* Right side: Navigation + GitHub + Theme Toggle */}
          <div className="flex items-center space-x-8">
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={prefixPath(item.path)}
                  className={`text-sm font-light transition-colors duration-200 ${
                    router.pathname === item.path
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-700 dark:text-pure-white hover:text-red-500 dark:hover:text-red-400'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* GitHub Link */}
            <a
              href={prefixPath('/aboutus')}
              className="p-2 text-gray-600 dark:text-pure-white hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Ver información GitHub del CPC UGR"
            >
              <Github className="h-5 w-5" />
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header; 