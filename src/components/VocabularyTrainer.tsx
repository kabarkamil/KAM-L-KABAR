import React, { useState } from 'react';
import {
  Search,
  Volume2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import { VocabularyWord } from '../types.js';
import { VOCABULARY_LIST } from '../data/vocabulary.js';
import { speakGerman } from '../utils/speech.js';

interface VocabularyTrainerProps {
  learnedWordIds: string[];
  onToggleLearned: (wordId: string) => void;
}

export const VocabularyTrainer: React.FC<VocabularyTrainerProps> = ({
  learnedWordIds,
  onToggleLearned,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  const categories = [
    'Hepsi',
    ...Array.from(new Set(VOCABULARY_LIST.map((w) => w.category))),
  ];

  const filteredWords = VOCABULARY_LIST.filter((w) => {
    const matchesCategory =
      selectedCategory === 'Hepsi' || w.category === selectedCategory;
    const matchesSearch =
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.turkishMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.plural && w.plural.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const learnedCount = VOCABULARY_LIST.filter((w) =>
    learnedWordIds.includes(w.id)
  ).length;

  const handlePlayAudio = (word: VocabularyWord) => {
    const textToSpeak = word.article
      ? `${word.article} ${word.word}`
      : word.word;
    setPlayingWordId(word.id);
    speakGerman(
      textToSpeak,
      0.85,
      () => setPlayingWordId(null),
      () => setPlayingWordId(null)
    );
  };

  const getArticleBadge = (article: VocabularyWord['article']) => {
    if (!article) return null;
    if (article === 'der') {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          der (Eril)
        </span>
      );
    }
    if (article === 'die') {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#800020]/15 text-[#800020] border border-red-200">
          die (Dişil)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        das (Nötr)
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner and Stats */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#800020]"></span>
              Goethe A1 Kelime Havuzu (Wortschatz)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Artikeller renk kodludur (der: mavi, die: bordo, das: yeşil). Kelimeleri dinleyin ve öğrendiklerinizi işaretleyin.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-red-50 text-[#800020] px-3.5 py-1.5 rounded-xl border border-red-100 text-xs font-bold self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-[#800020]" />
            <span>
              {learnedCount} / {VOCABULARY_LIST.length} Öğrenildi (%
              {Math.round((learnedCount / VOCABULARY_LIST.length) * 100)}
              )
            </span>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Almanca veya Türkçe kelime ara..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:border-[#800020] focus:ring-1 focus:ring-red-200 outline-none"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#800020] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredWords.map((item) => {
          const isLearned = learnedWordIds.includes(item.id);
          const isPlaying = playingWordId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-4 border transition-all space-y-3 shadow-2xs ${
                isLearned
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-stone-200 hover:border-[#800020]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getArticleBadge(item.article)}
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      {item.article ? `${item.article} ` : ''}
                      {item.word}
                    </h3>
                  </div>
                  {item.plural && (
                    <p className="text-xs text-stone-500 font-mono">
                      Çoğul: <span className="text-stone-700">{item.plural}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(item)}
                    className={`p-2 rounded-lg text-stone-600 hover:text-white hover:bg-[#800020] transition ${
                      isPlaying ? 'bg-[#800020] text-white animate-pulse' : 'bg-stone-100'
                    }`}
                    title="Almanca telaffuzu dinle"
                    aria-label={`${item.word} kelimesini seslendir`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleLearned(item.id)}
                    className={`p-2 rounded-lg text-xs font-semibold transition ${
                      isLearned
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-emerald-100 hover:text-emerald-800'
                    }`}
                    title={isLearned ? 'Öğrenildi olarak işaretlendi' : 'Öğrendim olarak işaretle'}
                    aria-label={`${item.word} kelimesini öğrenildi olarak işaretle`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Turkish Meaning */}
              <div className="text-sm font-semibold text-[#800020] bg-red-50/50 px-2.5 py-1.5 rounded-lg border border-red-100">
                🇹🇷 {item.turkishMeaning}
              </div>

              {/* Example Sentences */}
              <div className="text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200/80 space-y-1">
                <div className="text-stone-900 font-medium italic">
                  „{item.exampleGerman}“
                </div>
                <div className="text-stone-500">
                  {item.exampleTurkish}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                  {item.category}
                </span>
                <span>{isLearned ? '✓ Hafızada' : 'Henüz pekiştirilmedi'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
