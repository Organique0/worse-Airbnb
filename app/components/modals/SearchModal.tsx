"use client";
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const searchModal = useSearchModal();
    const router = useRouter();
    const params = useSearchParams();

    const [location, setLocation] = useState<CountrySelectValue>();
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [bathroomCount, setbathroomCount] = useState(1);
    const [roomCount, setroomCount] = useState(1);
    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const Map = useMemo(() => dynamic(() => import('../Map'), { ssr: false }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location]);

    const onBack = useCallback(() => {
        setStep((v) => v - 1);
    }, [])

    const onNext = useCallback(() => {
        setStep((v) => v + 1);
    }, [])

    const onSubmit = useCallback(async () => {
        if (step != STEPS.INFO) {
            return onNext()
        }
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate)
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate)
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery,
        }, { skipNull: true });

        setStep(STEPS.LOCATION);
        searchModal.onClose();
        router.push(url);
    }, [step, searchModal, location, router, guestCount, roomCount, bathroomCount, dateRange, onNext, params]);

    const actionLabel = useMemo(() => {
        if (step == STEPS.INFO) {
            return "Search";
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step == STEPS.LOCATION) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Where do you want to go?" subtitle="Find your perfect location!" />
            <CountrySelect value={location} onChange={(value) => {
                setLocation(value as CountrySelectValue)
            }} />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )

    if (step == STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="When do you plan to go?" />
                <Calendar value={dateRange} onChange={(value) => setdateRange(value.selection)} />
            </div>
        )
    }

    if (step == STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="More information" />
                <Counter title="Guest" subtitle="How many guest are coming?" value={guestCount} onChange={(value) => setGuestCount(value)} />
                <Counter title="Rooms" subtitle="How many rooms do you need?" value={roomCount} onChange={(value) => setroomCount(value)} />
                <Counter title="Bathrooms" subtitle="How many bathrooms do you need?" value={bathroomCount} onChange={(value) => setbathroomCount(value)} />
            </div>
        )
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secodaryAction={step == STEPS.LOCATION ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            body={bodyContent}
        />
    );
}

export default SearchModal;