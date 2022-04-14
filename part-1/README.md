# Testing Software - Part One

## Sections

1. Why
2. Specifications
3. Instincts
4. Testing Parlance
5. Shipping Features
6. Designing Tests

## 1. Why

Software build stability is critical for high-performing teams. The entire software development process relies on our ability to test our software. Approaches to how teams ensure stability vary depending on numerous factors. As teams and projects grow, so does the complexity of keeping a build stable.

Continuous integration is the term used to describe the practice of regularly merging and testing changes to a software project. The more code we change, the more we must test those changes. We use a continuous integration tool to automate the build and test process. It reports any failure back to the team. The ability to catch bugs early is highly dependent on how we design our testing strategy.

It is possible to release a project without any automated tests. If that project needs to scale, it can continue to do so within the constraints of how well we can test it manually. Manual testing doesn’t typically offer a consistent approach without a strict process.

To scale a project past this sticking point, we can add automated testing to our workflow. We can approach our coding with a mindset that considers testing early. As we scale the project, we can be confident in the stability of our build because we have tests that are run consistently and regularly.

## 2. Specifications

Software most often starts as a concept. We need to provide a user with the ability to perform specific actions. When the user performs the actions, the software will provide feedback to the user. During the software development process, we must define the specification for how the software should behave.

The person writing the software is not likely to be the same person deciding what actions a user can take or the feedback they will receive. When this is the case, communication between these parties becomes critically important. It is pretty common to build features iteratively, and as a result, we might need to change the software specifications as we learn more about how our users interact.

Change is good; it allows us to improve our software over time. As a developer, it is essential to embrace this change because the world in which our software exists is constantly changing. We can use change to our advantage in a couple of different ways.

When it comes to satisfying business requirements, we need to be able to adapt to these as they change. In an ideal situation, some research exists to support a concept. The designer shares the concept with a developer who can change the software with little risk to the stability of the existing product. We will label this behaviour as "shipping features".

The less common change that we should use to our advantage is the ability to change our code without providing new functionality. The ability to change our software to support new features is the focus of our work. Sometimes we make a good decision today, which turns out to be bad for future iterations. We should change the software to support our current understanding when we recognize it is necessary. We will label this behaviour as "refactoring".

Complex software development on a schedule can easily lead us to make trade-offs. Suppose we decide to write code a certain way to ship a feature quickly today. We also need to commit to the future refactoring work necessary to maintain the software's ability to change. We can build this into our development process.

## 3. Instincts

A new developer who understands a required specification will often start by adding code to the project. The requirement may be something they have no previous experience with; maybe some research is necessary first. They are familiar with the specification, so confidence comes from testing the software they build directly in the browser. They take on a user's role, click the same buttons, and read the same notifications.

Early on, our instincts may lead us to write code that we believe satisfies a requirement, then test it manually. An approach like this is satisfactory when we learn how to write code or even work on small projects. As a project grows, a dangerous pattern could emerge if our instinct is to avoid change because we can no longer manually test the entire scope of the project.

> We need to train our instincts to consider how we can test early, soon after we learn the requirements.

### Test First

Test-driven development should be a term that is familiar to everyone. It is not my recommendation to immediately adopt a test-first method of programming. It is possible to include it in our workflow slowly. Writing tests first encourages us to write code in a testable way.

We start by writing a test that fails. A failing test allows us to remove a lot of the doubt that can accompany writing a test after confirming that a feature works;

Then we write the minimum code we need to pass the test. We can consider the code we are writing to be exploratory;

Then we refactor the code to a point where we believe it will be easier to change in the future.

Getting something to work the first time can be difficult. When we complete an implementation that works, we may be hesitant to change it. The test removes any doubt that the code is working as specified. 

### Regression

Regression is an event where we re-introduce a defect into a codebase. We do regression testing to verify that no past bugs return. It is tough to achieve complete regression testing with a manual approach to testing. 

> We need to train our instincts to consider how we can test in a reproducible way as soon as we find a defect in our software.

Our instincts will push us towards a solution as fast as possible. That may work out fine in the short term; it allows us to go back to shipping features. In the long run, it is good to write a test that fails before applying any solution. When we write an automated regression test, we can confirm we have fixed the defect at this point and before every release of future versions.

## 4. Testing Parlance

A challenge we face when learning a new area of software development is learning the associated terms. There are a lot of opinions on how to test software with that comes a lot of terminologies that we can clarify. We want to understand the concept behind these terms so that we can navigate the various testing techniques.

### Assertion

An assertion is a statement that confirms that an expression is true. We can perform an assertion within tests and development code.

### Subject

The subject is the target of the test.

### Collaborators

The collaborators are other objects with which the subject interacts.

### Test Doubles

Test doubles replace a release-intended object or procedure for testing purposes.

**Fake**: Working implementation replaces actual dependency.

**Stub**: Provides hard-coded responses to calls made during the test.

**Spy**: Stubs that record information about how we call them.

**Mock**: Object pre-programmed with expectations of the calls they are to receive. It can be verified after we exercise the subject.

### Static Test

A static test is run without executing the code. Instead, we analyze it for defects at the source level. Lint and TypeScript are two examples of static testing.

### Unit Test

A unit test focuses on an isolated subject.

### Integration Test

An integration test verifies the integration of a subject and its collaborators.

### End-to-end Test

An end-to-end test simulates the user interacting with the production environment.

### Coverage

Coverage allows us to track the code execution when we run our tests. Reports describe which functions, statements and branches the code invokes during execution.

### Matchers

Matchers are helper methods that we use to make assertions easier.

## 5. Shipping Features

Employment comes with the expectation that we will ship features regularly. When we start a new project, it can be tempting to focus primarily on adding new features. The project's scope is limited. Therefore we can keep most of the test plan in our heads. Commonly, a new project starts with a small team. Communication is much easier when there is a low number of contact points.

Projects that are more mature and have had many developers have a maintenance cost. We can't expect everyone to always make the best architectural decisions. We also don't know that everyone is uniformly testing the existing features. However, developers can implement a process that allows them to ship new features and refactor code when required. We recognize that work is needed to maintain a codebase that accepts change.

When we have an unstable build, we spend a lot of time on unplanned work. When we find that bugs are preventing us from shipping new features, we need to evaluate whether our process for testing is adequate. Continuing to ship features while ignoring regression in build stability leads to a tipping point that can be hard to rebalance.

Elevating the importance of testing during the design process is a valuable first step in improving a poor situation. Testing should not be an afterthought; it makes performing the tests more difficult. When defining the specifications for a new feature focusing on the positive path is exciting, but it only describes a user flow where nothing goes wrong. A testing mindset forces us to also consider how to handle the negative path.

## 6. Designing Tests

There are a lot of opinions and approaches to testing software. The types of tests we write will vary depending on the libraries we use, the layer of the stack we are working on and how we design our interfaces.

- We can write tests first and then write the code to satisfy the tests;
- We can write tests to prove that our software doesn’t regress;
- We can write tests to help us refactor internal implementations.

When we start with a specification, the code we need to support the features may exist publicly. Open source code would most likely come as a library or HTTP-based API. It could be a Gem or a Node package. When we decide to use a library, the quality of the testing of the library has to be a significant consideration.

If a library lacks testing, it could have numerous defects, including regressions on bugs fixed in previous versions found during upgrades. A library should have a good series of automated tests to prove that it works the same way as its documentation specifies. When we can trust the library API to perform a certain way, we can decide how to write our tests to focus on weak points in our integrations.

> [Rails](https://github.com/rails/rails) has a test suite for each of the submodules. We can see the [ActionView](https://github.com/rails/rails/blob/main/actionview/test/template/form_tag_helper_test.rb) form tag helper tests for more details.

It is possible to use tests to learn the API of externally produced software. If you introduce a new library to a project, you can confirm your understanding by running tests against it. We can use the information that we gather during this process to inform future test writing, where we may need to provide a test double for the library as a dependency. We can run these tests against new versions of the package to test that our usage is still supported before committing to an upgrade.

With a curated list of dependencies, we can focus our testing efforts on our own application. Most of these techniques are transferable between testing environments. The underlying concepts should hold whether we are testing a JavaScript, Python or Ruby environment. The recommendations assume a focus on testing full-stack web applications.

### Planning

As part of our effort to teach our instincts to consider testing early in the process, we can practice by making lists of what we need to test to be confident we are shipping stable features. Imagine that we are blocked because we decide what our first test should be, but we don’t know how to implement that kind of test. With a list of tests, we can choose the best test we know how to write at this moment.

We can go through this exercise using a tic-tac-toe game engine as the example subject. The list of tests could resemble the following:

- Initialize grid state
- Select cell
- Check win condition
- Check tie condition
- Alternate player turn
- Reset game state

If any of the items on the list require more than one step, it will make sense to break the tests down and add them to the list. When we are focused on a task and think of a test that we should write, we can add it to our list. Once it’s on the list, we can return focus to completing our current task. The fresh item will be there the next time we choose what to work on.

### Isolation

Ensure that no tests depend on the successful completion of any other test. Modern testing frameworks assume that each test is run in isolation. In some cases, test runners will ensure that they run the tests in a random order each time.

### Skipping Tests

It should never be acceptable to use comments to avoid running a test. The two valid options when a situation is encountered where a test is failing, but there is no time to resolve it is either to remove the test or skip it.

It is reasonable to remove the test if it is no longer useful because we have changed our specification for a feature. We can also remove a test if it is proving to be redundant.

### Choosing a Test Type

Choosing the type of test to write can be a challenge. There is concern over writing too many tests and overlapping coverage. Although it is possible to work on a project with too many tests, it is more likely to join a project with minimal or no testing. If we ever determine that we have too many tests, we should delete those we no longer need.

As we move from unit to integration to end-to-end tests, we gain more confidence. We also increase the complexity and maintenance costs. Manual tests where we load a page in the browser and click on interactive elements are replicated most closely through end-to-end tests.

It is good to have several end-to-end tests that navigate through the different navigational flows of a web application. For example, a user can log in and order from a food delivery service. Creating an automated script that performs the actions necessary to prove that these features work in a production-like environment can save valuable testing time.

Integration tests exist between the unit and end-to-end tests; they allow us to confirm that multiple units work together. When we are testing API endpoints, we want to be able to make a request and confirm that the data returned in the response is what we expect. These tests include integrating the router, the API handler and the ORM or database.

Unit tests are the most specific; they focus on a single method. It is encouraged to write many small tests, each one including a single assertion. We avoid writing tests that know how the subject is implemented since this is a bad pattern. When the subject has collaborators, we use test doubles to fill in.

We don’t apply the same rules to each type of test. For example, we may limit our unit tests to a single assertion but allow for multiple assertions throughout an end-to-end test. If our end-to-end test is slow to set up and tear down, we can test more functionality in a single test.

These high-level categories of tests can be broken down further depending on the framework we are using. A Rails project that uses RSpec will likely have unit tests for Models, Helpers and Views. Instead of writing tests for a Controller, we can write integration tests that make requests through the router. Adding Capybara lets us perform feature tests in a browser with JavaScript support.

If we are unsure of the type of test to choose, we should ask ourselves, “What are we testing?”.

**What are we testing?**

One concrete example would be in the context of our tic-tac-toe game. We want to display a notification in the user interface when either user wins. We could write an end-to-end test that proves this behaviour by performing the following steps:

1. Visit the game page
2. Alternate clicking on squares, ensuring one user gets three in a row
3. Check that the notification popup appears

Our view has a dependency on a function called `getWinner(state: Array<"x" | "o" | null>): "x" | "o" | null` that takes an array of nine values and returns either "x", "o" or `null`. When a square is chosen, its value is either "x" or "o"; otherwise, `null` indicates that it is still available. A valid input would be `["x", "x", "x", null, null, null, null, null, null]`, which should result in a win for "Player X". There are at least seven other valid inputs that describe possible win conditions. Writing an end-to-end test for each win condition is not the most valuable use of time.

Our end-to-end test needs to trust that `getWinner` works as designed. We can write a test for each possible win condition at the unit level, which is less complex because we isolate the function responsible for determining the win condition. We can add another end-to-end test to have the alternate player win instead if we choose to. The confidence gained from the second end-to-end test is low compared to the confidence added by unit testing each win condition.

It is usually easier to see the gaps in coverage when we write an end-to-end test before a unit test. We would write the `getWinner` tests before the function is available in a test-driven workflow. With a complete set of tests, the entire function will be tested. We should ensure that we don't create a full set of duplicate end-to-end tests to test all win conditions.

### Example Project

[Food Conveyer Coop](https://github.com/jensen/conveyer-coop) is an example Rails 7 project that uses RSpec.

### Data

Ensuring that our project code is provided with the needed data while running our tests is one of the more time-consuming parts of writing tests. We use helpers like factories to generate our data dependencies to reduce overhead. 

Factories let us keep test data visible and close to the tests. Keeping test data visible in a test makes it easier to use in an assertion.

### Structure

A good default structure for a test follows the Arrange, Act, Assert steps. We can use many terms to describe these steps, for example, Setup, Exercise and Validate. Each step has a purpose, the first one being focused on preparation.

**Arrange**: We create any data dependencies and doubles needed to test the subject during the setup step. It is common to share the setup code between multiple tests in the same context. 

**Act**: The second step exercises the subject under test. This can be calling a function or making an HTTP request. The purpose is to run the code we want to validate in the final step.

**Assert**: Running the code is not enough; we also need to verify that the code meets specifications. We can make one or more assertions about what we expect to be true during the verification step.

All tests should have these steps, but it is reasonable to change the order to satisfy a testing style. We can create expectations that our code will call specific methods with mocks, which we do before we act on the subject. End-to-end tests that test entire flows will likely splice multiple instances of each step many times in a single test.

## Using Code Coverage

Referring to code coverage can easily lead us to think of a metric. With coverage tools, we can prove that we run a certain percentage of the lines of source code within a test environment. Although this metric is useful, we can only determine we are running the code, not how we are running the code.

Code coverage reports can act as a guide. It highlights the sections of our code that are not run during our automated process. If we design a good test that also increases code coverage, then we are improving the quality of our automated test suite.