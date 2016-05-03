// YOUR CODE HERE:

window.app = {
  server: undefined,
  init: function () {
    // $('.username').on('click', function () {
    //   $(this).addFriend();
    // });
    this.addFriend();
    this.handleSubmit();
  },
  send: function (messageArray) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(messageArray),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function () {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      data: {
        format: 'json'
      },
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },
  clearMessages: function () {
    // would this also remove all non-direct children?
    $('#chats').children().remove();
  },
  addMessage: function (message) {
    var $chat = $('<div></div>');

    var $user = $('<a href="#" class="username"></a>');
    $user.attr('data-user', message.username);
    $user.text(message.username + ' : ');

    var $msg = $('<div></div>');
    $msg.text(message.text);

    $chat.append($user, $msg);

    $('#chats').append($chat);
  },
  addRoom: function (roomName) {
    var $room = $('<div></div>');

    $room.addClass(roomName);
    $('#roomSelect').append($room);
  },
  addFriend: function () {
    $('.username').on('click', function () {
      var $this = $(this).attr('data-user');
      console.log($this);
    });
  },
  handleSubmit: function () {
    $('#send .submit').on('submit', function() {
      console.log($(this));
    });
  }

};