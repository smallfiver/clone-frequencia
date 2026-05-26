/**
 * Clone Frequência Vibracional - Quiz SPA
 * Lógica do quiz, navegação entre steps, áudios condicionais
 */

(function() {
    'use strict';

    // ==================== STATE ====================
    const state = {
        currentStep: 1,
        totalSteps: 8,
        genderValue: null,       // 'feminino' ou 'masculino'
        selectedMonth: null,     // {name, number}
        selectedDay: null,       // number
        selectedDecade: null,    // number (e.g. 1990)
        selectedYear: null,      // number (e.g. 1995)
        civilStatusValue: null,  // 'casado','namorando','noivo','solteiro','separado','viuvo'
        desafioValue: null,      // 'amor','financas','saude','felicidade'
        firstName: '',
        firstNameValue: null,
        audioElement: null,
        audioPlaying: false,
        backgroundVSL: false
    };

    // ==================== DATA ====================
    const months = [
        {name: "Janeiro", number: "01"},
        {name: "Fevereiro", number: "02"},
        {name: "Março", number: "03"},
        {name: "Abril", number: "04"},
        {name: "Maio", number: "05"},
        {name: "Junho", number: "06"},
        {name: "Julho", number: "07"},
        {name: "Agosto", number: "08"},
        {name: "Setembro", number: "09"},
        {name: "Outubro", number: "10"},
        {name: "Novembro", number: "11"},
        {name: "Dezembro", number: "12"}
    ];

    const civilStatusOptions = [
        {value: "casado", masculinoLabel: "Casado", femininoLabel: "Casada", icon: "./img/casado.png"},
        {value: "namorando", masculinoLabel: "Namorando", femininoLabel: "Namorando", icon: "./img/namorando.png"},
        {value: "noivo", masculinoLabel: "Noivo", femininoLabel: "Noiva", icon: "./img/noivo.png"},
        {value: "solteiro", masculinoLabel: "Solteiro", femininoLabel: "Solteira", icon: "./img/solteiro.png"},
        {value: "separado", masculinoLabel: "Separado", femininoLabel: "Separada", icon: "./img/divorciado.png"},
        {value: "viuvo", masculinoLabel: "Viúvo", femininoLabel: "Viúva", icon: "./img/viuvo.png"}
    ];

    const desafioOptions = [
        {value: "amor", label: "Vida Amorosa", icon: "💍"},
        {value: "financas", label: "Finanças", icon: "💰"},
        {value: "saude", label: "Saúde", icon: "🏥"},
        {value: "felicidade", label: "Felicidade", icon: "😊"}
    ];

    // ==================== HELPERS ====================
    function getAgeUser() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        let age = year - state.selectedYear;
        const monthVal = parseInt(state.selectedMonth.number) - 1;
        if (monthVal > month) age--;
        if (monthVal === month && state.selectedDay > day) age--;
        return age;
    }

    function getAgeUserFormat(age) {
        if (age < 20 || (age >= 20 && age < 30)) return "20";
        if (age >= 30 && age < 40) return "30";
        if (age >= 40 && age < 50) return "40";
        if (age >= 50 && age < 60) return "50";
        return "60";
    }

    function getCharCivilStatus(status) {
        if (status === "solteiro" || status === "separado" || status === "viuvo") return "s";
        if (status === "casado" || status === "namorando" || status === "noivo") return "c";
        return "s";
    }

    function getGenderChar() {
        return state.genderValue === "masculino" ? "h" : "m";
    }

    function getAudioP1Path() {
        const gender = getGenderChar();
        const age = getAgeUserFormat(getAgeUser());
        const civil = getCharCivilStatus(state.civilStatusValue);
        return `./audio/p1v2/${gender}_${age}_${civil}.mp3`;
    }

    function getAudioP2Path() {
        const gender = getGenderChar();
        const civilChar = getCharCivilStatus(state.civilStatusValue);
        
        if (state.desafioValue === "felicidade") return "./audio/p2v2/felicidade.mp3";
        if (state.desafioValue === "saude") return "./audio/p2v2/saude.mp3";
        if (state.desafioValue === "financas") return "./audio/p2v2/dinheiro.mp3";
        if (state.desafioValue === "amor") {
            if (civilChar === "c") {
                return gender === "h" ? "./audio/p2v2/h_casado.mp3" : "./audio/p2v2/m_casada.mp3";
            } else {
                return gender === "h" ? "./audio/p2v2/h_solteiro.mp3" : "./audio/p2v2/m_solteira.mp3";
            }
        }
        return "./audio/p2v2/dinheiro.mp3";
    }

    function generateDecades() {
        const decades = [];
        for (let d = 1910; d <= 2010; d += 10) {
            decades.push(d);
        }
        return decades;
    }

    function generateYears(decade) {
        const years = [];
        for (let y = decade; y < decade + 10; y++) {
            years.push(y);
        }
        return years;
    }

    function generateDays() {
        const days = [];
        for (let d = 1; d <= 31; d++) {
            days.push(d < 10 ? '0' + d : '' + d);
        }
        return days;
    }

    // ==================== RENDER ====================
    function render() {
        const app = document.getElementById('app');
        const progressPercentage = (state.currentStep / state.totalSteps) * 100;

        let stepContent = '';
        switch(state.currentStep) {
            case 1: stepContent = renderStep1(); break;
            case 2: stepContent = renderStep2(); break;
            case 3: stepContent = renderStep3(); break;
            case 4: stepContent = renderStep4(); break;
            case 5: stepContent = renderStep5(); break;
            case 6: stepContent = renderStep6(); break;
            case 7: stepContent = renderStep7(); break;
            case 8: stepContent = renderStep8(); break;
            case 9: stepContent = renderLoading(); break;
            case 10: stepContent = renderWarning(); break;
            case 11: stepContent = renderAudio(); break;
        }

        if (state.currentStep <= 8) {
            app.innerHTML = `
                <div id="page-wrapper" class="page-wrapper">
                    <div class="container">
                        <div class="ga4983248 container">
                            <section class="eh90427">
                                <div class="hf-4920">
                                    <div class="progress-bar-top">
                                        <div class="progress-bar-fill" style="width: ${Math.min(progressPercentage, 100)}%"></div>
                                    </div>
                                </div>
                                <div class="form-modal-2">
                                    <div class="form-container">
                                        <div class="step">
                                            ${stepContent}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            `;
        } else {
            app.innerHTML = stepContent;
        }

        bindEvents();
    }

    function renderStep1() {
        return `
            <div class="quiz-container">
                <h2 class="main-title">
                    Em apenas 30 segundos, descubra como seu nome rege sua vibração e veja como alinhar sua energia com a <span class="highlight-text">prosperidade</span>!
                </h2>
                <div class="alert-box">
                    <span class="alert-icon">⚠️</span>
                    <p>Atenção: Se tudo começar a fluir depois do teste, você me deve um PIX de R$ 5,00!</p>
                </div>
                <p class="selection-prompt">Selecione seu gênero para iniciar o teste.</p>
                <div class="gender-selection">
                    <div class="gender-cards">
                        <button class="gender-card ${state.genderValue === 'feminino' ? 'selected' : ''}" data-gender="feminino">
                            <div class="card-image female-bg"></div>
                            <div class="card-footer"><span class="arrow">&gt;</span> Mulher</div>
                        </button>
                        <button class="gender-card ${state.genderValue === 'masculino' ? 'selected' : ''}" data-gender="masculino">
                            <div class="card-image male-bg"></div>
                            <div class="card-footer"><span class="arrow">&gt;</span> Homem</div>
                        </button>
                    </div>
                </div>
                <div class="privacy-section">
                    <p class="privacy-text">
                        <span class="lock-icon">🔒</span>
                        <strong>Privacidade Garantida:</strong> Suas respostas são 100% anônimas e confidenciais.
                    </p>
                    <p class="stats-text">Mais de 98.342 pessoas já descobriram seus bloqueios através deste teste.</p>
                </div>
            </div>
        `;
    }

    function renderStep2() {
        const monthsHtml = months.map(m => 
            `<button class="date-item month-item" data-month='${JSON.stringify(m)}'>${m.name}</button>`
        ).join('');
        return `
            <h2 class="main-title" style="margin-top:40px">Clique no mês em que você nasceu:</h2>
            <div class="birth-date-month">
                <ul class="birth-date-list">${monthsHtml}</ul>
            </div>
            <div class="navigation-container">
                <button class="btn-voltar" data-back="true">&lt; Voltar</button>
            </div>
        `;
    }

    function renderStep3() {
        const days = generateDays();
        const daysHtml = days.map(d => 
            `<button class="date-item date-day" data-day="${d}">${d}</button>`
        ).join('');
        return `
            <h2 class="main-title" style="margin-top:40px">Informe o Dia do seu Nascimento:</h2>
            <div class="birth-date-month">
                <ul class="birth-date-list">${daysHtml}</ul>
            </div>
            <div class="navigation-container">
                <button class="btn-voltar" data-back="true">&lt; Voltar</button>
            </div>
        `;
    }

    function renderStep4() {
        const decades = generateDecades();
        const decadesHtml = decades.map(d => 
            `<button class="date-item" data-decade="${d}">${d}</button>`
        ).join('');
        return `
            <h2 class="main-title" style="margin-top:40px">Em qual Década você nasceu?</h2>
            <div class="birth-date-month">
                <ul class="birth-date-list">${decadesHtml}</ul>
            </div>
            <div class="navigation-container">
                <button class="btn-voltar" data-back="true">&lt; Voltar</button>
            </div>
        `;
    }

    function renderStep5() {
        const years = generateYears(state.selectedDecade);
        const yearsHtml = years.map(y => 
            `<button class="date-item" data-year="${y}">${y}</button>`
        ).join('');
        return `
            <h2 class="main-title" style="margin-top:40px">Em que Ano você nasceu?</h2>
            <div class="birth-date-month">
                <ul class="birth-date-list">${yearsHtml}</ul>
            </div>
            <div class="navigation-container">
                <button class="btn-voltar" data-back="true">&lt; Voltar</button>
            </div>
        `;
    }

    function renderStep6() {
        const isFem = state.genderValue === 'feminino';
        const statusHtml = civilStatusOptions.map(opt => {
            const label = isFem ? opt.femininoLabel : opt.masculinoLabel;
            return `<button class="civil-status-btn ${state.civilStatusValue === opt.value ? 'highlight' : ''}" data-civil="${opt.value}">
                <img src="${opt.icon}" alt="${label}">
                <span>${label}</span>
            </button>`;
        }).join('');
        return `
            <div class="civil-status-header">QUAL É O SEU ESTADO CIVIL?</div>
            <div class="civil-status-grid">${statusHtml}</div>
            <div class="navigation-container" style="margin-top:15px">
                <button class="btn-voltar" data-back="true">&lt; Voltar</button>
            </div>
        `;
    }

    function renderStep7() {
        const desafioHtml = desafioOptions.map(opt => 
            `<button class="botao-desafio2 date-item ${state.desafioValue === opt.value ? 'highlight' : ''}" data-desafio="${opt.value}">
                <span style="font-size:2.5rem">${opt.icon}</span>
                <span>${opt.label}</span>
            </button>`
        ).join('');
        return `
            <div class="desafio-header">QUAL O MAIOR DESAFIO DA SUA VIDA NESSE MOMENTO?</div>
            <div class="desafio-grid">${desafioHtml}</div>
            <div class="navigation-container" style="margin-top:15px">
                <button class="btn-voltar" data-back="true">&lt; Voltar</button>
            </div>
        `;
    }

    function renderStep8() {
        return `
            <div class="name-step">
                <h2>Qual é o seu Primeiro Nome?</h2>
                <input type="text" id="firstName" placeholder="Digite seu nome" value="${state.firstName}">
                <div class="error-message" id="errorMsg"></div>
                <br>
                <button class="btn-continuar" id="btnContinuar">Clique Aqui Para Continuar!</button>
            </div>
        `;
    }

    function renderLoading() {
        return `
            <div class="loading-screen">
                <div class="bg-img"><img src="./img/bg_divino.png" alt=""></div>
                <h3>Carregando a sua leitura...</h3>
                <div class="loading-bar-container">
                    <div class="loading-bar"></div>
                </div>
            </div>
        `;
    }

    function renderWarning() {
        const name = state.firstNameValue || 'Visitante';
        return `
            <div class="animation-section">
                <div class="animation-container">
                    <div class="modal-warning">
                        <div class="content-warning">
                            <h3><span style="color: #ffdb60;">${name}</span>, sua leitura vai sair do ar em breve.</h3>
                            <img src="./img/stop.png" alt="">
                            <p>Essa é a sua última chance de assistir até o final.<br>Clique no botão abaixo…</p>
                        </div>
                        <button class="btn-play" id="btnPlay">COMEÇAR</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Slideshow images synced with audio
    const slideshowImages = [
        './img/assets/frequencia.png',
        './img/assets/img_nome_vibracao.png',
        './img/assets/raro.png',
        './img/assets/biblico.png',
        './img/assets/famosos.png',
        './img/assets/certidao.png',
        './img/assets/revelacao.png',
        './img/assets/bloqueio_frequencia.png',
        './img/assets/fardo.png',
        './img/assets/caminho_frequencia.png',
        './img/assets/frequencia_justa.png',
        './img/assets/mantra.png',
        './img/assets/relax.png'
    ];
    let slideshowInterval = null;
    let currentSlideIndex = 0;

    function startSlideshow() {
        currentSlideIndex = 0;
        const slideEl = document.getElementById('slideshowImg');
        if (slideEl) {
            slideEl.src = slideshowImages[0];
            slideEl.style.opacity = '1';
        }
        slideshowInterval = setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % slideshowImages.length;
            const el = document.getElementById('slideshowImg');
            if (el) {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.src = slideshowImages[currentSlideIndex];
                    el.style.opacity = '1';
                }, 400);
            }
        }, 8000);
    }

    function stopSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }

    function renderAudio() {
        const name = state.firstNameValue || 'Visitante';
        return `
            <div class="audio-modal" id="audioModal">
                <div class="audio-astrology-container">
                    <div class="bg-mgi"></div>
                    <div class="slideshow-container" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                        <img id="slideshowImg" src="./img/assets/frequencia.png" style="max-width:85%;max-height:70%;object-fit:contain;opacity:0;transition:opacity 0.5s ease;border-radius:10px;">
                    </div>
                    <div style="position:relative;z-index:2;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:20px;min-height:100%;">
                        <div class="leitura-info" style="background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);border-radius:12px;padding:15px 25px;margin-bottom:15px;">
                            <h4>Leitura de Frequência para</h4>
                            <div class="nome">${name}</div>
                            <div class="elemento">Elemento: 🌱 Terra</div>
                            <div class="frequencia">Sua Frequência: <span id="freqStatus">Carregando...</span></div>
                        </div>
                        <div class="legendas" id="legendas"></div>
                        <div id="vslContainer" class="vsl-container" style="display:none;margin-top:20px;">
                            <div id="smartplayer"></div>
                        </div>
                    </div>
                </div>
                <div class="buttons-audio-container">
                    <button class="button-video" id="btnPausePlay">
                        <img src="./img/pause.png" alt="Pause" id="pauseIcon">
                    </button>
                </div>
                <audio id="audioPlayer" style="display:none;"></audio>
            </div>
        `;
    }

    // ==================== EVENTS ====================
    function bindEvents() {
        // Gender selection
        document.querySelectorAll('.gender-card').forEach(btn => {
            btn.addEventListener('click', function() {
                state.genderValue = this.dataset.gender;
                setTimeout(() => { state.currentStep = 2; render(); }, 300);
            });
        });

        // Month selection
        document.querySelectorAll('.month-item').forEach(btn => {
            btn.addEventListener('click', function() {
                state.selectedMonth = JSON.parse(this.dataset.month);
                state.currentStep = 3;
                render();
            });
        });

        // Day selection
        document.querySelectorAll('[data-day]').forEach(btn => {
            btn.addEventListener('click', function() {
                state.selectedDay = parseInt(this.dataset.day);
                state.currentStep = 4;
                render();
            });
        });

        // Decade selection
        document.querySelectorAll('[data-decade]').forEach(btn => {
            btn.addEventListener('click', function() {
                state.selectedDecade = parseInt(this.dataset.decade);
                state.currentStep = 5;
                render();
            });
        });

        // Year selection
        document.querySelectorAll('[data-year]').forEach(btn => {
            btn.addEventListener('click', function() {
                state.selectedYear = parseInt(this.dataset.year);
                state.currentStep = 6;
                render();
            });
        });

        // Civil status selection
        document.querySelectorAll('[data-civil]').forEach(btn => {
            btn.addEventListener('click', function() {
                state.civilStatusValue = this.dataset.civil;
                state.currentStep = 7;
                render();
            });
        });

        // Desafio selection
        document.querySelectorAll('[data-desafio]').forEach(btn => {
            btn.addEventListener('click', function() {
                state.desafioValue = this.dataset.value || this.dataset.desafio;
                state.currentStep = 8;
                render();
            });
        });

        // Back button
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', function() {
                if (state.currentStep > 1) {
                    state.currentStep--;
                    render();
                }
            });
        });

        // Name input
        const nameInput = document.getElementById('firstName');
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                state.firstName = this.value;
            });
            nameInput.focus();
        }

        // Continue button (name step)
        const btnContinuar = document.getElementById('btnContinuar');
        if (btnContinuar) {
            btnContinuar.addEventListener('click', handleNameSubmit);
        }

        // Play button (warning modal)
        const btnPlay = document.getElementById('btnPlay');
        if (btnPlay) {
            btnPlay.addEventListener('click', startAudio);
        }

        // Pause/Play button
        const btnPausePlay = document.getElementById('btnPausePlay');
        if (btnPausePlay) {
            btnPausePlay.addEventListener('click', toggleAudio);
        }
    }

    // ==================== HANDLERS ====================
    function handleNameSubmit() {
        const name = state.firstName.trim();
        const hasNumbers = /[0-9]/.test(name);
        const hasSpaces = /[a-zA-ZÀ-ú]+\s+[a-zA-ZÀ-ú]/.test(name);

        const errorEl = document.getElementById('errorMsg');

        if (hasNumbers) {
            if (errorEl) errorEl.textContent = "*Apenas letras são permitidas!";
            return;
        }
        if (hasSpaces) {
            if (errorEl) errorEl.textContent = "*Apenas o primeiro nome!";
            return;
        }
        if (!name) {
            if (errorEl) errorEl.textContent = "*Campo do primeiro nome inválido!";
            return;
        }

        // Capitalize first letter
        state.firstNameValue = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        state.currentStep = 9; // Loading
        render();

        // After loading animation, show warning
        setTimeout(() => {
            state.currentStep = 10; // Warning
            render();
        }, 3500);
    }

    function startAudio() {
        state.currentStep = 11;
        render();

        // Start slideshow
        setTimeout(() => { startSlideshow(); }, 600);

        // Start playing audio p1v2
        setTimeout(() => {
            const audioPath = getAudioP1Path();
            const audioPlayer = document.getElementById('audioPlayer');
            if (audioPlayer) {
                audioPlayer.src = audioPath;
                audioPlayer.play().then(() => {
                    state.audioPlaying = true;
                    const freqStatus = document.getElementById('freqStatus');
                    if (freqStatus) freqStatus.textContent = 'Ativa ✓';
                }).catch(e => {
                    console.log('Audio autoplay blocked:', e);
                    const freqStatus = document.getElementById('freqStatus');
                    if (freqStatus) freqStatus.textContent = 'Ativa ✓';
                });

                // When p1 ends, play p2
                audioPlayer.addEventListener('ended', function onP1End() {
                    audioPlayer.removeEventListener('ended', onP1End);
                    const p2Path = getAudioP2Path();
                    audioPlayer.src = p2Path;
                    audioPlayer.play().catch(e => console.log('P2 play error:', e));
                    
                    // Show VSL after p2 starts
                    setTimeout(() => {
                        stopSlideshow();
                        showVSL();
                    }, 5000);
                });
            }
        }, 500);
    }

    function toggleAudio() {
        const audioPlayer = document.getElementById('audioPlayer');
        if (!audioPlayer) return;

        if (state.audioPlaying) {
            audioPlayer.pause();
            state.audioPlaying = false;
        } else {
            audioPlayer.play();
            state.audioPlaying = true;
        }
    }

    function showVSL() {
        const vslContainer = document.getElementById('vslContainer');
        if (vslContainer) {
            vslContainer.style.display = 'block';
            // Load ConverteAI/VTurb player
            vslContainer.innerHTML = `
                <div id="vid_6841b662f59c67de93338696" style="position:relative;width:100%;padding:56.25% 0 0;">
                    <img id="thumb_6841b662f59c67de93338696" src="https://images.converteai.net/0a246cdd-c6bd-48cb-b2bf-d2a8c03c2dd5/players/6841b662f59c67de93338696/thumbnail.jpg" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">
                    <div id="backdrop_6841b662f59c67de93338696" style="position:absolute;top:0;width:100%;height:100%;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);"></div>
                </div>
            `;
            // Load the player script
            const script = document.createElement('script');
            script.src = 'https://scripts.converteai.net/0a246cdd-c6bd-48cb-b2bf-d2a8c03c2dd5/players/6841b662f59c67de93338696/player.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }

    // ==================== INIT ====================
    function init() {
        render();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
