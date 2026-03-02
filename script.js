//elements
const input = document.getElementById('country-input');
const button = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    try {
        errorMessage.textContent = "";
        countryInfo.innerHTML = "";
        borderSection.innerHTML = "";

        spinner.classList.remove('hidden');

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" width="150">
        `;

        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

            borderSection.innerHTML += `
            <article>
            <p>${borderCountry.name.common}</p>
            <img src="${borderCountry.flags.svg}" width="80">
            </article>
                `;
            }
        } else {
            borderSection.innerHTML = "<p>No bordering countries</p>";
        }

    } catch (error) {
        errorMessage.textContent = "Error: " + error.message;
    } finally {
        spinner.classList.add('hidden');
    }
}