const CommunityDto = require("../dto/community_dto");

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
}

module.exports = new CommunityService();
