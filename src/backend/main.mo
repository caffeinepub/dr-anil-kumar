import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  type MessageId = Nat;
  type TempUserId = Text;

  type Message = {
    id : MessageId;
    tempUserId : TempUserId;
    content : Text;
    timestamp : Int;
    reply : ?Text;
  };

  type Credential = {
    username : Text;
    password : Text;
  };

  var nextMessageId : MessageId = 0;
  var nextCredentialId : Nat = 0;

  let messages = Map.empty<MessageId, Message>();
  let credentials = Map.empty<Nat, Credential>();

  public shared ({ caller }) func sendMessage(content : Text, providedTempUserId : ?TempUserId) : async TempUserId {
    let tempUserId = switch (providedTempUserId) {
      case (null) { "anon" # nextMessageId.toText() };
      case (?id) { id };
    };

    let message : Message = {
      id = nextMessageId;
      tempUserId;
      content;
      timestamp = Time.now();
      reply = null;
    };

    messages.add(nextMessageId, message);
    nextMessageId += 1;

    tempUserId;
  };

  public shared ({ caller }) func saveCredential(username : Text, password : Text) : async () {
    let credential : Credential = {
      username;
      password;
    };
    credentials.add(nextCredentialId, credential);
    nextCredentialId += 1;
  };

  public shared ({ caller }) func replyToMessage(messageId : MessageId, replyText : Text) : async Bool {
    switch (messages.get(messageId)) {
      case (null) { false };
      case (?message) {
        let updatedMessage : Message = {
          id = message.id;
          tempUserId = message.tempUserId;
          content = message.content;
          timestamp = message.timestamp;
          reply = ?replyText;
        };
        messages.add(messageId, updatedMessage);
        true;
      };
    };
  };

  public shared ({ caller }) func clearMessages() : async () {
    messages.clear();
    nextMessageId := 0;
  };

  public shared ({ caller }) func clearCredentials() : async () {
    credentials.clear();
    nextCredentialId := 0;
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    messages.values().toArray();
  };

  public query ({ caller }) func getCredentials() : async [Text] {
    credentials.toArray().map(func((id, cred)) { "User " # (id + 1).toText() # ": username=" # cred.username # ", password=" # cred.password });
  };
};
