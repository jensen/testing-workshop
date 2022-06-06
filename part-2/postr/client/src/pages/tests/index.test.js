import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import { mockGet } from "../../mocks/server";

import Index from "../index";

import { renderWithPosts } from "./helpers";

describe("index", () => {
  it("does not render a list when loading", () => {
    renderWithPosts(<Index />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByTestId("post-list")).not.toBeInTheDocument();
  });

  it("renders an empty list after loading", async () => {
    mockGet("/api/posts").response([]);

    renderWithPosts(<Index />);

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.queryByText("Post Title")).not.toBeInTheDocument();
  });

  it("renders a post item", async () => {
    renderWithPosts(<Index />);

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.getByText("Post Title")).toBeInTheDocument();
  });

  it("handles the error when the posts don't load", async () => {
    mockGet("/api/posts").error(500);

    renderWithPosts(<Index />);

    await waitForElementToBeRemoved(screen.queryByTestId("loading"));

    expect(screen.queryByText("Post Title")).not.toBeInTheDocument();
  });
});
