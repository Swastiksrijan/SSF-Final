import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../../ims/LangContext';
import { ImsLegacyRegister } from '../../../ims/oldOfficeRegisters';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/legacy/$module')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsLegacyRegister /></LangProvider>,
});
