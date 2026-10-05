import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import { ImsOrganisationProfile } from '../../ims/pages/ImsOrganisationProfile';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/org-profile')({
  validateSearch: (search) => ({ tab: typeof search.tab === 'string' ? search.tab : undefined }),
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: OrgProfileRoute,
});

function OrgProfileRoute() {
  const { tab } = Route.useSearch();
  return <LangProvider><ImsOrganisationProfile initialTab={tab} /></LangProvider>;
}
