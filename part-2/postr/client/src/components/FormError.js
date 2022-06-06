export default function FormError(props) {
  return (
    <div>
      {props.error.messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </div>
  );
}
