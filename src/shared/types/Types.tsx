'use client';

import { ChangeEvent, MutableRefObject, ReactNode } from 'react';

export type ButtonProps = {
    type: 'submit' | 'reset' | 'button' | undefined;
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
};

export type CardProps = {
    cssName: string;
    children: ReactNode;
};

export type EmailProps = {
    type: {
        value: string;
        isValid: boolean | null;
    };
    action: {
        type: 'USER_INPUT';
        value: string;
        } | {
        type: 'INPUT_BLUR';
    };
};

export type InputProps = {
    id: string;
    isValid: boolean | null;
    label: string;
    onBlur: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    ref: any;
    type: string;
    value: string;
};

export type LoginProps = {
    onLogin: (email: string, password: string) => void;
};

export type LogoutProps = {
    onLogout: () => void;
};

export type PasswordProps = {
    type: {
        value: string;
        isValid: boolean | null;
    };
    action: {
        type: 'USER_INPUT';
        value: string;
        } | {
        type: 'INPUT_BLUR';
    };
};