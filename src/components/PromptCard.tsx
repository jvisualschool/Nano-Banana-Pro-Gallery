import { motion } from 'framer-motion';
import { ExternalLink, Copy, Eye } from 'lucide-react';
import { Prompt } from '../types';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PromptCardProps {
  prompt: Prompt;
  onView: (prompt: Prompt) => void;
}

export function PromptCard({ prompt, onView }: PromptCardProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    if (url === 'Original' || url.trim() === '') return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      layout
    >
      {isValidImageUrl(prompt.imageUrl) && !imageError && (
        <div
          className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer"
          onClick={() => onView(prompt)}
        >
          <img
            src={prompt.imageUrl}
            alt={prompt.imageAlt || prompt.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      {(!isValidImageUrl(prompt.imageUrl) || imageError) && (
        <div
          className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer flex items-center justify-center"
          onClick={() => onView(prompt)}
        >
          <div className="text-center text-gray-400 dark:text-gray-600">
            <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('card.view')}</p>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {t(`prompt.${prompt.id.replace('.', '_')}.title`) || prompt.title}
          </h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 whitespace-nowrap flex-shrink-0">
            {prompt.id}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {t(`prompt.${prompt.id.replace('.', '_')}.description`) || prompt.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap no-print">
          <motion.button
            onClick={() => onView(prompt)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4" />
            {t('card.view')}
          </motion.button>

          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="w-4 h-4" />
            {copied ? t('card.copied') : t('card.copy')}
          </motion.button>

          {prompt.source?.url && (
            <a
              href={prompt.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {t('card.source')}
            </a>
          )}
        </div>

        {/* Print Only Info */}
        <div className="hidden print:block mt-6 pt-6 border-t border-gray-200 space-y-4 text-sm text-gray-800">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Prompt</h4>
            <div className="bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap font-mono text-[10px] leading-relaxed">
              {prompt.prompt}
            </div>
          </div>
          {prompt.source && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-1">Source</h4>
              <p className="text-primary-600 font-medium">{prompt.source.name}</p>
              <p className="text-[9px] text-gray-400 break-all">{prompt.source.url}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

