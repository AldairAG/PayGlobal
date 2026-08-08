import i18n from '../i18n';
import type { TFunction } from 'i18next';

const usuarioServiceErrorPatterns: Array<{
    pattern: RegExp;
    translationKey: string;
    interpolate?: boolean;
}> = [
    { pattern: /^El nombre de usuario ya está en uso$/, translationKey: 'errors.username_in_use' },
    { pattern: /^El email ya está registrado$/, translationKey: 'errors.email_already_registered' },
    { pattern: /^Usuario no encontrado con id:/, translationKey: 'errors.user_not_found_by_id' },
    { pattern: /^Usuario destinatario no encontrado con username:/, translationKey: 'errors.user_not_found_by_username' },
    { pattern: /^Usuario no encontrado(?: con .*?)?$|^Usuario no encontrado:/, translationKey: 'errors.user_not_found' },
    { pattern: /^Usuario no encontrado con username o email:/, translationKey: 'errors.user_not_found' },
    { pattern: /^Wallet Address no encontrado con id:/, translationKey: 'errors.wallet_address_not_found' },
    { pattern: /^Wallet de .+ no encontrada(?: para el usuario con id: .+)?$/, translationKey: 'errors.wallet_not_found' },
    { pattern: /^Wallet no encontrada para el usuario con id:/, translationKey: 'errors.wallet_not_found' },
    { pattern: /^Fondos insuficientes en la wallet de (.+)$/, translationKey: 'errors.insufficient_funds_in_wallet', interpolate: true },
    { pattern: /^El usuario ya tiene una solicitud de retiro pendiente(?:\.|$)/, translationKey: 'errors.withdrawal_request_pending' },
    { pattern: /^El usuario no tiene una licencia activa para realizar retiros(?:\.|$)/, translationKey: 'errors.license_required_for_withdrawal' },
    { pattern: /^La solicitud no es de tipo retiro de fondos$/, translationKey: 'errors.request_not_withdrawal_type' },
    { pattern: /^Debe proporcionar al menos un tipo de solicitud$/, translationKey: 'errors.request_type_required' },
    { pattern: /^El ID de usuario es requerido$/, translationKey: 'errors.user_id_required' },
    { pattern: /^El usuario no ha establecido una clave de seguridad$/, translationKey: 'errors.security_key_not_set' },
    { pattern: /^Ocurrió un error durante la autenticación:/, translationKey: 'errors.authentication_error' },
    { pattern: /^Error al procesar bono de renovación:/, translationKey: 'errors.renewal_bonus_processing_error' },
    { pattern: /^Para renovar la licencia, debe adquirir un paquete igual o superior al actual/, translationKey: 'errors.license_renewal_higher_package_required' },
    { pattern: /^Fondos insuficientes para la transferencia$/, translationKey: 'errors.insufficient_funds_for_transfer' },
    { pattern: /^Solicitud no encontrada con id:/, translationKey: 'errors.request_not_found' },
    { pattern: /^Fondos insuficientes para el retiro$/, translationKey: 'errors.insufficient_funds_for_withdrawal' },
];

const extractErrorText = (error: unknown): string | null => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;

    const anyError = error as Record<string, unknown>;
    if (typeof anyError.message === 'string') return anyError.message;

    const response = anyError.response as Record<string, unknown> | undefined;
    if (response && typeof response.data === 'object' && response.data !== null) {
        const data = response.data as Record<string, unknown>;
        if (typeof data.message === 'string') return data.message;
        if (typeof data.error === 'string') return data.error;
    }
    if (typeof anyError.error === 'string') return anyError.error;

    return null;
};

const translateUsuarioServiceMessage = (message: string, t: TFunction): string => {
    for (const entry of usuarioServiceErrorPatterns) {
        const match = message.match(entry.pattern);
        if (!match) continue;
        if (entry.interpolate && match[1]) {
            return t(entry.translationKey, { wallet: match[1] });
        }
        return t(entry.translationKey);
    }

    return message;
};

export const translateUsuarioServiceError = (error: unknown, t: TFunction = i18n.t.bind(i18n)): string => {
    const message = extractErrorText(error);
    if (!message) {
        return t('errors.unknown_error');
    }

    return translateUsuarioServiceMessage(message, t);
};
