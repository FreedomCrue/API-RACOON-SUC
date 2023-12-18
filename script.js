    const API_URL = "https://visioncraftapi--vladalek05.repl.co";
    const API_KEY = "1e5a2dac-d702-464b-b8fb-ca60082e930a";
    
    let enotsArray = [];
    
    if (localStorage.getItem('enots')) {
        enotsArray = JSON.parse(localStorage.getItem('enots'));
    }
    
    function saveEnotsToLocalStorage() {
        localStorage.setItem('enots', JSON.stringify(enotsArray));
    }
    
    function displayImage(imageUrl) {
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
    
        const imageContainer = document.getElementById('imageContainer');
        if (imageContainer) {
            imageContainer.innerHTML = '';
            imageContainer.appendChild(imageElement);
        } else {
            console.error("Error: imageContainer not found");
        }
    }
    
    async function generateAndSaveImages(enotIndex) {
        const apiUrl = "https://visioncraftapi--vladalek05.repl.co";
        const apiKey = "1e5a2dac-d702-464b-b8fb-ca60082e930a";
    
        const enot = enotsArray[enotIndex];
        const model = "absolutereality_v1.8.1";
        const sampler = "Euler";
        const imageCount = 1;
        const cfgScale = 8;
        const steps = 30;
        const loras = { "3DMM_V12": 1, "GrayClay_V1.5.5": 2, "eye_size_slider_v1": 3, "age_slider_v20": 1 };
    
        const data = {
            model,
            sampler,
            prompt: enot.name,
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
        const nameInput = document.getElementById('enotik');
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const ageInput = document.getElementById('age');
    
        const name = nameInput.value;
        const height = parseFloat(heightInput.value) || 0;
        const weight = parseFloat(weightInput.value) || 0;
        const age = parseInt(ageInput.value) || 0;
    
        const enot = { name, height, weight, age };
        enotsArray.push(enot);
    
        saveEnotsToLocalStorage();
        generateAndSaveImages(enotsArray.length - 1);
    }
    
    function displayEnotInfo(enot) {
        const infoEnot = document.getElementById('photoenot');
        infoEnot.innerHTML = `Вашего енота зовут ${enot.name}, он весит ${enot.weight}кг, его возраст - ${enot.age} лет`;
    
        const enotsList = document.getElementById('enotsList');
        const enotButton = document.createElement('button');
        enotButton.innerHTML = `Показать информацию о ${enot.name}`;
        enotButton.onclick = function () {
            showEnotInfo(enot);
        };
    
        const newLine = document.createElement('br');
        enotsList.appendChild(newLine);
        enotsList.appendChild(enotButton);
    }
    
    function showEnotInfo(enot) {
        const infoEnot = document.getElementById('photoenot');
        infoEnot.innerHTML = `Вашего енота зовут ${enot.name}, он весит ${enot.weight} кг, его возраст - ${enot.age} лет`;
    
        displayImage(enot.imageURL);
    }
    
    window.onload = function () {
        localStorage.removeItem('enots');
    };
    
    document.addEventListener('DOMContentLoaded', function () {
        
    });
    

