<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * BaseApiController
 *
 * Contrôleur abstrait de base pour tous les endpoints de l'API V1.
 * Fournit des helpers de réponse JSON standardisés afin de garantir
 * une structure de réponse cohérente sur l'ensemble de l'API :
 *
 *  Succès  : { "data": …, "message": "…", "meta"?: {…} }
 *  Erreur  : { "message": "…", "errors"?: {…} }
 *
 * Tous les contrôleurs de l'API V1 doivent étendre cette classe.
 */
abstract /**
 * @OA\Info(
 *      version="1.0.0",
 *      title="API VideDressing",
 *      description="Documentation officielle de l'API de la marketplace VideDressing.",
 *      @OA\Contact(
 *          email="contact@videdressing.fr"
 *      )
 * )
 *
 * @OA\Server(
 *      url=L5_SWAGGER_CONST_HOST,
 *      description="Serveur API Principal"
 * )
 *
 * @OA\SecurityScheme(
 *      securityScheme="bearerAuth",
 *      type="http",
 *      scheme="bearer",
 *      bearerFormat="JWT"
 * )
 */
class BaseApiController extends Controller
{
    /**
     * Retourne une réponse JSON de succès générique.
     *
     * @param  mixed        $data     Données à sérialiser dans la clé "data".
     * @param  string       $message  Message lisible par l'humain.
     * @param  int          $status   Code HTTP de la réponse (2xx).
     * @param  array<string, mixed>  $meta  Métadonnées optionnelles (pagination, etc.).
     * @return JsonResponse
     */
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200,
        array $meta = [],
    ): JsonResponse {
        $response = [
            'data'    => $data,
            'message' => $message,
        ];

        if (! empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $status);
    }

    /**
     * Retourne une réponse JSON 201 Created.
     *
     * @param  mixed   $data     Ressource créée.
     * @param  string  $message  Message descriptif.
     * @return JsonResponse
     */
    protected function created(mixed $data = null, string $message = 'Created'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    /**
     * Retourne une réponse JSON 204 No Content.
     *
     * @return JsonResponse
     */
    protected function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    /**
     * Retourne une réponse JSON d'erreur.
     *
     * @param  string       $message  Message d'erreur lisible.
     * @param  int          $status   Code HTTP de l'erreur (4xx / 5xx).
     * @param  mixed        $errors   Détails des erreurs de validation ou autres.
     * @return JsonResponse
     */
    protected function error(string $message, int $status = 400, mixed $errors = null): JsonResponse
    {
        $response = ['message' => $message];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }

    /**
     * Retourne une réponse JSON 403 Forbidden.
     *
     * @param  string  $message  Message descriptif de l'interdiction.
     * @return JsonResponse
     */
    protected function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     * Retourne une réponse JSON 404 Not Found.
     *
     * @param  string  $message  Message descriptif de la ressource introuvable.
     * @return JsonResponse
     */
    protected function notFound(string $message = 'Not found'): JsonResponse
    {
        return $this->error($message, 404);
    }

    /**
     * Retourne une réponse JSON 501 Not Implemented.
     *
     * Utilisé pour les endpoints planifiés mais pas encore développés
     * (ex : intégration Stripe en stand-by).
     *
     * @param  string  $message  Message descriptif.
     * @return JsonResponse
     */
    protected function notImplemented(string $message = 'Not implemented yet'): JsonResponse
    {
        return $this->error($message, 501);
    }

    // -------------------------------------------------------------------------
    // Aliases pour la compatibilité avec les controllers générés
    // -------------------------------------------------------------------------

    /**
     * Alias de success() — compatibilité avec le style L9 sendResponse.
     *
     * @param  mixed   $data
     * @param  string  $message
     * @param  int     $status
     * @return JsonResponse
     */
    protected function sendResponse(mixed $data = null, string $message = 'Success', int $status = 200): JsonResponse
    {
        return $this->success($data, $message, $status);
    }

    /**
     * Alias de error() — compatibilité avec le style L9 sendError.
     *
     * @param  string  $message
     * @param  array   $errors
     * @param  int     $status
     * @return JsonResponse
     */
    protected function sendError(string $message, array $errors = [], int $status = 400): JsonResponse
    {
        return $this->error($message, $status, empty($errors) ? null : $errors);
    }
}

