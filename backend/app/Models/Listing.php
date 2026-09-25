<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

/**
 * Class Listing
 *
 * @package App\Models
 * @property int $id
 * @property int $user_id
 * @property int $category_id
 * @property int|null $address_id
 * @property array $title
 * @property array $description
 * @property float $price
 * @property string $currency
 * @property string $condition
 * @property string $status
 * @property bool $is_active
 * @property int $views_count
 * @property int $favorites_count
 * @property \Illuminate\Support\Carbon|null $boosted_until
 * @property \Illuminate\Support\Carbon|null $sold_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\ListingImage|null $cover_image
 */
class Listing extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'address_id',
        'title',
        'description',
        'price',
        'currency',
        'condition',
        'status',
        'city',
        'zip_code',
        'country_code',
        'latitude',
        'longitude',
        'boosted_until',
        'sold_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'boosted_until' => 'datetime',
        'sold_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user that owns the listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category of the listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the address for the listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    /**
     * Get the attribute values for the listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attributeValues(): HasMany
    {
        return $this->hasMany(ListingAttributeValue::class);
    }

    /**
     * Get the images for the listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class);
    }

    /**
     * Get the favorites for the listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Get the conversations for the listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    /**
     * Get the orders for the listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function toSearchableArray(): array
    {
        $array = $this->toArray();

        $array['category'] = $this->category ? $this->category->name : null;
        // On utilise le champ city de la table
        $array['city'] = $this->city;
        
        $dynamicAttributes = [];
        foreach ($this->attributeValues as $attributeValue) {
            if ($attributeValue->categoryAttribute) {
                $dynamicAttributes[$attributeValue->categoryAttribute->key] = $attributeValue->value;
            }
        }
        $array['attributes'] = $dynamicAttributes;

        return $array;
    }

    /**
     * Determine if the model should be searchable.
     *
     * @return bool
     */
    public function shouldBeSearchable(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Get the cover image for the listing.
     *
     * @return \App\Models\ListingImage|null
     */
    public function getCoverImageAttribute(): ?ListingImage
    {
        return $this->images()->where('is_cover', true)->first() ?? $this->images()->first();
    }

    /**
     * Scope a query to only include active listings.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->where('status', 'active');
    }

    public function scopeForCategory(Builder $query, int $categoryId): Builder
    {
        $category = Category::find($categoryId);
        if (!$category) {
            return $query->where('category_id', $categoryId);
        }

        $descendantIds = $category->getDescendantIds();
        $descendantIds[] = $categoryId;

        return $query->whereIn('category_id', $descendantIds);
    }

    /**
     * Atomically increment the views count.
     *
     * @return void
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }
}
