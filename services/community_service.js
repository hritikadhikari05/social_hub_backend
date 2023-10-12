const CommunityDto = require("../dto/community_dto");
const User = require("../models/user_model");

class CommunityService {
  /* Check if the user id the member of this community */
  async isMember(community, userId) {
    return await community.members.includes(userId);
  }

  /* Check and add isMember field to the repsonse */
  async addAndCheckIsMemberField(communities, userId) {
    return await Promise.all(
      communities.map(async (community) => {
        const isMember = await this.isMember(community, userId);
        return new CommunityDto(community, isMember);
      })
    );
  }

  /* Check if the user is following this user or not */
  async addAndCheckIsFollowingField(members, userId) {
    return await Promise.all(
      members.map(async (member) => {
        const user = await User.findById(member._id);
        if (!user) {
          return res.status(400).json({
            message: "No User found",
          });
        }

        const isFollowing = await user.followers.includes(userId);

        return { ...member._doc, isFollowing };
      })
    );
  }

  /* Check if the user is following this user or not for moderators */
  async addAndCheckIsFollowingFieldForModerators(moderators, userId) {
    return await Promise.all(
      moderators.map(async (moderator) => {
        const user = await User.findById(moderator.user._id);
        if (!user) {
          return res.status(400).json({
            message: "No User found",
          });
        }

        const isFollowing = user.followers.includes(userId);

        return {
          _id: moderator._id,
          user: { ...moderator.user._doc, isFollowing },
          community: { ...moderator.community._doc },
        };
      })
    );
  }
}

module.exports = new CommunityService();
