"use client";

import {FormEvent, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { showToast } from "@/components/ui-lib";
import { useUserStore } from "@/store";
import {RegisterResponse, ResponseStatus} from "@/app/api/typing.d";
import {Loading} from "@/components/loading";
import { useEffect } from "react";


import styles from "@/app/login/login.module.scss";
import Locales from "@/locales";


export default function Index() {


    const generateRandomText = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let text = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            text += characters.charAt(randomIndex);
        }

        return text;
    };

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = generateRandomText(10);
    const password = generateRandomText(5);
    const verificationCode = '112233';
    const [invitationCode, setInvitationCode] = useState(
        searchParams.get("code") ?? ""
    );

    const [updateSessionToken, updateEmail] = useUserStore((state) => [
        state.updateSessionToken,
        state.updateEmail,
    ]);

    const handleRegister = async () => {
        const res = (await (
            await fetch("/api/user/register", {
                cache: "no-store",
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                    code: verificationCode,
                    code_type: "email",
                    invitation_code: invitationCode.toLowerCase() ?? "",
                }),
            })
        ).json()) as RegisterResponse;

        switch (res.status) {
            case ResponseStatus.Success: {
                updateSessionToken(res.sessionToken);
                updateEmail(email);
                router.replace("/");
                showToast(Locales.Index.Success(Locales.Index.Register), 3000);
                break;
            }
            case ResponseStatus.alreadyExisted: {
                showToast(Locales.Index.DuplicateRegistration);
                break;
            }
            case ResponseStatus.invalidCode: {
                showToast(Locales.Index.CodeError);
                break;
            }
            default: {
                showToast(Locales.UnknownError);
                break;
            }
        }
    };
    useEffect(() => {
        handleRegister();
    }, []);
    return <Loading/>;
}
