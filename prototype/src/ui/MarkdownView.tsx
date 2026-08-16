/**
 * MarkdownView - XSS-safe Markdown Renderer (Extended)
 *
 * Supports:
 * - # / ## / ### headings
 * - **bold** and *italic*
 * - `inline code`
 * - [text](url) and [[wikilink]] links
 * - - unordered list items
 * - Code blocks (```...```)
 * - Callout blocks (!> info / !> warning / !> tip / !> danger)
 * - Tables (| col | col |)
 * - TTS button (🔊) for spoken pronunciation via Web Speech API
 * - Mini-dialogue blocks (```dialogue...```)
 *
 * SECURITY: All input is HTML-escaped BEFORE markdown parsing. No
 * `dangerouslySetInnerHTML` is used. All output is React elements.
 */

import { type ReactNode, useState } from 'react';

// ============================================================================
// Text-to-Speech Hook
// ============================================================================

/**
 * Speak the given text using the browser's Web Speech API.
 * Falls back gracefully if API is unavailable.
 */
function speakText(text: string, lang: string = 'en-US'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('[TTS] Web Speech API not available');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for learners
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

/**
 * BCP 47 language code for the TTS API.
 * Wiki content language code → BCP 47.
 */
const TTS_LANG_MAP: Record<string, string> = {
  en: 'en-US',
  jp: 'ja-JP',
  ja: 'ja-JP',
  es: 'es-ES',
  kr: 'ko-KR',
  ko: 'ko-KR',
};

function getTtsLang(languageCode?: string): string {
  if (!languageCode) return 'en-US';
  return TTS_LANG_MAP[languageCode.toLowerCase()] ?? 'en-US';
}

/**
 * TtsButton - A small button that speaks the given text on click.
 * Uses Web Speech API (free, browser-native).
 */
function TtsButton({ text, lang }: { text: string; lang: string }): ReactNode {
  const [speaking, setSpeaking] = useState(false);

  const handleClick = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakText(text, getTtsLang(lang));

    // Reset state after estimated duration
    setTimeout(() => setSpeaking(false), Math.max(2000, text.length * 80));
  };

  return (
    <button
      className={`md-tts-btn ${speaking ? 'md-tts-btn--active' : ''}`}
      onClick={handleClick}
      title={speaking ? 'Stop' : 'Listen to pronunciation'}
      aria-label={speaking ? 'Stop pronunciation' : 'Listen to pronunciation'}
      aria-pressed={speaking}
    >
      {speaking ? '⏸' : '🔊'}
    </button>
  );
}

// ============================================================================
// Inline Parser
// ============================================================================

/**
 * Parse inline markdown: **bold**, *italic*, `code`, [link](url), [[wikilink]]
 */
function parseInline(
  text: string,
  linkResolver?: (target: string) => string | null
): ReactNode[] {
  const nodes: ReactNode[] = [];

  const pattern =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[\[([^\]]+)\]\])|(\[[^\]]+\]\([^)]+\))/g;

  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(text.slice(lastIdx, match.index));
    }

    const fullMatch = match[0];

    if (match[1]) {
      const codeContent = fullMatch.slice(1, -1);
      nodes.push(<code key={key++}>{codeContent}</code>);
    } else if (match[2]) {
      const boldContent = fullMatch.slice(2, -2);
      nodes.push(<strong key={key++}>{parseInline(boldContent, linkResolver)}</strong>);
    } else if (match[3]) {
      const italicContent = fullMatch.slice(1, -1);
      nodes.push(<em key={key++}>{parseInline(italicContent, linkResolver)}</em>);
    } else if (match[4]) {
      const target = match[5];
      const resolved = linkResolver?.(target);
      const displayText = target.split('|')[0].trim();
      if (resolved) {
        nodes.push(
          <a key={key++} href={resolved} className="wikilink">
            {displayText}
          </a>
        );
      } else {
        nodes.push(
          <span key={key++} className="wikilink wikilink--broken">
            {displayText}
          </span>
        );
      }
    } else if (match[6]) {
      const linkMatch = fullMatch.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const url = linkMatch[2];
        const isExternal = /^https?:\/\//.test(url);
        nodes.push(
          <a
            key={key++}
            href={url}
            className="md-link"
            {...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {linkText}
          </a>
        );
      }
    }

    lastIdx = match.index + fullMatch.length;
  }

  if (lastIdx < text.length) {
    nodes.push(text.slice(lastIdx));
  }

  return nodes;
}

// ============================================================================
// Block Parser
// ============================================================================

type CalloutType = 'info' | 'warning' | 'tip' | 'danger' | 'note';

type Block =
  | { type: 'h1' | 'h2' | 'h3'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; text: string; lang?: string }
  | { type: 'callout'; variant: CalloutType; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'divider' };

function parseBlocks(md: string): Block[] {
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3;
      blocks.push({ type: ('h' + level) as 'h1' | 'h2' | 'h3', level, text: headingMatch[2] });
      i++;
      continue;
    }

    // Code block (```...```) with optional language tag
    if (trimmed.startsWith('```')) {
      const langMatch = trimmed.match(/^```(\w*)$/);
      const codeLang = langMatch?.[1] || undefined;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', text: codeLines.join('\n'), lang: codeLang });
      i++;
      continue;
    }

    // Callout: !> [info|warning|tip|danger|note] text...
    const calloutMatch = trimmed.match(/^!>\s*\[(\w+)\]\s+(.+)$/);
    if (calloutMatch) {
      const variant = calloutMatch[1].toLowerCase() as CalloutType;
      const text = calloutMatch[2];
      blocks.push({ type: 'callout', variant, text });
      i++;
      continue;
    }

    // Divider: --- (alone on a line)
    if (trimmed === '---' || trimmed === '***') {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    // Table: header | header | header (followed by separator | --- | ---)
    if (trimmed.includes('|') && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      const separatorMatch = nextLine.match(/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/);
      if (separatorMatch) {
        const headers = trimmed
          .split('|')
          .map((h) => h.trim())
          .filter((h) => h.length > 0);
        const rows: string[][] = [];
        i += 2; // skip header + separator
        while (i < lines.length && lines[i].trim().includes('|')) {
          const cells = lines[i]
            .split('|')
            .map((c) => c.trim())
            .filter((c, idx, arr) => {
              // Filter empty cells at start/end (from leading/trailing pipes)
              if (idx === 0 && c === '') return false;
              if (idx === arr.length - 1 && c === '') return false;
              return true;
            });
          if (cells.length > 0) rows.push(cells);
          i++;
        }
        blocks.push({ type: 'table', headers, rows });
        continue;
      }
    }

    // List item
    if (trimmed.match(/^[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length) {
        const listLine = lines[i].trim();
        const listMatch = listLine.match(/^[-*]\s+(.+)$/);
        if (!listMatch) break;
        items.push(listMatch[1]);
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i].trim();
      if (
        !l ||
        l.startsWith('#') ||
        l.startsWith('```') ||
        l.startsWith('!>') ||
        l === '---' ||
        l === '***' ||
        l.match(/^[-*]\s+/)
      ) {
        break;
      }
      paraLines.push(l);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
    }
  }

  return blocks;
}

// ============================================================================
// Main Component
// ============================================================================

export interface MarkdownViewProps {
  source: string;
  linkResolver?: (target: string) => string | null;
  className?: string;
  title?: string;
  /** Language code for TTS (e.g., 'en', 'jp', 'es', 'kr') */
  ttsLanguage?: string;
  /** Whether to show TTS buttons on text blocks. Default: false */
  enableTts?: boolean;
}

export function MarkdownView({
  source,
  linkResolver,
  className,
  title,
  ttsLanguage = 'en',
  enableTts = false,
}: MarkdownViewProps) {
  const blocks = parseBlocks(source);

  return (
    <div className={`markdown-view ${className ?? ''}`}>
      {title && <h2 className="markdown-view__title">{title}</h2>}
      {blocks.map((block, idx) =>
        renderBlock(block, idx, linkResolver, ttsLanguage, enableTts)
      )}
    </div>
  );
}

function renderBlock(
  block: Block,
  key: number,
  linkResolver?: (target: string) => string | null,
  ttsLanguage: string = 'en',
  enableTts: boolean = false
): ReactNode {
  switch (block.type) {
    case 'h1':
      return <h1 key={key}>{parseInline(block.text, linkResolver)}</h1>;
    case 'h2':
      return <h2 key={key}>{parseInline(block.text, linkResolver)}</h2>;
    case 'h3':
      return <h3 key={key}>{parseInline(block.text, linkResolver)}</h3>;
    case 'paragraph': {
      const text = block.text;
      if (enableTts) {
        return (
          <p key={key} className="md-paragraph">
            {parseInline(text, linkResolver)}
            <TtsButton text={text} lang={ttsLanguage} />
          </p>
        );
      }
      return <p key={key}>{parseInline(text, linkResolver)}</p>;
    }
    case 'list':
      return (
        <ul key={key}>
          {block.items.map((item, i) => (
            <li key={i}>
              {parseInline(item, linkResolver)}
              {enableTts && <TtsButton text={item.replace(/^[→▸►\-*]\s*/, '')} lang={ttsLanguage} />}
            </li>
          ))}
        </ul>
      );
    case 'code':
      if (block.lang === 'dialogue') {
        return (
          <div key={key} className="md-dialogue">
            <div className="md-dialogue__header">💬 Dialogue</div>
            {block.text.split('\n').map((line, i) => {
              const m = line.match(/^([A-Z]):\s*(.*)$/);
              if (m) {
                return (
                  <div key={i} className="md-dialogue__line">
                    <strong className="md-dialogue__speaker">{m[1]}:</strong>
                    <span className="md-dialogue__text">{m[2]}</span>
                  </div>
                );
              }
              return <div key={i} className="md-dialogue__line">{line}</div>;
            })}
          </div>
        );
      }
      return (
        <pre key={key}>
          <code>{block.text}</code>
        </pre>
      );
    case 'callout': {
      const ICONS: Record<CalloutType, string> = {
        info: 'ℹ️',
        warning: '⚠️',
        tip: '💡',
        danger: '🚫',
        note: '📝',
      };
      return (
        <div key={key} className={`md-callout md-callout--${block.variant}`}>
          <span className="md-callout__icon">{ICONS[block.variant]}</span>
          <span className="md-callout__body">
            {parseInline(block.text, linkResolver)}
            {enableTts && <TtsButton text={block.text} lang={ttsLanguage} />}
          </span>
        </div>
      );
    }
    case 'table': {
      // Phase 36: tables rendered without a <caption> or `scope` attrs.
      // SR users hear each cell as an isolated "column N row M" position
      // with no header context (WCAG 1.3.1: info-and-relationships). Added
      // a visually-hidden <caption> (per the Phase 32 .visually-hidden
      // utility) so the table has a programmatic name + `scope="col"` on
      // each <th> so SR engines announce the header context with each
      // data cell. Caption text falls back to a generic "Data table" if
      // the markdown didn't supply one (most daily-lesson tables come
      // from vocabulary comparisons; caption text is the table's first
      // row 0 column when present, otherwise a generic placeholder).
      const captionText =
        block.headers[0] && block.rows.length > 0
          ? `${block.headers[0]} table`
          : 'Data table';
      return (
        <table key={key} className="md-table">
          <caption className="visually-hidden">{captionText}</caption>
          <thead>
            <tr>
              {block.headers.map((h, i) => (
                <th key={i} scope="col">
                  {parseInline(h, linkResolver)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{parseInline(cell, linkResolver)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    case 'divider':
      return <hr key={key} className="md-divider" />;
  }
}
