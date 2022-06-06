import { Link } from "react-router-dom";

const Post = (props) => {
  return (
    <Link to={`${props.id}`}>
      <li>{props.title}</li>
    </Link>
  );
};

export default function Posts(props) {
  return (
    <ul data-testid="post-list">
      {props.posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </ul>
  );
}
