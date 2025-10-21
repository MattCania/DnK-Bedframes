import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const session = await locals.auth();
  if (!session) {
    throw redirect(404, '/login');
  }
  return { session };
};
