interface Enot {
    name: string;
    weight: number;
    year: number;
    imageURL?: string;
}

let enotsArray: Enot[] = [];

const storedEnots = localStorage.getItem('enots');
if (storedEnots) {
    enotsArray = JSON.parse(storedEnots) as Enot[];
}

function saveEnotsToLocalStorage() {
    localStorage.setItem('enots', JSON.stringify(enotsArray));
}

function displayImage(imageUrl: string) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;

    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer) {
        imageContainer.innerHTML = '';
        imageContainer.appendChild(imageElement);
    }
}

async function generateAndSaveImages(enotIndex: number) {
    const apiUrl = "https://visioncraftapi--vladalek05.repl.co";
    const apiKey = "1e5a2dac-d702-464b-b8fb-ca60082e930a";

    const enot = enotsArray[enotIndex];
    const model = "absolutereality_v1.8.1";
    const sampler = "Euler";
    const imageCount = 1;
    const cfgScale = 8;
    const steps = 30;
    const loras: Record<string, number> = { "3DMM_V12": 1, "GrayClay_V1.5.5": 2, "eye_size_slider_v1": 3, "age_slider_v20": 1 };

    const data = {
        model,
        sampler,
        prompt: "racoon animal", // Use the prompt "racoon animal"
        image_count: imageCount,
        token: apiKey,
        cfg_scale: cfgScale,
        steps,
        loras
    };

    try {
        const response = await fetch(`${apiUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const imageUrl = responseData.images[0];

        enot.imageURL = imageUrl;
        saveEnotsToLocalStorage();
        displayEnotInfo(enot);
        displayImage(imageUrl);
    } catch (error) {
        console.error('Error generating images:', error);
    }
}

function clickEnotik() {
    const nameInput = document.getElementById('enotik') as HTMLInputElement;
    const name = nameInput.value;
    const weight = Math.floor(Math.random() * 10);
    const year = Math.floor(Math.random() * 10);
    const enot: Enot = { name, weight, year };

    enotsArray.push(enot);

    saveEnotsToLocalStorage();
    generateAndSaveImages(enotsArray.length - 1);
}

function displayEnotInfo(enot: Enot) {
    const infoEnot = document.getElementById('photoenot');
    if (infoEnot) {
        infoEnot.innerHTML = `Вашего енота зовут ${enot.name}, он весит ${enot.weight}кг, его возраст - ${enot.year}`;
    }

    const enotsList = document.getElementById('enotsList');
    if (enotsList) {
        const enotButton = document.createElement('button');
        enotButton.innerHTML = `Показать информацию о ${enot.name}`;
        enotButton.onclick = () => showEnotInfo(enot);

        const newLine = document.createElement('br');
        enotsList.appendChild(newLine);
        enotsList.appendChild(enotButton);
    }
}

function showEnotInfo(enot: Enot) {
    const infoEnot = document.getElementById('photoenot');
    if (infoEnot) {
        infoEnot.innerHTML = `Вашего енота зовут ${enot.name}, он весит ${enot.weight} кг, его возраст - ${enot.year}`;
        displayImage(enot.imageURL || '');
    }
}

window.onload = () => {
    localStorage.removeItem('enots');
};

