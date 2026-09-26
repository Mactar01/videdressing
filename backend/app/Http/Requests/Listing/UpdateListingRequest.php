<?php

namespace App\Http\Requests\Listing;

use Illuminate\Foundation\Http\FormRequest;

class UpdateListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('listing'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'array'],
            'title.fr' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'array'],
            'price' => ['required', 'numeric', 'min:0.01', 'max:10000000'],
            'currency' => ['nullable', 'in:EUR,USD,GBP,XOF'],
            'category_id' => ['required', 'exists:categories,id'],
            'condition' => ['required', 'in:new,like_new,good,fair,poor'],
            'address_id' => ['nullable', 'exists:addresses,id'],
            'attributes' => ['nullable', 'array'],
            'city' => ['nullable', 'string', 'max:100'],
            'zip_code' => ['nullable', 'string', 'max:20'],
        ];
    }
}
