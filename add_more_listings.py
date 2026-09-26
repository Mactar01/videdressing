import os

p = 'backend/database/seeders/ListingSeeder.php'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

extra_listings = """
            [
                'title'       => ['fr' => 'Robe de soirée élégante', 'en' => 'Elegant Evening Dress'],
                'description' => ['fr' => 'Portée une seule fois. Très chic.', 'en' => 'Worn once. Very chic.'],
                'price'       => 15000.00,
                'condition'   => 'like_new',
                'category_id' => 2, // robes
                'city'        => 'Dakar',
            ],
            [
                'title'       => ['fr' => 'Sneakers Nike Air Max', 'en' => 'Nike Air Max Sneakers'],
                'description' => ['fr' => 'Neuf dans sa boîte.', 'en' => 'Brand new in box.'],
                'price'       => 35000.00,
                'condition'   => 'new',
                'category_id' => 3, // chaussures
                'city'        => 'Thiès',
            ],
            [
                'title'       => ['fr' => 'Sac à main en cuir', 'en' => 'Leather Handbag'],
                'description' => ['fr' => 'Sac vintage de très bonne qualité.', 'en' => 'Vintage bag of great quality.'],
                'price'       => 20000.00,
                'condition'   => 'good',
                'category_id' => 4, // accessoires
                'city'        => 'Saint-Louis',
            ],
            [
                'title'       => ['fr' => 'iPhone 13 Pro', 'en' => 'iPhone 13 Pro'],
                'description' => ['fr' => 'Écran sans aucune rayure. Batterie 90%.', 'en' => 'Scratchless screen.'],
                'price'       => 450000.00,
                'condition'   => 'good',
                'category_id' => 7, // high-tech
                'city'        => 'Dakar',
            ],
            [
                'title'       => ['fr' => 'Canapé 3 places velours', 'en' => '3-seater velvet sofa'],
                'description' => ['fr' => 'Très confortable, couleur moutarde.', 'en' => 'Very comfortable.'],
                'price'       => 85000.00,
                'condition'   => 'good',
                'category_id' => 6, // maison
                'city'        => 'Mbour',
            ],
            [
                'title'       => ['fr' => 'Chemise en lin homme', 'en' => 'Linen shirt for men'],
                'description' => ['fr' => 'Légère et parfaite pour l\'été.', 'en' => 'Light and perfect for summer.'],
                'price'       => 5000.00,
                'condition'   => 'new',
                'category_id' => 2, // vêtements
                'city'        => 'Ziguinchor',
            ],
            [
                'title'       => ['fr' => 'Machine à laver LG', 'en' => 'LG Washing Machine'],
                'description' => ['fr' => 'Capacité 8kg, moteur silencieux.', 'en' => '8kg capacity.'],
                'price'       => 120000.00,
                'condition'   => 'good',
                'category_id' => 8, // electromenager
                'city'        => 'Dakar',
            ],
            [
                'title'       => ['fr' => 'Montre Casio vintage', 'en' => 'Vintage Casio Watch'],
                'description' => ['fr' => 'Dorée, résistante à l\'eau.', 'en' => 'Gold, water resistant.'],
                'price'       => 12000.00,
                'condition'   => 'fair',
                'category_id' => 4, // accessoires
                'city'        => 'Dakar',
            ],
            [
                'title'       => ['fr' => 'Ensemble tailleur', 'en' => 'Suit set'],
                'description' => ['fr' => 'Parfait pour le bureau.', 'en' => 'Perfect for office.'],
                'price'       => 25000.00,
                'condition'   => 'like_new',
                'category_id' => 1,
                'city'        => 'Dakar',
            ],
"""

c = c.replace("$listingsData = [", "$listingsData = [\n" + extra_listings)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)

