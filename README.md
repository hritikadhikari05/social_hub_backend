# Social Hub

## Available Routes
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

