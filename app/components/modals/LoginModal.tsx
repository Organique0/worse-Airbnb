"use client";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";

const LoginModal = () => {
    const registerModal = useRegisterModal();
    const router = useRouter();
    const loginModal = useLoginModal();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: { email: '', password: '' }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setLoading(true);
        signIn('credentials', { ...data, redirect: false, })
            .then((callback) => {
                setLoading(false);
                if (!callback?.error) {
                    toast.success('Logged in');
                    router.refresh();
                    loginModal.onClose();
                }
                else {
                    toast.error(callback.error);
                }
            }
            )
    }

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen()
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back" subtitle="Login to your account" center />
            <Input id="email" label="Email" disabled={loading} register={register} errors={errors} required />
            <Input id="password" type="password" label="Password" disabled={loading} register={register} errors={errors} required />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4">
            <hr />
            <Button outline label="continue with Google" icon={FcGoogle} onClick={() => signIn('google')} />
            <Button outline label="continue with Github" icon={AiFillGithub} onClick={() => signIn('github')} />
            <div className="text-neutral-500 text-center font-light">
                <div className="flex flex-row items-center gap-2 justify-center">
                    <div>
                        Dont have an account yet?
                    </div>
                    <div className="text-neutral-800 cursor-pointer hover:underline" onClick={toggle}>
                        Sign up
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={loading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModal;