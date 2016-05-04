window.app = {
  server: 'https://api.parse.com/1/classes/messages',
  allRooms: {
    Lobby: [],
    emptyroom: []
  },
  allFriends: {

  },

  init: function () {
    this.fetch(app.sortByRoom);
    this.addFriend();
    // this.addRoom();
    $('#submitForm').submit(app.handleSubmit);
  },
  send: function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function (callback) {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: { order: '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        // debugger; 
        if (callback) {
          callback(data);
        } else {
          console.log('No callback provided', data);
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },
  sortByRoom: function (messages) {
    messages = messages.results;

    _.each(messages, function(message) {
      // debugger;
      // console.log(message);

      var roomToAdd = message.roomname;
      // message has roomname current room selected
      if (roomToAdd === $('option:selected').val() && app.allRooms[roomToAdd] !== undefined) {
        app.addMessage(message);
      } else if (roomToAdd === undefined || roomToAdd.length === 0) { // emptyroom
        roomToAdd = 'emptyroom';
      } else if (app.allRooms[roomToAdd] === undefined) { // new room
        app.allRooms[roomToAdd] = [];
      }
      // debugger;
      // console.log(message);
      // console.log(app.allRooms);
      // console.log(roomToAdd);
      // console.log(app.allRooms[roomToAdd]);
      app.allRooms[roomToAdd].push(message);


    });

    app.addRoom();
  },
  reload: function () {
    app.clearMessages();
    app.allRooms = {
      Lobby: [],
      emptyroom: []
    };
    $('#roomSelect').empty();
    app.fetch(app.sortByRoom);
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var $newRoom = $('.newRoomBox').val();
    var $newMsg = $('.messageBox').val();

    var message = {
      text: $newMsg,
      username: $('.usernameBox').val() || window.location.search.match(/username=(\w*)/)[1],
      roomname: $newRoom
    };
    app.send(message);
    $('.messageBox').val('');
    $('.newRoomBox').val('');
    $('.usernameBox').val('');
    app.reload();
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function (message) {
    var $chats = $('#chats');
    var $chat = $('<div class="chat"></div>');
    
    var escapedUsername = _.escape(message.username);
    var escapedText = _.escape(message.text);
    var escapedRoom = _.escape(message.roomname);

    var $user = $('<a href="#" class="username"></a>');
    $user.attr('data-user', escapedUsername);
    $user.text(escapedUsername + ': ');
    
    $user.on('click', function () {
      // var $username = $(this);
      // var $data_username = $username.attr('data-user');
      // var getUser = $(this).attr('data-user')
      // getUser.toggleClass('friend')
      var getUser = $(this).attr('data-user');
      $('[data-user=' + getUser + ']').toggleClass('friend');


      app.addFriend(getUser);
    });

    var $msg = $('<div>' + escapedText + '</div>');
    
    $chat.append($user, $msg);
    $chats.append($chat);
  },
  addRoom: function () {
    console.log('count +1');
    _.each(app.allRooms, function(_, key) {
      // debugger;
      var $option = $('<option></option>');
      var $select = $('#roomSelect');
      var roomSize = _.length;

      $option.attr('value', key);
      $option.text(key + ' (' + roomSize + ')');
      $select.append($option);

    });

    $('select').on('change', function (e) {
      var optionSelected = $("option:selected", this);
      var valueSelected = this.value;   
      app.clearMessages();

      _.each(app.allRooms[valueSelected], function (message) {
        app.addMessage(message);
      });


      // console.log(optionSelected, "  --  ", valueSelected);
    });
  },
  addFriend: function (friendName) {
    app.allFriends[friendName] = friendName;

  },

};
app.init();

// createdAt: "2016-05-03T1:4:30.112Z"
// objectId: "qDONKRnkKZ"
// roomname: ""
// text: "&lt;script&gt;alert(&#x27;you got hacked by Allen Price&#x27;)&lt;/script&gt;"
// updatedAt: "2016-05-03T1:4:30.112Z"
// username: "allenPrice"


// createdAt: "2016-05-03T1:5:34.802Z"
// objectId: "nC0pK2UunR"
// roomname: ""
// text: "<script>alert('hi')</script>"
// updatedAt: "2016-05-03T1:5:34.802Z"
// username: "user"