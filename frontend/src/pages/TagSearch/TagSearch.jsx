import React from "react";
import styles from "./styles.module.scss";
import Grid from "@mui/material/Grid";

import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../components";
import { fetchPosts, fetchTags } from "../../redux/slices/posts";

const TagSearch = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isPostsLoading = posts.status === "loading";
  const [localTongler, setLocalTongler] = React.useState(true);

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <>
      <Grid xs={8} item>
        {(isPostsLoading
          ? [...Array(5)]
          : posts.items.filter((a) => a.tags.includes(tags.activeTag))
        ).map((obj, index) =>
          isPostsLoading ? (
            <Post key={index} isLoading={true} />
          ) : localTongler ? (
            <Post
              _id={obj._id}
              title={obj.title}
              imageUrl={
                obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
              }
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={userData === localStorage.token}
            />
          ) : (
            <div>
              <Post
                _id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData === localStorage.token}
              />
              <p>Новиопы за всё заплатят</p>
            </div>
          )
        )}
      </Grid>
    </>
  );
};

export default TagSearch;
