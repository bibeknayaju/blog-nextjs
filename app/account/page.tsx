import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";
import Post from "@/components/Post";
import { fetchUserPost } from "@/lib/datas";
import Image from "next/image";
import React from "react";

async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const data = await fetchUserPost(userId as string);

  return (
    <div className="pt-10">
      <div className="max-w-[40rem] flex flex-row gap-4 mx-auto mt-5">
        <Image
          className="rounded-full"
          height={100}
          width={100}
          src={session?.user?.image || ""}
          alt={session?.user?.name || "User profile"}
        />

        <div className="flex flex-col">
          <h4 className="font-bold text-2xl mb-2">{session?.user?.name}</h4>
          <span className=" font-semibold text-gray-300 text-lg">
            {session?.user?.email}
          </span>

          <LogoutButton />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 max-w-[60rem] mx-auto  gap-3 mt-10">
        {data.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}

export default AccountPage;
