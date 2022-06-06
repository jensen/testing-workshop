import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import PostsProvider from "../context/posts";

export default function Root() {
  return (
    <main>
      <Header />
      <PostsProvider>
        <Outlet />
      </PostsProvider>
    </main>
  );
}
