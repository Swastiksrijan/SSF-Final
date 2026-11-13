import { createFileRoute, redirect } from '@tanstack/react-router';

const TOKEN_KEY = 'ssf_admin_token';

// Consolidated into the IMS resource register (the Digital Office screen was removed).
export const Route = createFileRoute('/ims/managing-committee')({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
    throw redirect({ to: '/ims/r/$resource', params: { resource: 'committeeMembers' }, replace: true });
  },
});
