import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import { ImsModuleDashboard } from '../../ims/pages/ImsSimple';
const C = () => <ImsModuleDashboard module="impact" titleKey="impact" icon="TrendingUp" active="impact" />;

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/impact')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><C /></LangProvider>,
});
