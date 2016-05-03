window.app = {
  server: 'https://api.parse.com/1/classes/messages',
  allRooms: {
    newroom: 0,
    lobby: [],
    emptyroom: [],
  },

  init: function () {
    this.fetch(function(messages){
      messages = messages.results;

      _.each(messages, function(message) {
        debugger;
        if (message.roomname === $('option:selected').val()) {
          app.addMessage(message);
          app.allRooms[message.roomname].push(message);
        } else if (message.roomname.length === 0) {
          app.allRooms.emptyroom.push(message);
        } else if (app.allRooms[message.roomname] === undefined) {
          app.allRooms[message.roomname] = [];
          app.allRooms[message.roomname].push(message);
        }
      });
    });
    this.addFriend();
    this.addRoom();
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
      contentType: 'application/json',
      success: function (data) {
        // debugger; 
        if (callback) {
          callback(data);
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var $newMsg = $('.messageBox').val();
    var $room = $('option:selected').val();

    var message = {
      text: $newMsg,
      username: $('.usernameBox').val() || window.location.search.match(/username=(\w*)/)[1],
      roomname: $room
    };
    app.send(message);
    $('.messageBox').val('');
    location.reload();
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

    var $msg = $('<div>' + escapedText + ' !!!!! ' + escapedRoom + '</div>');
    
    $chat.append($user, $msg);
    $chats.append($chat);
  },
  addRoom: function () {
    $('select').on('change', function (e) {
      var optionSelected = $("option:selected", this);
      var valueSelected = this.value;

      if (valueSelected === "newroom") {
        var roomName = prompt('Type the room name: ')
        var $roomSelect = $('#roomSelect');
        var $room = $('<option value=' + roomName + '>' + roomName + '</option>');
        $roomSelect.append($room);
      } else {
        _.each(app.allRooms[valueSelected], function (message) {
          app.addMessage(message);
        });
      };

      console.log(optionSelected, "  --  ", valueSelected);
    });
  },
  addFriend: function () {
    $('.username').on('click', function () {
      var $this = $(this).attr('data-user');
    });
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