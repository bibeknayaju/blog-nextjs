"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function HeroSection() {
  const navigate = useRouter();
  const { data: session } = useSession();

  const navigateFunction = () => {
    navigate.push("/write");
  };
  return (
    <div className=" h-[80vh] w-full rounded-md bg-white dark:bg-[#121212] relative flex items-center justify-center antialiased">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Welcome to Blog App, the best place to share your thoughts.
        </h1>

        <p className="text-neutral-500 max-w-3xl mx-auto my-2 text-sm text-center relative z-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
          pariatur dolore est reiciendis cumque accusamus tenetur voluptates
          quisquam quidem alias? Consectetur delectus tenetur numquam excepturi
          exercitationem praesentium, temporibus tempore repellat.
        </p>

        {session ? (
          <div className="mt-10 flex justify-center text-center">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
              {/* <AceternityLogo /> */}
              <Link href="/write">Write a Post</Link>
            </HoverBorderGradient>
          </div>
        ) : (
          // <Button className="text-center flex items-center justify-center mx-auto mt-5 font-xs">
          //   Write a Post
          // </Button>
          <button
            onClick={() => {
              console.log("clicked");
              signIn("google", { callbackUrl: "/" });
            }}
            className="text-center dark:bg-black flex gap-2 items-center z-30 mx-auto border w-fit border-gray-700  mt-10 px-3 py-2 rounded-lg">
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}
