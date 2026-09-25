<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Category\StoreCategoryAttributeRequest;
use App\Http\Requests\Category\UpdateCategoryAttributeRequest;
use App\Models\Category;
use App\Models\CategoryAttribute;
use Illuminate\Http\JsonResponse;

class CategoryAttributeController extends BaseApiController
{
    /**
     * List attributes for a category.
     *
     * @param int $categoryId
     * @return JsonResponse
     */
    public function index($categoryId): JsonResponse
    {
        $category = Category::findOrFail($categoryId);
        $attributes = $category->attributes()->orderBy('sort_order')->get();

        return $this->sendResponse($attributes, 'Attributes retrieved successfully');
    }

    /**
     * Store a new attribute for a category (admin only).
     *
     * @param StoreCategoryAttributeRequest $request
     * @param int $categoryId
     * @return JsonResponse
     */
    public function store(StoreCategoryAttributeRequest $request, $categoryId): JsonResponse
    {
        $category = Category::findOrFail($categoryId);
        $attribute = $category->attributes()->create($request->validated());

        return $this->sendResponse($attribute, 'Attribute created successfully', 201);
    }

    /**
     * Update a category attribute (admin only).
     *
     * @param UpdateCategoryAttributeRequest $request
     * @param int $categoryId
     * @param int $attributeId
     * @return JsonResponse
     */
    public function update(UpdateCategoryAttributeRequest $request, $categoryId, $attributeId): JsonResponse
    {
        $attribute = CategoryAttribute::where('category_id', $categoryId)
            ->findOrFail($attributeId);
            
        $attribute->update($request->validated());

        return $this->sendResponse($attribute, 'Attribute updated successfully');
    }

    /**
     * Remove a category attribute (admin only).
     *
     * @param int $categoryId
     * @param int $attributeId
     * @return JsonResponse
     */
    public function destroy($categoryId, $attributeId): JsonResponse
    {
        $attribute = CategoryAttribute::where('category_id', $categoryId)
            ->findOrFail($attributeId);
            
        $attribute->delete();

        return $this->sendResponse(null, 'Attribute deleted successfully');
    }
}
