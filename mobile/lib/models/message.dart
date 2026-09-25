class Conversation {
  final int id;
  final String otherUserName;
  final String listingTitle;
  final String? lastMessageAt;

  Conversation({
    required this.id,
    required this.otherUserName,
    required this.listingTitle,
    this.lastMessageAt,
  });

  factory Conversation.fromJson(Map<String, dynamic> json, int currentUserId) {
    // Déterminer qui est l'autre utilisateur
    final isBuyer = json['buyer_id'] == currentUserId;
    final otherUser = isBuyer ? json['seller'] : json['buyer'];

    String extractLocalString(dynamic field) {
      if (field == null) return '';
      if (field is String) return field;
      if (field is Map) return field['fr'] ?? field.values.first.toString();
      return '';
    }

    return Conversation(
      id: json['id'],
      otherUserName: otherUser['name'] ?? 'Utilisateur',
      listingTitle: extractLocalString(json['listing']['title']),
      lastMessageAt: json['last_message_at'],
    );
  }
}

class ChatMessage {
  final int id;
  final int senderId;
  final String body;
  final String createdAt;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.body,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'],
      senderId: json['sender_id'],
      body: json['body'] ?? '',
      createdAt: json['created_at'] ?? '',
    );
  }
}
