import {
  compose,
  withProps,
  withState,
  withStateHandlers,
  withHandlers,
} from 'recompose';
import qs from 'qs';
import { withRouter } from 'next/router';
import Application from '../../components/Application';
import fetch from '../../fetch';

const parseQueryString = (router) => qs.parse(router.asPath.split('?')[1]);

export default compose(
  withRouter,
  withProps(({ router }) => {
    const queries = parseQueryString(router);
    return {
      ...queries,
      authorized: queries.authorized ? queries.authorized === 'true' : null,
    };
  }),
  withState('hasBeenRefreshed', 'setHasBeenRefreshed', false),
  withState('hasRefreshFailed', 'setHasRefreshFailed', false),
  withStateHandlers(
    {},
    {
      refreshToken: (state, props) => () => {
        props.setHasBeenRefreshed(false);
        props.setHasRefreshFailed(false);
        return fetch('/refresh-token', {
          method: 'GET',
          qs: {
            // Retrieved from query params
            refresh_token: props.refresh_token,
          },
        })
          .then(() => props.setHasBeenRefreshed(true))
          .catch(() => props.setHasRefreshFailed(true));
      },
    },
  ),
  withHandlers({
    getBankAccounts: (props) => () => fetch('/bank-accounts', {
      method: 'GET',
      qs: {
        access_token: props.access_token,
        refresh_token: props.refresh_token,
        company_profile_id: props.companyProfileId,
      },
    })
      .then((result) => console.log({ data: result.body.data, status: result.statusCode }))
      .catch((error) => console.log(error)),
  }),
  withHandlers({
    createBankTransferRecipient: (props) => () => fetch('/bank-transfer-recipient', {
      method: 'POST',
      qs: {
        access_token: props.access_token,
        refresh_token: props.refresh_token,
        company_profile_id: props.companyProfileId,
        company_user_id: props.companyUserId,
        uid: props.uid,
      },
    })
      .then((result) => console.log({ body: result.body, status: result.statusCode }))
      .catch((error) => console.log(error)),
  }),
)(Application);
