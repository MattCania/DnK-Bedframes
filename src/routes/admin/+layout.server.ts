import { redirect } from '@sveltejs/kit'; 

export const load = async ({ locals }) => {
  const session = await locals.auth();

  if (!session || session?.role !== "admin") {
    console.log("No Session Found");
	redirect(301, '/')
  }

  return { session };
};
