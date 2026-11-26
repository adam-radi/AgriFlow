<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CounterOfferRequest;
use App\Http\Requests\StoreInquiryRequest;
use App\Http\Resources\PurchaseInquiryResource;
use App\Models\PurchaseInquiry;
use App\Services\InquiryService;
use Illuminate\Http\Request;

class PurchaseInquiryController extends Controller
{
    public function index(Request $request, InquiryService $service)
    {
        $this->authorize('viewAny', PurchaseInquiry::class);

        $inquiries = $service->listInquiries($request->user(), $request);

        return $this->success(
            PurchaseInquiryResource::collection($inquiries)->response()->getData(true)
        );
    }

    public function store(StoreInquiryRequest $request, InquiryService $service)
    {
        $this->authorize('create', PurchaseInquiry::class);

        $inquiry = $service->createInquiry($request, $request->user());

        return $this->created(new PurchaseInquiryResource($inquiry), 'Demande d\'achat transmise au producteur');
    }

    public function show(PurchaseInquiry $inquiry, InquiryService $service)
    {
        $this->authorize('view', $inquiry);

        $inquiry = $service->showInquiry($inquiry);

        return $this->success(new PurchaseInquiryResource($inquiry));
    }

    public function counterOffer(PurchaseInquiry $inquiry, CounterOfferRequest $request, InquiryService $service)
    {
        $this->authorize('negotiate', $inquiry);

        $updated = $service->submitCounterOffer($inquiry, $request, $request->user());

        return $this->success(new PurchaseInquiryResource($updated), 'Contre-proposition soumise avec succès');
    }

    public function accept(PurchaseInquiry $inquiry, Request $request, InquiryService $service)
    {
        $this->authorize('accept', $inquiry);

        $accepted = $service->acceptOffer($inquiry, $request->user());

        return $this->success(new PurchaseInquiryResource($accepted), 'Conditions convenues et acceptées');
    }

    public function confirm(PurchaseInquiry $inquiry, Request $request, InquiryService $service)
    {
        $this->authorize('confirm', $inquiry);

        $confirmed = $service->confirmAgreement($inquiry, $request->user());

        return $this->success(new PurchaseInquiryResource($confirmed), 'Accord commercial confirmé définitivement');
    }

    public function reject(PurchaseInquiry $inquiry, Request $request, InquiryService $service)
    {
        $this->authorize('reject', $inquiry);

        $rejected = $service->rejectInquiry($inquiry, $request, $request->user());

        return $this->success(new PurchaseInquiryResource($rejected), 'Demande refusée');
    }

    public function cancel(PurchaseInquiry $inquiry, Request $request, InquiryService $service)
    {
        $this->authorize('cancel', $inquiry);

        $cancelled = $service->cancelInquiry($inquiry, $request->user());

        return $this->success(new PurchaseInquiryResource($cancelled), 'Demande annulée');
    }

    public function updateDelivery(PurchaseInquiry $inquiry, string $status, Request $request, InquiryService $service)
    {
        $this->authorize('updateDelivery', $inquiry);

        $updated = $service->updateDeliveryStatus($inquiry, $status, $request->user());

        return $this->success(new PurchaseInquiryResource($updated), 'Statut de livraison mis à jour');
    }
}
