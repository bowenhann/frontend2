import React from 'react';

export const FlexContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        padding: '10px',
        width: '100%', // Ensure it takes full width of its parent
      }}
    >
      {children}
    </div>
  );
};