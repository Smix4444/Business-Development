export const VALID_PROMO_CODE = 'WELCOME20'
export const PROMO_DISCOUNT = 0.10

export function validatePromoCode(code: string): boolean {
  return code.trim().toUpperCase() === VALID_PROMO_CODE
}
