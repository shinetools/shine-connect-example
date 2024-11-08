const SHINE_AUTHENTICATION_PRODUCTION_URL = 'https://api.shine.fr/v2/authentication';
// const SHINE_AUTHENTICATION_STAGING_URL = 'https://authentication-v2-tmszuhnzwq-ew.a.run.app/v2/authentication';
const SHINE_AUTHENTICATION_STAGING_URL = 'https://api.staging.shine.fr/v2/authentication';

const SHINE_REGULATED_PRODUCTION_HOST = 'connect.mtls.shine.fr';
const SHINE_REGULATED_STAGING_HOST = 'mtls.connect.staging.shine.fr';
const SHINE_REGULATED_DEV_HOST = 'localhost';

const SHINE_PUBLIC_PRODUCTION_HOST = 'https://public.api.shine.fr';
const SHINE_PUBLIC_STAGING_HOST = 'https://public.api.staging.shine.fr';
const SHINE_PUBLIC_DEV_HOST = 'http://localhost:10081';

/**
 *
 * @param isLocal Set True only for local Shine development
 * @param isStaging SandBox environment or production
 * @param isPublicAPI Public API or regulated API
 */
export const getHosts = (isLocal: boolean, isStaging: boolean, isPublicAPI: boolean) => {
  const shineAuthHost = isLocal || isStaging ? SHINE_AUTHENTICATION_STAGING_URL : SHINE_AUTHENTICATION_PRODUCTION_URL;

  const shineRegulatedHost = isLocal
    ? SHINE_REGULATED_DEV_HOST
    : isStaging
      ? SHINE_REGULATED_STAGING_HOST
      : SHINE_REGULATED_PRODUCTION_HOST;

  const shinePublicApiHost = isLocal
    ? SHINE_PUBLIC_DEV_HOST
    : isStaging
      ? SHINE_PUBLIC_STAGING_HOST
      : SHINE_PUBLIC_PRODUCTION_HOST;

  const shineApiHost = isPublicAPI ? shinePublicApiHost : shineRegulatedHost;

  return {
    shineAuthHost,
    shineApiHost,
  };
};
