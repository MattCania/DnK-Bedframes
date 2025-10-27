
export const load = async ({ params }) => {
  const { id } = params;
  
  console.log(id)

  return { id };
};
