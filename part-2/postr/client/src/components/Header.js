import { Link } from "react-router-dom";

export default function Header(props) {
  return (
    <header>
      <Link to="/">Postr</Link>
      <Link to="new">New Post</Link>
    </header>
  );
}
