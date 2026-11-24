# 🗺️ AgriFlow Frontend — Architecture & Map (agriflow-web)

## 2. 📂 Arborescence du frontend

```
agriflow-web/
├── src/
│   ├── App.jsx                  # Composant racine
│   ├── main.jsx                 # Point d'entrée Vite
│   ├── assets/
│   │   └── app.css              # Styles globaux
│   ├── api/                     # Couche API (endpoints + clients axios)
│   │   ├── axiosClient.js       # Instance Axios configurée (token, intercepteurs)
│   │   ├── endpoints.js         # Carte des endpoints publics / farmer / client
│   │   ├── adminEndpoints.js    # Carte des endpoints admin
│   │   └── mockData.js          # Données mock (produits, récoltes, commandes)
│   ├── app/
│   │   ├── providers/
│   │   │   └── AppProvider.jsx  # Providers (Redux, Router, etc.)
│   │   ├── router/
│   │   │   └── AppRouter.jsx    # Configuration du routage
│   │   └── store/
│   │       ├── index.js         # Création du store Redux
│   │       ├── rootReducer.js   # Combine des reducers (carte d'état)
│   │       └── slices/
│   │           ├── admin/
│   │           │   ├── adminSlice.js
│   │           │   ├── adminApi.js
│   │           │   └── adminSelectors.js
│   │           ├── authSlice.js
│   │           ├── productSlice.js
│   │           ├── harvestSlice.js
│   │           ├── orderSlice.js
│   │           ├── cartSlice.js
│   │           └── deliverySlice.js
│   ├── components/              # Composants réutilisables par domaine
│   │   ├── admin/, common/, delivery/, farmer/, harvests/,
│   │   ├── home/, landing/, layout/, orders/, products/,
│   │   ├── profile/, verification/
│   ├── features/                # Logique métier par feature (API + slices + selectors)
│   │   ├── auth/, delivery/, harvests/, orders/, products/,
│   │   ├── profile/, verification/
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useAxios.js
│   ├── layouts/                 # Layouts par rôle
│   │   ├── AdminLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── ClientLayout.jsx
│   │   ├── FarmerLayout.jsx
│   │   └── PublicLayout.jsx
│   ├── pages/                   # Pages par rôle
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── RegisterClient.jsx
│   │   ├── RegisterFarmerPage.jsx
│   │   └── UnauthorizedPage.jsx
│   │   ├── admin/…  client/…  delivery/…  farmer/…  public/…
│   └── routes/
│       └── routeConfig.js       # Carte des routes (public / auth / farmer / admin / client / livreur)
```

## 3. 👥 Rôles & espaces d'accès

| Rôle | Layout | Pages principales | Accès |
| :--- | :--- | :--- | :--- |
| `Admin` | `AdminLayout` | Dashboard, Users, Farmers, Products, Orders, Harvests | `role:Admin` |
| `Farmer` | `FarmerLayout` | Dashboard, Products, Harvests | `role:Farmer` |
| `Client` | `ClientLayout` | Catalogue, Panier, Checkout, Commandes | `role:Client` |
| `Livreur` | `DeliveryLayout` | Dashboard, Groupes de livraison | `role:Livreur` |
| Public | `PublicLayout` | Home, Produits, Détails produit, Login, Register | sans authentification |

Voir `src/routes/routeConfig.js` pour la carte complète des routes et des rôles associés.

## 4. 🔄 Flux de données (requête API)

```
Component (React Hook Form / UI)
        │
        ▼
Feature API (src/features/*/*Api.js)  ──►  axiosClient (src/api/axiosClient.js)
        │                                      │
        ▼                                      ▼
Endpoints map (src/api/endpoints.js)     Intercepteur token Sanctum
        │                                      │
        ▼                                      ▼
Redux Thunk (createAsyncThunk) ◄────────── Réponse JSON API (Laravel)
        │
        ▼
Slice (src/features/*/*Slice.js)  ──►  rootReducer (src/app/store/rootReducer.js)
        │
        ▼
Composant (via useSelector / useDispatch)
```

## 5. 🗺️ Cartes existantes (maps)

### 5.1 Endpoints — `src/api/endpoints.js`
Objet `ENDPOINTS` groupé par domaine : `AUTH`, `PRODUCTS`, `HARVESTS`, `ORDERS`, `CART`, `DELIVERY`, `ADMIN`, `PAYMENTS`, `PROFILE`, `ACCOUNT`, `VERIFICATION`. Certaines entrées sont des fonctions `(id) => \`/path/${id}\``.

### 5.2 Endpoints Admin — `src/api/admin/adminEndpoints.js`
Objet `ADMIN_ENDPOINTS` : `users`, `farmers`, `products`, `orders`, `harvests`, `stats`, `validateFarmer`, `rejectFarmer`, `suspendUser`, `disableProduct`, `enableProduct`, `updateProduct`, `deleteProduct`, `updateOrderStatus`, `createDeliveryUser`.

### 5.3 Routes — `src/routes/routeConfig.js`
Tableaux exportés : `publicRoutes`, `authRoutes` (default), `farmerRoutes` (inclut `/farmer/profile` et `/farmer/verification`), `adminRoutes` (inclut `/admin/verifications`), `adminDeliveryRoutes`, `clientOrderRoutes` (inclut `/client/profile` et `/client/verification`), `deliveryLivreurRoutes`. Chaque entrée : `{ path, role, element? }`.

### 5.4 Données mock — `src/api/mockData.js`
`mockProducts`, `mockHarvests`, `mockOrders` (fallback / tests UI).

### 5.5 État global — `src/app/store/rootReducer.js`
```js
combineReducers({
    auth, products, harvests, orders, cart, delivery, admin, profile, verification
})
```

## 6. 🧩 Convention pour ajouter une nouvelle feature

1. Ajouter l'endpoint dans `src/api/endpoints.js` (ou `src/api/admin/adminEndpoints.js`).
2. Créer la fonction API dans `src/features/<domain>/<domain>Api.js` (appel `axiosClient`).
3. Créer le `createAsyncThunk` + `createSlice` dans `src/features/<domain>/<domain>Slice.js`.
4. Enregistrer le reducer dans `src/app/store/rootReducer.js`.
5. Ajouter la route dans `src/routes/routeConfig.js` (avec le rôle approprié).
6. Créer la page dans `src/pages/<role>/` et le composant dans `src/components/<domain>/`.
7. Exporter les sélecteurs si nécessaire (`*Selectors.js`).


> Ce document résume l'architecture globale du **frontend AgriFlow (React 19 / Vite)** : les dossiers, les cartes (endpoints, routes, state), le flux de données et les emplacements vides réservés pour le nouveau code.

---

## 1. 🧱 Stack technique

| Outil | Version | Rôle |
| :--- | :--- | :--- |
| React | `^19.2.6` | Bibliothèque d'interface |
| Vite | `^8.0.12` | Build tool & dev server |
| Redux Toolkit | `^2.12.0` | Gestion d'état globale |
| React Redux | `^9.3.0` | Liaison React ↔ Redux |
| React Router DOM | `^7.17.0` | Routage côté client |
| Axios | `^1.17.0` | Client HTTP |
| React Hook Form | `^7.78.0` | Formulaires |
| Yup | `^1.7.1` | Validation de schémas |
| Bootstrap | `^5.3.8` | CSS / composants UI |
| React Bootstrap | `^2.10.9` | Composants Bootstrap pour React |
| Vitest | `^3.0.0` | Tests unitaires |
| ESLint | `^10.3.0` | Linting |

Commandes utiles :
```bash
cd agriflow-web
npm run dev      # serveur de développement
npm run build    # build de production
npm run lint     # vérification ESLint
npm run test     # tests Vitest
```


## 7. 🕳️ Espace vide — Nouveau code (à remplir)

> Cette section est volontairement vide. Elle sert d'emplacement réservé ("l9ima") pour écrire le nouveau code du frontend. Copie-colle les modèles ci-dessous et remplace les `TODO`.

### 7.1 Nouveau endpoint (exemple)
```js
// src/api/endpoints.js  —  ajouter dans l'objet ENDPOINTS
// TODO: remplacer par la vraie route API
    NOUVEAU_DOMAINE: "/nouveau-domaine",
    NOUVEAU_DOMAINE_DETAILS: (id) => `/nouveau-domaine/${id}`,
    NOUVEAU_DOMAINE_CREATE: "/nouveau-domaine",
```

### 7.2 Nouvelle fonction API (exemple)
```js
// src/features/<domain>/<domain>Api.js
import axiosClient from "../../../api/axiosClient";
import ENDPOINTS from "../../../api/endpoints";

export const nouveauApi = {
    // TODO: implémenter l'appel axios
    getAll: (params = {}) => axiosClient.get(ENDPOINTS.NOUVEAU_DOMAINE, { params }),
    getById: (id) => axiosClient.get(ENDPOINTS.NOUVEAU_DOMAINE_DETAILS(id)),
    create: (data) => axiosClient.post(ENDPOINTS.NOUVEAU_DOMAINE_CREATE, data),
};
```

### 7.3 Nouveau slice / thunk (exemple)
```js
// src/features/<domain>/<domain>Slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { nouveauApi } from "./<domain>Api";

export const fetchNouveaux = createAsyncThunk(
    "nouveau/fetchAll",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await nouveauApi.getAll(params);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Échec du chargement");
        }
    }
);

const nouveauSlice = createSlice({
    name: "nouveau",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        // TODO: ajouter les reducers synchrones ici
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNouveaux.pending, (state) => { state.loading = true; })
            .addCase(fetchNouveaux.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchNouveaux.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default nouveauSlice.reducer;
```

### 7.4 Nouvelle route (exemple)
```js
// src/routes/routeConfig.js
export const nouveauRoutes = [
    // TODO: ajouter la route avec le rôle correspondant
    { path: "/nouveau/page", role: "Admin", element: NouveauPage },
];
```

### 7.5 Nouvelle page / composant (exemple)
```jsx
// src/pages/<role>/NouveauPage.jsx
import React from "react";

export default function NouveauPage() {
    // TODO: implémenter la page
    return (
        <div className="container py-4">
            <h1>Nouvelle page — en cours de développement</h1>
        </div>
    );
}
```

### 7.6 Enregistrement du reducer (exemple)
```js
// src/app/store/rootReducer.js
import nouveauReducer from "../../features/<domain>/<domain>Slice";

const rootReducer = combineReducers({
    // ... réducteurs existants
    nouveau: nouveauReducer,   // TODO: ajouter ici
});
```

## 8. ✅ Checklist avant de committer du nouveau code

- [ ] Endpoint ajouté dans la carte correspondante (`endpoints.js` ou `adminEndpoints.js`)
- [ ] Fonction API créée dans `src/features/<domain>/`
- [ ] Slice + thunk créés et reducer enregistré dans `rootReducer.js`
- [ ] Route ajoutée dans `src/routes/routeConfig.js` avec le bon `role`
- [ ] Page et composants créés sous `src/pages/` et `src/components/`
- [ ] `npm run lint` passe sans erreur
- [ ] `npm run build` réussit

---

> 🔗 Document lié : `docs/ARCHITECTURE_MAP.md` (carte du backend Laravel).
