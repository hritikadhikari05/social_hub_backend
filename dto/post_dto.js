class PostDto {
  _id;
  title;
  content;
  author;
  community;
  is_sticked;
  upvotes;
  downvotes;
  upvotes_count;
  downvotes_count;
  reports;
  report_count;
  view_count;
  comments_count;
  created_at;
  updated_at;

  constructor(post) {
    this._id = post._id;
    this.title = post.title;
    this.content = post.content;
    this.author = {
      _id: post.author._id,
      firstName: post.author.firstName,
      lastName: post.author.lastName,
      userName: post.author.userName,
      profilePic: post.author.profilePic,
      bio: post.author.bio,
    };
    this.community = {
      _id: post.community._id,
      name: post.community.name,
      description: post.community.description,
      rules: post.community.rules,
      members: post.community.members,
      posts: post.community.posts,
      created_at: post.community.created_at,
      updated_at: post.community.updated_at,
    };
    this.is_sticked = post.is_sticked;
    this.upvotes = post.upvotes;
    this.downvotes = post.downvotes;
    this.upvotes_count = post.upvotes_count;
    this.downvotes_count = post.downvotes_count;
    this.reports = post.reports;
    this.report_count = post.report_count;
    this.view_count = post.view_count;
    this.comments_count = post.comments_count;
    this.created_at = post.created_at;
    this.updated_at = post.updated_at;
  }
}
