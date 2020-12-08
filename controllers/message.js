/**
 * Firebase messages
 */
const fireAdmin = require("../firebase.config");
const User = require("../models/user");
/**
 * Create Room for users
 */
const roomsRef = fireAdmin.database().ref("/rooms");
function addRoom(req, res) {
  const userId = req.params.id;
  // check if user exist and if true get chatroom
  User.findByPk(userId)
    .then((response) => {
      if (response === null) {
        res.status(404).json({
          valid: false,
          error: "User not found",
        });
      } else {
        // user found so get chat room and check if it exists
        roomsRef.once("value", (data) => {
          console.log(data[response.chatRoom]);
          res.status(200).json({
            valid: true,
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        valid: false,
        error: "Add room error",
      });
    });
}

/**
 *  Get rooms
 */

function getRooms(req, res) {
  // get firebase rooms
  try {
    roomsRef.once("value", (data) => {
      return res.status(200).json({
        valid: true,
        data: data.val(),
      });
    });
  } catch (err) {
    res.status(500).json({
      valid: false,
      error: err,
    });
  }
}

module.exports = {
  getRooms,
  addRoom,
};
