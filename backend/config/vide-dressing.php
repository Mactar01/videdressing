<?php

/**
 * Configuration applicative de la plateforme VideDressing.
 *
 * Centralise les paramètres métier (commission, listings, commandes, localisation)
 * et les clés de services tiers (Stripe, R2…).
 * Toutes les valeurs sensibles sont injectées via les variables d'environnement.
 */

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Informations de la plateforme
    |--------------------------------------------------------------------------
    |
    | Nom, devise et paramètres de commission appliqués à chaque transaction.
    |
    */

    'platform' => [
        /** Nom public affiché de la plateforme. */
        'name' => env('PLATFORM_NAME', 'VideDressing'),

        /** Taux de commission prélevé sur chaque vente (ex : 0.10 = 10 %). */
        'commission_rate' => (float) env('PLATFORM_COMMISSION_RATE', 0.10),

        /** Montant minimal de commission en devise configurée (ex : 0.50 EUR). */
        'commission_min' => (float) env('PLATFORM_COMMISSION_MIN', 0.50),

        /** Code ISO 4217 de la devise de la plateforme. */
        'currency' => env('PLATFORM_CURRENCY', 'EUR'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Paramètres des annonces (Listings)
    |--------------------------------------------------------------------------
    |
    | Contraintes d'upload d'images et durée de mise en avant (boost).
    |
    */

    'listings' => [
        /** Nombre maximal d'images par annonce. */
        'max_images' => 12,

        /** Taille maximale autorisée par image (en kilo-octets, 8192 = 8 Mo). */
        'image_max_size_kb' => 8192,

        /** Largeur minimale d'une image en pixels. */
        'image_min_width' => 400,

        /** Hauteur minimale d'une image en pixels. */
        'image_min_height' => 400,

        /** Types MIME autorisés pour les images d'annonces. */
        'image_allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],

        /** Durée d'un boost d'annonce en jours. */
        'boost_duration_days' => 7,
    ],

    /*
    |--------------------------------------------------------------------------
    | Paramètres des commandes (Orders)
    |--------------------------------------------------------------------------
    |
    | Délais Stripe, protection acheteur et confirmation automatique.
    |
    */

    'orders' => [
        /**
         * Fenêtre maximale de capture d'un PaymentIntent Stripe (en heures).
         * Stripe impose un maximum de 7 jours (168 h).
         */
        'stripe_capture_window_hours' => 168,

        /**
         * Délai de protection acheteur avant le déclenchement du virement vendeur
         * (en heures). L'acheteur peut signaler un problème pendant ce délai.
         */
        'buyer_protection_hours' => 48,

        /**
         * Nombre de jours avant confirmation automatique de la livraison
         * si l'acheteur ne réagit pas.
         */
        'auto_confirm_days' => 10,
    ],

    /*
    |--------------------------------------------------------------------------
    | Localisation (i18n)
    |--------------------------------------------------------------------------
    |
    | Langues supportées et locale par défaut de la plateforme.
    |
    */

    'locales' => [
        /** Liste des codes langue ISO 639-1 acceptés. */
        'supported' => ['fr', 'en'],

        /** Locale appliquée si la langue de l'utilisateur n'est pas supportée. */
        'default' => 'fr',
    ],

    /*
    |--------------------------------------------------------------------------
    | Stripe (Stand-by)
    |--------------------------------------------------------------------------
    |
    | Les clés Stripe sont déclarées ici pour référence centralisée.
    | L'intégration complète (controllers, services) est en attente.
    |
    */

    'stripe' => [
        'secret_key'      => env('STRIPE_SECRET_KEY'),
        'publishable_key' => env('STRIPE_PUBLISHABLE_KEY'),
        'webhook_secret'  => env('STRIPE_WEBHOOK_SECRET'),
    ],

];
