import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import { ImsPermissions } from '../../ims/pages/ImsPages2';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/permissions')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsPermissions /></LangProvider>,
});
