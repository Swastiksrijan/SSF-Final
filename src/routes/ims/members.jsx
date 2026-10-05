import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import { ImsMembersLegacy } from '../../ims/oldOfficePages';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/members')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsMembersLegacy /></LangProvider>,
});
