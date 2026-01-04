import { motion } from 'framer-motion';
import { Sparkles, FileDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onOpenSplash: () => void;
}

export function Header({ onOpenSplash }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center gap-2 cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onOpenSplash}
          >
            <Sparkles className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
          </motion.div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={t('nav.print')}
            >
              <FileDown className="w-5 h-5" />
              <span className="sr-only">
                {t('nav.print')}
              </span>
            </button>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

