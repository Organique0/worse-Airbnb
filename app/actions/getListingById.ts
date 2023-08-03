import prisma from "@/app/libs/prismadb";

interface IParams {
    listingid?:string;
}

export default async function getListingById(params:IParams) {
    try {
        const {listingid} = params;

        const listing = await prisma.listing.findUnique({
            where: {
                id:listingid
            },
            include: {
                user:true
            }
        });

        if(!listing) return null;

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.createdAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toISOString() || null,
            }
        }
    } catch (error:any) {
        throw new Error(error);
    }
}