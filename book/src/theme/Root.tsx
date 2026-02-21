import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';

interface RootProps {
  children: React.ReactNode;
}

export default function Root({ children }: RootProps): React.ReactElement {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
