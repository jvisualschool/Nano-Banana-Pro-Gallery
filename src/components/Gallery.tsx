import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prompt } from '../types';
import { PromptCard } from './PromptCard';
import { PromptModal } from './PromptModal';
import { CategoryFilter } from './CategoryFilter';
import { categories } from '../data/prompts';
import { useLanguage } from '../contexts/LanguageContext';

interface GalleryProps {
  prompts: Prompt[];
}

export function Gallery({ prompts }: GalleryProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = useMemo(() => {
    let result = selectedCategory === null 
      ? prompts 
      : prompts.filter((p) => p.categoryId === selectedCategory);
    
    // 카테고리 순서에 맞춰 정렬
    const categoryOrder = categories.map(cat => cat.id);
    result = [...result].sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.categoryId);
      const bIndex = categoryOrder.indexOf(b.categoryId);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      // 같은 카테고리 내에서는 ID 순서로 정렬
      return a.id.localeCompare(b.id);
    });
    
    return result;
  }, [prompts, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PromptCard prompt={prompt} onView={setSelectedPrompt} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('gallery.noResults')}</p>
        </div>
      )}

      <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
    </div>
  );
}

