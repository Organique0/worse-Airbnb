import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings"
import EmptyState from "../components/EmptyState"
import FavoritesClient from "./FavoritesClient";



const ListingPage = async () => {
    const favorites = await getFavoriteListings();
    const currentUser = await getCurrentUser();
    if (favorites.length == 0) {
        return (
            <EmptyState title="No favorites found" subtitle="Looks like you have no favorite listings" />
        )
    }

    return (
        <FavoritesClient listings={favorites} currentUser={currentUser} />
    )

}

export default ListingPage;