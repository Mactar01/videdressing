<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware IsAdmin
 *
 * Protège les routes réservées aux administrateurs de la plateforme.
 * Vérifie que l'utilisateur authentifié possède le flag `is_admin = true`
 * sur son modèle. Retourne une erreur 403 JSON en cas d'accès non autorisé.
 *
 * Doit être placé après le middleware `auth:sanctum` dans la chaîne de
 * middlewares afin de garantir qu'un utilisateur est bien authentifié.
 */
class IsAdmin
{
    /**
     * Traite la requête entrante.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @param  Closure(Request): Response  $next  Le prochain middleware ou contrôleur.
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || ! $user->is_admin) {
            return response()->json(
                ['message' => 'Forbidden. Admin access required.'],
                Response::HTTP_FORBIDDEN,
            );
        }

        return $next($request);
    }
}
