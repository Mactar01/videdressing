<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('category') ? $this->route('category')->id : null;

        return [
            'parent_id' => ['nullable', 'exists:categories,id'],
            'slug' => ['required', 'string', 'unique:categories,slug,' . $categoryId],
            'name' => ['required', 'array'],
            'name.fr' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'array'],
            'icon' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
