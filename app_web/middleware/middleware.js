/**
 * Created by Benoit on 23/01/2017.
 */

const APIObject = require('./ToolboxAPI.js')

/**
 * AppServer listeners
 */
exports.appServerListeners = function (WebClients, AppServer, jwt, pjson, onSessionCheckClients) {

/*
  AppServer.on('user.connect', function (data) {
    const parsed = JSON.parse(data);
    const index = onSessionCheckClients.getFromId(parsed.sessionId);
    let target = "";
    let info = APIObject.API.parseResponseCode(parsed.code);

    if (index !== null) {

      if (index.z === "connect") target = "user.connect";
      else target = "session.check";

      if (parsed.code === "100" || parsed.code === "105") {
        if (parsed.userProfile !== null && parsed.userProfile !== undefined) {
          const token = jwt.sign({
            login: parsed.userProfile.login,
            email: parsed.userProfile.email,
            password: index.y
          }, pjson.secret, {expiresIn: 60 * 60 * 24 * 7});

          const res = {
            state: "Success",
            data: {
              user: {
                login: parsed.userProfile.login, email: parsed.userProfile.email,
                type: parsed.userProfile.type, icon: parsed.userProfile.icon
              },
              sessionId: parsed.sessionId,
              token: token,
            },
          }

          WebClients[parsed.sessionId].emit(target, res);
        } else {
          WebClients[parsed.sessionId].emit(target, {state: "Failure", data: "Corrupted data."})
        }
      } else {
        WebClients[parsed.sessionId].emit(target, {
          state: "Failure",
          data: "Could not connect. Error " + parsed.code,
          message: info.message
        });
      }

      console.log('\t[RESPONSE] \t\tAPPSERVER [session.check] ===>  WebClient<' + parsed.sessionId + '>');
      onSessionCheckClients.splice(onSessionCheckClients.getFromIdForPos(index.x), 1);
    }
  });
*/
  AppServer.on('user.connect', function(res) {
    if (res.userProfile !== null && res.userProfile !== undefined) {
      console.log('\t[RESPONSE] \t\tAPPSERVER [user.connect] ===>  WebClient<' + res.sessionId + '>');
      WebClients[res.sessionId].emit('user.disconnect', res);
    } else {
      console.log('\t[RESPONSE] \t\tAPPSERVER [user.disconnect] >< socket <' + res.sessionId + '> disconnected');
    }
  });

  AppServer.on('user.disconnect', function (res) {
    const parsed = JSON.parse(res);
    if (WebClients[parsed.sessionId] !== undefined) {
      console.log('\t[RESPONSE] \t\tAPPSERVER [user.disconnect] ===>  WebClient<' + parsed.sessionId + '>');
      WebClients[parsed.sessionId].emit('user.disconnect', parsed);
    } else {
      console.log('\t[RESPONSE] \t\tAPPSERVER [user.disconnect] >< socket <' + parsed.sessionId + '> disconnected');
    }
  });

  AppServer.on('user.update', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [user.update] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('user.update', parsed);
  });

  AppServer.on('user.contacts', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [user.contacts] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('user.contacts', parsed);
  });

  AppServer.on('user.repo', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [user.repo] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('user.repo', parsed);
  });

  AppServer.on('contacts.add', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [contacts.add] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('contacts.add', parsed);
  });

  AppServer.on('contacts.delete', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [contacts.delete] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('contacts.delete', parsed);
  });

  AppServer.on('contacts.updateStatus', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [contacts.updateStatus] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('contacts.updateStatus', parsed);
  });

  AppServer.on('contacts.search', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [contacts.search] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('contacts.search', parsed);
  });

  AppServer.on('admin.getConnectedUsers', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [admin.getConnectedUsers] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('admin.getConnectedUsers', parsed);
  });

  AppServer.on('admin.user.delete', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [admin.user.delete] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('admin.user.delete', parsed);
  });

  AppServer.on("admin.user.update", function (res) {
    const parsed = JSON.parse(res);
    console.log("\t[RESPONSE] \t\tAPPSERVER [admin.user.update] ===>  WebClient<" + parsed.sessionId + ">");
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit("admin.user.update", parsed);
  });

  AppServer.on('admin.user.create', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [admin.user.create] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('admin.user.create', parsed);
  });

  AppServer.on('repo.create', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [repo.create] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('repo.create', parsed);
  });

  AppServer.on('repo.delete', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [repo.delete] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('repo.delete', parsed);
  });

  AppServer.on('repo.get', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [repo.get] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('repo.get', parsed);
  });

  AppServer.on('repo.addMember', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [repo.addMember] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('repo.addMember', parsed);
  });

  AppServer.on('repo.deleteMember', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [repo.deleteMember] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('repo.deleteMember', parsed);
  });

  AppServer.on('data.addFile', function (res) {
    const parsed = JSON.parse(res);
    console.log('\t[RESPONSE] \t\tAPPSERVER [data.addFile] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('data.addFile', parsed);
  });

  AppServer.on('data.getRepo', function (res) {
    const parsed = JSON.parse(res)
    console.log('\t[RESPONSE] \t\tAPPSERVER [data.getRepo] ===>  WebClient<' + parsed.sessionId + '>');
    if (parsed.sessionId !== null && parsed.sessionId !== undefined && WebClients[parsed.sessionId] !== undefined)
      WebClients[parsed.sessionId].emit('data.getRepo', parsed);
  });
};

/**
 * WebClients listeners
 */

exports.webClientListeners = function (WebClient, AppServer, jwt, pjson, onSessionCheckClients) {

  WebClient.on("user.connect", function (data) {
    data.sessionType = "web";
    AppServer.emit("user.connect", data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [user.connect] ===> APPSERVER.');
    onSessionCheckClients.push(WebClient.id, data.password, "connect");
  });

/*  WebClient.on('session.check', function (data) {
    if (data === undefined)
      WebClient.emit('session.check', {state: "Failure", data: "Token don't exist."});
    else {
      jwt.verify(data, pjson.secret, function (err, decoded) {
        if (decoded === undefined)
          WebClient.emit('session.check', {state: "Failure", data: "Data are either undefined or null."});
        else {
          console.log(JSON.stringify(decoded));
          AppServer.emit('user.connect', {email: decoded.email, password: decoded.password,
            sessionId: WebClient.id, sessionName: "undefined", sessionType: "web"});
          console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [user.disconnect] ===> APPSERVER.');
          onSessionCheckClients.push(WebClient.id, decoded.password, "check");
        }
      });
    }
  });*/

  WebClient.on('user.disconnect', function (data) {
    AppServer.emit('user.disconnect', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [user.disconnect] ===> APPSERVER.');
  });

  WebClient.on('user.update', function (data) {
    AppServer.emit('user.update', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [user.update] ===> APPSERVER.');
  });

  WebClient.on('user.contacts', function (data) {
    AppServer.emit('user.contacts', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [user.contacts] ===> APPSERVER.');
  });

  WebClient.on('user.repo', function (data) {
    AppServer.emit('user.repo', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [user.repo] ===> APPSERVER.');
  });

  WebClient.on('contacts.add', function (data) {
    AppServer.emit('contacts.add', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [contacts.add] ===> APPSERVER.');
  });

  WebClient.on('contacts.delete', function (data) {
    AppServer.emit('contacts.delete', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [contacts.delete] ===> APPSERVER.');
  });

  WebClient.on('contacts.updateStatus', function (data) {
    AppServer.emit('contacts.updateStatus', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [contacts.updateStatus] ===> APPSERVER.');
  });

  WebClient.on('contacts.search', function (data) {
    AppServer.emit('contacts.search', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [contacts.search] ===> APPSERVER.');
  });

  WebClient.on('admin.getConnectedUsers', function (data) {
    AppServer.emit('admin.getConnectedUsers', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [admin.getConnectedUsers] ===> APPSERVER.');
  });

  WebClient.on('admin.user.delete', function (data) {
    AppServer.emit('admin.user.delete', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [admin.user.delete] ===> APPSERVER.');
  });

  WebClient.on('admin.user.update', function (data) {
    AppServer.emit('admin.user.update', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [admin.user.update] ===> APPSERVER.');
  });

  WebClient.on('admin.user.create', function (data) {
    AppServer.emit('admin.user.create', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [admin.user.create] ===> APPSERVER.');
  });

  WebClient.on('repo.create', function (data) {
    AppServer.emit('repo.create', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [repo.create] ===> APPSERVER.');
  });

  WebClient.on('repo.delete', function (data) {
    AppServer.emit('repo.delete', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [repo.delete] ===> APPSERVER.');
  });

  WebClient.on('repo.get', function (data) {
    AppServer.emit('repo.get', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [repo.get] ===> APPSERVER.');
  });

  WebClient.on('repo.addMember', function (data) {
    AppServer.emit('repo.addMember', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [repo.addMember] ===> APPSERVER.');
  });

  WebClient.on('repo.deleteMember', function (data) {
    AppServer.emit('repo.deleteMember', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [repo.deleteMember] ===> APPSERVER.');
  });

  WebClient.on('data.addFile', function (data) {
    AppServer.emit('data.addFile', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [data.addFile] ===> APPSERVER.');
  });

  WebClient.on('data.getRepo', function (data) {
    AppServer.emit('data.getRepo', data);
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [data.getRepo] ===> APPSERVER.');
  });


  // middleware.ping(WebClient);
  // middleware.userRepos(WebClient);
  // middleware.addKey(WebClient);
  // middleware.getRepo(WebClient);
  // middleware.addRepo(WebClient);

  WebClient.on('disconnect', function () {
    console.info("\t[INFO] \t\t\tclient <" + WebClient.id + "> on disconnection.\n");

    AppServer.emit('user.disconnect', {sessionId: WebClient.id});
    console.log('\t[REQUEST] \t\tWebClient<' + WebClient.id + '> [user.disconnect] ===> APPSERVER.');

    setTimeout(function () {
      WebClient.removeAllListeners();
      WebClient.disconnect();
    }, 150);
  });
};