import { AppPropsType } from 'next/dist/shared/lib/utils';
import Layout from '../components/Layout';

import { Toaster } from 'react-hot-toast';

import { getSide } from '../utils';
import { RecoilRoot } from 'recoil';
import '../styles/index.scss';
import Providers from '../contexts/Providers';

export default function App(props: AppPropsType) {
  console.log('hello from _app - ', getSide());


  return (
    <RecoilRoot>
      <Providers>
        <Toaster position='top-right' />
        <Layout>
          <props.Component {...props.pageProps} key={props.router.route} />
        </Layout>
      </Providers>
    </RecoilRoot>
  );
}

