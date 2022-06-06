# Testing Software - Part Two

## Sections

1. Taking Control
2. Isolation
3. The Spectrum
4. Determinism
5. Espionage
6. Services
7. Making Matchers

## 1. Taking Control

Approaches to testing software vary across ecosystems. Ruby on Rails was the first significant web framework to include automated testing. The framework makes it easier to write tests by providing skeleton test code for generated classes.

Since the release of Ruby on Rails in 2004, we have seen a rise in the popularity of server JavaScript. Node.js provides a JavaScript runtime built on Chrome's V8 engine. Before the release of Node.js, JavaScript testing was limited to the browser environment. Today it is common to simulate a browser environment in Node.js to run our tests.

To implement automated testing in any environment, we need a test runner. Our test runner will find test files in our project, run them, and report the results. We also need an assertion library, otherwise, the results of running a test aren't very useful. RSpec provides these features through four different libraries.

- **rspec-core:** The spec runner provides a rich command-line program, flexible and customizable reporting, and an API to organize your code examples.
- **rspec-expectations:** Provides a readable API to express the expected outcomes of a code example.
- **rspec-mocks:** Test double framework, providing multiple types of fake objects to allow you to tightly control the environment in which your specs run.
- **rspec-rails:** Supports using RSpec to test Ruby on Rails applications in place of Rails' built-in test framework.

Like Ruby, when we are using JavaScript, we have many options for testing tools. Mocha is one of the original test runners, while Chai provides a vast assertion library. These tools are not as popular as they used to be. Lately, most developers prefer Jest or vitest.

All of these tools allow us to mock parts of our code. Mocking is an important consideration when designing a test suite. There are numerous reasons to replace production code with test doubles.

- We can **isolate** our test subject by mocking its collaborators.
- We can make our tests **deterministic** by mocking dependencies that aren't.
- We can **spy** on methods to ensure they are used predictably.
- We can replace **services** with simple mocks to avoid complex network operations.

Test doubles allow us to punch holes in reality. Exploring how to take advantage of these tools lets us write tests that focus on the question, “_What are we testing?_”.

## 2. Isolation

We can isolate the subject under test by mocking its dependencies. Isolation lets us focus on unit testing the behaviour of our subject. Our primary goal is to design a unit test that is manageable. We don’t need to perform unit tests with complete isolation if retaining the coupling between a subject and its collaborators is easier than mocking.

It is recommended that we avoid writing a test that is aware of the implementation details of our subject. We should focus on the interface, the arguments and the return value. Unfortunately, this can be a hard rule to follow as it is highly dependent on how the code we are testing is written.

This example represents two classes that are capable of saving files.

```ruby
class FileSystem
  def save
    "saved to: file system"
  end
end

class S3
  def save
    "saved to: s3"
  end
end
```

We can use either, or both of these classes with an `Uploader` class. The uploader class is responsible for managing the file uploads, but it doesn’t actually save them. Instead, it instructs another class that implements the required interface to perform the operation.

```ruby
class Uploader
  def initialize(local = true)
    @storage = local ? FileSystem.new : S3.new
  end

  def upload
    @storage.save
  end
end
```

Our first example `Uploader` can be created with a `local` argument. This allows us to decide if we want to send the file to S3 or keep it on the File System of the server. During the test, we might not want to write an actual file to the local File System. If we did, we would need to remove that file as part of the cleanup. It is unlikely that we would want to upload the file to a remote server for the same reason.

In order to mock the collaborators, we have to know how this class is implemented. The dependencies are hardcoded in the class. Instead, we might want to use “Dependency Injection” to provide a storage instance as an argument.

```ruby
class Uploader
  def initialize(storage:)
    @storage = storage
  end

  def upload
    @storage.save
  end
end
```

Now the dependency is explicitly part of the interface, so we don’t need as much knowledge of the implementation of our class. We can create a mock object and pass it as an argument when we instantiate our test subject.

## 3. The Spectrum

Integration tests exist on a spectrum of mocking. As we leave the realm of unit testing and focus on testing the integration of many systems we will use fewer mocks. Eventually, we will be writing end-to-end tests that use as much production code as possible.

Rails request tests are a good example of integration tests. Included in a test is a verification that a request of a specific method to a specific path results in a response that we expect. This will provide coverage of the controller, model and view code representing the feature we are testing. Writing integration tests like this provides a good balance of test coverage vs. test complexity.

The setup of request tests can be simplified through the use of mocks, but it might be better to run production code to achieve the same result. This decision makes writing integration tests tricky, tests that are hard to write are likely going to be more trouble than they are worth. We should try and make tests as easy to write as possible.

One common example of setup required during request tests is user authentication. When we test endpoints that require user authentication with cookies, we need to ensure that our session is set before making our target request. We can do this by posting to our session creation route.

```ruby
post sessions_path, params: { session: attributes_for(:user, email: "user@test.com") }
```

Instead of writing this in each test that requires the user to log in, we could write a helper function that is easier to remember. This requires an initial test helper setup, but for common tasks, it can provide a clean abstraction.

```ruby
login("user@test.com")
```

We can take this further by writing a test route that allows us to define a session directly. This might be easier than performing all of the tasks a user would.

```ruby
set_session(user_id: user.id, cart_id: cart.id)
```

The `set_session` helper function makes a `post` request to the `test_sessions_path`. This endpoint will only exist in the test environment.

```ruby
if Rails.env.test?
  namespace :test do
    resources :sessions, only: [:create]
  end
end
```

Our controller takes the `session_vars` and sets them within the rails `session`.

```ruby
module Test
  class SessionsController < ApplicationController
    def create
      vars = params.permit(session_vars: {})
      vars[:session_vars].each do | var, value |
        session[var] = value
      end

      head :created
    end
  end
end
```

An alternative approach might have us directly mocking any instance of our `SessionHelper` or `CartHelper`. An approach like this is a brute force way to ensure our helpers return a specific value.

## 4. Determinism

In some cases, we might be required to write code that includes randomness. This can make it very hard to test a subject in a deterministic way. For the purpose of testing, we can replace a function that returns a random result with one that always returns the same result.

In our example, we have a function called `findPlacement` that returns the coordinates of a ship on a grid of a specified size. This function uses the built-in `Math.random` method to generate a value between `0` and `1`.

```jsx
export const findPlacement =
  (state: Placement[]) => (direction: Symbol, size: number) => {
    while (true) {
      const long = Math.floor(Math.random() * GAME_BOARD_SIZE);
      const short = Math.floor(Math.random() * (GAME_BOARD_SIZE - size - 1));

      const cells = [];

      for (let i = short; i < short + size; i++) {
        cells.push(
          direction === DIRECTION.HORIZONTAL
            ? GAME_BOARD_SIZE * long + i
            : GAME_BOARD_SIZE * i + long
        );
      }

      if (cells.every((value) => state[value] === null)) {
        return cells;
      }
    }
  };
```

Another example that requires us to test with knowledge of the implementation. To ensure that we can write deterministic assertions about the return values of this function, we need to mock the `Math.random` function to return a predictable result.

```jsx
vi.stubGlobal("Math", {
  random: vi.fn(() => 0.2),
  floor: vi.fn(Math.floor),
});
```

Since we are replacing the global `Math` object, we also need to provide an implementation for `Math.floor`, another dependency that we know about.

## 5. Espionage

A test double can typically record information on how it was called. This can be useful because we can assert to verify that it is called as we expect it to be. We can mock a method, run the code that performs the operation we are testing, and then verify that our method is called the correct number of times with the correct arguments.

In the following example we are performing a file upload. We won’t actually upload the file, but we do want to verify that an attempt was made.

```jsx
expect(storageMock.stream).toBeCalledTimes(1);
expect(storageMock.stream).toBeCalledWith(
  "abc-123/index.html",
  expect.any(Readable)
);
```

Using the example of the `findPlacement` test, we can confirm that the `Math.random` method is called the expected number of times. Our code calls `Math.random` twice, once for the x axis and once for the y axis.

```jsx
expect(Math.random).toBeCalledTimes(2);
```

When we test that `findPlacement` will continue to retry until it finds a location that is vacant, we expect the `Math.random` method to be called four times.

## 6. Services

Services make our applications interesting. Often we interact with them to store data. We can mock our services to avoid network operations and database cleanup. In our JavaScript example, we import a module for each service. Mocking these modules lets us control their behaviour when invoked by our production code.

```jsx
vi.mock("~/services/db.server.ts", () => ({
  query: vi.fn(),
}));
```

Our module exports a query method, and we ensure that it is replaced with a mock object. We can attach responses using the mock object API that forces our service to resolve or reject a promise.

```jsx
import * as db from "~/services/db.server";

const dbMock = { query: db.query as unknown as SpyInstance };

dbMock.query.mockResolvedValueOnce([
  { name: "Neighbourhood", description: "Description" },
]);
```

Other tools exist to help us mock requests that our application makes. When we test a client application that makes HTTP requests to a backend API, we can mock all of those requests using service workers. [Mock Service Workers](https://mswjs.io/) intercept requests at the network level. To handle a request, we create a request handler that sends a response with test data.

```jsx
rest.get("/api/posts", (request, response, context) =>
  response(
    context.json([
      {
        id: 1,
        title: "Post Title",
        content: "Post Content",
      },
      {
        id: 2,
        title: "Second Title",
        content: "Second Content",
      },
    ])
  )
);
```

The production code makes a `fetch` request to the `/api/posts` endpoint, the mock service worker intercepts the request and delivers a response created by our handler.

## 7. Making Matchers

Matchers make writing specific assertions for the domain we are testing easier. We may expect an element to be in the document when dealing with DOM after we fire an event. When we use spies, our matchers allow us to check that our code calls a function with specific arguments. We can even expect that a function we call throws an error.

A custom matcher may be required if we don’t currently have a matcher available to verify our assumptions. In this case, we want to confirm that the function we call throws a response object when encountering an error.

```javascript
await expect(() =>
  action({
    request,
    params: {},
    context: {},
  })
).toThrowResponse(401);
```
