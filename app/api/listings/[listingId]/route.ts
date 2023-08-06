import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingid?:string;
}

export async function DELETE(req:Request, {params}:{params:IParams}) {
    const currentUser = await getCurrentUser();

    if(!currentUser) return NextResponse.error();

    const {listingid} = params;

    if(!listingid || typeof listingid != 'string'){
        throw new Error("invalid id")
    }

    const listing = await prisma.listing.deleteMany({
        where: {
            id:listingid,
            userId:currentUser.id
        }
    });

    return NextResponse.json(listing);
}