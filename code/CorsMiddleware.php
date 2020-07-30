<?php

namespace NikRolls\SsFreedom;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\Middleware\HTTPMiddleware;
use SilverStripe\Core\Config\Config;

class CorsMiddleware implements HTTPMiddleware
{
  public function process(HTTPRequest $request, callable $delegate)
  {
    $config = Config::inst()->get(static::class);

    $origin = $request->getHeader('Origin');
    if (!$origin) {
      return $delegate($request);
    }

    $allowedOrigins = (array)$config['origins'];
    $originAuthorised = $this->validateOrigin($origin, $allowedOrigins);

    if (!$originAuthorised) {
      return HTTPResponse::create('Access Forbidden', 403);
    }

    $response = $request->httpMethod() === 'OPTIONS' ? HTTPResponse::create() : $delegate($request);

    $response->addHeader('Access-Control-Allow-Origin', $originAuthorised);
    if (isset($config['headers'])) {
      $response->addHeader('Access-Control-Allow-Headers', implode(', ', (array)$config['headers']));
    }
    if (isset($config['methods'])) {
      $response->addHeader('Access-Control-Allow-Methods', implode(', ', (array)$config['methods']));
    }
    if (isset($config['maxAge'])) {
      $response->addHeader('Access-Control-Max-Age', $config['maxAge']);
    }
    if (isset($config['allowCredentials'])) {
      $response->addHeader(
        'Access-Control-Allow-Credentials',
        $config['allowCredentials'] ? 'true' : 'false'
      );
    }

    return $response;
  }

  protected function validateOrigin($origin, $allowedOrigins)
  {
    if (empty($allowedOrigins) || empty($origin)) {
      return false;
    }

    foreach ($allowedOrigins as $allowedOrigin) {
      if ($allowedOrigin === '*') {
        return $allowedOrigin;
      }
      if (strcasecmp($allowedOrigin, $origin) === 0) {
        return $origin;
      }
    }

    return false;
  }
}
