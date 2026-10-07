import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import ImsSocial from '../../ims/pages/ImsSocial';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/social')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsSocial /></LangProvider>,
});
