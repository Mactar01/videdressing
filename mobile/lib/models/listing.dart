class Listing {
  final int id;
  final String title;
  final String description;
  final double price;
  final String coverUrl;

  Listing({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.coverUrl,
  });

  factory Listing.fromJson(Map<String, dynamic> json) {
    // Gestion du champ titre multilingue (ex: {"fr": "Veste", "en": "Jacket"})
    String extractLocalString(dynamic field) {
      if (field == null) return '';
      if (field is String) return field;
      if (field is Map) {
        return field['fr'] ?? field.values.first.toString();
      }
      return '';
    }

    // Gestion de l'image de couverture
    String cover = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80';
    if (json['images'] != null && (json['images'] as List).isNotEmpty) {
      var images = json['images'] as List;
      var coverImage = images.firstWhere((img) => img['is_cover'] == true, orElse: () => images[0]);
      cover = 'http://10.0.2.2:8000/storage/${coverImage['path']}';
    }

    return Listing(
      id: json['id'],
      title: extractLocalString(json['title']),
      description: extractLocalString(json['description']),
      price: double.parse(json['price'].toString()),
      coverUrl: cover,
    );
  }
}
