const { response } = require("express");

const accountSid = "AC5b9b96509678a977f7c298c264ade64b";
const authToken = "7a06175598028ba938f14518aed91574";
const client = require("twilio")(accountSid, authToken);
/* Send Otp using twilio */
const sendOtp = async (phoneNo, message) => {
  try {
    const response = await client.messages.create({
      body: `Your OTP for social-hub is: ${message}`,
      from: "+19165121841",
      to: `+91${phoneNo}`,
    });
    return response;
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { sendOtp };
