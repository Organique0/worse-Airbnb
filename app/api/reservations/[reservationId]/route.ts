import {NextResponse} from 'next/server';
;
import prisma from "@/app/libs/prismadb";
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
    reservationId?:string;
}

export async function DELETE(req:Request, {params}:{params:IParams}) {
    const CurrentUser = await getCurrentUser();

    if(!CurrentUser) {
        return NextResponse.error();
    }

    const {reservationId} = params;

    if(!reservationId || typeof reservationId != 'string') {
        throw new Error('invalid id');
    }

    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
        OR: [
            {userId: CurrentUser.id},
            {listing: {userId: CurrentUser.id}}
        ]
        }
    });

    return NextResponse.json(reservation);
}