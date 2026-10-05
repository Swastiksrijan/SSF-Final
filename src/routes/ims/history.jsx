import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import { ImsHistory } from '../../ims/pages/ImsPages2';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/history')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsHistory /></LangProvider>,
});
