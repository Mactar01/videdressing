<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\User\UpdateProfileRequest;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * UserController
 *
 * Gère les profils utilisateurs (publics et privés), le carnet d'adresses,
 * et les endpoints RGPD (export et suppression de compte).
 */
class UserController extends BaseApiController
{
    /**
     * Affiche le profil public d'un vendeur.
     * Masque les données sensibles (email, téléphone, Stripe…).
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $user = User::select(['id', 'name', 'avatar', 'bio', 'is_verified', 'created_at'])
            ->where('is_banned', false)
            ->findOrFail($id);

        $user->loadCount(['listings' => fn ($q) => $q->where('status', 'active')]);
        $user->loadAvg('reviewsReceived', 'rating');

        return $this->success($user, 'User profile retrieved successfully');
    }

    /**
     * Met à jour le profil de l'utilisateur connecté.
     *
     * @param  UpdateProfileRequest  $request
     * @return JsonResponse
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'r2');
            $user->update(array_merge($request->validated(), ['avatar' => $path]));
        } else {
            $user->update($request->validated());
        }

        return $this->success($user->fresh(), 'Profile updated successfully');
    }

    /**
     * RGPD — Exporte toutes les données personnelles de l'utilisateur en JSON.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function exportData(Request $request): JsonResponse
    {
        $user = $request->user()->load([
            'addresses',
            'listings.images',
            'listings.attributeValues.categoryAttribute',
            'orders' => fn ($q) => $q->select(['id', 'reference', 'amount', 'status', 'created_at']),
            'reviewsWritten',
            'reports',
        ]);

        $export = [
            'exported_at'   => now()->toIso8601String(),
            'user'          => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'phone'      => $user->phone,
                'bio'        => $user->bio,
                'locale'     => $user->locale,
                'created_at' => $user->created_at,
            ],
            'addresses'     => $user->addresses,
            'listings'      => $user->listings,
            'orders'        => $user->orders,
            'reviews_given' => $user->reviewsWritten,
            'reports_filed' => $user->reports,
        ];

        return $this->success($export, 'Your data has been exported. Handle with care.');
    }

    /**
     * RGPD — Anonymise et supprime (soft delete) le compte utilisateur.
     * Révoque tous les tokens Sanctum. Les annonces actives sont archivées.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function deleteAccount(Request $request): JsonResponse
    {
        $user = $request->user();

        // Révoquer tous les tokens Sanctum
        $user->tokens()->delete();

        // Archiver toutes les annonces actives
        $user->listings()->where('status', 'active')->update(['status' => 'archived']);

        // Anonymiser les données personnelles
        $user->update([
            'name'               => 'Utilisateur supprimé',
            'email'              => 'deleted_' . $user->id . '_' . time() . '@deleted.local',
            'phone'              => null,
            'bio'                => null,
            'avatar'             => null,
            'stripe_account_id'  => null,
            'stripe_customer_id' => null,
        ]);

        // Soft delete (RGPD — conserve les données transactionnelles)
        $user->delete();

        return $this->success(null, 'Your account has been deleted. Goodbye.');
    }

    // =========================================================================
    // Carnet d'adresses
    // =========================================================================

    /**
     * Liste les adresses de l'utilisateur connecté.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function addresses(Request $request): JsonResponse
    {
        return $this->success(
            $request->user()->addresses()->orderByDesc('is_default')->get(),
            'Addresses retrieved successfully'
        );
    }

    /**
     * Ajoute une nouvelle adresse.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function storeAddress(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label'       => ['nullable', 'string', 'max:50'],
            'first_name'  => ['required', 'string', 'max:100'],
            'last_name'   => ['required', 'string', 'max:100'],
            'line1'       => ['required', 'string', 'max:200'],
            'line2'       => ['nullable', 'string', 'max:200'],
            'city'        => ['required', 'string', 'max:100'],
            'zip_code'    => ['required', 'string', 'max:20'],
            'country_code'=> ['nullable', 'string', 'size:2'],
            'is_default'  => ['nullable', 'boolean'],
        ]);

        if (!empty($validated['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create($validated);

        return $this->created($address, 'Address created successfully');
    }

    /**
     * Met à jour une adresse existante.
     *
     * @param  Request  $request
     * @param  Address  $address
     * @return JsonResponse
     */
    public function updateAddress(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return $this->forbidden('You do not own this address.');
        }

        $validated = $request->validate([
            'label'       => ['nullable', 'string', 'max:50'],
            'first_name'  => ['sometimes', 'string', 'max:100'],
            'last_name'   => ['sometimes', 'string', 'max:100'],
            'line1'       => ['sometimes', 'string', 'max:200'],
            'line2'       => ['nullable', 'string', 'max:200'],
            'city'        => ['sometimes', 'string', 'max:100'],
            'zip_code'    => ['sometimes', 'string', 'max:20'],
            'country_code'=> ['nullable', 'string', 'size:2'],
            'is_default'  => ['nullable', 'boolean'],
        ]);

        if (!empty($validated['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($validated);

        return $this->success($address, 'Address updated successfully');
    }

    /**
     * Supprime une adresse.
     *
     * @param  Request  $request
     * @param  Address  $address
     * @return JsonResponse
     */
    public function destroyAddress(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return $this->forbidden('You do not own this address.');
        }

        $address->delete();

        return $this->noContent();
    }

    /**
     * Définit une adresse comme adresse par défaut.
     *
     * @param  Request  $request
     * @param  Address  $address
     * @return JsonResponse
     */
    public function setDefaultAddress(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return $this->forbidden('You do not own this address.');
        }

        $request->user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return $this->success($address, 'Default address updated successfully');
    }
}
