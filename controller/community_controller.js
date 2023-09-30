const Community = require("../models/community_model");
const User = require("../models/user_model");
const Moderator = require("../models/moderator_model");
const CommunityService = require("../services/community_service");
const CommunityDto = require("../dto/community_dto");
const { mongo, default: mongoose } = require("mongoose");
const AdminModel = require("../models/admin_model");
const CommunityRequest = require("../models/community_request_model");

/* Add members field to the community model */
// exports.addMembersField = async (req, res) => {
//   try {
//     const communities = await Community.find();
//     communities.map(async (community) => {
//       community.members = [];
//       await community.save();
//     });
//     res.status(200).json({
//       message:
//         "Members field added to community model",
//     });
//   } catch (err) {
//     res

//       .status(500)
//       .json({ message: err.message });
//   }
// };

/* Create a new community */
exports.create_community = async (req, res) => {
  try {
    const {
      name,
      displayName,
      description,
      community_type, // public, private, restricted
      icon_image,
    } = req.body;

    /* Check if the community already exists */
    const communityExists = await Community.findOne({
      name,
    });

    if (communityExists) {
      return res.status(400).json({
        message: "Community already exists.",
      });
    }

    const community = new Community({
      name,
      displayName,
      description,
      community_type: community_type.toLowerCase(),
      icon_image,
      creator_id: req.user.userId,
      members: [req.user.userId],
      member_count: 1,
    });
    const newCommunity = await community.save();

    /* Add this user to as Admin of this community */
    const admin = new AdminModel({
      admin_id: req.user.userId,
      community_id: newCommunity._id,
    });
    await admin.save();

    res.status(201).json(newCommunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* Get All Community */
exports.getAllCommunity = async (req, res) => {
  const { userId } = req.user;

  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  try {
    const totalItems = await Community.countDocuments();

    const communities = await Community.find().skip(skip).limit(limit);

    //Add isMember field to the community
    res.status(200).json({
      message: "Communities Found",
      data: await CommunityService.addAndCheckIsMemberField(
        communities,
        userId
      ),
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Get Community By Id */
exports.getCommunityById = async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.user;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(400).json({
        message: "No community with this id.",
      });
    }
    /* Check if the user is the member of this community */
    const isMember = await CommunityService.isMember(community, userId);

    /* Return the response */
    res.status(200).json({
      message: "Community Found",
      data: new CommunityDto(community, isMember),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Join Community */
exports.joinCommunity = async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.user;

  try {
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(400).json({ message: "No Community Found" });
    }

    /* Check if the user is already the member of this community */
    if (community.members.includes(userId)) {
      return res.status(400).json({
        message: "You are already the member of this community.",
      });
    }

    /* Check if the community is private */
    if (community.community_type === "private") {
      /* Create request to join this community to the admin */
      const request = new CommunityRequest({
        user: userId,
        community: communityId,
      });
      await request.save();

      return res.status(201).json({
        message: "Successfully requested to join community.",
      });
    }

    /* Join the community */
    community.members.push(userId);
    community.member_count++;
    await community.save();

    /* Return the response */
    return res.status(200).json({
      message: "Community sucessfully joined.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* Leave Community */
exports.leaveCommunity = async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.user;

  try {
    const community = await Community.findById(communityId);

    if (!community) {
      res.status(400).json({ message: "No Community Found" });
    }

    /* Check if the user is already the member of this community */
    if (!community.members.includes(userId)) {
      return res.status(400).json({
        message: "You are not the member of this community.",
      });
    }

    /* Leave the community */
    community.members.pull(userId);
    community.member_count--;
    await community.save();

    /* Return the response */
    return res.status(200).json({
      message: "Community sucessfully left.",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/* 
Promote User to the moderator
role for the specific Community 
*/
exports.promoteToModerator = async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.user;

  try {
    /* Check if the user is already the moderator */
    const moderators = await Moderator.findOne({
      $and: [{ community_id: communityId }, { user_id: userId }],
    });

    /* If the user is not the moderator of this community then promote */
    if (!moderators) {
      const moderator = new Moderator({
        user_id: userId,
        community_id: communityId,
      });
      await moderator.save();
      return res.status(201).json({
        message: "Successfully promoted to moderator.",
      });
    }

    /* If the user for the community exists then */
    return res.status(400).json({
      message: "User is already the moderator of this communtiy",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* Get the list of joined communities by logged in user */
exports.getJoinedCommunities = async (req, res) => {
  const { userId } = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  try {
    const totalItems = await Community.countDocuments({
      members: userId,
    });

    const communities = await Community.find({
      members: userId,
    })
      .skip(skip)
      .limit(limit);

    /* Return the response */
    res.status(200).json({
      message: "Joined Communities Found",
      data: communities,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* Delete Community */
exports.deleteCommunity = async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.user;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(400).json({
        message: "No community found.",
      });
    }

    /* Check if the user is the creator of this community */
    if (community.creator_id.toString() !== userId) {
      return res.status(403).json({
        message: "You are not the creator of this community.",
      });
    }

    /* Delete the community */
    await community.deleteOne();

    /* Delete posts associated with this community */
    await Post.deleteMany({
      community_id: communityId,
    });

    /* Return the response */
    return res.status(200).json({
      message: "Community successfully deleted.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/* Get all community join requests */
exports.getAllCommunityJoinRequests = async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.user;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(400).json({
        message: "No community found.",
      });
    }

    /* Check if the user is the creator of this community */
    if (community.creator_id.toString() !== userId) {
      return res.status(403).json({
        message: "You are not the creator of this community.",
      });
    }

    /* Get all the requests to join this community */
    const requests = await CommunityRequest.find({
      community: communityId,
    }).populate({
      path: "user",
      select: "firstName lastName userName bio profilePic gender email",
    });

    /* Return the response */
    return res.status(200).json({
      message: "Community join requests found.",
      data: requests,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/* Approve the request to join the community */
exports.approveRequestToJoinCommunity = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.user;

  try {
    const request = await CommunityRequest.findById(requestId);
    if (!request) {
      return res.status(400).json({
        message: "No request found.",
      });
    }

    /* Check if the user is the creator of this community */
    const community = await Community.findById(request.community);

    if (community.creator_id.toString() !== userId) {
      return res.status(403).json({
        message: "You are not the creator of this community.",
      });
    }

    /* Join the community */
    community.members.push(request.user);
    community.member_count++;
    await community.save();

    /* Delete the request */
    await request.deleteOne();

    /* Return the response */
    return res.status(200).json({
      message: "Community join request approved.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
