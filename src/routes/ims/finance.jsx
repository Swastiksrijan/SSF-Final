import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import { ImsModuleDashboard } from '../../ims/pages/ImsSimple';
const C = () => <ImsModuleDashboard module="finance" titleKey="finance_dashboard" icon="PieChart" active="finance_dashboard" />;

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/finance')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><C /></LangProvider>,
});
