<?php

namespace App\Enums;

class InquiryStatus
{
    const Pending     = 'pending';      // Demande soumise, en attente du producteur
    const Negotiating = 'negotiating';  // Contre-offre en cours d'examen
    const Accepted    = 'accepted';     // Conditions de prix et volume acceptées
    const Confirmed   = 'confirmed';    // Transaction confirmée définitivement
    const Rejected    = 'rejected';     // Demande refusée par l'une des parties
    const Cancelled   = 'cancelled';    // Annulée par l'acheteur
    const InDelivery  = 'in_delivery';  // Lot en cours d'acheminement logistique
    const Delivered   = 'delivered';    // Lot réceptionné et conforme
}
