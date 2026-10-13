/**
 * Character Selection Screen
 * 
 * Displays 3 characters for the current language
 * Allows player to choose their preferred character
 */

import React, { useRef, useEffect, useState } from 'react';
import type { GameAction } from '../state/gameReducer.js';
import type { Language } from '../types.js';
import { 
  LANGUAGE_CHARACTERS, 
  CHARACTER_INFO, 
  getCharacterForLanguage,
  type CharacterInfo 
} from '../config/characterImages.js';
import { renderCharacterPrimitive } from '../character/CharacterRenderer.js';
import { setCharacter } from '../character/CharacterSelector.js';
import { createInitialCharacterState } from '../character/CharacterController.js';

interface CharacterSelectProps {
  language: string;
  dispatch: React.Dispatch<GameAction>;
}

export function CharacterSelect({ language, dispatch }: CharacterSelectProps) {
  const canvasRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const characterIds = LANGUAGE_CHARACTERS[language] || LANGUAGE_CHARACTERS['en'];
  const characters: CharacterInfo[] = characterIds.map(id => CHARACTER_INFO[id]);

  // Find current default character index
  useEffect(() => {
    const defaultId = getCharacterForLanguage(language);
    const index = characterIds.indexOf(defaultId);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [language, characterIds]);

  // Render character previews
  useEffect(() => {
    const renderPreviews = () => {
      canvasRefs.forEach((ref, index) => {
        const canvas = ref.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw character
        const characterState = createInitialCharacterState();
        characterState.language = language as Language;

        renderCharacterPrimitive(ctx, characterState, canvas.width / 2, canvas.height - 50, Date.now());

        // Draw selection highlight
        if (index === selectedIndex) {
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 3;
          ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
        }
      });
    };

    renderPreviews();
    const interval = setInterval(renderPreviews, 100);
    return () => clearInterval(interval);
  }, [selectedIndex, language]);

  // Keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1') setSelectedIndex(0);
      else if (e.key === '2') setSelectedIndex(1);
      else if (e.key === '3') setSelectedIndex(2);
      else if (e.key === 'ArrowLeft') {
        setSelectedIndex(prev => (prev - 1 + 3) % 3);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex(prev => (prev + 1) % 3);
      } else if (e.key === 'Enter' || e.key === ' ') {
        const selectedCharacterId = characterIds[selectedIndex];
        setCharacter(selectedCharacterId);
        dispatch({ type: 'SELECT_CHARACTER', characterId: selectedCharacterId });
      } else if (e.key === 'Escape') {
        dispatch({ type: 'BACK_TO_MENU' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIndex, characterIds, dispatch]);

  const handleCharacterClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    const selectedCharacterId = characterIds[selectedIndex];
    setCharacter(selectedCharacterId);
    dispatch({ type: 'SELECT_CHARACTER', characterId: selectedCharacterId });
  };

  return (
    <div className="character-select">
      <h1>Choose Your Character</h1>
      <p className="language-label">Language: {language.toUpperCase()}</p>
      
      {/* Phase 21: character-grid is a radiogroup with an aria-label so
         SR users get selection-group semantics. Each card is a real
         <button> with role="radio" + aria-checked so native Enter/Space
         activation fires (in addition to the existing window keydown for
         arrow keys / 1-3 shortcuts). */}
      <div
        className="character-grid"
        role="radiogroup"
        aria-label="Choose your character"
      >
        {characters.map((char, index) => (
          <button
            key={char.id}
            type="button"
            className={`character-card ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleCharacterClick(index)}
            role="radio"
            aria-checked={index === selectedIndex}
            aria-label={`${char.name}, style ${char.style}. Press ${index + 1} to select.`}
          >
            <canvas
              ref={canvasRefs[index]}
              width={200}
              height={200}
              className="character-preview"
              aria-hidden="true"
            />
            <h2>{char.name}</h2>
            <p className="character-description">{char.description}</p>
            <p className="character-style">Style: {char.style}</p>
            <div className="key-hint" aria-hidden="true">Press {index + 1}</div>
          </button>
        ))}
      </div>

      <div
        className="controls"
        aria-label="Keyboard shortcuts"
      >
        <p>
          <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> Select character
        </p>
        <p>
          <kbd>←</kbd> <kbd>→</kbd> Navigate
        </p>
        <p>
          <kbd>Enter</kbd> or <kbd>Space</kbd> Confirm
        </p>
        <p>
          <kbd>Esc</kbd> Back to menu
        </p>
      </div>

      <button
        onClick={handleConfirm}
        className="confirm-button"
        aria-label={`Confirm selection of ${characters[selectedIndex].name}`}
      >
        Select {characters[selectedIndex].name}
      </button>
    </div>
  );
}
