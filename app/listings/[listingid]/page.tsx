import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import ListingClient2 from "./ListingClient2";
import getReservations from "@/app/actions/getReservations";

interface IParams {
    listingid?: string;
}
export const dynamic = "force-dynamic";
const ListingPage = async ({ params }: { params: IParams }) => {
    const listing = await getListingById(params);
    const currentUser = await getCurrentUser();
    const reservations = await getReservations(params);

    if (!listing) {
        return (<EmptyState />)
    }

    return (
        <div>
            <ListingClient2 listing={listing} currentUser={currentUser} reservations={reservations} />
        </div>
    );
}

export default ListingPage;
