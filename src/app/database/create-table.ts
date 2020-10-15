export const createDepense = (): string => {
    return `create table IF NOT EXISTS Depense(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  beneficiaire TEXT not null,
                  montant REAL not null,
                  justificativ TEXT not null,
                  date date not null
            )`;
};

export const createPersonne = (): string => {
    return `create table IF NOT EXISTS Personne(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nom text not null,
                  tel text not null
            )`;
};

export const createSociete = (): string => {
    return `create table IF NOT EXISTS Societe(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nom text not null,
                  tel text not null
            )`;
};

export const createCheque = (): string => {
    return `create table IF NOT EXISTS Cheque(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  num text not null,
                  banque text not null
            )`;
};

export const createEspece = (): string => {
    return `create table IF NOT EXISTS Espece(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  montant real not null
            )`;
};

export const createAlimentation = (): string => {
    return `create table IF NOT EXISTS Alimentation(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  idCheque INTEGER null,
                  idPersonne INTEGER null,
                  idSociete INTEGER null,
                  montant real not null,
                  date date not null,
                  FOREIGN KEY (idCheque) REFERENCES cheque(id),
                  FOREIGN KEY (idPersonne) REFERENCES personne(id),
                  FOREIGN KEY (idSociete) REFERENCES societe(id)
            )`;
};

export const createCaisse = (): string => {
    return `create table IF NOT EXISTS caisse(
                  id INTEGER PRIMARY KEY,
                  montant INTEGER not null
            )`;
};

export const insertCaisse = (): string => {
    return `INSERT OR IGNORE INTO caisse VALUES (1, 0)`;
};


