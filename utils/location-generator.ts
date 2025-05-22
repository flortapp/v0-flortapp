// Define city center coordinates and residential areas (approximate)
const cityData: Record<
  string,
  {
    center: { lat: number; lng: number }
    residentialAreas: Array<{
      name: string
      center: { lat: number; lng: number }
      radius: number
    }>
  }
> = {
  Istanbul: {
    center: { lat: 41.0082, lng: 28.9784 },
    residentialAreas: [
      { name: "Kadıköy", center: { lat: 40.9927, lng: 29.0277 }, radius: 0.015 },
      { name: "Beşiktaş", center: { lat: 41.0422, lng: 29.0083 }, radius: 0.012 },
      { name: "Şişli", center: { lat: 41.0602, lng: 28.9877 }, radius: 0.018 },
      { name: "Üsküdar", center: { lat: 41.0233, lng: 29.0151 }, radius: 0.014 },
      { name: "Bakırköy", center: { lat: 40.9819, lng: 28.8772 }, radius: 0.016 },
    ],
  },
  Ankara: {
    center: { lat: 39.9334, lng: 32.8597 },
    residentialAreas: [
      { name: "Çankaya", center: { lat: 39.9027, lng: 32.8632 }, radius: 0.017 },
      { name: "Keçiören", center: { lat: 39.9817, lng: 32.8548 }, radius: 0.015 },
      { name: "Yenimahalle", center: { lat: 39.9654, lng: 32.7831 }, radius: 0.016 },
      { name: "Etimesgut", center: { lat: 39.9583, lng: 32.6809 }, radius: 0.014 },
      { name: "Mamak", center: { lat: 39.9186, lng: 32.9137 }, radius: 0.013 },
    ],
  },
  Izmir: {
    center: { lat: 38.4237, lng: 27.1428 },
    residentialAreas: [
      { name: "Konak", center: { lat: 38.4192, lng: 27.1287 }, radius: 0.014 },
      { name: "Karşıyaka", center: { lat: 38.4673, lng: 27.0903 }, radius: 0.013 },
      { name: "Bornova", center: { lat: 38.4681, lng: 27.2148 }, radius: 0.015 },
      { name: "Buca", center: { lat: 38.3778, lng: 27.1741 }, radius: 0.016 },
      { name: "Bayraklı", center: { lat: 38.4579, lng: 27.1571 }, radius: 0.012 },
    ],
  },
  Bursa: {
    center: { lat: 40.1885, lng: 29.061 },
    residentialAreas: [
      { name: "Nilüfer", center: { lat: 40.2132, lng: 28.9708 }, radius: 0.015 },
      { name: "Osmangazi", center: { lat: 40.1927, lng: 29.0677 }, radius: 0.016 },
      { name: "Yıldırım", center: { lat: 40.1963, lng: 29.1091 }, radius: 0.014 },
    ],
  },
  Antalya: {
    center: { lat: 36.8969, lng: 30.7133 },
    residentialAreas: [
      { name: "Muratpaşa", center: { lat: 36.8851, lng: 30.7042 }, radius: 0.015 },
      { name: "Konyaaltı", center: { lat: 36.8838, lng: 30.6363 }, radius: 0.016 },
      { name: "Kepez", center: { lat: 36.9316, lng: 30.7258 }, radius: 0.014 },
    ],
  },
  // Default data for other cities
  default: {
    center: { lat: 41.0082, lng: 28.9784 }, // Istanbul as default
    residentialAreas: [
      { name: "Merkez", center: { lat: 0, lng: 0 }, radius: 0.015 }, // Will be replaced with city center
    ],
  },
}

// More realistic place types focused on residential and social areas
const placeTypes = [
  // Residential
  "Apartmanı",
  "Sitesi",
  "Rezidans",
  "Konutları",
  // Social
  "Cafe",
  "Restaurant",
  "Bistro",
  "Pastane",
  "Fırın",
  // Services
  "Eczane",
  "Market",
  "Bakkal",
  "Kuaför",
  "Terzi",
  // Recreation
  "Park",
  "Spor Salonu",
  "Yürüyüş Parkuru",
  "Çocuk Parkı",
]

// More realistic place names with Turkish options
const placeNames = [
  // Turkish names
  "Yıldız",
  "Güneş",
  "Ay",
  "Deniz",
  "Mavi",
  "Yeşil",
  "Çınar",
  "Ihlamur",
  "Akasya",
  "Manolya",
  "Lale",
  "Gül",
  "Papatya",
  "Menekşe",
  "Zambak",
  "Orkide",
  "Mimoza",
  "Begonvil",
  // Family names
  "Yılmaz",
  "Kaya",
  "Demir",
  "Şahin",
  "Çelik",
  "Yıldırım",
  "Öztürk",
  "Aydın",
  "Özdemir",
  "Arslan",
  // Descriptive
  "Panorama",
  "Manzara",
  "Bahçe",
  "Köşk",
  "Saray",
  "Konak",
  "Yalı",
  "Tepe",
  "Vadi",
]

export interface Location {
  lat: number
  lng: number
  placeName: string
  city: string
  neighborhood: string
  placeType: string
  googleMapsUrl: string
}

/**
 * Generates a random location within a specified city, focusing on residential areas
 * @param city The name of the city
 * @returns A location object with coordinates, place name, city and neighborhood
 */
export function generateRandomLocation(city: string): Location {
  // Normalize city name to match our keys
  const normalizedCity = Object.keys(cityData).find((key) => key.toLowerCase() === city.toLowerCase()) || "Istanbul"

  // Get city data or use default
  const data = cityData[normalizedCity] || {
    ...cityData.default,
    center: cityData.default.center,
  }

  // If using default data, update the center to the requested city's center
  if (!(normalizedCity in cityData)) {
    // Find the city in the old data structure if available
    const oldCityData: Record<string, { lat: number; lng: number }> = {
      Istanbul: { lat: 41.0082, lng: 28.9784 },
      Ankara: { lat: 39.9334, lng: 32.8597 },
      Izmir: { lat: 38.4237, lng: 27.1428 },
      Bursa: { lat: 40.1885, lng: 29.061 },
      Antalya: { lat: 36.8969, lng: 30.7133 },
      Adana: { lat: 37.0, lng: 35.3213 },
      Konya: { lat: 37.8715, lng: 32.4846 },
      Gaziantep: { lat: 37.0662, lng: 37.3833 },
      Mersin: { lat: 36.8, lng: 34.6333 },
      Kayseri: { lat: 38.7312, lng: 35.4787 },
    }

    if (oldCityData[normalizedCity]) {
      data.center = oldCityData[normalizedCity]
      data.residentialAreas[0].center = oldCityData[normalizedCity]
    }
  }

  // Select a random residential area
  const area = data.residentialAreas[Math.floor(Math.random() * data.residentialAreas.length)]

  // Generate random offset within the residential area's radius
  const angle = Math.random() * 2 * Math.PI
  const distance = Math.random() * area.radius
  const latOffset = distance * Math.cos(angle)
  const lngOffset = distance * Math.sin(angle)

  // Calculate final coordinates
  const lat = area.center.lat + latOffset
  const lng = area.center.lng + lngOffset

  // Generate random place name and type
  const placeType = placeTypes[Math.floor(Math.random() * placeTypes.length)]
  const placeName = placeNames[Math.floor(Math.random() * placeNames.length)]
  const fullPlaceName = `${placeName} ${placeType}`

  // Create Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return {
    lat,
    lng,
    placeName: fullPlaceName,
    city: normalizedCity,
    neighborhood: area.name,
    placeType,
    googleMapsUrl,
  }
}

/**
 * Returns a list of available cities
 */
export function getAvailableCities(): string[] {
  return Object.keys(cityData)
}

/**
 * Checks if coordinates are within a habitable area
 * This is a simple implementation - in a real app, you might use GeoJSON data
 */
export function isHabitableLocation(lat: number, lng: number): boolean {
  // Check if coordinates are within any known residential area
  for (const cityName in cityData) {
    const city = cityData[cityName]
    for (const area of city.residentialAreas) {
      const distance = calculateDistance(lat, lng, area.center.lat, area.center.lng)
      if (distance <= area.radius * 1.2) {
        // 20% buffer
        return true
      }
    }
  }

  // Default to true for cities we don't have detailed data for
  return true
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
