# Social Hub

## Available Routes

### Create Post

- **Route**: `/create-post`
- **Method**: POST
- **Description**: Create a new post.
- **Middleware**: Authentication required.

### Get Post

- **Route**: `/get-post/:postId`
- **Method**: GET
- **Description**: Retrieve a specific post by its ID.
- **Middleware**: Authentication required.

### Get All Posts

- **Route**: `/get-all-posts`
- **Method**: GET
- **Description**: Retrieve all posts.
- **Middleware**: Authentication required.

### Get Blocked Posts

- **Route**: `/get-blocked-posts`
- **Method**: GET
- **Description**: Retrieve all blocked posts.
- **Middleware**: Authentication required.

### Unblock Post

- **Route**: `/unblock-post/:postId`
- **Method**: POST
- **Description**: Unblock a specific post by its ID.
- **Middleware**: Authentication required.

### Report Post

- **Route**: `/report-post/:postId`
- **Method**: POST
- **Description**: Report a specific post by its ID.
- **Middleware**: Authentication required.

### Unreport Post

- **Route**: `/unreport-post/:postId`
- **Method**: POST
- **Description**: Remove a report from a specific post by its ID.
- **Middleware**: Authentication required.

### Get All Posts By User

- **Route**: `/get-all-posts-by-user`
- **Method**: GET
- **Description**: Retrieve all posts by a specific user.
- **Middleware**: Authentication required.

### Get All Posts By Community

- **Route**: `/get-all-posts-by-community`
- **Method**: GET
- **Description**: Retrieve all posts in a specific community.
- **Middleware**: Authentication required.

### Get Latest Posts

- **Route**: `/get-latest-posts`
- **Method**: GET
- **Description**: Retrieve the latest posts.
- **Middleware**: Authentication required.

### Get Trending Posts

- **Route**: `/get-trending-posts`
- **Method**: GET
- **Description**: Retrieve the trending posts.
- **Middleware**: Authentication required.

### Upvote Post

- **Route**: `/upvote-post/:postId`
- **Method**: POST
- **Description**: Upvote a specific post by its ID.
- **Middleware**: Authentication required.

### Downvote Post

- **Route**: `/downvote-post/:postId`
- **Method**: POST
- **Description**: Downvote a specific post by its ID.
- **Middleware**: Authentication required.

### Delete Post By Id

- **Route**: `/delete-post/:postId`
- **Method**: DELETE
- **Description**: Delete a specific post by its ID.
- **Middleware**: Authentication required.

### Update Post By Id

- **Route**: `/update-post/:postId`
- **Method**: PUT
- **Description**: Update a specific post by its ID.
- **Middleware**: Authentication required.
