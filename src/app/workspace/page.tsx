import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/server/auth';
import WorkspaceHome from '@/components/workspace/workspace-home';

export const dynamic = 'force-dynamic';
export default async function WorkspacePage() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session || !session.user.emailVerified) redirect('/?expired=1');
  return <WorkspaceHome />;
}
