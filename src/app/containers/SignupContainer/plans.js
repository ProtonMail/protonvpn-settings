import React from 'react';
import { c } from 'ttag';
import { PLANS, PLAN_TYPES, CYCLE } from 'proton-shared/lib/constants';
import { Info } from 'react-components';

export const PLAN = {
    FREE: 'free',
    VISIONARY: PLANS.VISIONARY,
    BASIC: PLANS.VPNBASIC,
    PLUS: PLANS.VPNPLUS
};

export const PLAN_NAMES = {
    [PLAN.FREE]: 'Free',
    [PLAN.VISIONARY]: 'Visionary',
    [PLAN.BASIC]: 'Basic',
    [PLAN.PLUS]: 'Plus'
};

export const VPN_PLANS = [PLAN.FREE, PLAN.BASIC, PLAN.PLUS, PLAN.VISIONARY];

const getPlanFeatures = (plan) =>
    ({
        [PLAN.FREE]: {
            description: c('Plan Description').t`Privacy and security for everyone`,
            features: [
                c('Plan Feature').t`1 simultaneous VPN connection`,
                c('Plan Feature').t`Servers in 3 countries`,
                c('Plan Feature').t`No logs policy`,
                c('Plan Feature').t`No data limit`,
                c('Plan Feature').t`No ads`
            ]
        },
        [PLAN.BASIC]: {
            description: c('Plan Description').t`Basic privacy features`,
            additionalFeatures: c('Plan feature').t`All ${PLAN_NAMES[PLAN.FREE]} plan features`,
            features: [
                c('Plan Feature').t`2 simultaneous VPN connections`,
                c('Plan Feature').t`Servers in 32 countries`,
                c('Plan Feature').t`High speeds - up to 1 Gb/s`,
                <>
                    <span className="mr0-5">{c('Plan Feature').t`P2P support`}</span>
                    <Info title={c('Tooltip').t`Support for file sharing protocols such as Bittorrent.`} />
                </>
            ]
        },
        [PLAN.PLUS]: {
            isBest: true,
            description: c('Plan Description').t`Advanced security features`,
            additionalFeatures: c('Plan feature').t`All ${PLAN_NAMES[PLAN.BASIC]} plan features`,
            features: [
                c('Plan Feature').t`5 simultaneous VPN connections`,
                c('Plan Feature').t`Secure Core`,
                c('Plan Feature').t`Highest speeds`,
                <>
                    <span className="mr0-5">{c('Plan Feature').t`Access blocked content`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Access content (Netflix, Amazon Prime, Wikipedia, Facebook, Youtube, etc) no matter where you are.`}
                    />
                </>
            ]
        },
        [PLAN.VISIONARY]: {
            description: c('Plan Description').t`The complete privacy suite`,
            additionalFeatures: c('Plan feature').t`All ${PLAN_NAMES[PLAN.PLUS]} plan features`,
            features: [
                c('Plan Feature').t`10 simutaneous plan features`,
                c('Plan Feature').t`ProtonMail Visionary account`
            ]
        }
    }[plan]);

// To use coupon, AmountDue from coupon must be merged into plan.
const getPlanPrice = (plan, cycle) => {
    const monthly = plan.Pricing[CYCLE.MONTHLY];
    const cyclePrice = plan.Pricing[cycle];
    const adjustedTotal = plan.AmountDue;

    const total = typeof adjustedTotal !== 'undefined' ? plan.AmountDue : cyclePrice;
    const saved = monthly * cycle - cyclePrice;
    const totalMonthly = total / cycle;

    return { monthly, total, totalMonthly, saved };
};

export const getPlan = (planName, cycle, plans = []) => {
    const plan = plans.find(({ Type, Name }) => Type === PLAN_TYPES.PLAN && Name === planName);
    const price = plan ? getPlanPrice(plan, cycle) : { monthly: 0, total: 0, totalMonthly: 0, saved: 0 };

    return {
        ...getPlanFeatures(planName),
        planName,
        title: PLAN_NAMES[planName],
        id: plan && plan.ID,
        disabled: !plan && planName !== PLAN.FREE,
        price,
        couponDiscount: plan && Math.abs(plan.CouponDiscount),
        couponDescription: plan && plan.CouponDescription
    };
};
