"use client";


import { createClient } from "@/utils/superbase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function ClientComponent() {

  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    async function getUser() {
       const suoerbase = await createClient();
       const { data , error } = await suoerbase.auth.getUser();
       if (error || !data?.user) {
         console.log("User does not exist");
       } else {
         setUser(data.user);
       }
    }
    getUser();
  }, []);

  return <h2>{user?.email}</h2>;
}
