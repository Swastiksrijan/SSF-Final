import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import { ImsDashboardLegacy } from '../../ims/oldOfficePages';

const TOKEN_KEY = 'ssf_admin_token';

// The verbatim old Digital Office dashboard, kept reachable for reference.
export const Route = createFileRoute('/ims/office')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsDashboardLegacy /></LangProvider>,
});
