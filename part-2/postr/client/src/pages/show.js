import { useParams, Link, Routes, Route, useNavigate } from "react-router-dom";

import { usePost } from "../context/posts";
import PostForm from "../components/PostForm";

const Show = (props) => {
  const navigate = useNavigate();

  return (
    <section>
      <h2>{props.title}</h2>
      <p>{props.content}</p>
      <Link to={`/${props.id}/edit`}>Edit</Link>
      <br />
      <button
        type="button"
        onClick={async () => {
          try {
            await props.destroy();
            navigate("/");
          } catch (error) {}
        }}
      >
        Delete
      </button>
    </section>
  );
};

const Edit = (props) => {
  const navigate = useNavigate();

  return (
    <section>
      <PostForm
        onSubmit={async (event) => {
          try {
            await props.edit(new FormData(event.target));
            navigate("..");
          } catch (error) {}
        }}
        title={props.title}
        content={props.content}
        error={props.error}
      >
        <button>Save</button>
      </PostForm>
    </section>
  );
};

export default function Post() {
  const { id } = useParams();
  const { data, edit, destroy, error } = usePost(Number(id));

  return (
    <Routes>
      <Route index element={<Show {...data} destroy={destroy} />} />
      <Route
        path="edit"
        element={<Edit {...data} edit={edit} error={error} />}
      />
    </Routes>
  );
}
