"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./getPosts";

export default function Posts() {
  // This useQuery could just as well happen in some deeper child to
  // the "HydratedPosts"-component, data will be available immediately either way
  const { data } = useQuery({ queryKey: ["posts"], queryFn: getPosts });

  return (
    <section className="flex">
      <div>
        <h2 className="text-lg text-center font-bold mb-6">
          React Query SSR 적용
        </h2>
        <ul>
          {data?.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
