// ===== STOCKAGE DES RÉPONSES =====
let answers = {
    q1: null,
    q2: null,
    q3: [], // Array pour les choix multiples
    q4: null
};

// ===== FONCTION PRINCIPALE : CHANGER D'ÉCRAN AVEC RIDEAU =====
function changeScreen(fromScreen, toScreen) {
    const curtain = document.getElementById('curtain');
    const from = document.getElementById(fromScreen);
    const to = document.getElementById(toScreen);

    // Étape 1 : Descendre le rideau
    curtain.classList.add('closing');
    
    setTimeout(() => {
        // Étape 2 : Changer l'écran (caché derrière le rideau)
        from.classList.remove('active');
        to.classList.remove('active'); // Au cas où
        to.classList.add('active');
        
        // Scroll en haut du contenu
        const content = to.querySelector('.content');
        if (content) content.scrollTop = 0;
        
        // Étape 3 : Remonter le rideau
        curtain.classList.remove('closing');
        curtain.classList.add('opening');
        
        setTimeout(() => {
            curtain.classList.remove('opening');
        }, 500);
    }, 500); // Attendre que le rideau soit descendu
}

// ===== DÉMARRER LE QUIZ =====
function startQuiz() {
    // Reset des réponses
    answers = { q1: null, q2: null, q3: [], q4: null };
    changeScreen('accueil', 'question1');
}

// ===== PASSER À LA QUESTION SUIVANTE =====
function nextQuestion(currentQuestion) {
    // Sauvegarder la réponse actuelle
    if (currentQuestion === 3) {
        // Question 3 : choix multiple (checkboxes)
        const checkboxes = document.querySelectorAll('input[name="q3"]:checked');
        answers.q3 = Array.from(checkboxes).map(cb => cb.value);
        
        if (answers.q3.length === 0) {
            alert('⚠️ Sélectionne au moins une compétence !');
            return;
        }
    } else {
        // Questions 1, 2, 4 : choix unique (radio)
        const selected = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
        
        if (!selected) {
            alert('⚠️ Sélectionne une réponse !');
            return;
        }
        
        answers[`q${currentQuestion}`] = selected.value;
    }

    // Déterminer l'écran suivant
    const nextScreenMap = {
        1: 'question2',
        2: 'question3',
        3: 'question4',
        4: 'optin'
    };

    changeScreen(`question${currentQuestion}`, nextScreenMap[currentQuestion]);
}

// ===== ALLER AUX RÉSULTATS =====
function goToResults() {
    calculateResults();
    changeScreen('optin', 'results');
}

// ===== CALCULER LES RÉSULTATS (LOGIQUE CUMULATIVE) =====
function calculateResults() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Vider le contenu précédent

    const results = [];

    // Règle 1 : Perle (Rôle Discord)
    if (['A', 'B', 'C'].includes(answers.q4) && ['B', 'C', 'D'].includes(answers.q2)) {
        results.push({
            title: '💎 Perle (Rôle Discord)',
            description: 'Participe aux communautés Discord des projets prometteurs. Accumule des rôles actifs pour maximiser tes chances de recevoir des airdrops. Idéal pour ceux qui ont du temps mais peu de capital.'
        });
    }

    // Règle 2 : Farming de perps en DN
    if (['C', 'D'].includes(answers.q4)) {
        results.push({
            title: '📈 Farming de perps en DN (Variational, Paradex...)',
            description: 'Utilise ton capital pour farmer du volume sur les plateformes de trading de perpétuels en phase de testnet. Variational, Paradex et autres protocoles récompensent les early adopters.'
        });
    }

    // Règle 3 : Farm de volume sur Extended + Vault
    if (answers.q3.includes('B') && ['C', 'D'].includes(answers.q4)) {
        results.push({
            title: '💹 Farm de volume sur Extended + Vault',
            description: 'Profite de ton expérience en trading et de ton capital pour maximiser le volume sur Extended et participer aux Vaults. Stratégie avancée pour traders confirmés.'
        });
    }

    // Règle 4 : Programmes Ambassadeurs
    if (answers.q3.includes('C')) {
        results.push({
            title: '🎤 Programmes Ambassadeurs',
            description: 'Mets tes compétences en marketing et création de contenu au service des projets crypto. Deviens ambassadeur pour gagner des tokens et construire ta réputation dans l\'écosystème.'
        });
    }

    // Règle 5 : Aucun match = Inéligible
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>😔 Désolé, tu es inéligible pour les airdrops actuels.</p>
                <p style="font-size: 0.9em; margin-top: 15px; color: #aaa;">
                    Augmente ton capital ou ton temps disponible pour débloquer plus d'opportunités.
                </p>
            </div>
        `;
        return;
    }

    // Afficher tous les résultats correspondants
    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        resultDiv.innerHTML = `
            <h3>${result.title}</h3>
            <p>${result.description}</p>
        `;
        resultsContainer.appendChild(resultDiv);
    });
}

// ===== RECOMMENCER LE QUIZ =====
function restartQuiz() {
    // Reset des réponses
    answers = { q1: null, q2: null, q3: [], q4: null };
    
    // Décocher tous les inputs
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
    
    changeScreen('results', 'accueil');
}

// ===== INITIALISATION AU CHARGEMENT =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Quiz Airdrops initialisé !');
    console.log('Réponses stockées :', answers);
});
