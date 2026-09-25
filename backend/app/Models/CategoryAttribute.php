<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class CategoryAttribute
 *
 * @package App\Models
 * @property int $id
 * @property int $category_id
 * @property string $key
 * @property array $label
 * @property string $type
 * @property array|null $options
 * @property array|null $validation_rules
 * @property bool $is_required
 * @property bool $is_filterable
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class CategoryAttribute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'category_id',
        'key',
        'label',
        'type',
        'options',
        'validation_rules',
        'is_required',
        'is_filterable',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'label' => 'array',
        'options' => 'array',
        'validation_rules' => 'array',
        'is_required' => 'boolean',
        'is_filterable' => 'boolean',
    ];

    /**
     * Get the category that owns the attribute.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the values for this attribute.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function values(): HasMany
    {
        return $this->hasMany(ListingAttributeValue::class);
    }

    /**
     * Build Laravel validation rules for this attribute.
     *
     * @return array
     */
    public function buildValidationRules(): array
    {
        $rules = [];

        if ($this->is_required) {
            $rules[] = 'required';
        } else {
            $rules[] = 'nullable';
        }

        switch ($this->type) {
            case 'string':
                $rules[] = 'string';
                $rules[] = 'max:255';
                break;
            case 'integer':
                $rules[] = 'integer';
                break;
            case 'boolean':
                $rules[] = 'boolean';
                break;
            case 'enum':
            case 'select':
                if (is_array($this->options)) {
                    $validValues = array_map(function($option) {
                        return is_array($option) && isset($option['value']) ? $option['value'] : $option;
                    }, $this->options);
                    $rules[] = 'in:' . implode(',', $validValues);
                }
                break;
        }

        if (is_array($this->validation_rules)) {
            $rules = array_merge($rules, $this->validation_rules);
        }

        return $rules;
    }
}
