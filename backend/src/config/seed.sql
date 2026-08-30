-- 0. Nettoyage complet des tables et réinitialisation des IDs à 1
TRUNCATE TABLE users, categories, subcategories, topics, posts, zoom_events, fiches,useful_number_categories, useful_numbers RESTART IDENTITY CASCADE;

-- 1. Insertion des utilisateurs (mots de passe hachés fictifs)
INSERT INTO users (username, email, password_hash, role) VALUES
('Alice_Admin', 'admin@safespace.fr', '$2b$10$9zzxppbEmEVqJ.8HkjgEm.bQYopP3zLP1zLriMUhuZEFLHX/UqvK.', 'admin'),
('Marc_Modo', 'modo@safespace.fr', '$2b$10$abcdefghijklmnopqrstuu', 'moderateur'),
('Claire92', 'claire@gmail.com', '$2b$10$abcdefghijklmnopqrstuu', 'membre'),
('Samy_S', 'samy@yahoo.fr', '$2b$10$abcdefghijklmnopqrstuu', 'membre');

-- 2. Insertion des catégories principales
INSERT INTO categories (name, slug,description) VALUES
('Soutien & Écoute', 'soutien-ecoute','Espaces de parole bienveillants pour échanger sur vos difficultés'),
('Vie Quotidienne & Bien-être','quotidien', 'Conseils, astuces et discussions sur la santé mentale au quotidien'),
('Créativité & Expression', 'creativite-expression','Utiliser les arts, l''écriture et les passions pour libérer l''esprit'),
('Événements & Ateliers', 'evenements-ateliers','Prochains rassemblements et sessions de soutien en visio');

-- 3. Insertion des sous-catégories
INSERT INTO subcategories (category_id, title, slug, description) VALUES
(1, 'Gestion de l''Anxiété', 'anxiety', 'Partagez vos histoires et méthodes pour apaiser l''anxiété'),
(1, 'Dépression & Baisse de Moral','depression', 'Un espace d''écoute pour traverser les moments de doute et de solitude'),
(1, 'Relations & Entourage', 'relations','Discussions sur la communication avec les proches et les limites'),
(2, 'Sommeil & Relaxation', 'sleep','Techniques pour retrouver un rythme de sommeil paisible'),
(2, 'Développement Personnel','personal-dev', 'Exercices de confiance en soi, gratitude et gestion des émotions'),
(2, 'Travail & Épuisement', 'work','Échanger autour du burn-out, du stress pro et de la reconversion'),
(3, 'Art & Écriture Thérapies','art', 'Partagez vos dessins, poèmes et textes libérateurs'),
(3, 'Partage d''Expériences Positives','positives-experiences', 'Vos petites victoires et moments d''inspiration du quotidien'),
(4, 'Ateliers Zoom','zoom' ,'Sessions d''éveil et échanges organisés en direct'),
(4, 'Rencontres & Entraide','meeting', 'Initiatives locales et groupes de parole entre membres');

-- 4. Insertion des 30 sujets (topics)
INSERT INTO topics (subcategory_id, user_id, title, slug, content, is_pinned) VALUES
-- Categorie 1 : Soutien & Écoute
(1, 3, 'Comment gérez-vous les crises de panique imprévues ?', 'comment-gerez-vous-les-crises-de-panique-imprevues', 'Bonjour à tous, ces derniers temps j''ai du mal à gérer les montées d''anxiété au travail. Avez-vous des exercices de respiration à me conseiller ?', TRUE),
(1, 4, 'L''impact de la caféine sur le stress au quotidien', 'limpact-de-la-cafeine-sur-le-stress-au-quotidien', 'J''ai remarqué que dès que je bois deux cafés le matin, mes palpitations augmentent. Avez-vous diminué votre consommation ?', FALSE),
(1, 3, 'Gestion de l''anxiété de performance lors des examens', 'gestion-de-lanxiete-de-performance-lors-des-examens', 'Comment réussir à se concentrer quand le cerveau tourne à mille à l''heure avant une épreuve importante ?', FALSE),
(1, 2, 'Technique d''ancrage 5-4-3-2-1 : retour d''expérience', 'technique-dancrage-5-4-3-2-1-retour-dexperience', 'Je partage ici cette méthode qui m''a sauvé la vie plus d''une fois lors de mes crises d''angoisse en plein supermarché.', FALSE),
(2, 3, 'Sortir du sentiment de solitude au quotidien', 'sortir-du-sentiment-de-solitude-au-quotidien', 'C''est parfois difficile de se sentir seul même quand on est entouré. Comment faites-vous pour retrouver du lien authentique ?', FALSE),
(2, 4, 'Surmonter une baisse de moral saisonnière', 'surmonter-une-baisse-de-moral-saisonniere', 'L''hiver arrive et avec lui cette baisse d''énergie habituelle. Quelles sont vos astuces lumineuses pour garder le cap ?', FALSE),
(2, 1, 'Gérer la culpabilité d''avoir une journée sans énergie', 'gerer-la-culpabilite-davoir-une-journee-sans-energie', 'Accorder du repos à son corps n''est pas de la paresse. Parlons de cette sensation de culpabilité qui nous guette.', FALSE),
(3, 4, 'Exprimer ses besoins sans culpabiliser', 'exprimer-ses-besoins-sans-culpabiliser', 'J''ai toujours eu du mal à dire non à mes amis ou ma famille par peur de décevoir. Quelqu''un a déjà travaillé là-dessus ?', FALSE),
(3, 3, 'Poser des limites claires avec des collègues toxiques', 'poser-des-limites-claires-avec-des-collegues-toxiques', 'Comment maintenir une distance saine au travail sans créer de conflits inutiles avec son entourage pro ?', FALSE),
(3, 4, 'Comment expliquer son anxiété à son/sa partenaire ?', 'comment-expliquer-son-anxiete-a-sonsa-partenaire', 'Ce n''est pas toujours facile d''expliquer ce qu''on ressent à quelqu''un qui n''a jamais vécu de crise de panique.', FALSE),
(3, 2, 'Gérer la pression familiale lors des fêtes de fin d''année', 'gerer-la-pression-familiale-lors-des-fetes-de-fin-dannee', 'Les réunions de famille peuvent parfois raviver de vieilles blessures. Comment vous vous y préparez ?', FALSE),

-- Categorie 2 : Vie Quotidienne & Bien-être
(4, 3, 'Insomnies et rumination nocturne : vos remèdes naturels', 'insomnies-et-rumination-nocturne-vos-remedes-naturels', 'Réveillée à 3h du matin avec le cerveau qui tourne en boucle... Avez-vous des tisanes ou routines d''endormissement à recommander ?', FALSE),
(4, 4, 'Créer une routine du soir apaisante et sans écran', 'creer-une-routine-du-soir-apaisante-et-sans-ecran', 'J''essaie d''éteindre le téléphone une heure avant de dormir. Voici ce que j''ai mis en place depuis deux semaines.', FALSE),
(4, 1, 'L''ASMR et la relaxation sonore : efficace ou gadget ?', 'lasmr-et-la-relaxation-sonore-efficace-ou-gadget', 'Certaines personnes adorent les bruits blancs ou le tapotement pour s''endormir, d''autres détestent. Et vous ?', FALSE),
(5, 3, 'Apprendre à célébrer ses petites victoires quotidiennes', 'apprendre-a-celebrer-ses-petites-victoires-quotidiennes', 'Aujourd''hui j''ai réussi à passer un appel stressant. Et vous, quelle est votre petite victoire du jour ?', FALSE),
(5, 4, 'Le syndrome de l''imposteur : comment s''en libérer ?', 'le-syndrome-de-limposteur-comment-sen-liberer', 'Je me sens souvent illégitime dans mon poste alors que mes bilans sont bons. Est-ce que certains vivent ça ici ?', FALSE),
(5, 2, 'Tenir un journal de gratitude : 30 jours de bilan', 'tenir-un-journal-de-gratitude-30-jours-de-bilan', 'J''écris chaque soir 3 choses positives de ma journée. Les effets sur mon état d''esprit après un mois sont impressionnants.', FALSE),
(6, 3, 'Signes avant-coureurs d''un burn-out : à quoi faire attention ?', 'signes-avant-coureurs-dun-burn-out-a-quoi-faire-attention', 'Épuisement physique, cynisme au travail, irritabilité... Discutons des signaux d''alarme pour s''arrêter à temps.', FALSE),
(6, 4, 'Réussir à déconnecter totalement pendant les week-ends', 'reussir-a-deconnecter-totalement-pendant-les-week-ends', 'Recevoir des notifications de mails pro le samedi gâche mon repos. Comment réussir à fermer le volet du travail ?', FALSE),
(6, 1, 'Changer de voie professionnelle après un épuisement', 'changer-de-voie-professionnelle-apres-un-epuisement', 'Certains parmi vous ont-ils entamé une reconversion suite à un surmenage ? Comment s''est passée la transition ?', FALSE),

-- Categorie 3 : Créativité & Expression
(7, 3, 'L''écriture thérapeutique : poser ses pensées sur le papier', 'lecriture-therapeutique-poser-ses-pensees-sur-le-papier', 'Je pratique l''écriture libre le matin pour vider mon sac. Ça évite de garder la charge mentale en tête.', FALSE),
(7, 4, 'Peinture et dessin sans recherche de perfection', 'peinture-et-dessin-sans-recherche-de-perfection', 'Utiliser la couleur sans chercher à faire joli, juste pour exprimer une émotion. Qui pratique l''art intuitif ?', FALSE),
(7, 2, 'La musique comme exutoire face aux tensions', 'la-musique-comme-exutoire-face-aux-tensions', 'Partagez vos morceaux préférés pour vous évader quand la journée a été particulièrement lourde.', FALSE),
(8, 3, 'Un mot gentil reçu d''un inconnu qui a changé ma journée', 'un-mot-gentil-recu-dun-inconnu-qui-a-change-ma-journee', 'Racontez ces petits moments d''humanité du quotidien qui redonnent foi en l''avenir et réchauffent le cœur.', FALSE),
(8, 4, 'Mon parcours avec la thérapie : 1 an après, le bilan', 'mon-parcours-avec-la-therapie-1-an-apres-le-bilan', 'Il y a un an je n''osais pas franchir la porte d''un cabinet. Voici comment mon quotidien a évolué depuis.', FALSE),

-- Categorie 4 : Événements & Ateliers
(9, 1, 'Prochain atelier Zoom : Méditation guidée et respiration', 'prochain-atelier-zoom-meditation-guidee-et-respiration', 'Retrouvez-nous ce mardi à 19h pour un atelier doux axé sur le relâchement des tensions musculaires.', TRUE),
(9, 2, 'Retour sur la session Zoom du mois dernier', 'retour-sur-la-session-zoom-du-mois-dernier', 'Merci à tous les participants ! Vos retours bienveillants font très chaud au cœur. On remet ça bientôt.', FALSE),
(10, 3, 'Proposer un groupe de marche douce dans le 92', 'proposer-un-groupe-de-marche-douce-dans-le-92', 'Si certains membres habitent dans les Hauts-de-Seine et souhaitent marcher calmement le dimanche matin...', FALSE),
(10, 4, 'Club de lecture autour de la psychologie et du bien-être', 'club-de-lecture-autour-de-la-psychologie-et-du-bien-etre', 'Que diriez-vous de lire un livre inspirant par mois et d''en discuter ensemble de manière bienveillante ?', FALSE),
(10, 2, 'Espace d''entraide entre nouveaux membres', 'espace-dentraide-entre-nouveaux-membres', 'Tu viens de rejoindre Safe Space ? Viens te présenter ici et poser toutes tes questions sur le fonctionnement du forum !', TRUE);

-- 5. Insertion des 64 réponses (posts) distribuées sur tous les sujets
INSERT INTO posts (topic_id, user_id, content) VALUES
-- Topic 1
(1, 2, 'Bonjour Claire ! La méthode du 5-4-3-2-1 fonctionne très bien pour moi quand la crise monte : repérer 5 objets autour de soi, 4 bruits, 3 textures... Ça aide à s''ancrer.'),
(1, 4, 'Totalement d''accord avec Marc. La cohérence cardiaque 5 minutes par jour m''a aussi beaucoup aidé !'),
(1, 1, 'N''hésite pas à consulter la fiche pratique sur l''anxiété dans l''onglet dédié du forum, elle reprend les étapes pas à pas.'),

-- Topic 2
(2, 3, 'Je suis passé au décaféiné après 14h et la différence sur ma fréquence cardiaque du soir est impressionnante.'),
(2, 1, 'La chicorée ou le rooibos sont de super alternatives douces si tu aimes garder une boisson chaude à portée de main.'),

-- Topic 3
(3, 4, 'Pour les examens, je me force à faire 10 minutes de marche sans écouteurs juste avant d''entrer dans la salle.'),
(3, 2, 'Visualiser la fin de l''épreuve et se projeter dans un moment calme après l''examen aide aussi à faire descendre la pression.'),

-- Topic 4
(4, 3, 'Je confirme ! Je l''utilise souvent dans les transports en commun quand je commence à me sentir à l''étroit.'),
(4, 1, 'Merci pour ce partage Marc, c''est un classique très efficace qui remet immédiatement en lien avec le corps.'),

-- Topic 5
(5, 1, 'Rejoindre une activité de groupe sans enjeu (comme le dessin ou le bénévolat) m''a beaucoup aidé à sortir de ce sentiment.'),
(5, 4, 'La solitude ressentie au milieu de la foule est la plus difficile. Prendre le temps d''échanger ici m''aide beaucoup.'),

-- Topic 6
(6, 2, 'Une lampe de luminothérapie pendant le petit-déjeuner a changé mes automnes. Je recommande à 100% !'),
(6, 3, 'Je me prépare des tisanes à la verveine et à la cannelle, et je m''accorde le droit de me coucher plus tôt.'),

-- Topic 7
(7, 3, 'Merci pour ce rappel Alice. On oublie trop souvent que le repos fait partie de la productivité sur le long terme.'),
(7, 4, 'C''est tellement vrai... J''apprends doucement à culpabiliser moins quand je passe un dimanche sous le plaid.'),

-- Topic 8
(8, 3, 'C''est un long travail sur soi Samy ! Poser des limites, c''est aussi se respecter soi-même.'),
(8, 1, 'Dire non à une demande, c''est souvent dire oui à sa propre santé mentale.'),
(8, 2, 'Tu peux commencer par de petits "non" indolores pour t''entraîner progressivement.'),

-- Topic 9
(9, 4, 'Rappeler poliment que tu réponds uniquement sur les heures de bureau permet de poser un cadre clair sans être agressif.'),
(9, 1, 'La communication écrite garde aussi une trace propre et factuelle des échanges si besoin.'),

-- Topic 10
(10, 2, 'Je lui ai montré un schéma expliquant la réponse du système nerveux. Ça l''a aidé à comprendre que ce n''est pas "dans la tête".'),
(10, 3, 'Lui demander juste de tenir la main sans chercher à donner de conseils, c''est ce qui m''a le plus soulagé avec mon conjoint.'),

-- Topic 11
(11, 1, 'Prévoir des échappées extérieures (marcher 15min après le repas) permet de souffler pendant les réunions de famille.'),
(11, 4, 'J''ai décidé de ne plus aborder certains sujets sensibles à table cette année. Chacun son rythme.'),

-- Topic 12
(12, 4, 'Tisane camomille/fleur d''oranger et lecture d''un livre peu stimulant. Si après 20 min je ne dors pas, je me lève.'),
(12, 2, 'Éviter de regarder l''heure sur son téléphone à tout prix ! Ça ne fait qu me faire calculer les heures de sommeil restantes.'),

-- Topic 13
(13, 1, 'Bravo Samy ! La lecture sur papier le soir m''a permis de retrouver un sommeil beaucoup plus profond.'),
(13, 3, 'Je laisse mon téléphone dans le salon pour la nuit, la meilleure décision de mon année.'),

-- Topic 14
(14, 3, 'Personnellement le bruit de la pluie sur une vitre m''apaise instantanément.'),
(14, 4, 'Moi l''ASMR de chuchotement me tend plus qu''autre chose ! En revanche les sons de forêt fonctionnent bien.'),

-- Topic 15
(15, 1, 'Félicitations Claire ! Passer ce genre de coup de téléphone quand on est anxieux est une vraie victoire.'),
(15, 2, 'Bravo ! Aujourd''hui pour moi c''était de sortir marcher malgré la pluie.'),

-- Topic 16
(16, 2, 'Noter sur un carnet les faits objectifs qui prouvent tes réussites aide à contrer cette voix négative.'),
(16, 3, 'On oublie que le syndrome de l''imposteur touche souvent les personnes les plus consciencieuses !'),

-- Topic 17
(17, 4, 'Ça fait deux semaines que je me suis lancé grâce à ton message Marc, et ça change vraiment le regard sur la journée.'),
(17, 1, 'Un classique de la psychologie positive qui a fait ses preuves !'),

-- Topic 18
(18, 1, 'L''envie de ne voir personne le week-end et la fatigue au réveil sont pour moi les deux premiers signaux d''alarme.'),
(18, 2, 'Si votre corps vous dit stop avec des douleurs lombaires ou des migraines à répétition, écoutez-le sans attendre.'),

-- Topic 19
(19, 3, 'Désactiver les notifications professionnelles du vendredi soir au lundi matin est indispensable.'),
(19, 4, 'J''ai un deuxième téléphone dédié au travail que j''éteins carrément le week-end.'),

-- Topic 20
(20, 2, 'Reconversion réussie il y a 2 ans. Ça n''a pas été facile tous les jours mais je ne regrette absolument pas.'),
(20, 3, 'Prendre le temps d''un bilan de compétences avec un professionnel d''accompagnement m''a sécurisé.'),

-- Topic 21
(21, 4, 'J''ai commencé à écrire le matin au réveil sans relire. Ça vide l''esprit avant d''attaquer la journée.'),
(21, 1, 'C''est la technique des "Morning Pages", un excellent outil pour faire baisser la pression mentale.'),

-- Topic 22
(22, 1, 'L''aquarelle intuitive ! On pose de l''eau, des pigments et on laisse couler sans projeter de résultat.'),
(22, 3, 'C''est tellement libérateur de ne pas chercher le "beau" mais juste l''expression du moment.'),

-- Topic 23
(23, 4, 'Du piano classique doux après le travail pour couper la journée stressante.'),
(23, 2, 'Le dernier album instrumental de Max Richter me calme immédiatement.'),

-- Topic 24
(24, 2, 'Un boulanger qui m''a offert un croissant chaud un matin où j''avais les yeux rougis par les larmes. Je n''oublierai jamais.'),
(24, 1, 'Merci pour ce beau partage Claire, ces micro-attentions font tellement de bien.'),

-- Topic 25
(25, 3, 'Félicitations pour ce parcours ! Demander de l''aide est la plus grande preuve de courage.'),
(25, 2, 'Merci pour ton témoignage inspirant Samy, ça donnera de l''espoir à beaucoup d''entre nous.'),

-- Topic 26
(26, 3, 'Comptez sur moi, je serai présente mardis soir !'),
(26, 4, 'Est-ce qu''un replay sera disponible pour ceux qui finissent le travail tard ?'),

-- Topic 27
(27, 4, 'Encore merci Alice et Marc pour l''animation ! Ces espaces d''écoute sont précieux.'),
(27, 1, 'Merci à vous tous pour votre présence et votre bienveillance constante !'),

-- Topic 28
(28, 2, 'Excellente initiative Claire ! La nature et la marche lente font des merveilles sur l''anxiété.'),
(28, 4, 'Je suis du 92 aussi ! Je t''envoie un message privé pour me joindre au groupe.'),

-- Topic 29
(29, 3, 'Excellente idée ! On pourrait commencer par un livre facile à lire sur les émotions.'),
(29, 1, 'Si vous voulez des propositions de lectures inspirantes, je peux vous partager une première sélection.'),

-- Topic 30
(30, 4, 'Bienvenue à tous les nouveaux ! N''hésitez pas, la communauté ici est d''une bienveillance rare.'),
(30, 3, 'Bonjour à tous ! Ravie d''avoir trouvé cet endroit rassurant.');

-- 6. Insertion d'un événement Zoom de test
INSERT INTO zoom_events (organizer_id, title, description, zoom_url, start_at, end_at) VALUES
(1, 'Atelier Cohérence Cardiaque & Ancrage', 'Rejoignez-nous pour 45min d exercices guidés en petit groupe.', 'https://zoom.us/j/123456789', '2026-09-01 18:00:00', '2026-09-01 18:45:00');

-- 7. Insertion d'une announcements
INSERT INTO announcements (title, content, author_id) VALUES
('Bienvenue sur ShyForum !', 'N''hésitez pas à vous présenter dans la section dédiée.', 1),
('Mise à jour de la charte', 'Merci de respecter les règles de courtoisie sur l''ensemble du forum.', 1);

INSERT INTO fiches (title, slug, description, icon, icon_color, content) VALUES
(
  'Gérer l''anxiété au quotidien',
  'anxiete',
  'Conseils pratiques et habitudes simples pour réduire le stress jour après jour.',
  'Wind',
  'text-[#3B6978]',
  '# Gérer l''anxiété au quotidien

L''anxiété est une réaction naturelle du corps face au stress ou à une menace perçue. Lorsqu''elle devient chronique ou envahissante, elle peut perturber le sommeil, la concentration et la qualité de vie globale. Heureusement, des stratégies simples et validées scientifiquement permettent de reprendre le contrôle au quotidien.

---

## 1. Comprendre le mécanisme de l''anxiété
Lorsque le cerveau perçoit un danger (réel ou imaginé), il déclenche la réaction de **lutte ou de fuite**. Le cœur accélère, la respiration devient courte et les muscles se tendent. 

Savoir reconnaître ces signaux physiques est la première étape pour désamorcer l''angoisse avant qu''elle ne prenne le dessus :
* **Signaux corporels :** Oppression thoracique, mains moites, boule dans le ventre, vertiges.
* **Signaux mentaux :** Ruminations, scénarios catastrophes, difficulté à se concentrer.

---

## 2. La technique de respiration 4-7-8
La respiration est le moyen le plus rapide d''envoyer au cerveau le signal que vous êtes en sécurité en stimulant le système nerveux parasympathique.

1. **Inspirez** calmement par le nez pendant **4 secondes**.
2. **Bloquez** votre respiration pendant **7 secondes**.
3. **Expiez** lentement par la bouche en faisant un léger souffle pendant **8 secondes**.
4. Répétez ce cycle **4 fois de suite**.

---

## 3. Remettre en question les pensées anxieuses
L''anxiété a tendance à nous faire anticiper le pire. Face à une pensée angoissante, prenez un temps de pause et posez-vous ces trois questions :

* **Où est la preuve ?** Existe-t-il des faits réels qui prouvent que ce scénario va se produire ?
* **Quel est le pire scénario, et puis-je y faire face ?** Souvent, nous sous-estimons notre capacité d''adaptation.
* **Que dirais-je à un ami ?** Nous sommes souvent bien plus bienveillants envers les autres qu''envers nous-mêmes.

---

## 4. Créer une routine apaisante
* **Limitez les stimulants :** Réduisez la consommation de caféine et d''alcool qui amplifient les palpitations.
* **Ancrez-vous dans le corps :** La marche, les étirements ou 10 minutes d''activité physique aident à libérer la tension accumulée.
* **Fixez un "moment d''inquiétude" :** Accordez-vous 15 minutes par jour (par exemple à 17h) pour noter vos soucis sur un carnet, puis refermez-le.

> **Note bienveillante :** Vous n''avez pas besoin de tout régler aujourd''hui. Avancez un jour à la fois, une respiration à la fois.'
),
(
  'Aider un proche en souffrance',
  'aider-proche',
  'Attitudes et réflexes bienveillants pour soutenir une personne vulnérable.',
  'HeartHandshake',
  'text-[#8B5A33]',
  '# Comment soutenir un proche en souffrance

Voir une personne chère traverser une période difficile (dépression, anxiété, deuil) peut nous faire sentir démunis. Il n''est pas toujours nécessaire d''avoir toutes les réponses : votre présence est déjà un soutien précieux.

---

## 1. L''écoute active et sans jugement
L''erreur la plus fréquente est de vouloir "réparer" la situation ou d''offrir des solutions immédiates. Souvent, la personne a simplement besoin de se sentir entendue et validée.

* **À éviter :** *"Secoue-toi", "Il y a pire dans la vie", "Ne pense pas à ça".*
* **À privilégier :** *"Je vois que c''est très dur pour toi", "Je suis là si tu veux en parler", "Prends le temps qu''il te faut".*

---

## 2. Proposer une aide concrète
Les personnes en souffrance ont souvent du mal à demander de l''aide ou à exprimer leurs besoins. Les propositions vagues comme *"Dis-moi si tu as besoin de quelque chose"* restent souvent sans réponse.

Soyez spécifique dans vos propositions :
* *"Je passe au supermarché, qu''est-ce que je peux te rapporter ?"*
* *"Est-ce que tu aimerais qu''on aille faire une petite marche de 10 minutes ?"*
* *"Je peux m''occuper du repas ce soir si tu veux te reposer."*

---

## 3. Préserver vos propres limites
On ne peut pas verser d''eau d''une gourde vide. Pour être en mesure d''aider durablement, vous devez aussi prendre soin de vous :

1. **Fixez des limites claires :** Vous êtes un soutien, pas un thérapeute.
2. **Ne restez pas seul(e) :** Encouragez votre proche à consulter un professionnel de santé (médecin, psychologue).
3. **Prenez du temps pour vous :** Continuez vos activités et préservez votre propre équilibre.

> **Besoin d''aide d''urgence ?** Si vous craignez pour la sécurité immédiate de votre proche, contactez le **15** (SAMU) ou le **3114** (Numéro national de prévention du suicide).'
),
(
  'Exercices d''ancrage pour couper les pensées',
  'ancrage',
  'Techniques réflexes (dont le 5-4-3-2-1) pour stopper la rumination et revenir au présent.',
  'Anchor',
  'text-[#4A5D4E]',
  '# L''ancrage : Stopper la rumination mentale

Lorsque notre esprit est emporté par un tourbillon de pensées ou une crise d''angoisse, le corps reste bloqué en mode alerte. L''ancrage (ou *grounding*) est une méthode rapide pour ramener l''attention sur le moment présent en s''appuyant sur les 5 sens.

---

## La méthode 5 - 4 - 3 - 2 - 1

Regardez autour de vous et nommez mentalement ou à voix haute :

* **5 choses que vous voyez :** Une tache sur le mur, la lumière à travers la fenêtre, la couleur de votre stylo...
* **4 choses que vous pouvez toucher :** La texture de votre jean, le froid de la table, vos pieds à plat sur le sol...
* **3 sons que vous entendez :** Le ronronnement du frigo, le bruit du trafic au loin, votre propre respiration...
* **2 odeurs que vous sentez :** L''odeur de votre café, le parfum de votre savon ou simplement l''air ambiant...
* **1 goût que vous ressentez :** Le goût de votre dentifrice, un verre d''eau fraîche ou un bonbon.

---

## Autre exercice rapide : Le scan corporel express
Si vous êtes dans un lieu public ou sans possibilité de parler :

1. Posez les deux pieds bien à plat sur le sol.
2. Appuyez fort sur vos talons et ressentez le contact ferme avec la terre.
3. Touchez le bout de votre pouce avec chaque doigt de la même main en comptant : *1, 2, 3, 4*.
4. Sentez la température de l''air sur votre peau.

> **Pourquoi ça marche ?** Votre cerveau ne peut pas concentrer toute son énergie sur l''anxiété en même temps qu''il traite activement des informations sensorimotrices réelles.'
),
(
  'J''ai des idées noires',
  'idees-noires',
  'Étapes de sécurité et repères immédiats pour traverser un moment très sombre.',
  'LifeBuoy',
  'text-[#934B36]',
  '# Vous n''êtes pas seul(e) : Traverser la crise

Si vous lisez ceci et que vous traversez un moment d''obscurité intense, sachez que la douleur que vous ressentez actuellement est temporaire, même si elle semble insurmontable en ce moment. Des personnes sont prêtes à vous écouter sans aucun jugement.

---

## 1. Actions immédiates de sécurité
Si la crise est très forte :

* **Mettez-vous en sécurité :** Éloignez-vous de tout objet ou situation dangereux.
* **Ne restez pas seul(e) :** Appelez une personne de confiance ou un service d''écoute.
* **Différez toute décision :** Promettez-vous d''attendre simplement les prochaines 24 heures sans agir.

---

## 2. Numéros gratuits & confidentiels (24h/24)

* **3114** : Numéro national de prévention du suicide (Appel gratuit, professionnel et confidentiel en France).
* **15** ou **112** : Urgences médicales (SAMU) en cas de danger immédiat.
* **114** : Numéro d''urgence pour les personnes sourdes ou malentendantes (SMS).
* **Fil Santé Jeunes (0 800 235 236)** : Écoute anonyme et gratuite pour les 12-25 ans.

---

## 3. Plan de sécurité personnel
Prenez un papier et notez :
1. Une raison (même toute petite) d''attendre aujourd''hui (un animal, un ami, un projet).
2. Deux activités qui me distraient pendant 10 minutes (écouter une musique, prendre une douche froide).
3. Le nom et le numéro de 2 personnes ressources à contacter.'
),
(
  'Je me sens seul',
  'isolement',
  'Pistes concrètes et rassurantes pour briser la solitude pas à pas.',
  'Users',
  'text-[#8B6E33]',
  '# Apprivoiser et briser la solitude

La solitude est un sentiment profond qui peut toucher n''importe qui, même entouré de monde. Reconnaître ce sentiment sans culpabiliser est le premier pas pour recréer du lien avec soi-même et avec les autres.

---

## 1. Faire la différence entre isolement et solitude
* **L''isolement** est un état de fait (peu ou pas de contacts sociaux).
* **La solitude** est un sentiment intérieur. On peut se sentir seul au milieu d''une foule, tout comme on peut apprécier être seul chez soi.

---

## 2. Les micro-connections du quotidien
N''attendez pas de trouver l''ami parfait du jour au lendemain. Commencez par réhabituer votre esprit aux interactions sociales à petite échelle :

* Dites bonjour ou souriez au commerçant du quartier.
* Échangez un mot sur la météo avec un voisin dans l''ascenseur.
* Prenez des nouvelles d''une connaissance perdue de vue par un simple message.

---

## 3. Rejoindre des espaces bienveillants
* **Le bénévolat :** S''engager dans une association permet de rencontrer des personnes qui partagent des valeurs communes.
* **Les forums et communautés :** Échanger sur des espaces de discussion bienveillants (comme ce forum) permet d''exprimer ses ressentis sans peur du jugement.'
),
(
  'J''ai une crise de panique',
  'crise-panique',
  'Guide d''urgence pas à pas pour apaiser les symptômes physiques d''une attaque.',
  'Zap',
  'text-[#6B4E71]',
  '# Calmer une crise de panique (Attaque de panique)

Une crise de panique est une montée soudaine de peur intense. Les symptômes sont impressionnants (cœur qui bat très vite, sensation d''étouffement, tremblements, peur de perdre le contrôle), mais **elle n''est pas dangereuse pour votre santé** et va passer.

---

## Ce qu''il faut se répéter tout de suite
> *"Ce que je ressens est très inconfortable, mais ce n''est pas dangereux. Mon corps réagit à une fausse alerte. Ça va s''arrêter dans quelques minutes."*

---

## Les étapes à suivre pas à pas

1. **Arrêtez ce que vous faites** et, si possible, asseyez-vous confortablement.
2. **Posez les pieds à plat sur le sol** et appuyez vos mains sur vos cuisses.
3. **La respiration en carré :**
   * Inspirez pendant **4s**
   * Retenez votre souffle pendant **4s**
   * Expirez pendant **4s**
   * Attendez **4s** avant de réinspirer
4. **Regardez un objet autour de vous** et décrivez-le mentalement dans les moindres détails (sa forme, ses couleurs, ses ombres).

La crise atteint généralement son pic en 5 à 10 minutes avant de redescendre progressivement. Laissez la vague passer sans lutter.'
);

-- Insertion des catégories
INSERT INTO useful_number_categories (name) VALUES
('Santé mentale & Écoute'),
('Urgences psy & crise');

-- Insertion des numéros utiles
INSERT INTO useful_numbers (category_id, name, number, description, badge, urgent, chat, url) VALUES
-- Santé mentale & Écoute (category_id = 1)
(1, 'SOS Amitié', '09 72 39 40 50', 'Écoute anonyme contre la détresse et la solitude', '24/7 • Gratuit', false, 'Chat accessible de 13h à 3h', 'https://www.sos-amitie.com'),
(1, 'Fil Santé Jeunes', '0 800 235 236', 'Soutien et conseils pour les 12-25 ans', '9h-23h • Gratuit', false, 'Chat accessible de 9h à 22h', 'https://www.filsantejeunes.com'),
(1, 'Nightline', '01 88 32 12 32', 'Écoute par des étudiants pour des étudiants', '21h-2h30 • Gratuit', false, 'Chat accessible de 21h à 2h30', 'https://www.nightline.fr/'),
(1, 'Suicide Écoute', '01 45 39 40 00', 'Écoute et soutien sans jugement pour personnes en souffrance', '24/7 • Gratuit', false, NULL, 'https://www.suicide-ecoute.fr/'),
(1, 'CNAE', '01 45 39 40 00', 'Écoute, soutien et orientation gratuits et confidentiels pour tous les étudiants', '24/7 • Gratuit', false, NULL, 'https://3114.fr'),

-- Urgences psy & crise (category_id = 2)
(2, 'Prévention du Suicide', '3114', 'Écoute et soutien par des professionnels de santé', '24/7 • Gratuit', false, NULL, 'https://3114.fr'),
(2, 'SAMU', '15', 'Urgences psy médicales graves et détresse vitale', '24/7 • Gratuit', true, NULL, 'https://www.samu-de-france.fr'),
(2, 'Urgence SMS / Chat', '114', 'Pour personnes sourdes, malentendantes ou dans l''impossibilité de parler', '24/7 • Gratuit', false, NULL, 'https://www.urgence114.fr');


INSERT INTO settings (id, forum_name, maintenance_mode, topics_per_page, registration_open)
VALUES (1, 'Safe Space', false, 10, true)
ON CONFLICT (id) DO NOTHING;