import { createClient } from "@/utils/superbase/server";
import Link from "next/link";
import React from "react";
import Logout from "./Logout";

const Navbar = async () => {
  const superbase = await createClient();
  const {
    data: { user },
  } = await superbase.auth.getUser();

  return (
    <nav className="border-b bg-background w-full flex items-center">
      <div className="flex w-full items-center justify-between my-4">
        <Link className="font-bold" href="/">
          Home
        </Link>

        <div className="flex items-center gap-x-5">
          <Link href="/private">Private</Link>
        </div>
        <div className="flex items-center gap-x-5">
          {!user ? (
            <Link href="/sign-in">
              <div className="bg-blue-600 text-white text-sm px-4 py-2 rounded-sm">
                Login
              </div>
            </Link>
          ) : (
            <>
              <div className="flex items-center gap-x-2 text-sm">
              {user?.email}
            </div>
              <Logout />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
