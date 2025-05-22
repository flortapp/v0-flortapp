// Utility function to generate random addresses within a specified city

interface AddressOptions {
  city: string
  country?: string
}

export function generateRandomAddress(options: AddressOptions): string {
  const { city, country = "Türkiye" } = options

  // Common Turkish street names
  const streets = [
    "Atatürk",
    "Cumhuriyet",
    "İstiklal",
    "Bağdat",
    "Vatan",
    "Millet",
    "Gül",
    "Lale",
    "Zambak",
    "Menekşe",
    "Papatya",
    "Orkide",
    "Deniz",
    "Sahil",
    "Manzara",
    "Yıldız",
    "Güneş",
    "Ay",
  ]

  // Common street types
  const streetTypes = ["Caddesi", "Sokak", "Bulvarı", "Yolu"]

  // Generate random components
  const streetName = streets[Math.floor(Math.random() * streets.length)]
  const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)]
  const buildingNumber = Math.floor(Math.random() * 150) + 1
  const apartmentName = generateRandomApartmentName()
  const floor = Math.floor(Math.random() * 10) + 1
  const doorNumber = Math.floor(Math.random() * 20) + 1

  // Generate random postal code (5 digits for Turkey)
  const postalCode = Math.floor(10000 + Math.random() * 90000)

  // Format the address
  return `${streetName} ${streetType} No:${buildingNumber}, ${apartmentName} Apt. Kat:${floor} Daire:${doorNumber}, ${postalCode} ${city}/${country}`
}

function generateRandomApartmentName(): string {
  const prefixes = ["Yeni", "Güzel", "Yeşil", "Mavi", "Beyaz", "Kırmızı", "Altın", "Gümüş"]
  const suffixes = ["Konak", "Saray", "Yıldız", "Ay", "Güneş", "Vadi", "Deniz", "Park"]

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]

  return `${prefix} ${suffix}`
}
