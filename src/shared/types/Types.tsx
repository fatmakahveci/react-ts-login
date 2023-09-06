import { ReactNode } from 'react';

export type ButtonProps = {
    type: 'submit' | 'reset' | 'button' | undefined;
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled: boolean;
    className?: string;
};

export type CardProps = {
    cssName: string;
    children: ReactNode;
};

export type EmailProps = {
    type: {
        value: string;
        isValid: boolean | null
    };
    action: {
        type: 'USER_INPUT';
        value: string;
        } | {
        type: 'INPUT_BLUR';
        isValid: boolean | null;
    };
};

export type HomeProps = {
    onLogout: any;
};

export type LoginProps = {
    onLogin: any;
};

export type MainHeaderProps = {
    isAuthenticated: boolean;
    onLogout: any;
};

export type NavigationProps = {
    isLoggedIn: boolean;
    onLogout: any;
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
        isValid: boolean | null;
    };
};