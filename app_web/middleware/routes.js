/**
 * Created by Benoit on 30/04/2016.
 */

// const APIObject = require('./ToolboxAPI.js');
// const jwt = require('jsonwebtoken');
const pjson = require('../package.json');
//
// // Injection method in order to use AppServer defined into 'app.js'
// exports.setAppServer = function(socket) {
//   AppServer = socket;
// };

/**
 * Routing of HTML files
 */

// We tell server to render index.jade when it get "/" request
exports.index = function (req, res) {
  const params = { title: 'Nymerus', server: pjson.appserver_ip };
  res.render('layout', params);
};

// We tell server to render ':name'.jade when it get "/app/:name"
exports.content = function (req, res) {
  const name = req.params.name;
  res.render('content/' + name);
};

/**
 * Routing of login and signup logic
 */

/**
 * In order to use socketIO callback for http response, we need to do respect some aspect of concurrency call.
 *
 * More information about the code :
 * http://stackoverflow.com/questions/30803640/use-socket-io-client-with-express-and-nodejs-to-send-query-to-java-server
 */

// // We received a login request
// exports.login = function(req, res) {
//
//   let user = {
//     email: req.body.email,
//     password: req.body.password,
//     sessionId: req.body.socket_id,
//     sessionName: req.body.browser_name,
//     sessionType: 'web'
//   }
//
//   // Log.d proof of Signin request treatment
//   console.log("\t[REQUEST] \t\tLog-in request received.\n["
//     + user.email + ", " + user.password + ", " + user.sessionId + ", "
//     + user.sessionName + ", " + user.sessionType + "]");
//
//   function onResponse(msg) {
//     // for concurrency reasons, make sure this is the right
//     // response.  The server must return the same
//     // transactionId that it was sent
//     let token = null;
//     const parsedMsg = JSON.parse(msg);
//     console.log("\t[RESPONSE] \t\tAppServer [Login] res.code [" + parsedMsg.code + "]");
//     // console.log("===> OBJ : " + parsedMsg.userProfile);
//
//     const info = APIObject.API.parseResponseCode(parsedMsg.code)
//
//     // console.log(JSON.stringify(info, null, 2));
//     // console.log(JSON.stringify(parsedMsg, null, 2));
//
//     if (info.codeHTTP === 200) {
//       token = jwt.sign({
//         login: parsedMsg.userProfile.login,
//         email: parsedMsg.userProfile.email,
//         password: user.password
//       }, pjson.secret, {expiresIn: 60 * 60 * 24 * 7});
//
//       res.status(info.codeHTTP)
//         .send({
//           message: info.message,
//           user: {
//             login   : parsedMsg.userProfile.login,
//             email   : parsedMsg.userProfile.email,
//             type    : parsedMsg.userProfile.type,
//             icon    : parsedMsg.userProfile.icon
//           },
//           token: token,
//           meta : parsedMsg
//         });
//     } else {
//       res.status(info.codeHTTP).send({message: info.message});
//     }
//
//     AppServer.off('user.connect', onResponse);
//   }
//
//   AppServer.on('user.connect', onResponse);
//
//   AppServer.emit('user.connect', user);
// };

// // We received a signup request
// exports.signup = function(req, res) {
//
//   // Log.d proof of Signup request treatment
//   console.log("\t[REQUEST] \t\tSign-Up request received.\n[" + req.body.email + ", " + req.body.password + "]");
//
//   let user = {login: req.body.login, password: req.body.password, email: req.body.email, icon: 'undefined'}
//
//   function onResponse(msg) {
//     const parsedMsg = JSON.parse(msg)
//     console.log("\t[RESPONSE] \t\tAppServer [Sign-Up] res.code [" + parsedMsg.code + "]");
//
//     const info = APIObject.API.parseResponseCode(parsedMsg.code)
//
//     res.status(info.codeHTTP).send({ message :   info.message });
//
//     AppServer.off('debug.user.create', onResponse);
//   }
//
//   AppServer.on('debug.user.create', onResponse);
//
//   AppServer.emit('debug.user.create', user);
// };