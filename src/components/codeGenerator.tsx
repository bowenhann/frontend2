import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeViewer,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

const defaultCode = `export default function App() {
  return <h1>Welcome to the AI Code Generator!</h1>
}`;

export const CodeGenerator = () => {
  const { connectors: { connect, drag } } = useNode();
  const [sessionId, setSessionId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('DETAIL');
  const [generatedCode, setGeneratedCode] = useState(defaultCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCodeViewerVisible, setIsCodeViewerVisible] = useState(false);
  const [key, setKey] = useState(0);

  const generateCode = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedCode('');

    try {
      const response = await fetch('https://api-dev.aictopusde.com/api/v1/ai/generate-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhaWN0b3B1cyIsImlhdCI6MTcyNDAyOTYzNiwiZXhwIjoxODk2ODI5NjM2fQ.2B2fARX74hql9eeZyqbc9Wh2ibtMLTaH0W2Ri0XnEINcoKT41tcQBF0zn-shdx_s30CRtPpwzrCkFg7BZVKCkA',
        },
        body: JSON.stringify({
          sessionId,
          prompt,
          mode,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let partialChunk = "";

      let buffer = '';
      let isInDataSection = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          let chunk = decoder.decode(value, { stream: true });
          chunk = buffer + chunk;
          
          const lines = chunk.split('\n');
          let processedChunk = '';
          
          for (const line of lines) {
            if (line.startsWith('data:')) {
              isInDataSection = true;
              const content = line.slice(5).trim();
              if (content) {
                processedChunk += content;
              }
            } else if (isInDataSection && line.trim() === '') {
              isInDataSection = false;
              processedChunk += '\n';
            }
          }
          
          buffer = isInDataSection ? lines[lines.length - 1] : '';
          
          // Replace single newlines with space, keep double newlines
          processedChunk = processedChunk.replace(/\n(?!\n)/g, ' ').replace(/\n\n/g, '\n');
          
          setGeneratedCode(prevCode => prevCode + processedChunk);
        }
      }
      
      // Process any remaining buffer content
      if (buffer) {
        const content = buffer.slice(5).trim();
        if (content) {
          setGeneratedCode(prevCode => prevCode + content);
        }
      }
  
      setGeneratedCode(prevCode => {
        let cleanedCode = prevCode.trim();
        if (cleanedCode.startsWith('```jsx')) {
          cleanedCode = cleanedCode.slice(6);
        }
        // if (cleanedCode.endsWith('```')) {

        // }
        return cleanedCode;
      });
    } catch (error) {
      console.error('Error generating code:', error);
      setError('Error when generating code');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedCode !== defaultCode) {
      setKey(prevKey => prevKey + 1);
    }
  }, [isLoading, generatedCode]);

  return (
    <div 
      ref={(ref) => connect(drag(ref) as any)}
      className="p-4 max-w-4xl mx-auto border border-gray-300 rounded"
    >
      <div className="mb-4">
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Enter session ID"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        >
          <option value="DETAIL">DETAIL</option>
          <option value="SUMMARY">SUMMARY</option>
        </select>
        <button
          onClick={generateCode}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : 'Generate Code'}
        </button>
      </div>

      <div className="mt-4">
        <SandpackProvider
          key={key}
          template="react"
          files={{
            "/App.js": {
              code: generatedCode,
              active: true
            },
          }}
          customSetup={{
            dependencies: {
              "react": "^18.0.0",
              "react-dom": "^18.0.0"
            }
          }}
        >
          <SandpackLayout>
            {!isLoading && <SandpackPreview />}
            {isLoading && <SandpackCodeViewer showLineNumbers />}
            {process.env.NODE_ENV === 'development' && (
              <div
                className="relative"
                onMouseEnter={() => setIsCodeViewerVisible(true)}
                onMouseLeave={() => setIsCodeViewerVisible(false)}
              >
                <button className="absolute top-0 right-0 bg-gray-200 px-2 py-1 text-sm">
                  Code
                </button>
                {/* {isCodeViewerVisible && (
                  <div className="absolute top-8 right-0 w-64 h-64 overflow-auto">
                    <SandpackCodeEditor showLineNumbers />
                  </div>
                )} */}
                
              </div>
            )}
                                <SandpackCodeEditor showLineNumbers />

          </SandpackLayout>
        </SandpackProvider>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

CodeGenerator.craft = {
  displayName: 'AI Code Generator',
  props: {},
  related: {
    toolbar: () => (
      <div>
        <h3 className="text-sm font-bold mb-2">AI Code Generator Settings</h3>
        <p className="text-xs">Customize settings as needed</p>
      </div>
    ),
  },
};