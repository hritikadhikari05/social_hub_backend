const CommunityService = require("../services/community_service");

class CommunityDto {
  _id;
  name;
  displayName;
  description;
  community_type; // public, private, restricted
  icon_image;
  creator_id;
  members;
  member_count;
  report_count;
  is_banned;
  ban_reason;
  isMember;
  createdAt;
  updatedAt;

  constructor(data, isMember) {
    // console.log(CommunityService.isMember(data, userId));
    this._id = data._id;
    this.name = data.name;
    this.displayName = data.displayName;
    this.description = data.description;
    this.community_type = data.community_type;
    this.icon_image = data.icon_image;
    this.creator_id = data.creator_id;
    this.members = data.members;
    this.member_count = data.member_count;
    this.report_count = data.report_count;
    this.is_banned = data.is_banned;
    this.ban_reason = data.ban_reason;
    this.isMember = isMember;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

module.exports = CommunityDto;
