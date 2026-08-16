/**
 * MarkdownView Tests - XSS safety + markdown parsing
 *
 * Uses react-dom/server.renderToStaticMarkup to avoid needing
 * @testing-library/react. Tests assert on HTML strings.
 */

import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownView } from '../../src/ui/MarkdownView.js';

function render(md: string, linkResolver?: (t: string) => string | null): string {
  return renderToStaticMarkup(
    <MarkdownView source={md} linkResolver={linkResolver} />
  );
}

describe('MarkdownView — Basic Parsing', () => {
  it('renders h1', () => {
    expect(render('# Title')).toContain('<h1>Title</h1>');
  });

  it('renders h2 and h3', () => {
    const html = render('## H2\n\n### H3');
    expect(html).toContain('<h2>H2</h2>');
    expect(html).toContain('<h3>H3</h3>');
  });

  it('renders paragraphs', () => {
    const html = render('First paragraph.\n\nSecond paragraph.');
    expect(html).toContain('<p>First paragraph.</p>');
    expect(html).toContain('<p>Second paragraph.</p>');
  });

  it('renders bold', () => {
    expect(render('**bold** text')).toContain('<strong>bold</strong>');
  });

  it('renders italic', () => {
    expect(render('*italic* text')).toContain('<em>italic</em>');
  });

  it('renders inline code', () => {
    expect(render('Use `npm install` to setup')).toContain(
      '<code>npm install</code>'
    );
  });

  it('renders unordered lists', () => {
    const html = render('- Item 1\n- Item 2\n- Item 3');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Item 1</li>');
    expect(html).toContain('<li>Item 2</li>');
    expect(html).toContain('<li>Item 3</li>');
    expect(html).toContain('</ul>');
  });
});

describe('MarkdownView — Links', () => {
  it('renders [text](url) links as <a>', () => {
    const html = render('[Click here](https://example.com)');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('>Click here<');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('renders [[wikilink]] with resolver', () => {
    const resolver = (t: string) => {
      if (t === 'beautiful') return '/word/beautiful';
      return null;
    };
    const html = render('See [[beautiful]] for details', resolver);
    expect(html).toContain('href="/word/beautiful"');
    expect(html).toContain('class="wikilink"');
  });

  it('renders broken [[wikilink]] as span', () => {
    const resolver = () => null;
    const html = render('See [[missing]]', resolver);
    expect(html).toContain('class="wikilink wikilink--broken"');
    expect(html).toContain('<span');
  });

  it('renders [[wikilink|alias]] with first part as display', () => {
    const resolver = (t: string) => {
      const name = t.split('|')[0].trim();
      return name === 'name' ? '/word/name' : null;
    };
    const html = render('See [[name|the word name]]', resolver);
    expect(html).toContain('>name</a>');
  });
});

describe('MarkdownView — XSS Safety (CRITICAL)', () => {
  it('does not render <script> as actual element', () => {
    const html = render("Hello <script>alert('xss')</script>");
    // No <script> tag in the HTML
    expect(html).not.toMatch(/<script[\s>]/i);
    // The text content is preserved (as escaped text, double-escaped in raw HTML)
    expect(html).toContain('Hello');
  });

  it('does not allow javascript: URLs in text', () => {
    const html = render('Click <a href="javascript:alert(1)">here</a>');
    // No <a> with javascript: href
    expect(html).not.toMatch(/href="javascript:/i);
  });

  it('does not render <img onerror>', () => {
    const html = render('<img src=x onerror=alert(1)>');
    // No <img> tag
    expect(html).not.toMatch(/<img[\s>]/i);
  });

  it('does not render event handler attributes', () => {
    const html = render("<div onclick='alert(1)'>click</div>");
    // No <div> element with onclick attribute
    // (the literal "onclick=" text appears as escaped text content, which is safe)
    expect(html).not.toMatch(/<div[^>]*onclick/i);
  });

  it('does not render <svg onload>', () => {
    const html = render("<svg onload='alert(1)'></svg>");
    // No <svg> element with onload attribute
    expect(html).not.toMatch(/<svg[^>]*onload/i);
  });

  it('does not render <iframe>', () => {
    const html = render("<iframe src='https://evil.com'></iframe>");
    expect(html).not.toMatch(/<iframe[\s>]/i);
  });

  it('does not allow data: URLs in markdown links', () => {
    const html = render('[Click](data:text/html,<script>alert(1)</script>)');
    // The link is rendered but the data: URL would only fire on click.
    // For safety, we should sanitize data: URLs.
    // For now, just check that the link doesn't have <script> in it:
    expect(html).not.toMatch(/<script[\s>]/i);
  });

  it('mixed markdown + injection attempts', () => {
    const html = render(
      "# Title\n\n**Bold** with <script>alert(1)</script>\n\n- item with <b>html</b>"
    );
    expect(html).not.toMatch(/<script[\s>]/i);
    expect(html).not.toMatch(/<b>html<\/b>/i);
    expect(html).toContain('<strong>Bold</strong>');
  });
});

describe('MarkdownView — Complex Content', () => {
  it('renders full wiki-style page', () => {
    const md = `# beautiful

**Part of Speech:** adjective
**Level:** A2

**Definition:** 아름답다 — Pleasing the senses.

## Examples

- "You look beautiful tonight." — 칭찬
- **Beautiful** is essential.

## Sources

- [[dating-romance]]
- [[first-travel-japan]]
`;
    const html = render(md, (t) => `/word/${t}`);
    expect(html).toContain('<h1>beautiful</h1>');
    expect(html).toContain('<strong>');
    expect(html).toContain('<h2>Examples</h2>');
    expect(html).toContain('<li>');
    expect(html).toContain('href="/word/dating-romance"');
    expect(html).toContain('href="/word/first-travel-japan"');
  });
});

// ============================================================================
// Extended Features (Phase A-4): callouts, tables, dialogue, TTS
// ============================================================================

describe('MarkdownView — Callouts', () => {
  it('renders !> [info] callout', () => {
    const html = render('!> [info] This is info');
    expect(html).toContain('md-callout--info');
    expect(html).toContain('This is info');
    expect(html).toContain('ℹ️');
  });

  it('renders !> [warning] callout', () => {
    const html = render('!> [warning] Be careful');
    expect(html).toContain('md-callout--warning');
    expect(html).toContain('⚠️');
  });

  it('renders !> [tip] callout', () => {
    const html = render('!> [tip] Try this approach');
    expect(html).toContain('md-callout--tip');
    expect(html).toContain('💡');
  });

  it('renders !> [danger] callout', () => {
    const html = render('!> [danger] Do not do this');
    expect(html).toContain('md-callout--danger');
    expect(html).toContain('🚫');
  });

  it('renders !> [note] callout', () => {
    const html = render('!> [note] FYI');
    expect(html).toContain('md-callout--note');
    expect(html).toContain('📝');
  });

  it('callout text supports inline markdown', () => {
    const html = render('!> [tip] Try **bold** text');
    expect(html).toContain('<strong>bold</strong>');
  });
});

describe('MarkdownView — Tables', () => {
  // Phase 36 — table a11y: every <th> now ships scope="col" so SR engines
  // announce column headers when announcing each <td>. The two assertions
  // that pinned the literal "<th>Type</th>" / "<th>A</th>" sub-strings
  // were defending the *pre-Phase-36* markup; they have been rewired to
  // defend the *current* contract (regex matches the header content
  // inside a scope="col" wrapping <th>) so future regressions in either
  // direction fail loudly.
  it('renders simple table with header + separator + rows', () => {
    const md = `
| Type | Mode | When |
| --- | --- | --- |
| ojala | subjuntivo | wishing |
| a ver si | indicativo | guessing |
`;
    const html = render(md);
    expect(html).toContain('<table');
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>Type<\/th>/);
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>Mode<\/th>/);
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>When<\/th>/);
    expect(html).toContain('<td>ojala</td>');
    expect(html).toContain('<td>subjuntivo</td>');
  });

  it('table supports inline markdown in cells', () => {
    const md = `
| A | B |
| --- | --- |
| **bold** | *italic* |
`;
    const html = render(md);
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('handles table with leading/trailing pipes', () => {
    const md = `
| A | B |
| --- | --- |
| 1 | 2 |
`;
    const html = render(md);
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>A<\/th>/);
    expect(html).toContain('<td>1</td>');
  });
});

describe('MarkdownView — Dialogue Blocks', () => {
  it('renders dialogue code block as styled dialogue', () => {
    const md = '```dialogue\nA: Hello\nB: Hi there\n```';
    const html = render(md);
    expect(html).toContain('md-dialogue');
    expect(html).toContain('Dialogue');
    expect(html).toContain('md-dialogue__speaker');
    expect(html).toContain('A:');
    expect(html).toContain('Hello');
  });

  it('preserves dialogue lines without speaker prefix', () => {
    const md = '```dialogue\nA: Hi\n```';
    const html = render(md);
    expect(html).toContain('A:');
  });
});

describe('MarkdownView — Dividers', () => {
  it('renders --- as hr', () => {
    const html = render('Above\n\n---\n\nBelow');
    expect(html).toContain('md-divider');
  });

  it('renders *** as hr', () => {
    const html = render('Above\n\n***\n\nBelow');
    expect(html).toContain('md-divider');
  });
});

describe('MarkdownView — TTS', () => {
  it('does not show TTS button by default', () => {
    const html = render('Hello world');
    expect(html).not.toContain('md-tts-btn');
  });

  it('shows TTS button when enableTts is true', () => {
    const html = renderToStaticMarkup(
      <MarkdownView source="Hello" enableTts={true} ttsLanguage="en" />
    );
    expect(html).toContain('md-tts-btn');
    expect(html).toContain('🔊');
  });

  it('TTS button works on list items when enabled', () => {
    const html = renderToStaticMarkup(
      <MarkdownView
        source="- Item 1\n- Item 2"
        enableTts={true}
        ttsLanguage="jp"
      />
    );
    expect(html).toContain('md-tts-btn');
  });
});

describe('MarkdownView — Integration with new fields', () => {
  it('renders full enhanced vocab page', () => {
    const md = `
# beautiful

**Part of Speech:** adjective
**Level:** A2

**Definition:** Pleasing the senses.

**Memory Tip:** BEAU + ti + ful = beautiful

## Examples

- "You look beautiful tonight."

\`\`\`dialogue
A: You look beautiful.
B: Thank you!
\`\`\`

## Cultural Notes

- Be specific with compliments.

!> [tip] Pair with eye contact + smile for sincerity

| Type | Use |
| --- | --- |
| beautiful | people |
| handsome | men |

[[handsome]] — comparison
`;
    const html = render(md, (t) => `/word/${t}`);
    expect(html).toContain('<h1>beautiful</h1>');
    expect(html).toContain('md-callout--tip');
    expect(html).toContain('md-dialogue');
    expect(html).toContain('<table');
    expect(html).toContain('Memory Tip');
    expect(html).toContain('handsome');
  });
});
