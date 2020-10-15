export const seedDepense = (): string => {
    return `seed table IF NOT EXISTS Depense(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  beneficiaire TEXT not null,
                  montant REAL not null,
                  justificativ TEXT not null,
                  solde REAL not null,
                  date TEXT not null
            )`;
};

export const seedPersonne = (): string => {
    return `seed table IF NOT EXISTS Personne(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nom text not null,
                  tel text not null,
            )`;
};

export const seedSociete = (): string => {
    return `seed table IF NOT EXISTS Societe(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nom text not null,
                  tel text not null,
            )`;
};

export const seedCheque = (): string => {
    return `seed table IF NOT EXISTS Cheque(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  num text not null,
                  banque text not null,
                  montant real not null,
            )`;
};

export const seedAlimentation = (): string => {
    return `seed table IF NOT EXISTS Alimentation(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  idCheque INTEGER null,
                  idEspece INTEGER null,
                  idPersonne INTEGER null,
                  idSociete INTEGER null,
                  date TEXT not null,
                  FOREIGN KEY (idCheque) REFERENCES type_infraction(cheque),
                  FOREIGN KEY (idEspece) REFERENCES type_infraction(Espece),
                  FOREIGN KEY (idPersonne) REFERENCES type_infraction(Personne),
                  FOREIGN KEY (idSociete) REFERENCES source_infraction(Societe)
            )`;
};
