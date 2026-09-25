<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Report::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reportable_type' => ['required', 'in:listing,user,message'],
            'reportable_id' => ['required', 'integer'],
            'reason' => ['required', 'in:spam,fake,offensive,prohibited_item,other'],
            'comment' => ['nullable', 'string', 'max:500'],
        ];
    }
}
