import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../../ims/LangContext';
import ImsFinanceLedger from '../../../ims/pages/ImsFinanceLedger';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/finance/ledger')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsFinanceLedger /></LangProvider>,
});
