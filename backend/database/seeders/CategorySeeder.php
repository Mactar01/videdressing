<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryAttribute;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * CategorySeeder
 *
 * Crée 5 catégories parent avec leurs sous-catégories et attributs dynamiques.
 * Chaque catégorie a des attributs différents pour démontrer la flexibilité du système.
 */
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriesData = [
            [
                'name'       => ['fr' => 'Vêtements Femme', 'en' => 'Women Clothing'],
                'slug'       => 'vetements-femme',
                'icon'       => 'shirt',
                'attributes' => [
                    [
                        'key'         => 'size',
                        'label'       => ['fr' => 'Taille', 'en' => 'Size'],
                        'type'        => 'select',
                        'options'     => [
                            ['value' => 'xs',  'label' => ['fr' => 'XS']],
                            ['value' => 's',   'label' => ['fr' => 'S']],
                            ['value' => 'm',   'label' => ['fr' => 'M']],
                            ['value' => 'l',   'label' => ['fr' => 'L']],
                            ['value' => 'xl',  'label' => ['fr' => 'XL']],
                            ['value' => 'xxl', 'label' => ['fr' => 'XXL']],
                        ],
                        'is_required'   => true,
                        'is_filterable' => true,
                    ],
                    [
                        'key'         => 'color',
                        'label'       => ['fr' => 'Couleur', 'en' => 'Color'],
                        'type'        => 'multiselect',
                        'options'     => [
                            ['value' => 'noir',  'label' => ['fr' => 'Noir']],
                            ['value' => 'blanc', 'label' => ['fr' => 'Blanc']],
                            ['value' => 'rouge', 'label' => ['fr' => 'Rouge']],
                            ['value' => 'bleu',  'label' => ['fr' => 'Bleu']],
                            ['value' => 'vert',  'label' => ['fr' => 'Vert']],
                            ['value' => 'rose',  'label' => ['fr' => 'Rose']],
                        ],
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                    [
                        'key'           => 'brand',
                        'label'         => ['fr' => 'Marque', 'en' => 'Brand'],
                        'type'          => 'text',
                        'options'       => null,
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                    [
                        'key'     => 'material',
                        'label'   => ['fr' => 'Matière', 'en' => 'Material'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => 'coton',     'label' => ['fr' => 'Coton']],
                            ['value' => 'polyester', 'label' => ['fr' => 'Polyester']],
                            ['value' => 'soie',      'label' => ['fr' => 'Soie']],
                            ['value' => 'laine',     'label' => ['fr' => 'Laine']],
                            ['value' => 'lin',       'label' => ['fr' => 'Lin']],
                        ],
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                ],
                'children' => [
                    ['fr' => 'Robes',              'en' => 'Dresses',       'slug' => 'robes'],
                    ['fr' => 'Hauts & T-shirts',   'en' => 'Tops & Tees',   'slug' => 'hauts-tshirts-femme'],
                    ['fr' => 'Pantalons & Jeans',  'en' => 'Pants & Jeans', 'slug' => 'pantalons-jeans-femme'],
                ],
            ],
            [
                'name'       => ['fr' => 'Vêtements Homme', 'en' => 'Men Clothing'],
                'slug'       => 'vetements-homme',
                'icon'       => 'person',
                'attributes' => [
                    [
                        'key'     => 'size',
                        'label'   => ['fr' => 'Taille', 'en' => 'Size'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => 'xs',  'label' => ['fr' => 'XS']],
                            ['value' => 's',   'label' => ['fr' => 'S']],
                            ['value' => 'm',   'label' => ['fr' => 'M']],
                            ['value' => 'l',   'label' => ['fr' => 'L']],
                            ['value' => 'xl',  'label' => ['fr' => 'XL']],
                            ['value' => 'xxl', 'label' => ['fr' => 'XXL']],
                            ['value' => '3xl', 'label' => ['fr' => '3XL']],
                        ],
                        'is_required'   => true,
                        'is_filterable' => true,
                    ],
                    [
                        'key'     => 'color',
                        'label'   => ['fr' => 'Couleur', 'en' => 'Color'],
                        'type'    => 'multiselect',
                        'options' => [
                            ['value' => 'noir',   'label' => ['fr' => 'Noir']],
                            ['value' => 'blanc',  'label' => ['fr' => 'Blanc']],
                            ['value' => 'gris',   'label' => ['fr' => 'Gris']],
                            ['value' => 'marine', 'label' => ['fr' => 'Marine']],
                            ['value' => 'beige',  'label' => ['fr' => 'Beige']],
                        ],
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                    [
                        'key'           => 'brand',
                        'label'         => ['fr' => 'Marque', 'en' => 'Brand'],
                        'type'          => 'text',
                        'options'       => null,
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                ],
                'children' => [
                    ['fr' => 'T-shirts & Polos',   'en' => 'T-shirts & Polos',  'slug' => 'tshirts-polos-homme'],
                    ['fr' => 'Vestes & Manteaux',  'en' => 'Jackets & Coats',   'slug' => 'vestes-manteaux-homme'],
                ],
            ],
            [
                'name'       => ['fr' => 'Chaussures', 'en' => 'Shoes'],
                'slug'       => 'chaussures',
                'icon'       => 'shoe',
                'attributes' => [
                    [
                        'key'              => 'shoe_size',
                        'label'            => ['fr' => 'Pointure', 'en' => 'Shoe Size'],
                        'type'             => 'number',
                        'options'          => null,
                        'validation_rules' => ['min' => 35, 'max' => 50],
                        'is_required'      => true,
                        'is_filterable'    => true,
                    ],
                    [
                        'key'     => 'gender',
                        'label'   => ['fr' => 'Genre', 'en' => 'Gender'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => 'femme',   'label' => ['fr' => 'Femme']],
                            ['value' => 'homme',   'label' => ['fr' => 'Homme']],
                            ['value' => 'unisexe', 'label' => ['fr' => 'Unisexe']],
                        ],
                        'is_required'   => true,
                        'is_filterable' => true,
                    ],
                    [
                        'key'           => 'brand',
                        'label'         => ['fr' => 'Marque', 'en' => 'Brand'],
                        'type'          => 'text',
                        'options'       => null,
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                ],
                'children' => [
                    ['fr' => 'Baskets',          'en' => 'Sneakers',      'slug' => 'baskets'],
                    ['fr' => 'Talons',           'en' => 'Heels',         'slug' => 'talons'],
                    ['fr' => 'Bottes & Bottines', 'en' => 'Boots',        'slug' => 'bottes-bottines'],
                ],
            ],
            [
                'name'       => ['fr' => 'Accessoires', 'en' => 'Accessories'],
                'slug'       => 'accessoires',
                'icon'       => 'bag',
                'attributes' => [
                    [
                        'key'     => 'accessory_type',
                        'label'   => ['fr' => 'Type', 'en' => 'Type'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => 'sac',      'label' => ['fr' => 'Sac']],
                            ['value' => 'ceinture', 'label' => ['fr' => 'Ceinture']],
                            ['value' => 'chapeau',  'label' => ['fr' => 'Chapeau']],
                            ['value' => 'echarpe',  'label' => ['fr' => 'Écharpe']],
                            ['value' => 'bijou',    'label' => ['fr' => 'Bijou']],
                            ['value' => 'montre',   'label' => ['fr' => 'Montre']],
                            ['value' => 'lunettes', 'label' => ['fr' => 'Lunettes']],
                        ],
                        'is_required'   => true,
                        'is_filterable' => true,
                    ],
                    [
                        'key'           => 'brand',
                        'label'         => ['fr' => 'Marque', 'en' => 'Brand'],
                        'type'          => 'text',
                        'options'       => null,
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                ],
                'children' => [
                    ['fr' => 'Sacs',             'en' => 'Bags',          'slug' => 'sacs'],
                    ['fr' => 'Bijoux & Montres', 'en' => 'Jewelry & Watches', 'slug' => 'bijoux-montres'],
                ],
            ],
            [
                'name'       => ['fr' => 'Enfants', 'en' => 'Kids'],
                'slug'       => 'enfants',
                'icon'       => 'child',
                'attributes' => [
                    [
                        'key'     => 'age_range',
                        'label'   => ['fr' => 'Âge', 'en' => 'Age'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => '0-3m',   'label' => ['fr' => '0-3 mois']],
                            ['value' => '3-6m',   'label' => ['fr' => '3-6 mois']],
                            ['value' => '6-12m',  'label' => ['fr' => '6-12 mois']],
                            ['value' => '1-2a',   'label' => ['fr' => '1-2 ans']],
                            ['value' => '3-4a',   'label' => ['fr' => '3-4 ans']],
                            ['value' => '5-6a',   'label' => ['fr' => '5-6 ans']],
                            ['value' => '7-8a',   'label' => ['fr' => '7-8 ans']],
                            ['value' => '9-10a',  'label' => ['fr' => '9-10 ans']],
                            ['value' => '11-12a', 'label' => ['fr' => '11-12 ans']],
                        ],
                        'is_required'   => true,
                        'is_filterable' => true,
                    ],
                    [
                        'key'     => 'gender',
                        'label'   => ['fr' => 'Genre', 'en' => 'Gender'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => 'fille',   'label' => ['fr' => 'Fille']],
                            ['value' => 'garcon',  'label' => ['fr' => 'Garçon']],
                            ['value' => 'unisexe', 'label' => ['fr' => 'Unisexe']],
                        ],
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                    [
                        'key'           => 'size',
                        'label'         => ['fr' => 'Taille / Tour de tête', 'en' => 'Size'],
                        'type'          => 'text',
                        'options'       => null,
                        'is_required'   => false,
                        'is_filterable' => false,
                    ],
                ],
                'children' => [
                    ['fr' => 'Bébé (0-2 ans)', 'en' => 'Baby',        'slug' => 'bebe'],
                    ['fr' => '2-8 ans',         'en' => 'Kids 2-8',    'slug' => 'enfants-2-8-ans'],
                    ['fr' => '9-14 ans',         'en' => 'Kids 9-14',  'slug' => 'enfants-9-14-ans'],
                ],
            ],
            [
                'name'       => ['fr' => 'Maison & Ameublement', 'en' => 'Home & Furniture'],
                'slug'       => 'maison',
                'icon'       => 'sofa',
                'attributes' => [
                    [
                        'key'     => 'material',
                        'label'   => ['fr' => 'Matière', 'en' => 'Material'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => 'bois', 'label' => ['fr' => 'Bois']],
                            ['value' => 'metal', 'label' => ['fr' => 'Métal']],
                            ['value' => 'tissu', 'label' => ['fr' => 'Tissu']],
                            ['value' => 'verre', 'label' => ['fr' => 'Verre']],
                        ],
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                    [
                        'key'           => 'dimensions',
                        'label'         => ['fr' => 'Dimensions (cm)', 'en' => 'Dimensions (cm)'],
                        'type'          => 'text',
                        'options'       => null,
                        'is_required'   => false,
                        'is_filterable' => false,
                    ],
                ],
                'children' => [
                    ['fr' => 'Canapés & Fauteuils', 'en' => 'Sofas & Chairs', 'slug' => 'canapes'],
                    ['fr' => 'Tables & Chaises', 'en' => 'Tables', 'slug' => 'tables'],
                    ['fr' => 'Décoration', 'en' => 'Decoration', 'slug' => 'decoration'],
                ],
            ],
            [
                'name'       => ['fr' => 'High-Tech', 'en' => 'Electronics'],
                'slug'       => 'high-tech',
                'icon'       => 'device-phone-mobile',
                'attributes' => [
                    [
                        'key'           => 'brand',
                        'label'         => ['fr' => 'Marque', 'en' => 'Brand'],
                        'type'          => 'text',
                        'options'       => null,
                        'is_required'   => true,
                        'is_filterable' => true,
                    ],
                    [
                        'key'     => 'storage',
                        'label'   => ['fr' => 'Capacité / Stockage', 'en' => 'Storage'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => '64gb', 'label' => ['fr' => '64 Go']],
                            ['value' => '128gb', 'label' => ['fr' => '128 Go']],
                            ['value' => '256gb', 'label' => ['fr' => '256 Go']],
                            ['value' => '512gb', 'label' => ['fr' => '512 Go']],
                        ],
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                ],
                'children' => [
                    ['fr' => 'Smartphones', 'en' => 'Smartphones', 'slug' => 'smartphones'],
                    ['fr' => 'Ordinateurs', 'en' => 'Computers', 'slug' => 'ordinateurs'],
                    ['fr' => 'Jeux Vidéo', 'en' => 'Video Games', 'slug' => 'jeux-video'],
                ],
            ],
            [
                'name'       => ['fr' => 'Électroménager', 'en' => 'Appliances'],
                'slug'       => 'electromenager',
                'icon'       => 'sparkles',
                'attributes' => [
                    [
                        'key'     => 'energy_class',
                        'label'   => ['fr' => 'Classe Énergétique', 'en' => 'Energy Class'],
                        'type'    => 'select',
                        'options' => [
                            ['value' => 'A', 'label' => ['fr' => 'A']],
                            ['value' => 'B', 'label' => ['fr' => 'B']],
                            ['value' => 'C', 'label' => ['fr' => 'C']],
                        ],
                        'is_required'   => false,
                        'is_filterable' => true,
                    ],
                ],
                'children' => [
                    ['fr' => 'Gros Électroménager', 'en' => 'Large Appliances', 'slug' => 'gros-electromenager'],
                    ['fr' => 'Petit Électroménager', 'en' => 'Small Appliances', 'slug' => 'petit-electromenager'],
                ],
            ],
        ];

        foreach ($categoriesData as $sort => $catData) {
            /** @var Category $parent */
            $parent = Category::create([
                'name'       => $catData['name'],        // JSON array
                'slug'       => $catData['slug'],
                'icon'       => $catData['icon'] ?? null,
                'sort_order' => $sort,
                'parent_id'  => null,
                'is_active'  => true,
            ]);

            // Créer les attributs dynamiques de la catégorie
            foreach ($catData['attributes'] as $sortAttr => $attrData) {
                CategoryAttribute::create([
                    'category_id'     => $parent->id,
                    'key'             => $attrData['key'],
                    'label'           => $attrData['label'],
                    'type'            => $attrData['type'],
                    'options'         => $attrData['options'] ?? null,
                    'validation_rules'=> $attrData['validation_rules'] ?? null,
                    'is_required'     => $attrData['is_required'] ?? false,
                    'is_filterable'   => $attrData['is_filterable'] ?? true,
                    'sort_order'      => $sortAttr,
                ]);
            }

            // Créer les sous-catégories
            foreach ($catData['children'] as $childSort => $childData) {
                Category::create([
                    'name'       => ['fr' => $childData['fr'], 'en' => $childData['en']],
                    'slug'       => $childData['slug'],
                    'parent_id'  => $parent->id,
                    'sort_order' => $childSort,
                    'is_active'  => true,
                ]);
            }
        }
    }
}
