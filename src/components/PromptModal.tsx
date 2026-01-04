import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, ExternalLink } from 'lucide-react';
import { Prompt } from '../types';
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface PromptModalProps {
  prompt: Prompt | null;
  onClose: () => void;
}

export function PromptModal({ prompt, onClose }: PromptModalProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!prompt) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [prompt, onClose]);

  if (!prompt) return null;

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-row"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Column - Image */}
          <div className="flex-shrink-0 w-1/2 bg-gray-100 dark:bg-gray-800 flex items-center justify-center min-h-[400px]">
            {isValidImageUrl(prompt.imageUrl) && !imageError ? (
              <img
                src={prompt.imageUrl}
                alt={prompt.imageAlt || prompt.title}
                className="w-full h-full object-contain max-h-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">{t('card.view')}</p>
                <p className="text-xs mt-1 opacity-75">이미지를 사용할 수 없습니다</p>
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t(`prompt.${prompt.id.replace('.', '_')}.title`) || prompt.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{t(`prompt.${prompt.id.replace('.', '_')}.description`) || prompt.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                  {prompt.category}
                </span>
                {prompt.source && (
                  <a
                    href={prompt.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {prompt.source.name}
                  </a>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('modal.prompt')}</h3>
                  <motion.button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? t('card.copied') : t('modal.copyPrompt')}
                  </motion.button>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                  <SyntaxHighlighter
                    language={prompt.promptType === 'json' ? 'json' : 'text'}
                    style={theme === 'dark' ? vscDarkPlus : oneLight}
                    wrapLongLines={true}
                    codeTagProps={{
                      style: {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }
                    }}
                    customStyle={{
                      margin: 0,
                      padding: '1.25rem',
                      fontSize: '0.925rem',
                      lineHeight: '1.7',
                      minHeight: '400px',
                      maxWidth: '100%',
                      overflowX: 'hidden',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {prompt.prompt}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

