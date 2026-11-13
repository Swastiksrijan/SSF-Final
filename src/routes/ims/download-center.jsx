import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import ImsDownloadCenter from '../../ims/pages/ImsDownloadCenter';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/download-center')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsDownloadCenter /></LangProvider>,
});
