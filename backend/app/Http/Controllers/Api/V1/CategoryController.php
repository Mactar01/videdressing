<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends BaseApiController
{
    /**
     * List all active categories as a tree.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();
            
        return $this->success($categories, 'Categories retrieved successfully');
    }

    /**
     * Show category details and its filterable attributes.
     *
     * @param string $slug
     * @return JsonResponse
     */
    public function show($slug): JsonResponse
    {
        $category = Category::with(['attributes' => function ($query) {
            $query->where('is_filterable', true)->orderBy('sort_order');
        }])->where('slug', $slug)->firstOrFail();

        return $this->success($category, 'Category retrieved successfully');
    }

    /**
     * Store a new category (admin only).
     *
     * @param StoreCategoryRequest $request
     * @return JsonResponse
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return $this->created($category, 'Category created successfully');
    }

    /**
     * Update a category (admin only).
     *
     * @param UpdateCategoryRequest $request
     * @param Category $category
     * @return JsonResponse
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        return $this->success($category, 'Category updated successfully');
    }

    /**
     * Remove a category (admin only).
     *
     * @param Category $category
     * @return JsonResponse
     */
    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return $this->noContent();
    }
}
