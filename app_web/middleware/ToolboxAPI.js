/**
 * Created by Benoit on 13/10/2016.
 */

exports.API = {
  array_status_code_meaning : {
    // USER [1XX]

    // user.connect [10X]
    code100: { code: 200, state: "Success",    message: "User is now connected."},
    code101: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code102: { code: 401, state: "Fail",       message: {email : "This email is unknown."} },
    code103: { code: 401, state: "Fail",       message: {password : "This password is unknown."} },
    code104: { code: 500, state: "Fail",       message: "Too much devices connected, access refused."},
    code105: { code: 200, state: "Success",    message: "User is now connected but password has to be changed."},
    code108: { code: 500, state: "Fail",       message: "Already logged in."},
    code109: { code: 500, state: "Fail",       message: "Internal server error."},

    // user.disconnect [11X]
    code110: { code: 200, state: "Success",    message: "User has been disconnected successfully."},
    code111: { code: 401, state: "Fail",       message: "Request or parameters format invalid."},
    code118: { code: 401, state: "Fail",       message: "No session found."},

    // user.profile [12X]
    code120: { code: 200, state: "Success",    message: "User profile has been fetched successfully."},
    code121: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code128: { code: 500, state: "Fail",       message: "No session found."},
    code129: { code: 500, state: "Fail",       message: "Internal server error."},

    // user.profile [13X]
    code130: { code: 200, state: "Success",    message: "User profile has been updated successfully."},
    code131: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code132: { code: 401, state: "Fail",       message: {password : "This password is unknown or invalid."} },
    code133: { code: 401, state: "Fail",       message: "Previous and new values should be different." },
    code138: { code: 500, state: "Fail",       message: "No session found."},
    code139: { code: 500, state: "Fail",       message: "Internal server error."},

    // user.contacts [14X]
    code140: { code: 200, state: "Success",    message: "User contacts has been fetched successfully."},
    code141: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code148: { code: 500, state: "Fail",       message: "No session found."},
    code149: { code: 500, state: "Fail",       message: "Internal server error."},

    // user.devices [15X]
    code150: { code: 200, state: "Success",    message: "User devices has been fetched successfully."},
    code151: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code158: { code: 500, state: "Fail",       message: "No session found."},
    code159: { code: 500, state: "Fail",       message: "Internal server error."},

    // CONTACTS [2XX]

    // contacts.add [20X]
    code200: { code: 200, state: "Success",    message: "Contact has been added successfully."},
    code201: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code202: { code: 500, state: "Fail",       message: "Contact is unknown."},
    code208: { code: 500, state: "Fail",       message: "No session found."},
    code209: { code: 500, state: "Fail",       message: "Internal server error."},

    // contacts.deleted [21X]
    code210: { code: 200, state: "Success",    message: "Contact has been deleted successfully."},
    code211: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code212: { code: 500, state: "Fail",       message: "Contact is unknown."},
    code218: { code: 500, state: "Fail",       message: "No session found."},
    code219: { code: 500, state: "Fail",       message: "Internal server error."},

    // contacts.profile [22X]
    code220: { code: 200, state: "Success",    message: "Contact profile has been fetched successfully."},
    code221: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code222: { code: 500, state: "Fail",       message: "Contact is unknown."},
    code228: { code: 500, state: "Fail",       message: "No session found."},
    code229: { code: 500, state: "Fail",       message: "Internal server error."},

    // contacts.updateStatus [23X]
    code230: { code: 200, state: "Success",    message: "Contact status has been updated successfully."},
    code231: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code232: { code: 500, state: "Fail",       message: "Contact is unknown."},
    code238: { code: 500, state: "Fail",       message: "No session found."},
    code239: { code: 500, state: "Fail",       message: "Internal server error."},

    // contacts.search [24X]
    code240: { code: 200, state: "Success",    message: "Contact search was executed successfully."},
    code241: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code248: { code: 500, state: "Fail",       message: "No session found."},
    code249: { code: 500, state: "Fail",       message: "Internal server error."},

    // DEVICES [3XX]

    // devices.delete [30X]
    code300: { code: 200, state: "Success",    message: "Device has been deleted successfully."},
    code301: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code302: { code: 500, state: "Fail",       message: "Enable to delete current device."},
    code303: { code: 500, state: "Fail",       message: "Unable to delete unknown device"},
    code308: { code: 500, state: "Fail",       message: "No session found."},
    code309: { code: 500, state: "Fail",       message: "Internal server error."},

    // devices.deleteOffline [31X]
    code310: { code: 200, state: "Success",    message: "Device has been deleted successfully."},
    code311: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code312: { code: 500, state: "Fail",       message: "Unable to delete unknown device."},
    code319: { code: 500, state: "Fail",       message: "Internal server error."},

    // devices.rename [32X]
    code320: { code: 200, state: "Success",    message: "Device has been renamed successfully."},
    code321: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code322: { code: 500, state: "Fail",       message: "Unable to rename unknown device"},
    code328: { code: 500, state: "Fail",       message: "No session found."},
    code329: { code: 500, state: "Fail",       message: "Internal server error."},

    // ADMIN [4XX]

    // admin.user.create [40X]
    code400: { code: 200, state: "Success",    message: "User has been created successfully."},
    code401: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code402: { code: 500, state: "Fail",       message: "Current user doesn't have administrator right."},
    code403: { code: 401, state: "Fail",       message: "The login should be unique."},
    code404: { code: 401, state: "Fail",       message: "The email should be unique."},
    code408: { code: 500, state: "Fail",       message: "No session found."},
    code409: { code: 500, state: "Fail",       message: "Internal server error."},

    // admin.user.delete [41X]
    code410: { code: 200, state: "Success",    message: "User has been deleted successfully."},
    code411: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code412: { code: 500, state: "Fail",       message: "Current user doesn't have administrator right."},
    code413: { code: 401, state: "Fail",       message: "Unable to delete unknown user."},
    code418: { code: 500, state: "Fail",       message: "No session found."},
    code419: { code: 500, state: "Fail",       message: "Internal server error."},

    // admin.user.getConnectedUsers [45X]
    code450: { code: 200, state: "Success",    message: "Connected user list has been fetched successfully."},
    code451: { code: 500, state: "Fail",       message: "Request or parameters format invalid."},
    code452: { code: 500, state: "Fail",       message: "Current user doesn't have administrator right."},
    code458: { code: 500, state: "Fail",       message: "No session found."},
    code459: { code: 500, state: "Fail",       message: "Internal server error."},


    // DEBUG [10XX]

    // debug.user.create [100X]
    code1000: { code: 200, state: "Success",    message: "! DEBUG ! : Create list has been fetched successfully."},
    code1001: { code: 500, state: "Fail",       message: "! DEBUG ! : Request or parameters format invalid."},
    code1002: { code: 500, state: "Fail",       message: {login : "! DEBUG ! : Login must be unique."} },
    code1003: { code: 500, state: "Fail",       message: {email : "! DEBUG ! : Email must be unique."} },
    code1009: { code: 500, state: "Fail",       message: "! DEBUG ! : Internal server error."}
  }
};

exports.API.parseResponseCode = function (code) {
  const info = exports.API.array_status_code_meaning['code' + code]
  const result = {
    codeAPI: code,
    codeHTTP: info.code,
    status: {
      state: info.state,
      errorSideVal: -1,
      errorSide: 'Undefined'
    },
    message: info.message
  }

  if (info.state === "Fail") {
    if ((info.code / 100) === 4) {
      result.status.errorSide = "Client side.";
      result.status.errorSideVal = 4;
    } else {
      result.status.errorSide = "Server Side.";
      result.status.errorSideVal = 5;
    }
  } else {
    result.status.errorSide = "None.";
    result.status.errorSideVal = 0;
  }

  return result;
};