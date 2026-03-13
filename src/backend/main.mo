import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Int "mo:core/Int";

actor {
  type Message = {
    sender : Text; // "user" or "bot"
    content : Text;
    timestamp : Time.Time;
  };

  module Message {
    public func compare(message1 : Message, message2 : Message) : Order.Order {
      Int.compare(message1.timestamp, message2.timestamp);
    }
  };

  let messages = List.empty<Message>();

  public shared ({ caller }) func sendMessage(content : Text) : async () {
    let userMessage = {
      sender = "user";
      content;
      timestamp = Time.now();
    };

    messages.add(userMessage);

    let botResponse = {
      sender = "bot";
      content = generateBotResponse(content);
      timestamp = Time.now();
    };

    messages.add(botResponse);
  };

  public query ({ caller }) func getChatHistory() : async [Message] {
    messages.toArray().sort();
  };

  func generateBotResponse(userMessage : Text) : Text {
    if (userMessage.contains(#text "hello")) {
      return "Hello, how can I assist you today?";
    } else if (userMessage.contains(#text "help")) {
      return "I'm here to help! What do you need?";
    } else if (userMessage.contains(#text "bye")) {
      return "Goodbye!";
    } else {
      return "I'm not sure I understand. Can you please clarify?";
    };
  };
};
