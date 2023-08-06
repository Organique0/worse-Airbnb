import prisma from "@/app/libs/prismadb";

interface IParams {
    listingid?:string;
    userId?:string;
    authorId?:string;
}

export default async function getReservations(params:IParams) {
    try{

    const {listingid, userId, authorId} = params;

    const query:any = {};

    if(listingid) {
        query.listingId = listingid;
    }

    if(userId) {
        query.userId = userId;
    }

    if(authorId) {
        query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
        where:query,
        include: {
            listing:true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const safeReservations = reservations.map((res) => ({
        ...res,
        createdAt: res.createdAt.toISOString(),
        startDate: res.startDate.toISOString(),
        endDate: res.endDate.toISOString(),
        listing: {
            ...res.listing,
            createdAt:res.listing.createdAt.toISOString(),
        }
    }));

    return safeReservations;

    } catch(error:any){
        throw new Error(error);
    }
}