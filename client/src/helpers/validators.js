import i18next from 'i18next';
import {
    MAX_PORT,
    R_CIDR,
    R_CIDR_IPV6,
    R_HOST,
    R_IPV4,
    R_IPV6,
    R_MAC,
    R_URL_REQUIRES_PROTOCOL,
    STANDARD_WEB_PORT,
    UNSAFE_PORTS,
    R_CLIENT_ID,
    R_DOMAIN,
} from './constants';
import { ip4ToInt, isValidAbsolutePath } from './form';
import { isIpInCidr } from './helpers';

// Validation functions
// https://redux-form.com/8.3.0/examples/fieldlevelvalidation/
// If the value is valid, the validation function should return undefined.
/**
 * @param value {string|number}
 * @returns {undefined|string}
 */
export const validateRequiredValue = (value) => {
    const formattedValue = typeof value === 'string' ? value.trim() : value;
    if (formattedValue || formattedValue === 0 || (formattedValue && formattedValue.length !== 0)) {
        return undefined;
    }
    return 'form_error_required';
};

/**
 * @returns {undefined|string}
 * @param _
 * @param allValues
 */
export const validateIpv4RangeEnd = (_, allValues) => {
    if (!allValues || !allValues.v4 || !allValues.v4.range_end || !allValues.v4.range_start) {
        return undefined;
    }

    const { range_end, range_start } = allValues.v4;

    if (ip4ToInt(range_end) <= ip4ToInt(range_start)) {
        return 'range_end_error';
    }

    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateIpv4 = (value) => {
    if (value && !R_IPV4.test(value)) {
        return 'form_error_ip4_format';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateClientId = (value) => {
    if (!value) {
        return undefined;
    }
    const formattedValue = value.trim();
    if (formattedValue && !(
        R_IPV4.test(formattedValue)
            || R_IPV6.test(formattedValue)
            || R_MAC.test(formattedValue)
            || R_CIDR.test(formattedValue)
            || R_CIDR_IPV6.test(formattedValue)
            || R_CLIENT_ID.test(formattedValue)
    )) {
        return 'form_error_client_id_format';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateConfigClientId = (value) => {
    if (!value) {
        return undefined;
    }
    const formattedValue = value.trim();
    if (formattedValue && !R_CLIENT_ID.test(formattedValue)) {
        return 'form_error_client_id_format';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateServerName = (value) => {
    if (!value) {
        return undefined;
    }
    const formattedValue = value ? value.trim() : value;
    if (formattedValue && !R_DOMAIN.test(formattedValue)) {
        return 'form_error_server_name';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateIpv6 = (value) => {
    if (value && !R_IPV6.test(value)) {
        return 'form_error_ip6_format';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateIp = (value) => {
    if (value && !R_IPV4.test(value) && !R_IPV6.test(value)) {
        return 'form_error_ip_format';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateMac = (value) => {
    if (value && !R_MAC.test(value)) {
        return 'form_error_mac_format';
    }
    return undefined;
};

/**
 * @param value {number}
 * @returns {boolean|*}
 */
export const validateBiggerOrEqualZeroValue = (value) => {
    if (value < 0) {
        return 'form_error_negative';
    }
    return false;
};

/**
 * @param value {number}
 * @returns {undefined|string}
 */
export const validatePort = (value) => {
    if ((value || value === 0) && (value < STANDARD_WEB_PORT || value > MAX_PORT)) {
        return 'form_error_port_range';
    }
    return undefined;
};

/**
 * @param value {number}
 * @returns {undefined|string}
 */
export const validateInstallPort = (value) => {
    if (value < 1 || value > MAX_PORT) {
        return 'form_error_port';
    }
    return undefined;
};

/**
 * @param value {number}
 * @returns {undefined|string}
 */
export const validatePortTLS = (value) => {
    if (value === 0) {
        return undefined;
    }
    if (value && (value < STANDARD_WEB_PORT || value > MAX_PORT)) {
        return 'form_error_port_range';
    }
    return undefined;
};

/**
 * @param value {number}
 * @returns {undefined|string}
 */
export const validatePortQuic = validatePortTLS;

/**
 * @param value {number}
 * @returns {undefined|string}
 */
export const validateIsSafePort = (value) => {
    if (UNSAFE_PORTS.includes(value)) {
        return 'form_error_port_unsafe';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateDomain = (value) => {
    if (value && !R_HOST.test(value)) {
        return 'form_error_domain_format';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validateAnswer = (value) => {
    if (value && (!R_IPV4.test(value) && !R_IPV6.test(value) && !R_HOST.test(value))) {
        return 'form_error_answer_format';
    }
    return undefined;
};

/**
 * @param value {string}
 * @returns {undefined|string}
 */
export const validatePath = (value) => {
    if (value && !isValidAbsolutePath(value) && !R_URL_REQUIRES_PROTOCOL.test(value)) {
        return 'form_error_url_or_path_format';
    }
    return undefined;
};

/**
 * @param cidr {string}
 * @returns {Function}
 */

export const validateIpv4InCidr = (valueIp, allValues) => {
    if (!isIpInCidr(valueIp, allValues.cidr)) {
        return i18next.t('form_error_subnet', { ip: valueIp, cidr: allValues.cidr });
    }
    return undefined;
};
