import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/listing.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  // Récupérer le token sauvegardé dans le téléphone
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  // Connexion
  Future<bool> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        // Sauvegarder le token
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', data['data']['token'] ?? 'fake-token-for-cookie-auth');
        
        // Si Laravel utilise Sanctum en mode stateful (cookies), Flutter reçoit un cookie.
        // Mais pour une app native, on retourne généralement un vrai Token API (Bearer).
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // Déconnexion
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  Future<List<Listing>> fetchListings() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/listings'));

      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> data = body['data']['data'];
        return data.map((json) => Listing.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load listings');
      }
    } catch (e) {
      throw Exception('Erreur de connexion au serveur: $e');
    }
  }

  // === MESSAGERIE ===

  Future<List<dynamic>> getConversations() async {
    // Pour l'instant, on renvoie une liste vide simulée si pas de vrai token
    // Dans une vraie implémentation, on passe le Bearer Token dans le header
    try {
      final response = await http.get(Uri.parse('$baseUrl/conversations'));
      if (response.statusCode == 200) {
        return json.decode(response.body)['data'];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<List<dynamic>> getMessages(int conversationId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/conversations/$conversationId/messages'));
      if (response.statusCode == 200) {
        return json.decode(response.body)['data']['data']; // Pagination wrapper
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> sendMessage(int conversationId, String body) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/conversations/$conversationId/messages'),
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: json.encode({'body': body}),
      );
      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }
}

