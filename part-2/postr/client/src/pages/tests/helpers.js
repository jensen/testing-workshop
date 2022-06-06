import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BrowserRouter } from "react-router-dom";

import PostsProvider from "../../context/posts";

export const renderWithPosts = (Component, options = {}) => {
  if (options.route) {
    window.history.pushState({}, "Test Page", options.route);
  }

  return {
    user: userEvent.setup(),
    ...render(Component, {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <PostsProvider>{children}</PostsProvider>
        </BrowserRouter>
      ),
    }),
  };
};
