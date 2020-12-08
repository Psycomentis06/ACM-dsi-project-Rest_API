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
        roomsRef.child("/" + response.chatRoom + "/").once("value", (data) => {
          if (data.exists()) {
            // room already exists
            res.status(405).json({
              valid: false,
              message: "Room already exists",
            });
          } else {
            roomsRef.child("/" + response.chatRoom + "/").set(
              {
                username: response.firstName + " " + response.lastName,
                userId: response.id,
                createdAt: fireAdmin.database.ServerValue.TIMESTAMP,
                messages: {},
              },
              (a) => {
                if (a) {
                  // error
                  res.status(500).json({
                    valid: false,
                    message:
                      "Room not created due to an error please try again",
                  });
                } else {
                  res.status(200).json({
                    valid: true,
                    message: "Room created",
                  });
                }
              }
            );
          }
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
