<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

/**
 * Class Category
 *
 * @package App\Models
 * @property int $id
 * @property int|null $parent_id
 * @property string $slug
 * @property array $name
 * @property array|null $description
 * @property string|null $icon
 * @property int $sort_order
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string|null $localized_name
 */
class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'parent_id',
        'slug',
        'name',
        'description',
        'icon',
        'sort_order',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the parent category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the child categories.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Get the attributes for this category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attributes(): HasMany
    {
        return $this->hasMany(CategoryAttribute::class);
    }

    /**
     * Get the listings in this category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * Get the ancestors of this category.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAncestors()
    {
        $ancestors = collect([]);
        $category = $this;

        while ($category->parent) {
            $ancestors->push($category->parent);
            $category = $category->parent;
        }

        return $ancestors->reverse()->values();
    }

    /**
     * Get all descendant IDs.
     *
     * @return array
     */
    public function getDescendantIds(): array
    {
        $rows = DB::select(
            "WITH RECURSIVE CategoryTree AS (
                SELECT id FROM categories WHERE parent_id = ?
                UNION ALL
                SELECT c.id FROM categories c
                INNER JOIN CategoryTree ct ON ct.id = c.parent_id
            )
            SELECT id FROM CategoryTree",
            [$this->id]
        );

        return array_column($rows, 'id');
    }

    /**
     * Get the localized name of the category.
     *
     * @return string|null
     */
    public function getNameAttribute(): ?string
    {
        $locale = app()->getLocale();
        $names = $this->getRawOriginal('name');

        if (is_string($names)) {
            $names = json_decode($names, true);
        }

        return $names[$locale] ?? ($names['en'] ?? null);
    }
}
