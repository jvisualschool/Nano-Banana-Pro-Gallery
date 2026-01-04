import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { StarfieldBackground } from './StarfieldBackground';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative py-12 md:py-16 flex flex-col items-center justify-center overflow-hidden">
      {/* Starfield background */}
      <StarfieldBackground />

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-50/50 dark:to-gray-900/50 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t('hero.subtitle')}</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-4xl mr-2">🍌</span>
            {t('hero.title')}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-light">
            {t('hero.description')}
          </p>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-8"
          >
            <ArrowDown className="w-6 h-6 text-gray-400 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

