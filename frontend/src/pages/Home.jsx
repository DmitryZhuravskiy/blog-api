import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  fetchTags,
  sortByDate,
  sortByPopular,
} from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const [select, setSelect] = React.useState(0);

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    console.log(posts);
  }, [dispatch]);

  const sortToNewest = () => {
    const newItems = [...posts.items];
    const sortItems = newItems.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    dispatch(sortByDate(sortItems));
    setSelect(1);
  };

  const onClickPopular = () => {
    dispatch(sortByPopular());
    setSelect(2);
  };
  

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={select}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" onClick={sortToNewest} value={1} />
        <Tab label="Популярные" onClick={onClickPopular} value={2} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
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
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={tags.items}
            isLoading={isTagsLoading}
          />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
