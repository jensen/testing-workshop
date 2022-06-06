import { useContext, useReducer, useEffect, createContext } from "react";
import { ErrorBoundary } from "react-error-boundary";

import * as Request from "../api";

import Loading from "../components/Loading";
import ErrorFallback from "../components/ErrorFallback";

const TYPE = {
  START_LOADING: Symbol("Start Loading Operation"),
  LOAD_SUCCESS: Symbol("Successful Load"),
  LOAD_FAILURE: Symbol("Unsuccessful Load"),
  CREATE_SUCCESS: Symbol("Successful Create"),
  UPDATE_SUCCESS: Symbol("Sucessful Update"),
  DESTROY_SUCCESS: Symbol("Sucessful Destroy"),
};

const reducers = {
  [TYPE.START_LOADING]: (state, action) => ({ ...state, loading: true }),
  [TYPE.LOAD_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    error: null,
    data: action.posts,
  }),
  [TYPE.LOAD_FAILURE]: (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  }),
  [TYPE.CREATE_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    error: null,
    data: [...state.data, action.post],
  }),
  [TYPE.UPDATE_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    error: null,
    data: state.data.map((post) =>
      post.id === action.post.id ? action.post : post
    ),
  }),
  [TYPE.DESTROY_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    error: null,
    data: state.data.filter((post) => post.id !== action.post.id),
  }),
};

const reducer = (state, action) => {
  if (typeof reducers[action.type] === "function") {
    return reducers[action.type](state, action);
  }

  return state;
};

const PostsContext = createContext();

const PostsProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: TYPE.START_LOADING });

    Request.all()
      .then((posts) => {
        dispatch({ type: TYPE.LOAD_SUCCESS, posts });
      })
      .catch((error) => dispatch({ type: TYPE.LOAD_FAILURE, error }));
  }, []);

  return (
    <PostsContext.Provider value={{ ...state, dispatch }}>
      {state.loading ? <Loading /> : props.children}
    </PostsContext.Provider>
  );
};

export default function PP(props) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <PostsProvider {...props} />
    </ErrorBoundary>
  );
}

export const usePost = (id) => {
  if (typeof id !== "number") {
    throw new Error("Id must be a number");
  }

  try {
    const { dispatch, ...context } = useContext(PostsContext);

    const post = context.data.find((post) => post.id === id);

    const edit = async (body) => {
      dispatch({ type: TYPE.START_LOADING });
      try {
        await Request.edit(id, body);

        dispatch({
          type: TYPE.UPDATE_SUCCESS,
          post: { ...Object.fromEntries(body), id },
        });
      } catch (error) {
        dispatch({ type: TYPE.LOAD_FAILURE, error });
        throw error;
      }
    };

    const destroy = async () => {
      dispatch({ type: TYPE.START_LOADING });
      try {
        await Request.destroy(id);

        dispatch({
          type: TYPE.DESTROY_SUCCESS,
          post: { id },
        });
      } catch (error) {
        dispatch({ type: TYPE.LOAD_FAILURE, error });
        throw error;
      }
    };

    return {
      ...context,
      data: post,
      edit,
      destroy,
    };
  } catch (error) {
    throw new Error("Must be within PostsProvider.");
  }
};

export const usePosts = () => {
  try {
    const { dispatch, ...context } = useContext(PostsContext);

    const create = async (body) => {
      dispatch({ type: TYPE.START_LOADING });
      try {
        const post = await Request.create(body);

        dispatch({
          type: TYPE.CREATE_SUCCESS,
          post,
        });

        return post;
      } catch (error) {
        dispatch({ type: TYPE.LOAD_FAILURE, error });
        throw error;
      }
    };

    return {
      ...context,
      create,
    };
  } catch (error) {
    throw new Error("Must be within PostsProvider.");
  }
};
