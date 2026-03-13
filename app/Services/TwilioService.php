<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class TwilioService
{
    protected Client $client;

    public function __construct()
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $this->client = new Client($sid, $token);
    }

    public function sendWhatsApp(string $toNormalized, string $message)
    {
        $from = config('services.twilio.whatsapp_from');

        try {
            Log::info("Enviando WhatsApp a: whatsapp:$toNormalized desde $from");
            $msg = $this->client->messages->create(
                "whatsapp:$toNormalized",
                [
                    'from' => $from,
                    'body' => $message,
                ]
            );

            Log::info("Mensaje enviado correctamente: " . json_encode($msg));
            return $msg;
        } catch (\Throwable $e) {
            Log::error('Twilio send error: '.$e->getMessage());
            return null;
        }
    }
}
