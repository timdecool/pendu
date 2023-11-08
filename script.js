const zoneGrille = document.getElementById('grille');
const boutonNombreLettres = document.getElementsByName('nbLettres');
const zoneTentatives = document.getElementById('tentatives');
const imagesPendu = ['Images/pendu4.png', 'Images/pendu5.png', 'Images/pendu6.png', 'Images/pendu7.png', 'Images/pendu8.png', 'Images/pendu9.png', 'Images/pendu10.png', 'Images/pendu11.png', 'Images/pendu12.png']
const pendu = document.getElementById('imgpendu');

const boutonStart = document.getElementById('newGame');
boutonStart.addEventListener('click', demarrerPartie);

const boutonLettre = document.querySelectorAll('.lettre');
boutonLettre.forEach(div => {
    div.classList.add('transition-couleur');
    div.addEventListener('click', function() {
        if (motAleatoire != "") {
            const lettre = this.textContent;
        var erreur = true;
        for (let i=0; i<motAleatoire.length; i++) {
            if (lettre == motAleatoire[i]) {
                zoneGrille.childNodes[i].innerText = lettre;
                erreur = false;
            }
        }
        this.classList.add("lettreselect");

        if (erreur) {
            decompteErreurs();
        }
        else {
            verifierVictoire();
        }
        }  
    })
})

var nombreLettres = 6;
var motAleatoire = "";
var nombreErreurs = 0;
const nombremaxErreurs = 8;

function decompteErreurs() {
    nombreErreurs += 1;
    pendu.src = imagesPendu[nombreErreurs];
    if (nombreErreurs == nombremaxErreurs) {
        zoneTentatives.innerText = "Vous avez perdu...";
        for (let i = 0 ; i < motAleatoire.length ; i++) {
            if (zoneGrille.childNodes[i].innerText == "_"){
                zoneGrille.childNodes[i].innerText = motAleatoire[i];
                zoneGrille.childNodes[i].style.color = "#8F754F";
            }
        }
    }
}

function verifierVictoire() {
    let victoire = true;
    if (motAleatoire == "") {
        zoneTentatives.innerText = "Veuillez lancer une partie !";
    }
    else {
        for (let i=0; i < zoneGrille.childNodes.length; i++) {
            if (zoneGrille.childNodes[i].innerText === "_") {
                victoire = false;
                break;
            }
        }
    
        if (victoire) {
            zoneTentatives.innerText = "Bravo ! Vous avez gagné."
            zoneGrille.style.color = "#D7B377";
        }
        else {
            decompteTentatives();
        }
    }
}

function demarrerPartie() {

    zoneGrille.style.color = "#2B4162";

    while (zoneGrille.firstChild) {
        zoneGrille.removeChild(zoneGrille.firstChild);
    }

    nombreErreurs = 0;
    pendu.src = imagesPendu[nombreErreurs];

    boutonLettre.forEach(div => {
        div.classList.remove("lettreselect");
        div.style.display = 'inline';
    });

    zoneTentatives.innerText = "";

    for (let i=0; i < boutonNombreLettres.length; i++) {
        if (boutonNombreLettres[i].checked) {
            nombreLettres = boutonNombreLettres[i].value;
            break;
        }
    }

    for (let i=0; i < nombreLettres; i++) {
        var lettreMystere = document.createElement("div");
        lettreMystere.innerText = "_";
        lettreMystere.classList.add('lettreGrille');
        lettreMystere.classList.add('transition-mot');
        zoneGrille.appendChild(lettreMystere);
    } 

    return importerDico()
        .then(dicoMots => {
            const dico = dicoMots.filter(mot => {
            return mot.length == nombreLettres;
        });
        const indexAleatoire = Math.floor(Math.random() * dico.length);
        motAleatoire = dico[indexAleatoire];        
        })
        .catch(erreur => {
            console.error("Une erreur s'est produite :", erreur);
        }) 
}

async function importerDico() {
    const reponse = await fetch('liste_francais.txt');
    const contenu = await reponse.text();

    const lines = contenu.split('\n');
    const lines2 = lines.map(line => line.replace ('\r', ''));
    const lines3 = lines2.map(lines2 => retirerAccents(lines2).toUpperCase());
    const dicomots = [...new Set(lines3)];
    return dicomots;
}

function retirerAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}