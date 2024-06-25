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
                    reject('Impossible d\'obtenir la géolocalisation.')
                }
            )
        } else {
            reject('La géolocalisation n\'est pas supportée par ce navigateur.')
        }
    })
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

const generateCurrentWeatherReportHtml = (currentWeather) => {
    const { temperature, weathercode, windspeed, winddirection, time } = currentWeather

    const date = new Date(time)
    const weatherDescription = getWeatherDescription(weathercode)

    let report = `<h2>Météo actuelle</h2>`
    report += `<strong>Température:</strong> ${temperature} °C <br>`
    report += `<strong>Condition:</strong> ${weatherDescription} <br>`
    report += `<strong>Vitesse du vent:</strong> ${windspeed} km/h <br>`
    report += `<strong>Direction du vent:</strong> ${winddirection}° <br>`

    return report
}

const createMeteoBot = () => {
    const bot = createBot('MeteoBot')
    bot.addCommand('meteo', 'Obtenir la météo actuelle où vous vous trouvez', async () => {
        try {
            const { latitude, longitude } = await getGeolocation()
            const currentWeather = await getWeatherData(latitude, longitude)
            return generateCurrentWeatherReportHtml(currentWeather)
        } catch (error) {
            return `<p style="color:red">${error.message}</p>`
        }
    })

    return bot
}

export default createMeteoBot