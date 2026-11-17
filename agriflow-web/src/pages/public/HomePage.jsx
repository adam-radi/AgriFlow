import HomeHero from "../../components/home/HomeHero";
import HomeFeaturedProducts from "../../components/home/HomeFeaturedProducts";
import HomeCategories from "../../components/home/HomeCategories";
import HomeAbout from "../../components/home/HomeAbout";
import HomeFarmerSection from "../../components/home/HomeFarmerSection";
import HomeBuyerSection from "../../components/home/HomeBuyerSection";
import HomeContact from "../../components/home/HomeContact";

/**
 * HomePage — AgriFlow Public Home Page (Modernized AgTech UI/UX)
 *
 * Structure validée :
 * 1. Floating Navbar (rendue par PublicLayout)
 * 2. Hero Section (HomeHero)
 * 3. Sélection de produits agricoles disponibles (HomeFeaturedProducts)
 * 4. Catégories agricoles / filières régionales (HomeCategories)
 * 5. Présentation d'AgriFlow — About (HomeAbout)
 * 6. Section dédiée aux agriculteurs et producteurs (HomeFarmerSection)
 * 7. Section dédiée aux acheteurs professionnels (HomeBuyerSection)
 * 8. Contact & Support (HomeContact)
 * 9. Footer moderne (rendu par PublicLayout)
 */
export default function HomePage() {
    return (
        <main id="agriflow-home" className="d-flex flex-column">
            {/* 2. Hero Section */}
            <HomeHero />

            {/* 3. Sélection de produits agricoles disponibles */}
            <HomeFeaturedProducts />

            {/* 4. Catégories agricoles régionales */}
            <HomeCategories />

            {/* 5. Présentation d'AgriFlow — About */}
            <HomeAbout />

            {/* 6. Section dédiée aux agriculteurs et producteurs */}
            <HomeFarmerSection />

            {/* 7. Section dédiée aux acheteurs professionnels */}
            <HomeBuyerSection />

            {/* 8. Contact & Support */}
            <HomeContact />
        </main>
    );
}
