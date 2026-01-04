import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle language"
    >
      <span className="flex items-center gap-1">
        <span className={language === 'ko' ? 'font-bold' : 'opacity-50'}>한</span>
        <span className="text-gray-400">|</span>
        <span className={language === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
      </span>
    </motion.button>
  );
}

