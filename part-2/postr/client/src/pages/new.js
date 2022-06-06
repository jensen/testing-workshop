import { useNavigate } from "react-router-dom";

import { usePosts } from "../context/posts";
import PostForm from "../components/PostForm";

export default function NewPost() {
  const { create, error } = usePosts();
  const navigate = useNavigate();

  return (
    <section>
      <PostForm
        onSubmit={async (event) => {
          try {
            const post = await create(new FormData(event.target));
            navigate(`/${post.id}`);
          } catch (error) {
            navigate("/new");
          }
        }}
        error={error}
      >
        <button>Create</button>
      </PostForm>
    </section>
  );
}
