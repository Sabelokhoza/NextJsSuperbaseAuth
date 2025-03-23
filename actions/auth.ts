"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/superbase/server";
import { headers } from "next/headers";
import ForgotPassword from '@/components/ForgotPassword';

export async function getUserSession(){
  const superbase = await createClient();
  const {data,error} = await superbase.auth.getUser();
  if(error){
    return null;
  }

  return {status:"success",user:data?.user};

} 


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

const {data:existingUser} = await superbase.from("user_profiles")
  .select("*")
  .eq("email", credentials?.email)
  .limit(1)
  .single();


  if(!existingUser){
    const {error:insertError} = await superbase.from("user_profiles")
    .insert({
      email: data?.user?.email,
      username: data?.user?.user_metadata?.username,
    });
    if(insertError){
      return{
        status: insertError?.message,
        user: null
      }
    }
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    user: data.user,
  };
}

export async function signOut(){
  const supabase = await createClient();
  const {error} = await supabase.auth.signOut();
  if(error){
    redirect('/error')
  }

  revalidatePath("/", "layout");
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const superbase = await createClient();
  const origin = (await headers()).get("origin");

  const credentials = {
    email: formData.get("email") as string, 
  };

  const { error } = await superbase.auth.resetPasswordForEmail(credentials.email, {
    redirectTo: `${origin}/reset-password`,
  }); 

 if (error) {
    return {
      status: error?.message,
    };
  }

  return {status:"success"}

}

export async function resetPassword(formData: FormData , code : string) {
  const superbase = await createClient();
  const credentials = {
    password: formData.get("password") as string,
  };

  const { error : CodeError } = await  superbase.auth.exchangeCodeForSession(code);

  if (CodeError) {
    return { status: CodeError?.message };
  }

  const { error } = await superbase.auth.updateUser({
    password: credentials.password});

    if (error) {
      return {
        status: error?.message,
      };
    }

    return {status:"success"}

}