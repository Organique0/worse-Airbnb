"use client";
import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeReservation, SafeUser } from "../types";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";


interface TripsClientProps {
    reservations: SafeReservation[];
    currentUser: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({ currentUser, reservations }) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/reservations/${id}`)
            .then(() => toast.success("Reservation canceled"))
            .catch(error => toast.error("An error accured"))
            .finally(() => setDeletingId(''))
    }, [])
    return (
        <Container>
            <Heading title="Trips" subtitle="Where you have been and where you are going" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-9">
                {reservations.map((r) => (
                    <ListingCard
                        key={r.id}
                        data={r.listing}
                        reservation={r}
                        actionId={r.id}
                        onAction={onCancel}
                        disabled={deletingId == r.id}
                        actionLabel="Cancel reservation"
                        currentUser={currentUser} />
                ))}
            </div>
        </Container>
    );
}

export default TripsClient;