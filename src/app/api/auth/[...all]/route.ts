import { getAuth } from '@/lib/server/auth';
import { failure } from '@/lib/server/http';

export const runtime = 'nodejs';
async function handler(request: Request) {
  try { return await getAuth().handler(request); }
  catch (error) { return failure(error); }
}
export { handler as GET, handler as POST };
