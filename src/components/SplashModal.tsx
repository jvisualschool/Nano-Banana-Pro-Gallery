import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Code2, User } from 'lucide-react';

interface SplashModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SplashModal({ isOpen, onClose }: SplashModalProps) {


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Section - 16:9 */}
                        <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-800">
                            <img
                                src="/BANANA/splash.jpg"
                                alt="Awesome Nano Banana Pro Gallery"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <h2 className="text-2xl font-bold text-white">
                                    Awesome Nano Banana Pro Gallery
                                </h2>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tech Stack */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary-500 font-semibold">
                                        <Code2 className="w-5 h-5" />
                                        <span>Tech Stack</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'].map((tech) => (
                                            <span key={tech} className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Creator */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary-500 font-semibold">
                                        <User className="w-5 h-5" />
                                        <span>Creator</span>
                                    </div>
                                    <a
                                        href="https://jvibeschool.org"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-1"
                                    >
                                        Jinho Jung <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            {/* Source Link */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <a
                                    href="https://github.com/ZeroLu/awesome-nanobanana-pro"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all group"
                                >
                                    <Github className="w-5 h-5" />
                                    <span>Original README.md (ZeroLu)</span>
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
