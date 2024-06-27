import createBot from './createBot'

const getGeolocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    })
                },
                error => {
                    reject(new Error('Impossible d\'obtenir la géolocalisation.'))
                }
            )
        } else {
            reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur.'))
        }
    })
}

const getCoordinatesFromCity = async (city) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Erreur lors de la récupération des coordonnées de la ville.')

        const data = await response.json()
        if (data.length === 0) throw new Error('Ville non trouvée.')

        return {
            latitude: data[0].lat,
            longitude: data[0].lon,
            name: data[0].display_name
        }
    } catch (error) {
        throw new Error('Impossible d\'obtenir les coordonnées de la ville.')
    }
}

const getWeatherData = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Erreur lors de la récupération des données météo.')
        const data = await response.json()
        return data.current_weather
    } catch (error) {
        throw new Error('Impossible d\'obtenir les données météo.')
    }
}

const getWeatherDescription = (weathercode) => {
    const weatherConditions = {
        0: 'Soleil !',
        1: 'Principalement ensoleillé',
        2: 'Partiellement nuageux',
        3: 'Nuageux',
        45: 'Brouillard',
        48: 'Dépôt de brouillard givrant',
        51: 'Bruine légère',
        53: 'Bruine modérée',
        55: 'Bruine dense',
        56: 'Bruine verglaçante légère',
        57: 'Bruine verglaçante dense',
        61: 'Pluie légère',
        63: 'Pluie modérée',
        65: 'Pluie forte',
        66: 'Pluie verglaçante légère',
        67: 'Pluie verglaçante forte',
        71: 'Neige légère',
        73: 'Neige modérée',
        75: 'Neige forte',
        77: 'Grains de neige',
        80: 'Averses de pluie légères',
        81: 'Averses de pluie modérées',
        82: 'Averses de pluie violentes',
        85: 'Averses de neige légères',
        86: 'Averses de neige fortes',
        95: 'Orages',
        96: 'Orages avec grêle légère',
        99: 'Orages avec grêle forte'
    }

    return weatherConditions[weathercode] || 'Condition météorologique inconnue'
}

const generateCurrentWeatherReportHtml = (currentWeather, locationName = 'votre position actuelle') => {
    const { temperature, weathercode, windspeed, winddirection, time } = currentWeather

    const date = new Date(time)
    const weatherDescription = getWeatherDescription(weathercode)

    let report = `<h2>Météo actuelle à ${locationName}</h2>`
    report += `<strong>Température:</strong> ${temperature} °C <br>`
    report += `<strong>Condition:</strong> ${weatherDescription} <br>`
    report += `<strong>Vitesse du vent:</strong> ${windspeed} km/h <br>`
    report += `<strong>Direction du vent:</strong> ${winddirection}° <br>`

    return report
}

const createMeteoBot = () => {
    const bot = createBot('MeteoBot')

    bot.addCommand('meteo', 'Obtenir la météo actuelle à votre position ou une ville donnée. (ex: meteo Bayonne)', async (args) => {
        try {
            let latitude, longitude, locationName
            if (args.length > 0) {
                const city = args.join(' ')
                const coordinates = await getCoordinatesFromCity(city)
                latitude = coordinates.latitude
                longitude = coordinates.longitude
                //add majuscule to first letter
                locationName = city.charAt(0).toUpperCase() + city.slice(1)
            } else {
                const geolocation = await getGeolocation()
                latitude = geolocation.latitude
                longitude = geolocation.longitude
                locationName = 'Votre position actuelle'
            }

            const currentWeather = await getWeatherData(latitude, longitude)
            return generateCurrentWeatherReportHtml(currentWeather, locationName)
        } catch (error) {
            return `<p style="color:red">${error.message}</p>`
        }
    })

    return bot
}

export default createMeteoBot