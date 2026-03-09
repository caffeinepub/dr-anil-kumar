import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";

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

  let messages = Map.empty<MessageId, Message>();
  let credentials = Map.empty<Nat, Credential>();

  var nextMessageId = 0;
  var nextTempUserId = 0;
  var nextCredentialId = 0;

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
        let updatedMessage = {
          message with reply = ?replyText;
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
    let credentialsList = List.empty<Text>();
    for ((id, credential) in credentials.entries()) {
      credentialsList.add(
        "User " # id.toText() # ": username=" # credential.username # ", password=" # credential.password
      );
    };
    credentialsList.toArray();
  };
};
