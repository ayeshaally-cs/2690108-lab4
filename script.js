const input = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    try {
        // Reset UI
        errorMessage.textContent = '';
        countryInfo.classList.add('hidden');
        borderingCountries.classList.add('hidden');
        spinner.classList.remove('hidden');

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        // Display country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" width="150">
        `;

        countryInfo.classList.remove('hidden');

        // Border countries
        if (country.borders && country.borders.length > 0) {
            borderingCountries.innerHTML = "<h3>Bordering Countries:</h3>";

            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountries.innerHTML += `
                    <div>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" width="80">
                    </div>
                `;
            }

            borderingCountries.classList.remove('hidden');
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
            borderingCountries.classList.remove('hidden');
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        spinner.classList.add('hidden');
    }
}

// Button click
searchBtn.addEventListener('click', () => {
    const country = input.value.trim();
    if (country) {
        searchCountry(country);
    }
});

// Press Enter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = input.value.trim();
        if (country) {
            searchCountry(country);
        }
    }
});