import { createClient } from "@/utils/superbase/server";

export default async function PrivatePage() {

  const superbase = await createClient();
   const {data} = await superbase.auth.getUser();
  

  return (
    <p className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello , {data?.user?.user_metadata?.username}
    </p>
  );
}
