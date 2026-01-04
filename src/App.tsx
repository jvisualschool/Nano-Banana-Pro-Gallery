import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { prompts } from './data/prompts';
import { useLanguage } from './contexts/LanguageContext';
import { motion } from 'framer-motion';

import { useState } from 'react';
import { SplashModal } from './components/SplashModal';

function AppContent() {
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header onOpenSplash={() => setShowSplash(true)} />
      <Hero />
      <Gallery prompts={prompts} />

      <SplashModal isOpen={showSplash} onClose={() => setShowSplash(false)} />

      {/* Try Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="https://www.nanobananaproprompts.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/50"
          >
            {t('hero.tryButton')}
          </a>
        </motion.div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              {t('footer.madeWith')}
            </p>
            <p className="text-sm">
              {t('footer.lastUpdated')}: 2025.12.19 |
              <a
                href="https://github.com/ZeroLu/awesome-nanobanana-pro"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-primary-500 hover:underline"
              >
                {t('footer.viewOnGitHub')}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

