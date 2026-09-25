import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/listing.dart';

class ListingDetailScreen extends StatelessWidget {
  final Listing listing;

  const ListingDetailScreen({super.key, required this.listing});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_border, color: Colors.black),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Ajouté aux favoris ! ❤️')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.share, color: Colors.black),
            onPressed: () {},
          ),
        ],
      ),
      extendBodyBehindAppBar: true,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image de l'annonce
            SizedBox(
              height: 400,
              width: double.infinity,
              child: CachedNetworkImage(
                imageUrl: listing.coverUrl,
                fit: BoxFit.cover,
                placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                errorWidget: (context, url, error) => const Icon(Icons.broken_image, size: 50),
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Prix et Titre
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          listing.title,
                          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.2),
                        ),
                      ),
                      Text(
                        '${listing.price.toStringAsFixed(2)} €',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFFff7096)),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Caractéristiques rapides (Simulées pour le MVP)
                  Row(
                    children: [
                      _buildChip('Taille M'),
                      const SizedBox(width: 8),
                      _buildChip('Très bon état'),
                      const SizedBox(width: 8),
                      _buildChip('Paris'),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Description
                  const Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(
                    listing.description.isEmpty ? 'Aucune description fournie par le vendeur.' : listing.description,
                    style: const TextStyle(fontSize: 15, color: Colors.black87, height: 1.5),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Profil du Vendeur (Simulé)
                  const Divider(color: Colors.black12),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(
                      backgroundColor: Colors.grey[200],
                      radius: 24,
                      child: const Text('V', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.black54)),
                    ),
                    title: const Text('Vendeur Mystère', style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: const Row(
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        Icon(Icons.star_half, color: Colors.amber, size: 16),
                        SizedBox(width: 4),
                        Text('(12 avis)', style: TextStyle(fontSize: 12)),
                      ],
                    ),
                    trailing: const Icon(Icons.chevron_right),
                  ),
                  const Divider(color: Colors.black12),
                ],
              ),
            ),
          ],
        ),
      ),
      
      // Barre d'actions fixe en bas
      bottomNavigationBar: SafeArea(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))
            ]
          ),
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    // Logique pour ouvrir le chat avec le vendeur
                  },
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    side: const BorderSide(color: Color(0xFFff7096)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Contacter', style: TextStyle(color: Color(0xFFff7096), fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: () {
                    // Logique d'achat (Stripe)
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFff7096),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: const Text('Acheter', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Text(label, style: const TextStyle(fontSize: 12, color: Colors.black87)),
    );
  }
}
