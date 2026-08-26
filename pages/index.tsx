import { GetServerSideProps } from 'next';
import App from './containers/App';
import { isPublicAPI } from '../server/config';

export default function Home({ isPublicAPI }: { isPublicAPI: boolean }) {
  return <App isPublicAPI={isPublicAPI} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { isPublicAPI } };
};
