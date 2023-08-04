import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingParams } from "./actions/getListings";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";

interface HomeProps {
  searchParams: IListingParams
}

const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (listings.length == 0) {
    return (
      <EmptyState showReset />
    )
  }

  return (
    <Container>
      <div className="pt-25 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        <div>
          {listings.map((lst) => {
            return (
              <ListingCard key={lst.id} data={lst} currentUser={currentUser} />
            )
          })}
        </div>
      </div>
    </Container>
  )
}
