
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.1.0
 * Query Engine version: 11f085a2012c0f4778414c8db2651556ee0ef959
 */
Prisma.prismaVersion = {
  client: "6.1.0",
  engine: "11f085a2012c0f4778414c8db2651556ee0ef959"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.NewsletterScalarFieldEnum = {
  id: 'id',
  email: 'email',
  unsubscribeToken: 'unsubscribeToken'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  nom: 'nom',
  prenom: 'prenom',
  email: 'email',
  phone: 'phone',
  hashPassword: 'hashPassword',
  statutUser: 'statutUser',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  companyId: 'companyId',
  stripeAccountId: 'stripeAccountId',
  stripeAccountCompleted: 'stripeAccountCompleted'
};

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  siret: 'siret',
  nomSociete: 'nomSociete',
  codePostal: 'codePostal',
  adresse: 'adresse',
  ville: 'ville',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  secteurActivite: 'secteurActivite',
  typeSociete: 'typeSociete'
};

exports.Prisma.ProfileImageScalarFieldEnum = {
  id: 'id',
  path: 'path',
  userId: 'userId'
};

exports.Prisma.FavorisScalarFieldEnum = {
  id: 'id',
  saveDate: 'saveDate',
  userId: 'userId',
  annonceId: 'annonceId'
};

exports.Prisma.AnnoncesScalarFieldEnum = {
  id: 'id',
  titre: 'titre',
  description: 'description',
  prix: 'prix',
  typeTarif: 'typeTarif',
  priority: 'priority',
  localisation: 'localisation',
  adresse: 'adresse',
  statut: 'statut',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  categorieAnnonce: 'categorieAnnonce',
  sousCategorie: 'sousCategorie',
  userId: 'userId',
  priceId: 'priceId'
};

exports.Prisma.ImageAnnonceScalarFieldEnum = {
  id: 'id',
  path: 'path',
  annoncesId: 'annoncesId'
};

exports.Prisma.CommentaireScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  commentaire: 'commentaire',
  note: 'note',
  annoncesId: 'annoncesId',
  userId: 'userId'
};

exports.Prisma.TemoignagesScalarFieldEnum = {
  id: 'id',
  temoignage: 'temoignage',
  noteLilee: 'noteLilee',
  ville: 'ville',
  pays: 'pays',
  userId: 'userId'
};

exports.Prisma.AdresseFacturationScalarFieldEnum = {
  id: 'id',
  nom: 'nom',
  adresse: 'adresse',
  codePostal: 'codePostal',
  ville: 'ville',
  pays: 'pays',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.EngagementScalarFieldEnum = {
  id: 'id',
  nom: 'nom',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  statutPartenaire: 'statutPartenaire',
  siteWeb: 'siteWeb',
  adresse: 'adresse',
  email: 'email',
  phone: 'phone',
  facebook: 'facebook',
  instagram: 'instagram',
  twitter: 'twitter',
  linkedin: 'linkedin',
  tikTok: 'tikTok',
  youtube: 'youtube',
  duree: 'duree',
  description: 'description'
};

exports.Prisma.ContenuPartenaireScalarFieldEnum = {
  id: 'id',
  path: 'path',
  engagementId: 'engagementId'
};

exports.Prisma.LogoScalarFieldEnum = {
  id: 'id',
  path: 'path',
  engagementId: 'engagementId'
};

exports.Prisma.ArticleScalarFieldEnum = {
  id: 'id',
  titre: 'titre',
  contenu: 'contenu',
  categorieArticle: 'categorieArticle',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ImageScalarFieldEnum = {
  id: 'id',
  path: 'path',
  articleId: 'articleId'
};

exports.Prisma.TransactionsScalarFieldEnum = {
  id: 'id',
  dateRange: 'dateRange',
  price: 'price',
  quantity: 'quantity',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  annonceId: 'annonceId',
  userId: 'userId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.statutUser = exports.$Enums.statutUser = {
  ACTIF: 'ACTIF',
  SUSPENDU: 'SUSPENDU'
};

exports.role = exports.$Enums.role = {
  PERSO: 'PERSO',
  PRO: 'PRO',
  ADMIN: 'ADMIN'
};

exports.secteurActivite = exports.$Enums.secteurActivite = {
  IMMOBILIER: 'IMMOBILIER',
  VETEMENT: 'VETEMENT',
  EMPLOI: 'EMPLOI',
  SERVICE: 'SERVICE',
  VOITURE: 'VOITURE',
  LOISIR: 'LOISIR',
  MATERIEL: 'MATERIEL',
  MOBILIER: 'MOBILIER'
};

exports.typeSociete = exports.$Enums.typeSociete = {
  ENTREPRISE_INDIVIDUELLE: 'ENTREPRISE_INDIVIDUELLE',
  SOCIETE_PRIVEE: 'SOCIETE_PRIVEE',
  SOCIETE_PUBLIQUE: 'SOCIETE_PUBLIQUE',
  COOPERATIVE: 'COOPERATIVE',
  ASSOCIATION: 'ASSOCIATION'
};

exports.typeTarif = exports.$Enums.typeTarif = {
  JOURNALIER: 'JOURNALIER',
  NUITEE: 'NUITEE',
  FIXE: 'FIXE',
  MENSUEL: 'MENSUEL'
};

exports.priority = exports.$Enums.priority = {
  URGENT: 'URGENT',
  POPULAIRE: 'POPULAIRE',
  RECOMMANDATION: 'RECOMMANDATION'
};

exports.statut = exports.$Enums.statut = {
  PUBLIEE: 'PUBLIEE',
  DESACTIVEE: 'DESACTIVEE',
  EN_ATTENTE_DE_VALIDATION: 'EN_ATTENTE_DE_VALIDATION'
};

exports.categorieAnnonce = exports.$Enums.categorieAnnonce = {
  IMMOBILIER: 'IMMOBILIER',
  VETEMENT: 'VETEMENT',
  EMPLOI_SERVICE: 'EMPLOI_SERVICE',
  VOITURE: 'VOITURE',
  LOISIR: 'LOISIR',
  MATERIEL: 'MATERIEL',
  MOBILIER: 'MOBILIER',
  DONS: 'DONS'
};

exports.statutPartenaire = exports.$Enums.statutPartenaire = {
  ACTIF: 'ACTIF',
  SUSPENDU: 'SUSPENDU'
};

exports.duree = exports.$Enums.duree = {
  MENSUEL: 'MENSUEL',
  TRIMESTRIEL: 'TRIMESTRIEL',
  SEMESTRIEL: 'SEMESTRIEL',
  ANNUEL: 'ANNUEL'
};

exports.transactionStatus = exports.$Enums.transactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  newsletter: 'newsletter',
  user: 'user',
  company: 'company',
  profileImage: 'profileImage',
  favoris: 'favoris',
  annonces: 'annonces',
  imageAnnonce: 'imageAnnonce',
  commentaire: 'commentaire',
  temoignages: 'temoignages',
  adresseFacturation: 'adresseFacturation',
  engagement: 'engagement',
  contenuPartenaire: 'contenuPartenaire',
  logo: 'logo',
  article: 'article',
  image: 'image',
  transactions: 'transactions'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
