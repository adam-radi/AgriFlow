<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $unreadCount = $user->unreadNotifications()->count();

        $notifications = $user->notifications()
            ->latest()
            ->take(30)
            ->get()
            ->map(function ($n) {
                return [
                    'id'         => $n->id,
                    'type'       => $n->data['type'] ?? 'general',
                    'title'      => $n->data['title'] ?? 'Notification',
                    'message'    => $n->data['message'] ?? '',
                    'link'       => $n->data['link'] ?? null,
                    'inquiry_id' => $n->data['inquiry_id'] ?? null,
                    'read_at'    => $n->read_at ? $n->read_at->toIso8601String() : null,
                    'is_read'    => !is_null($n->read_at),
                    'created_at' => $n->created_at ? $n->created_at->toIso8601String() : null,
                ];
            });

        return response()->json([
            'unread_count' => $unreadCount,
            'data'         => $notifications,
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->where('id', $id)->firstOrFail();

        $notification->markAsRead();

        return response()->json([
            'message'      => 'Notification marquée comme lue',
            'unread_count' => $request->user()->unreadNotifications()->count(),
            'data'         => [
                'id'      => $notification->id,
                'is_read' => true,
                'read_at' => $notification->fresh()->read_at?->toIso8601String(),
            ],
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'message'      => 'Toutes les notifications ont été marquées comme lues',
            'unread_count' => 0,
        ]);
    }
}
