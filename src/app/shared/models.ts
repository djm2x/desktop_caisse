export class User {
    email = '';
    password = '';
}

export class Depense {
    id = null;
    beneficiaire = '';
    montant = null;
    justificativ = '';
    date = new Date();
}

export class Caisse {
    id = 1;
    montant = 0;
}

export class Personne {
    id = null;
    nom = '';
    tel = '';
}

export class Societe {
    id = null;
    nom = '';
    tel = '';
}

export class Cheque {
    id = null;
    num = '';
    banque = '';
}

export class Espece {
    id = null;
    montant = 500;
}

export class Alimentation {
    id = null;
    idCheque = null;
    // idEspece = null;
    idPersonne = null;
    idSociete = null;
    montant = 0;
    date = new Date();
    // espece = new Espece();
    cheque = new Cheque();
    personne = new Personne();
    societe = new Societe();
}

