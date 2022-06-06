import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import NewPost from "../new";

import { mockPost } from "../../mocks/server";

import { renderWithPosts } from "./helpers";

describe("new", () => {
  it("renders the creation form", async () => {
    renderWithPosts(<NewPost />, { route: "/new" });

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
  });

  it("redirects to the post after creation", async () => {
    const { user } = renderWithPosts(<NewPost />, { route: "/new" });

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    await user.type(screen.getByLabelText("Title"), "Test Title");
    await user.type(screen.getByLabelText("Content"), "Test Content");

    await user.click(screen.getByRole("button"));

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(window.location.pathname).toBe("/1");
  });

  it("displayers errors for invalid body data", async () => {
    mockPost("/api/posts").error(400);

    const { user } = renderWithPosts(<NewPost />, { route: "/new" });

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    await user.type(screen.getByLabelText("Title"), "Test Title");
    await user.type(screen.getByLabelText("Content"), "Test Content");

    await user.click(screen.getByRole("button"));

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(window.location.pathname).toBe("/new");
    expect(screen.getByText("The error message")).toBeInTheDocument();
  });
});
