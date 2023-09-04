const Community = require("../models/community_model");
const User = require("../models/user_model");
const Moderator = require("../models/moderator_model");

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
    const communityExists =
      await Community.findOne({
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
      community_type,
      icon_image,
      creator_id: req.user.userId,
    });

    const newCommunity = await community.save();
    res.status(201).json(newCommunity);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message });
  }
};

/* Get All Community */
exports.getAllCommunity = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json({
      message: "Communities Found",
      data: communities,
      hits: communities.length,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

/* Get Community By Id */
exports.getCommunityById = async (req, res) => {
  const { communityId } = req.params;

  try {
    const community = await Community.findById(
      communityId
    );
    if (!community) {
      return res.status(400).json({
        message: "No community with this id.",
      });
    }
    res.status(200).json({
      message: "Community Found",
      data: community,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

/* Join Community */
exports.joinCommunity = async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.user;

  try {
    const community = await Community.findById(
      communityId
    );

    if (!community) {
      res
        .status(400)
        .json({ message: "No Community Found" });
    }

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      community.member_count++;
      await community.save();
      return res.status(200).json({
        message: "Community sucessfully joined.",
      });
    }

    return res.status(400).json({
      message:
        "You are already the member of this community.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
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
      $and: [
        { community_id: communityId },
        { user_id: userId },
      ],
    });

    /* If the user is not the moderator of this community then promote */
    if (!moderators) {
      const moderator = new Moderator({
        user_id: userId,
        community_id: communityId,
      });
      await moderator.save();
      return res.status(201).json({
        message:
          "Successfully promoted to moderator.",
      });
    }

    /* If the user for the community exists then */
    return res.status(400).json({
      message:
        "User is already the moderator of this communtiy",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
