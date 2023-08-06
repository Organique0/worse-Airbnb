"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";
import LoginModal from "./LoginModal";
import useLoginModal from "@/app/hooks/useLoginModal";

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: { name: '', email: '', password: '' }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setLoading(true);
        axios.post('/api/register', data)
            .then(() => {
                toast.success("success");
                loginModal.onOpen();
                registerModal.onClose();
            })
            .catch((error) => { toast.error("Something went wrong") })
            .finally(() => setLoading(false));
    }

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen()
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome" subtitle="Create an account!" center />
            <Input id="email" label="Email" disabled={loading} register={register} errors={errors} required />
            <Input id="name" label="Name" disabled={loading} register={register} errors={errors} required />
            <Input id="password" type="password" label="Password" disabled={loading} register={register} errors={errors} required />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4">
            <hr />
            <Button outline label="continue with Google" icon={FcGoogle} onClick={() => signIn('google')} />
            <div className="text-neutral-500 text-center font-light">
                <div className="flex flex-row items-center gap-2 justify-center">
                    <div>
                        Already have an account?
                    </div>
                    <div className="text-neutral-800 cursor-pointer hover:underline" onClick={toggle}>
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={loading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default RegisterModal;