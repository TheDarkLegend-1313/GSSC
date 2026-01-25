import Cookies from 'js-cookie'

const SOLAR_CALC_COOKIE = 'solar_calc_data'
const COOKIE_EXPIRY_DAYS = 1

export const cookieService = {
  setSolarCalcData: (data) => {
    // Remove old cookie if exists
    Cookies.remove(SOLAR_CALC_COOKIE)
    // Set new cookie with 1 day expiry
    Cookies.set(SOLAR_CALC_COOKIE, JSON.stringify(data), {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'strict',
    })
  },

  getSolarCalcData: () => {
    try {
      const data = Cookies.get(SOLAR_CALC_COOKIE)
      if (!data) {
        return null
      }
      return JSON.parse(data)
    } catch (error) {
      console.error('Error parsing cookie data:', error)
      // Clear invalid cookie
      Cookies.remove(SOLAR_CALC_COOKIE)
      return null
    }
  },

  clearSolarCalcData: () => {
    Cookies.remove(SOLAR_CALC_COOKIE)
  },
}
