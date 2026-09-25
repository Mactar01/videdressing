<?php

declare(strict_types=1);

namespace App\Traits;

/**
 * Trait HasI18n
 *
 * Fournit un helper de lecture de champs JSON multilingues stockés en base.
 * Les champs concernés sont des colonnes de type JSON dont la valeur
 * ressemble à : {"fr": "Robe d'été", "en": "Summer dress"}.
 *
 * Stratégie de fallback :
 *   1. Locale demandée (ou locale applicative active si non précisée).
 *   2. Fallback sur 'fr'.
 *   3. Fallback sur la première valeur disponible dans le tableau.
 *   4. Retourne null si le champ est vide ou invalide.
 *
 * Utilisation dans un modèle Eloquent :
 *
 * ```php
 * use App\Traits\HasI18n;
 *
 * class Listing extends Model
 * {
 *     use HasI18n;
 *
 *     protected $casts = ['title' => 'array'];
 *
 *     public function getTitleAttribute(): ?string
 *     {
 *         return $this->getLocalizedAttribute('title');
 *     }
 * }
 * ```
 */
trait HasI18n
{
    /**
     * Récupère une valeur localisée depuis un champ JSON multilingue.
     *
     * @param  string       $field   Nom de l'attribut Eloquent contenant le JSON i18n.
     * @param  string|null  $locale  Code ISO 639-1 de la locale souhaitée.
     *                               Si null, utilise la locale applicative active.
     * @return string|null           Valeur traduite ou null si introuvable.
     */
    public function getLocalizedAttribute(string $field, ?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();

        /** @var mixed $data */
        $data = $this->$field;

        // Décode la chaîne JSON si le cast Eloquent n'a pas déjà été appliqué.
        if (is_string($data)) {
            $data = json_decode($data, true);
        }

        // Si le champ n'est pas un tableau (valeur scalaire brute), on le retourne tel quel.
        if (! is_array($data)) {
            return is_scalar($data) ? (string) $data : null;
        }

        // Stratégie de fallback : locale demandée → 'fr' → première valeur disponible.
        return $data[$locale]
            ?? $data['fr']
            ?? (! empty($data) ? (string) array_values($data)[0] : null);
    }
}
