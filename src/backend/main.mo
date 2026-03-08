import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Map "mo:core/Map";

actor {
  type MessageId = Nat;
  type TempUserId = Text;

  type Message = {
    tempUserId : TempUserId;
    content : Text;
    timestamp : Int;
  };

  module Message {
    public func compare(message1 : Message, message2 : Message) : Order.Order {
      Int.compare(message2.timestamp, message1.timestamp);
    };
  };

  let messages = Map.empty<MessageId, Message>();
  var nextMessageId = 0;
  var nextTempUserId = 0;

  public shared ({ caller }) func sendMessage(content : Text, providedTempUserId : ?TempUserId) : async TempUserId {
    let tempUserId = switch (providedTempUserId) {
      case (null) {
        let newId = "anon" # nextTempUserId.toText();
        nextTempUserId += 1;
        newId;
      };
      case (?id) { id };
    };

    let message : Message = {
      tempUserId;
      content;
      timestamp = Time.now();
    };

    messages.add(nextMessageId, message);
    nextMessageId += 1;

    tempUserId;
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    let messagesList = List.empty<Message>();
    for (message in messages.values()) {
      messagesList.add(message);
    };
    messagesList.toArray().sort();
  };
};
