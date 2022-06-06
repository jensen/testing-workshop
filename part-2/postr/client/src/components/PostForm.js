import FormError from "./FormError";

export default function PostForm(props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit(event);
      }}
    >
      <label>
        Title
        <input type="text" name="title" defaultValue={props.title} />
      </label>
      <label>
        Content
        <textarea name="content" defaultValue={props.content} />
      </label>
      {props.error && <FormError error={props.error} />}
      {props.children}
    </form>
  );
}
