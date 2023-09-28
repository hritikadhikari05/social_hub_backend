class CommunityService {
  /* Check if the user id the member of this community */
  async isMember(community, userId) {
    return await community.members.includes(userId);
  }
}

module.exports = new CommunityService();
