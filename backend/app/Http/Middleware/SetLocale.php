<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware SetLocale
 *
 * Détermine la locale active de l'application à partir de l'en-tête HTTP
 * `Accept-Language` fourni par le client. Si la locale extraite n'est pas
 * dans la liste des langues supportées, la locale par défaut est appliquée.
 *
 * Les langues supportées et la locale par défaut sont lues depuis la
 * configuration `vide-dressing.locales`.
 */
class SetLocale
{
    /**
     * Traite la requête entrante et configure la locale applicative.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @param  Closure(Request): Response  $next  Le prochain middleware ou contrôleur.
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var list<string> $supported */
        $supported = config('vide-dressing.locales.supported', ['fr', 'en']);

        /** @var string $default */
        $default = config('vide-dressing.locales.default', 'fr');

        // Récupère la valeur brute de l'en-tête (ex : "fr-FR,fr;q=0.9,en;q=0.8").
        $rawLocale = $request->header('Accept-Language', $default);

        // Extrait les deux premiers caractères pour obtenir le code ISO 639-1 (ex : "fr").
        $locale = substr((string) $rawLocale, 0, 2);

        if (! in_array($locale, $supported, true)) {
            $locale = $default;
        }

        App::setLocale($locale);

        return $next($request);
    }
}
