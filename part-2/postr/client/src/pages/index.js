import { usePosts } from "../context/posts";
import Posts from "../components/Posts";

export default function Index() {
  const { data } = usePosts();

  return (
    <section>
      <Posts posts={data} />
    </section>
  );
}
