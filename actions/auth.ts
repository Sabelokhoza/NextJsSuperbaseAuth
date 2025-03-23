"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/superbase/server";
import { headers } from "next/headers";

export async function signUp(formData: FormData) {
  const superbase = await createClient();

  const credentials = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data } = await superbase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        username: credentials.username,
      },
    },
  });

  if (error) {
    return {
      status: error?.message,
      user: null,
    };
  } else if (data?.user?.identities === 0) {
    return {
      status: "user with this email already exists, please log in",
      user: null,
    };
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    user: data.user,
  };
}

export async function signIn(formData: FormData) {
  const superbase = await createClient();

  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data } = await superbase.auth.signInWithPassword(credentials);

  console.log(error);
  console.log(credentials)

  if (error) {
    return {
      status: error?.message,
      user: null,
    };
  }

  //TODO  create a user instance on user Profiles table

  revalidatePath("/", "layout");
  return {
    status: "success",
    user: data.user,
  };
}
