export default function ErrorFallback(props) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{props.error.message}</pre>
      <button onClick={props.resetErrorBoundary}>Try again</button>
    </div>
  );
}
