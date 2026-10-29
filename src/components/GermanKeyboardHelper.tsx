import React from 'react';

interface GermanKeyboardHelperProps {
  onInsertChar: (char: string) => void;
  className?: string;
}

export const GermanKeyboardHelper: React.FC<GermanKeyboardHelperProps> = ({
  onInsertChar,
  className = '',
}) => {
  const chars = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      <span className="text-[11px] text-stone-500 font-medium mr-0.5">
        Almanca Karakterler:
      </span>
      {chars.map((char) => (
        <button
          key={char}
          type="button"
          onClick={() => onInsertChar(char)}
          className="w-7 h-7 bg-stone-100 hover:bg-[#800020] hover:text-white text-stone-800 rounded font-semibold text-xs border border-stone-300 transition-colors shadow-2xs active:scale-95 flex items-center justify-center"
          title={`'${char}' karakterini ekle`}
        >
          {char}
        </button>
      ))}
    </div>
  );
};
