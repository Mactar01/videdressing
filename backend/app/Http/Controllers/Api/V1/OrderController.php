<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Models\Order;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends BaseApiController
{
    /**
     * List user's orders (bought and sold).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        $orders = Order::where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->with(['listing', 'buyer', 'seller'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return $this->sendResponse($orders, 'Orders retrieved successfully');
    }

    /**
     * Show order details.
     *
     * @param Order $order
     * @return JsonResponse
     */
    public function show(Order $order): JsonResponse
    {
        $this->authorize('view', $order);
        
        $order->load(['listing', 'buyer', 'seller', 'shippingAddress']);

        return $this->sendResponse($order, 'Order retrieved successfully');
    }

    /**
     * Initialize an order (Stripe in stand-by).
     *
     * @param StoreOrderRequest $request
     * @return JsonResponse
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        // TODO: Create Stripe PaymentIntent
        return response()->json(['message' => 'Not Implemented - Stripe integration pending'], 501);
    }

    /**
     * Confirm payment via Stripe Webhook.
     *
     * @param Order $order
     * @return JsonResponse
     */
    public function confirmPayment(Order $order): JsonResponse
    {
        // TODO: Verify Stripe webhook signature and update order status
        return response()->json(['message' => 'Not Implemented - Stripe integration pending'], 501);
    }

    /**
     * Confirm delivery and trigger Stripe capture.
     *
     * @param Request $request
     * @param Order $order
     * @return JsonResponse
     */
    public function confirmDelivery(Request $request, Order $order): JsonResponse
    {
        $this->authorize('confirmDelivery', $order);
        
        // TODO: Capture Stripe PaymentIntent
        return response()->json(['message' => 'Not Implemented - Stripe integration pending'], 501);
    }

    /**
     * Cancel an order.
     *
     * @param Request $request
     * @param Order $order
     * @return JsonResponse
     */
    public function cancel(Request $request, Order $order): JsonResponse
    {
        $this->authorize('cancel', $order);
        
        // TODO: Cancel Stripe PaymentIntent if needed
        return response()->json(['message' => 'Not Implemented - Stripe integration pending'], 501);
    }
}
