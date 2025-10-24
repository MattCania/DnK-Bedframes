import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
  const session = await locals.auth();

  if (!session) return { session: null };
  console.log(session)
  // if (url.pathname === "/" && (session.role === "admin" || session.role === "manager")) {
  //   throw redirect(303, "/admin");
  // }

  return { session };
};
