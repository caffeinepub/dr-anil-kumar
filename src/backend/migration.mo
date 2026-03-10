import Nat "mo:core/Nat";
import Map "mo:core/Map";

module {
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

  type OldActor = {
    messages : Map.Map<MessageId, Message>;
    credentials : Map.Map<Nat, Credential>;
    nextMessageId : MessageId;
    nextCredentialId : Nat;
    nextTempUserId : Nat;
  };

  type NewActor = {
    messages : Map.Map<MessageId, Message>;
    credentials : Map.Map<Nat, Credential>;
    nextMessageId : MessageId;
    nextCredentialId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      messages = old.messages;
      credentials = old.credentials;
      nextMessageId = old.nextMessageId;
      nextCredentialId = old.nextCredentialId;
    };
  };
};
