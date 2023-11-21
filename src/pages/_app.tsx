import { AppPropsType } from 'next/dist/shared/lib/utils';
import Layout from '../components/Layout';
import { LanguageProvider } from '../contexts/LanguageContext';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';

import { getSide } from '../utils';
import { RecoilRoot } from 'recoil';
import '../styles/index.scss';

export default function App({ Component, pageProps, router }: AppPropsType) {
  console.log('hello from _app - ', getSide());
  return (
    <RecoilRoot>
      <NextUIProvider>
        <Toaster position='top-right' />
        <LanguageProvider>
          <Layout>
            <Component {...pageProps} key={router.route} />
          </Layout>
        </LanguageProvider>
      </NextUIProvider>
    </RecoilRoot>
  );
}
