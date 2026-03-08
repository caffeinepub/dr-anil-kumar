import Nat "mo:core/Nat";
import Map "mo:core/Map";

module {
  // Old types without id and reply.
  type OldMessage = {
    tempUserId : Text;
    content : Text;
    timestamp : Int;
  };

  type OldActor = {
    messages : Map.Map<Nat, OldMessage>;
  };

  // New types with id and reply.
  type NewMessage = {
    id : Nat;
    tempUserId : Text;
    content : Text;
    timestamp : Int;
    reply : ?Text;
  };

  type NewActor = {
    messages : Map.Map<Nat, NewMessage>;
  };

  // Migration function called by the main actor via the with-clause.
  public func run(old : OldActor) : NewActor {
    let newMessages = old.messages.map<Nat, OldMessage, NewMessage>(
      func(id, oldMessage) {
        { oldMessage with id; reply = null };
      }
    );
    {
      old with messages = newMessages;
    };
  };
};
