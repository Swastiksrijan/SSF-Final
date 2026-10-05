import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../../ims/LangContext';
import ImsPerson360 from '../../../ims/pages/ImsPerson360';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/person/$id')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsPerson360 /></LangProvider>,
});
