/**
 * Character Selection Screen
 *
 * Displays 3 characters for the current language
 * Allows player to choose their preferred character
 */

import React, { useRef, useEffect, useState } from 'react';
import type { GameAction } from '../state/gameReducer.js';
import {
  LANGUAGE_CHARACTERS,
  CHARACTER_INFO,
  CHARACTER_IMAGES,
  getCharacterForLanguage,
  type CharacterInfo
} from '../config/characterImages.js';
import { ImageLoader } from '../sprites/ImageLoader.js';
import { setCharacter } from '../character/CharacterSelector.js';

interface CharacterSelectProps {
  language: string;
  dispatch: React.Dispatch<GameAction>;
}

export function CharacterSelect({ language, dispatch }: CharacterSelectProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const characterIds = LANGUAGE_CHARACTERS[language] || LANGUAGE_CHARACTERS['en'];
  const characters: CharacterInfo[] = characterIds.map(id => CHARACTER_INFO[id]);

  // Phase 37: ref array so arrow-key navigation can move DOM focus alongside
  // the visual highlight. Mirrors the Phase 29 Menu + Phase 36 ProfileSelector
  // avatar radiogroup pattern: each card mounts a ref-setter via
  // `setCardRef` so the keyboard handler can call .focus() on the new cell
  // as well as setSelectedIndex. Without this, the state moved but DOM
  // focus stayed put — SR users would hear the aria-checked flip but the
  // focused element was the same card.
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Find current default character index
  useEffect(() => {
    const defaultId = getCharacterForLanguage(language);
    const index = characterIds.indexOf(defaultId);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [language, characterIds]);

  // Load character images
  useEffect(() => {
    const loadImages = async () => {
      const imagesToLoad = characterIds.map(id => {
        const imageSet = CHARACTER_IMAGES[id];
        return imageSet?.idle;
      }).filter(Boolean);

      try {
        await ImageLoader.preload(imagesToLoad as any[]);
        setImagesLoaded(true);
      } catch (err) {
        console.error('Failed to load character images:', err);
        setImagesLoaded(false);
      }
    };

    loadImages();
  }, [characterIds]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1') {
        setSelectedIndex(0);
        // Phase 37: move DOM focus to the first card so SR users follow
        // the 1-key shortcut visually.
        cardRefs.current[0]?.focus();
      } else if (e.key === '2') {
        setSelectedIndex(1);
        cardRefs.current[1]?.focus();
      } else if (e.key === '3') {
        setSelectedIndex(2);
        cardRefs.current[2]?.focus();
      } else if (e.key === 'ArrowLeft') {
        // Phase 37: wrap-around + DOM focus move. Previously state moved
        // but the same card stayed focused. Focus now follows the state.
        const next = (selectedIndex - 1 + 3) % 3;
        setSelectedIndex(next);
        cardRefs.current[next]?.focus();
      } else if (e.key === 'ArrowRight') {
        const next = (selectedIndex + 1) % 3;
        setSelectedIndex(next);
        cardRefs.current[next]?.focus();
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

  const getCharacterImage = (characterId: string) => {
    const imageSet = CHARACTER_IMAGES[characterId];
    return imageSet?.idle?.src || '';
  };

  return (
    <div className="character-select">
      <h1>Choose Your Character</h1>
      <p className="language-label">Language: {language.toUpperCase()}</p>

      <div
        className="character-grid"
        role="radiogroup"
        aria-label="Choose your character"
      >
        {characters.map((char, index) => (
          <div
            key={char.id}
            ref={(el) => {
              // Phase 37: populate the ref array in render order so the
              // arrow-key handler can call .focus() on the cell that just
              // became selected. Mirrors the Phase 27 LanguageSelection
              // cardRefs pattern.
              cardRefs.current[index] = el;
            }}
            role="radio"
            aria-checked={index === selectedIndex}
            aria-label={`${char.name}, ${char.style} style. Press ${index + 1} to select, Enter to confirm.`}
            tabIndex={index === selectedIndex ? 0 : -1}
            className={`character-card ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleCharacterClick(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCharacterClick(index);
                handleConfirm();
              }
            }}
          >
            <div className="character-image-container">
              <img
                src={getCharacterImage(char.id)}
                alt={char.name}
                className="character-preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {!imagesLoaded && (
                <div className="character-loading" aria-live="polite">Loading...</div>
              )}
            </div>
            <h2>{char.name}</h2>
            <p className="character-description">{char.description}</p>
            <p className="character-style">Style: {char.style}</p>
            <div className="key-hint" aria-hidden="true">Press {index + 1}</div>
          </div>
        ))}
      </div>

      <div className="controls" aria-label="Keyboard shortcuts">
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
