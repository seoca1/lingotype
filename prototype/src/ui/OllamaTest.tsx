/**
 * Ollama Test Component
 *
 * Ollama 연동 테스트를 위한 간단한 UI 컴포넌트
 */

import { useState } from 'react';
import { getOllamaService } from '../ai/OllamaService.js';

export function OllamaTest() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);

  const ollamaService = getOllamaService();

  const testConnection = async () => {
    setLoading(true);
    const isConnected = await ollamaService.testConnection();
    setConnected(isConnected);
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    const result = await ollamaService.generate({
      user: prompt,
      system: 'You are a helpful assistant for a language learning game.',
    });

    if (result.error) {
      setResponse(`Error: ${result.error}`);
    } else {
      setResponse(
        `${result.text}\n\n(Generated in ${result.generationTime.toFixed(0)}ms, ${result.tokens || 0} tokens)`,
      );
    }

    setLoading(false);
  };

  const handleStreamGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const stream = ollamaService.generateStream({
        user: prompt,
        system: 'You are a helpful assistant for a language learning game.',
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setResponse(fullText);
      }
    } catch (error) {
      setResponse(`Error: ${error}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Ollama Connection Test</h2>

      <div
        style={{ marginBottom: '20px' }}
        role="group"
        aria-label="Connection test"
      >
        <button
          onClick={testConnection}
          disabled={loading}
          aria-label="Test Ollama connection"
        >
          Test Connection
        </button>
        {connected !== null && (
          <span
            style={{
              marginLeft: '10px',
              color: connected ? 'green' : 'red',
            }}
            role="status"
            aria-live="polite"
            aria-label={connected ? 'Connection succeeded' : 'Connection failed'}
          >
            {connected ? '✓ Connected' : '✗ Connection Failed'}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Model:</strong> {ollamaService.getConfig().model}
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="ollama-test-prompt">
          <strong>Prompt</strong>
        </label>
        <textarea
          id="ollama-test-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={5}
          aria-label="Prompt input"
          style={{ width: '100%', padding: '10px', fontSize: '14px' }}
        />
      </div>

      <div
        style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}
        role="group"
        aria-label="Generation actions"
      >
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          aria-label="Generate response (non-streaming)"
        >
          Generate (Normal)
        </button>
        <button
          onClick={handleStreamGenerate}
          disabled={loading || !prompt.trim()}
          aria-label="Generate response (streaming)"
        >
          Generate (Stream)
        </button>
      </div>

      {loading && (
        <p role="status" aria-live="polite">
          Generating...
        </p>
      )}

      {response && (
        <div
          role="region"
          aria-label="Ollama response"
          aria-live="polite"
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
            whiteSpace: 'pre-wrap',
          }}
        >
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
      <style>{`
        /* Phase 38: visible focus indicator on every actionable control
           inside this test harness. */
        div button:focus-visible,
        div textarea:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
