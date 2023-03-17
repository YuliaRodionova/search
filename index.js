let form = document.forms.form;
let button = document.getElementById('search-button');

form.onsubmit = function (event) {
    event.preventDefault();
    const input = document.querySelector('.input-search');
    const resultText = document.querySelector('.result');
    const value = input.value;

    if (value == '' || value.length == 1) {
        input.classList.add('invalid');
        let error = document.createElement('div');
        error.className = 'error';
        error.innerHTML = 'Пожалуйста, ввеедите запрос более 1 символа';
        if (!button.nextElementSibling) {
            button.after(error);
        }
    } else {
        input.classList.remove('invalid');
        if (button.nextElementSibling) {
            button.nextSibling.remove();
        }
        getReps(value)
            .then(response => response.json())
            .then(reps => printReps(reps, value))
    }

    resultText.innerHTML = '';
}

async function getReps(value) {
    const queryString = `q=${encodeURIComponent(value)}`;
    const queryURL = `https://api.github.com/search/repositories?${queryString}`;

    return fetch(queryURL);
}

function printReps(repsResponse, value) {
    const resultText = document.querySelector('.result');

    if (repsResponse.items.length === 0) {
        resultText.textContent = 'ничего не найдено';
        return;
    } else {
        const title = document.createElement('h2');
        title.textContent = `Результаты поиска по запросу: ${value}`
        resultText.append(title);
    }

    const reps = repsResponse.items.slice(0, 10);
    const repsReduced = reps.map(repo => {
        return {
            name: repo.name,
            url: repo.html_url,
        }
    });
    repsReduced.forEach(repo => {
        addRepoToList(repo);
    });
}

function addRepoToList(repo) {
    const resultText = document.querySelector('.result');
    const resultTextItem = document.createElement('div');
    resultTextItem.classList.add('result__item');
    resultText.append(resultTextItem);

    const nameLink = document.createElement('a');
    nameLink.target = '_blank';
    nameLink.href = repo.url;
    nameLink.textContent = repo.name;
    resultTextItem.append(nameLink);

}