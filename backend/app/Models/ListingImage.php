<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * Class ListingImage
 *
 * @package App\Models
 * @property int $id
 * @property int $listing_id
 * @property string $path
 * @property string $disk
 * @property int|null $width
 * @property int|null $height
 * @property int|null $size_bytes
 * @property string|null $mime_type
 * @property int $sort_order
 * @property bool $is_cover
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string|null $url
 */
class ListingImage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'listing_id',
        'path',
        'disk',
        'width',
        'height',
        'size_bytes',
        'mime_type',
        'sort_order',
        'is_cover',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_cover' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get the listing that owns the image.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * Get the public URL for the image on R2.
     *
     * @return string|null
     */
    public function getUrlAttribute(): ?string
    {
        if (!$this->path) {
            return null;
        }

        // Return public URL or temporary URL based on disk settings
        return Storage::disk($this->disk ?: 'r2')->url($this->path);
    }
}
