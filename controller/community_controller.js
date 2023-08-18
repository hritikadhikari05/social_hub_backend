const Community = require("../models/community_model");
const User = require("../models/user_model");

/* Create a new community */
exports.create_community = async (req, res) => {
  try {
    const {
      name,
      displayName,
      description,
      community_type, // public, private, restricted
      icon_image,
      creator_id, // user_id
    } = req.body;

    const community = new Community({
      name,
      displayName,
      description,
      community_type,
      icon_image,
      creator_id,
    });

    const newCommunity = await community.save();
    res.status(201).json(newCommunity);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message });
  }
};
