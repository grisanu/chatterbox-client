window.app = {
  server: 'https://api.parse.com/1/classes/messages',
  init: function () {
    this.fetch(function(messages){
      messages = messages.results

      _.each(messages, function(message) {
        app.addMessage(message);
      })
    });
    this.addFriend();
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
    var message = {
      text: $newMsg,
      username: 'Tester'
    }
    app.send(message)
    $('.messageBox').val('');
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function (message) {
    var $chats = $('#chats');
    var $chat = $('<div class="chat"></div>');
    
    var $user = $('<a href="#" class="username"></a>');
    $user.attr('data-user', message.username);
    $user.text(message.username + ': ');

    var $msg = $('<div>' + message.text + '</div>');
    
    $chat.append($user, $msg);
    $chats.append($chat);
  },
  addRoom: function (roomName) {
    var $roomSelect = $('#roomSelect');
    var $room = $('<div class=' + roomName + '></div>');
    $roomSelect.append($room);
  },
  addFriend: function () {
    $('.username').on('click', function () {
      var $this = $(this).attr('data-user');
    });
  }
};
app.init();