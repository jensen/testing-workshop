# Testing Software - Part Two

## Sections

1. Confidence
2. Visual Regresssion
3. Static Analysis
4. Simulation
5. End-to-End

## 1. Confidence

Confidence allows us to commit code and deploy it to a production server. Testing is a pre-requisite to deployment since we would like to catch defects before making them available to the public. If we don’t catch an issue before deployment, we should be able to roll our changes back quickly.

One of the benefits of unit tests is that they work well with pure functions; unit tests give us confidence that the functions work in a particular way. Graphical interfaces are challenging to test well. As users, we judge interfaces based on what we see. We like to interact with an in-development feature the same way we expect our end users to, and we are the most confident that things work when we test in a web browser.

Automated tests provide a consistent approach to running application code for all developers on a team; we can use them to refactor code and add new features with confidence. Tests that are slow to write and run can hinder iteration, but we can rarely consider them slower than manual testing. We aim to write tests that emulate the same interactions we perform during manual testing. Testing is half of the coding process, and testing code can be much easier if we design the subject under test with testability as a requirement.

The `FetchAndRender` function depends on an external system. The API endpoint needs to return data; otherwise, the `items` array stays empty.

```jsx
function FetchAndRender() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/items")
      .then((response) => response.json())
      .then((items) => setCache(data));
  }, []);

  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>{item}</li>
      ))}
    </ul>
  );
}
```

We could split the single component up into two components and write tests against a pure Items component. These tests are valuable when they are testing complex conditional rendering state.

```jsx
function Items(props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>{item}</li>
      ))}
    </ul>
  );
}

function Fetch() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/items")
      .then((response) => response.json())
      .then((items) => setCache(data));
  }, []);

  return <Items items={items} />;
}
```

If we want to test that the data is fetched, cached and rendered, then we need to write an integration test.

## 2. Visual Regression

We either build web applications top-down or bottom-up. The approach that we choose will have a direct impact on the interfaces that we design for our components. When we break our application into smaller components, if we rarely consider these components as isolated units, we end up with a lot of components that mostly pass props from parent to children.

For larger applications, it is common to use a tool like Storybook to manage the isolated development of shared components. Components are much easier to develop, test and document when we use [supportive tools](https://storybook.js.org/tutorials/visual-testing-handbook/).

When we have large teams working on component libraries, we want to make it as easy as possible for designers to verify that the interface matches their designs. Pair Storybook with [Chromatic](https://www.chromatic.com/) to gain access to more features like automated visual testing and collaborative review.

https://user-images.githubusercontent.com/14803/179072046-6c33cae5-d2b3-4cf2-8da6-042d07e4ddfa.mp4

We can see how larger organizations use Storybook by browsing their showcase.

## 3. Static Analysis

We can use JavaScript to write a function that adds two numbers.

```jsx
function add(a, b) {
  return a + b;
}
```

When we call this function with numbers, the result is as expected.

```jsx
console.log(add(1, 2));
```

If we call the `add` function using strings instead, the result is string concatenation.

```jsx
console.log(add("1", "2"));
```

[TypeScript](https://www.typescriptlang.org/play) allows us to declare the expected type for values. The compiler gives us immediate feedback when we do not adhere to the expected interface.

```jsx
function add(a: number, b: number) {
  return a + b;
}
```

Writing software requires us to write functions and pass values around. We want to declare the types of values we pass around and let TypeScript verify their usage. Ideally, we let type inference do most of the hard work. Building applications with React and TypeScript generally requires two areas of focus when declaring types.

- The props that we pass to a component.
- The data that we fetch from a server.

Tools like ESLint provide an automatic way to check code for specific harmful patterns. We reduce the code review burden on our teammates if we use static analysis tools. If we notice that code review comments mostly focus on issues that ESLint could catch, we should take steps to catch them early with automation.

## 4. Simulation

A simulated browser environment provides a good compromise between speed and capabilities. The simulation doesn't render pages but provides a replica of the browser's DOM API. When we run tests with [jest](https://jestjs.io/) or [vitest](https://vitest.dev/) we can run those tests in an environment like node, which wouldn't know what a `window` is or [jsdom](https://github.com/jsdom/jsdom), which provides a fake implementation for things like `localStorage`.

Two significant differences exist between these component integration tests and most end-to-end tests.

1. We simulate the browser environment.
2. We mock external services.

We can render our React components using a simulated DOM and assert that the manipulation performed by React is what we expect it to be. Many libraries are combined to build an environment that can render and interact with React components, including our primary testing API provided by [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/). 

We limit the API we use to find elements on purpose; it forces us to consider how a user would interact with our components. We can make our application easier to test by making it more accessible to screen readers. We should give custom drop-down elements relevant [roles](https://testing-library.com/docs/queries/about#priority), and input elements should have labels. As a last resort, we can assign specific test ids to elements to avoid using CSS selectors.

Most of the challenge of writing tests comes from the asynchronous nature of user interfaces. When we click on buttons, we need to wait until things change before we can take our next step. Our testing tools help us by providing a relevant API.

## 5. End-to-End

Testing our application in an environment that matches production will always provide the highest level of confidence. We can replace our simulated browser environment with a real browser and make requests to our application from top to bottom. While we can run these tools locally, they are most often used for continuous integration.

- [Selenium Webdriver](https://www.selenium.dev/documentation/webdriver/)
- [WebdriverIO](https://webdriver.io/)
- [Cypress](https://go.cypress.io/)

There are @testing-library packages for both [WebdriverIO](https://testing-library.com/docs/webdriverio-testing-library/intro) and [Cypress](https://testing-library.com/docs/cypress-testing-library/intro). We can use them to interact with the document in a familiar way. The same rules apply as before; write tests that mimic how real user interaction.

Cypress abstracts timing from testing using a concept called “retry-ability,” resulting in our having to write a lot less code to verify we are in the correct state before continuing with our tests. Due to this abstraction we will only use `findBy` queries, since `getBy` is incompatible and `queryBy` is redundant.
