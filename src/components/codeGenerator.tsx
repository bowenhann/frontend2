import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { fetchEventSource } from '@microsoft/fetch-event-source';
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
  const [content, setContent] = useState(defaultCode);
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeViewerVisible, setIsCodeViewerVisible] = useState(false);
  const [key, setKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setContent('');
    setIsLoading(true);
    try {
      await fetchEventSource('https://api-dev.aictopusde.com/api/v1/ai/generate-pages', {
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
        async onopen(response) {
          if (response.ok && response.headers.get('content-type') === 'text/event-stream') {
            console.log('连接已建立');
          } else {
            console.error('连接失败', response);
            throw new Error('连接失败');
          }
        },
        onmessage(event) {
          let line = event.data;
          line = line.replace(/data:\s*/g, '');
          if (line == ""){
            setContent(prevContent => prevContent + " ");
          } else {
            setContent(prevContent => prevContent + line);
          }
        },
        onerror(err) {
          console.error('EventSource failed:', err);
          setIsLoading(false);
        },
        openWhenHidden: true,
      });
    } catch (error) {
      console.error('获取数据时出错:', error);
    } finally {
      setIsLoading(false);
      setKey(prevKey => prevKey + 1);
    }
  };

  return (
    <div 
      ref={(ref) => connect(drag(ref) as any)}
      className="p-4 max-w-4xl mx-auto border border-gray-300 rounded"
    >
      <form onSubmit={handleSubmit} className="mb-4">
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
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : 'Generate Code'}
        </button>
      </form>

      <div className="mt-4">
        <SandpackProvider
          key={key}
          template="react"
          files={{
            "/App.js": {
              code: content,
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
              </div>
            )}
            <SandpackCodeEditor showLineNumbers />
          </SandpackLayout>
        </SandpackProvider>
      </div>
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