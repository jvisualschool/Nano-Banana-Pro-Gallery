import { motion } from 'framer-motion';
import { Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category.id
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: category.id * 0.05 }}
        >
          {t(`category.${category.id}`) || category.name}
        </motion.button>
      ))}
      <motion.button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === null
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('category.all')}
      </motion.button>
    </div>
  );
}

