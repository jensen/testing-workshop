import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { mockPut, mockDelete } from "../../mocks/server";

import Post from "../show";

import { renderWithPosts } from "./helpers";

const Router = (props) => {
  return (
    <Routes>
      {/* eslint-disable-next-line testing-library/no-node-access */}
      <Route path="/*" element={props.children} />
      {/* eslint-disable-next-line testing-library/no-node-access */}
      <Route path="/:id/*" element={props.children} />
    </Routes>
  );
};

describe("show", () => {
  it("renders the page", async () => {
    renderWithPosts(
      <Router>
        <Post />
      </Router>,
      { route: "/1" }
    );

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.getByText("Post Title")).toBeInTheDocument();
    expect(screen.getByText("Post Content")).toBeInTheDocument();
  });

  it("switch to the edit page when clicking on edit link", async () => {
    const { user } = renderWithPosts(
      <Router>
        <Post />
      </Router>,
      { route: "/1" }
    );

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();

    await user.click(screen.getByText("Edit"));

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/1/edit");
  });

  it("removes the post when deleted successfully", async () => {
    const { user } = renderWithPosts(
      <Router>
        <Post />
      </Router>,
      { route: "/1" }
    );

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();

    await user.click(screen.getByText("Delete"));

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(window.location.pathname).toBe("/");
  });

  it("handles the error when cannot delete", async () => {
    mockDelete("/api/posts/:id").error(500);

    const { user } = renderWithPosts(
      <Router>
        <Post />
      </Router>,
      { route: "/1" }
    );

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();

    await user.click(screen.getByText("Delete"));
  });
});

describe("edit", () => {
  it("renders the page", async () => {
    renderWithPosts(
      <Router>
        <Post />
      </Router>,
      { route: "/1/edit" }
    );

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
  });

  it("redirects to the post after update", async () => {
    const { user } = renderWithPosts(
      <Router>
        <Post />
      </Router>,
      { route: "/1/edit" }
    );

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Edited Title");

    await user.click(screen.getByText("Save"));

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));
  });

  it("displays errors for invalid body data", async () => {
    mockPut("/api/posts/:id").error(400);

    const { user } = renderWithPosts(
      <Router>
        <Post />
      </Router>,
      { route: "/1/edit" }
    );

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Edited Title");

    await user.click(screen.getByText("Save"));

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(window.location.pathname).toBe("/1/edit");
    expect(screen.getByText("The error message")).toBeInTheDocument();
  });
});
