# Social Hub

Social Hub is a community-driven platform that empowers users to share, discuss, and discover content on a wide range of topics. Similar to Reddit, it provides a space for individuals to engage in conversations, post content, and connect with like-minded users. Whether you're interested in news, hobbies, or niche interests, Social Hub is the place to explore, contribute, and stay informed within diverse communities. Join us and be a part of the discussion!


## Available Routes

## Authentication Controller Routes

| Route                 | Method | Description                                      | Middleware           |
|-----------------------|--------|--------------------------------------------------|-----------------------|
| `/register`           | POST   | Register a new user.                            | None                  |
| `/login`              | POST   | Login a user.                                   | None                  |
| `/user-details`       | GET    | Get user details.                               | Authentication       |
| `/reset-password`     | PUT    | Reset user password.                            | Authentication       |


## Post Controller

| Route                     | Method | Description                                         | Middleware           |
|---------------------------|--------|-----------------------------------------------------|-----------------------|
| `/create-post`            | POST   | Create a new post.                                 | Authentication       |
| `/get-post/:postId`       | GET    | Retrieve a specific post by its ID.               | Authentication       |
| `/get-all-posts`          | GET    | Retrieve all posts.                                | Authentication       |
| `/get-blocked-posts`      | GET    | Retrieve all blocked posts.                        | Authentication       |
| `/unblock-post/:postId`   | POST   | Unblock a specific post by its ID.                | Authentication       |
| `/report-post/:postId`    | POST   | Report a specific post by its ID.                 | Authentication       |
| `/unreport-post/:postId`  | POST   | Remove a report from a specific post by its ID.   | Authentication       |
| `/get-all-posts-by-user`  | GET    | Retrieve all posts by a specific user.            | Authentication       |
| `/get-all-posts-by-community` | GET | Retrieve all posts in a specific community.     | Authentication       |
| `/get-latest-posts`       | GET    | Retrieve the latest posts.                        | Authentication       |
| `/get-trending-posts`     | GET    | Retrieve the trending posts.                      | Authentication       |
| `/upvote-post/:postId`    | POST   | Upvote a specific post by its ID.                 | Authentication       |
| `/downvote-post/:postId`  | POST   | Downvote a specific post by its ID.               | Authentication       |
| `/delete-post/:postId`    | DELETE | Delete a specific post by its ID.                 | Authentication       |
| `/update-post/:postId`    | PUT    | Update a specific post by its ID.                 | Authentication       |

## Community Controller Routes

| Route                                 | Method | Description                                         | Middleware           |
|---------------------------------------|--------|-----------------------------------------------------|-----------------------|
| `/create`                             | POST   | Create a new community.                            | Authentication       |
| `/get-all-communities`                | GET    | Retrieve all communities.                          | None                  |
| `/get-community/:communityId`         | GET    | Retrieve a community by its ID.                    | None                  |
| `/join-community/:communityId`         | POST   | Join a community by its ID.                        | Authentication       |
| `/promote-to-moderator/:communityId`   | POST   | Promote a user to moderator in a community.        | Authentication       |

## Comment Controller Routes

| Route                                  | Method | Description                                      | Middleware           |
|----------------------------------------|--------|--------------------------------------------------|-----------------------|
| `/create-comment/:post_id`             | POST   | Create a comment on a specific post.            | Authentication       |
| `/get-comments/:post_id`               | GET    | Retrieve comments for a specific post.          | Authentication       |
| `/get-comment-replies/:comment_id`     | GET    | Retrieve replies for a specific comment.        | Authentication       |
| `/delete-comment/:comment_id`          | DELETE | Delete a specific comment by its ID.            | Authentication       |

## Bookmark Controller Routes

| Route                                   | Method | Description                                      | Middleware           |
|-----------------------------------------|--------|--------------------------------------------------|-----------------------|
| `/add-bookmark/:postId`                 | POST   | Add a bookmark to a specific post.              | Authentication       |
| `/remove-bookmark/:postId`              | DELETE | Remove a bookmark from a specific post.         | Authentication       |
| `/get-bookmarks`                        | GET    | Get all bookmarked posts for the user.          | Authentication       |

## File Upload Controller Routes

| Route                                | Method | Description                                      | Middleware           |
|--------------------------------------|--------|--------------------------------------------------|-----------------------|
| `/single-file-upload`                | POST   | Upload a single file.                           | None                  |
| `/multiple-file-upload`              | POST   | Upload multiple files (up to 5).               | None                  |
| `/delete-file/:name`                 | DELETE | Delete a file from Firebase storage by name.   | None                  |


