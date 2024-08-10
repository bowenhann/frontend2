import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { renderComponents } from '@/lib/componentRenderer';

const StreamingRenderer = ({ streamingString }) => {
  const [components, setComponents] = useState([]);
  const [buffer, setBuffer] = useState('');
  const [debugInfo, setDebugInfo] = useState({ buffer: '', components: [] });

  useEffect(() => {
    const processBuffer = () => {
      const closingTagIndex = buffer.indexOf('</ResizableComponent>');
      if (closingTagIndex !== -1) {
        const completeComponent = buffer.slice(0, closingTagIndex + '</ResizableComponent>'.length);
        let newComponents;
        try {
          newComponents = renderComponents(completeComponent);
        } catch (error) {
          console.error('Error rendering component:', error);
          setDebugInfo(prev => ({ ...prev, error: error.message }));
          return;
        }
        setComponents(prevComponents => [...prevComponents, ...newComponents]);
        setBuffer(buffer.slice(closingTagIndex + '</ResizableComponent>'.length));
        
        // Update debug info
        setDebugInfo(prev => ({
          ...prev,
          buffer: buffer,
          components: [...prev.components, completeComponent]
        }));
      }
    };

    setBuffer(prevBuffer => prevBuffer + streamingString);
    processBuffer();
  }, [streamingString]);

  if (components.length === 0) {
    return (
      <div>
        <h2>Debug Information</h2>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>
    );
  }

  return (
    <Editor
      resolver={{
        // ... (include all your component resolvers here)
        ResizableComponent: props => <div {...props} />, // Placeholder
        NodeButton: props => <button {...props} />, // Placeholder
        NodeCalendar: props => <div {...props} />, // Placeholder
        NodeCard: props => <div {...props} />, // Placeholder
        NodeCardHeader: props => <div {...props} />, // Placeholder
        NodeCardTitle: props => <h3 {...props} />, // Placeholder
        NodeCardDescription: props => <p {...props} />, // Placeholder
        NodeCardContent: props => <div {...props} />, // Placeholder
        NodeCardFooter: props => <div {...props} />, // Placeholder
      }}
      onRender={({ render }) => render}
    >
      <Frame>
        <Element
          canvas
          is="div"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}
        >
          {components}
        </Element>
      </Frame>
    </Editor>
  );
};

export default StreamingRenderer;