import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../../ims/LangContext';
import ImsSectionDashboard from '../../../ims/pages/ImsSectionDashboard';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/sections/$section')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => {
    const { section } = Route.useParams();
    return <LangProvider><ImsSectionDashboard section={section} /></LangProvider>;
  },
});
