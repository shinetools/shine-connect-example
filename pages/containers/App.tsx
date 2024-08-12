import qs from 'qs';
import { NextRouter, Router, useRouter, withRouter } from 'next/router';
// import Authenticated from './Authenticated';
import SignIn from './SignIn';
import { useEffect, useState } from 'react';
import Authenticated from './Authenticated';
import { AuthenticatedData } from '../utils';

// get the query string from the router
// parse authorized, uid, access_token and refresh_token from the query string
const parseQueryString = (router: NextRouter) => qs.parse(router.asPath.split('?')[1]);

function App() {
  const router = useRouter();
  const [authenticatedData, setAuthenticatedData] = useState<AuthenticatedData>(undefined);

  useEffect(() => {
    const params = parseQueryString(router) as AuthenticatedData;
    setAuthenticatedData(params);
  }, [router, setAuthenticatedData]);

  return authenticatedData?.authorized ? <Authenticated authenticatedData={authenticatedData} /> : <SignIn />;
}

export default App;
