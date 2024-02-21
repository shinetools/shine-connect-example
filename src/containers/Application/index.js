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

const stringifyResponse = (data) => JSON.stringify(data, null, 2);

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
  withState('operationOutput', 'setOperationOutput', null),
  withState('error', 'setError', null),
  withStateHandlers(
    {},
    {
      refreshToken: (state, props) => () => {
        // FIXME does not update token in URL
        props.setError(null);
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
    getBankAccounts: (props) => () => {
      props.setError(null);
      fetch('/bank-accounts', {
        method: 'GET',
        qs: {
          access_token: props.access_token,
          refresh_token: props.refresh_token,
          company_profile_id: props.companyProfileId,
        },
      })
        .then((result) => {
          props.setOperationOutput(stringifyResponse(result.body.data));
        })
        .catch((error) => {
          error.response
            .json()
            .then((body) => props.setError(stringifyResponse(body)));
        });
    },
  }),
  withHandlers({
    getInvoices: (props) => () => {
      props.setError(null);
      fetch('/invoices', {
        method: 'GET',
        qs: {
          access_token: props.access_token,
          refresh_token: props.refresh_token,
          company_profile_id: props.companyProfileId,
        },
      })
        .then((result) => {
          props.setOperationOutput(stringifyResponse(result.body.data));
        })
        .catch((error) => {
          error.response
            .json()
            .then((body) => props.setError(stringifyResponse(body)));
        });
    },
  }),
  withHandlers({
    createBankTransferRecipient: (props) => () => {
      const iban = prompt('Please enter the IBAN');
      const bic = prompt('Please enter the BIC');
      props.setError(null);
      fetch('/bank-transfer-recipient', {
        method: 'POST',
        qs: {
          access_token: props.access_token,
          refresh_token: props.refresh_token,
          company_profile_id: props.companyProfileId,
          company_user_id: props.companyUserId,
          uid: props.uid,
          iban,
          bic,
        },
      })
        .then((result) => {
          props.setOperationOutput(stringifyResponse(result.body.data));
        })
        .catch((error) => {
          error.response
            .json()
            .then((body) => props.setError(stringifyResponse(body)));
        });
    },
  }),
  withHandlers({
    getBankTransferRecipients: (props) => () => {
      props.setError(null);
      fetch('/bank-transfers-recipients', {
        method: 'GET',
        qs: {
          access_token: props.access_token,
          refresh_token: props.refresh_token,
          company_profile_id: props.companyProfileId,
        },
      })
        .then((result) => {
          props.setOperationOutput(stringifyResponse(result.body.data));
        })
        .catch((error) => {
          error.response
            .json()
            .then((body) => props.setError(stringifyResponse(body)));
        });
    },
  }),
)(Application);
