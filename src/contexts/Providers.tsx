import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { LanguageProvider } from './LanguageContext';

const Providers = (props) => (
  <LanguageProvider>
    <NextUIProvider>
      {props.children}
    </NextUIProvider>
  </LanguageProvider>
);

export default Providers;
