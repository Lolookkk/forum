-- 0. Nettoyage complet des tables et réinitialisation des IDs à 1
TRUNCATE TABLE users, categories, subcategories, topics, posts, zoom_events RESTART IDENTITY CASCADE;

-- 1. Insertion des utilisateurs (mots de passe hachés fictifs)
INSERT INTO users (username, email, password_hash, role) VALUES
('Alice_Admin', 'admin@safespace.fr', '$2b$10$abcdefghijklmnopqrstuu', 'admin'),
('Marc_Modo', 'modo@safespace.fr', '$2b$10$abcdefghijklmnopqrstuu', 'moderateur'),
('Claire92', 'claire@gmail.com', '$2b$10$abcdefghijklmnopqrstuu', 'membre'),
('Samy_S', 'samy@yahoo.fr', '$2b$10$abcdefghijklmnopqrstuu', 'membre');

-- 2. Insertion des catégories principales
INSERT INTO categories (name, slug, description) VALUES
('Soutien & Écoute', 'soutien-ecoute', 'Espaces de parole bienveillants pour échanger sur vos difficultés'),
('Vie Quotidienne & Bien-être', 'quotidien', 'Conseils, astuces et discussions sur la santé mentale au quotidien'),
('Créativité & Expression', 'creativite-expression', 'Utiliser les arts, l''écriture et les passions pour libérer l''esprit'),
('Événements & Ateliers', 'evenements-ateliers', 'Prochains rassemblements et sessions de soutien en visio');

-- 3. Insertion des sous-catégories
INSERT INTO subcategories (category_id, title, slug, description) VALUES
(1, 'Gestion de l''Anxiété', 'anxiety', 'Partagez vos histoires et méthodes pour apaiser l''anxiété'),
(1, 'Dépression & Baisse de Moral', 'depression', 'Un espace d''écoute pour traverser les moments de doute et de solitude'),
(1, 'Relations & Entourage', 'relations', 'Discussions sur la communication avec les proches et les limites'),
(2, 'Sommeil & Relaxation', 'sleep', 'Techniques pour retrouver un rythme de sommeil paisible'),
(2, 'Développement Personnel', 'personal-dev', 'Exercices de confiance en soi, gratitude et gestion des émotions'),
(2, 'Travail & Épuisement', 'work', 'Échanger autour du burn-out, du stress pro et de la reconversion'),
(3, 'Art & Écriture Thérapies', 'art', 'Partagez vos dessins, poèmes et textes libérateurs'),
(3, 'Partage d''Expériences Positives', 'positives-experiences', 'Vos petites victoires et moments d''inspiration du quotidien'),
(4, 'Ateliers Zoom', 'zoom', 'Sessions d''éveil et échanges organisés en direct'),
(4, 'Rencontres & Entraide', 'meeting', 'Initiatives locales et groupes de parole entre membres');

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

-- 5. Insertion des réponses (posts)
INSERT INTO posts (topic_id, user_id, content) VALUES
-- Topic 1 : Crises de panique
(1, 2, 'Bonjour Claire ! La méthode du 5-4-3-2-1 fonctionne très bien pour moi quand la crise monte : repérer 5 objets autour de soi, 4 bruits, 3 textures... Ça aide à s''ancrer.'),
(1, 4, 'Totalement d''accord avec Marc. La cohérence cardiaque 5 minutes par jour m''a aussi beaucoup aidé !'),
(1, 1, 'L''application Respiro ou des vidéos de respiration carrée m''aident à faire redescendre le rythme cardiaque au bureau sans que mes collègues s''en rendent compte.'),
(1, 3, 'Merci pour vos retours précieux, je vais essayer la cohérence cardiaque dès demain matin !'),

-- Topic 2 : Caféine
(2, 2, 'J''ai remplacé le deuxième café par du thé vert puis de la verveine. Moins de tremblements et beaucoup moins d''anxiété en fin de matinée.'),
(2, 3, 'Pareil ici ! Le décaféiné m''a sauvée, au moins je garde le goût du café du matin sans la crise de tachycardie qui allait avec.'),

-- Topic 3 : Anxiété de performance
(3, 1, 'Essaye de fractionner tes révisions. Faire des pauses de 10 minutes toutes les 45 minutes permet d''éviter la surchauffe mentale.'),
(3, 4, 'Ce qui m''aide beaucoup, c''est d''écrire mes peurs sur une feuille avant de commencer l''épreuve pour m''en vider l''esprit.'),

-- Topic 4 : Technique 5-4-3-2-1
(4, 3, 'Je confirme, je l''utilise dès que je commence à me sentir oppressée dans les transports en commun. C''est un vrai réflexe à prendre !'),
(4, 4, 'Petite astuce en plus : avoir une huile essentielle ou un bonbon à la menthe forte pour stimuler le sens du goût/odorat.'),

-- Topic 5 : Solitude
(5, 1, 'Sache que tu n''es pas seule Claire. S''inscrire dans une association ou participer à des ateliers de groupe m''a réappris à créer de vrais liens.'),
(5, 2, 'Le sentiment de solitude peut être très paradoxal au milieu des gens. N''hésite pas à échanger ici en attendant !'),
(5, 4, 'Les activités créatives en petit groupe m''ont beaucoup aidé perso.'),

-- Topic 6 : Baisse de moral saisonnière
(6, 3, 'J''ai investi dans une lampe de luminothérapie l''année dernière, 20 minutes chaque matin avec mon petit-déjeuner. Ça change tout !'),
(6, 2, 'Sortir marcher au moins 15 minutes à la pause déjeuner pour attraper le moindre rayon de soleil aide vraiment.'),

-- Topic 7 : Culpabilité sans énergie
(7, 4, 'Merci pour ce rappel Alice. On oublie trop souvent que le repos fait partie du processus de guérison.'),
(7, 3, 'Un jour sans énergie n''est pas une journée perdue. C''est juste son corps qui demande une pause obligatoire.'),

-- Topic 8 : Exprimer ses besoins
(8, 3, 'C''est un long travail sur soi Samy ! Poser des limites, c''est aussi se respecter soi-même.'),
(8, 2, 'J''ai commencé par dire des "non" sur des toutes petites choses sans me justifier. Petit à petit, on prend confiance.'),
(8, 1, 'Un livre très chouette là-dessus : "Les mots sont des fenêtres" sur la Communication Non-Violente (CNV).'),

-- Topic 9 : Collègues toxiques
(9, 4, 'Le principe de la "pierre grise" (devenir le plus neutre et ennuyeux possible face à eux) fonctionne à merveille.'),
(9, 1, 'Mettre les échanges importants par écrit/email permet aussi de se protéger en cas de conflit.'),

-- Topic 10 : Expliquer son anxiété
(10, 2, 'Lui faire lire des témoignages ou des articles simples sur les mécanismes de la crise d''angoisse peut aider à démystifier la chose.'),
(10, 3, 'Mon conjoint ne comprenait pas au début, puis on a trouvé un mot-clé ("pause") que j''utilise quand la foule devient trop lourde.'),

-- Topic 11 : Pression familiale
(11, 4, 'Prévoir un moyen de transport autonome pour pouvoir partir quand on se sent dépassé, ça change la vie !'),
(11, 1, 'Se rappeler qu''on n''est pas obligé d''aborder les sujets piquants. On peut poliment changer de sujet.'),

-- Topic 12 : Insomnies
(12, 1, 'La verveine-camomille avec une goutte de miel, et surtout bannir le téléphone du lit !'),
(12, 2, 'Les podcasts d''histoires pour s''endormir m''aident à focaliser mon attention ailleurs que sur mes ruminations.'),

-- Topic 13 : Routine du soir
(13, 3, 'Lecture d''un roman léger sous un plaid, bougie parfumée et lumière tamisée à partir de 21h30.'),
(13, 2, 'Excellente habitude ! Le sommeil s''est vraiment amélioré de mon côté depuis que je lis des livres papiers.'),

-- Topic 14 : ASMR
(14, 4, 'Team bruits de pluie et de vent fort sur une tente ! Ça m''apaise instantanément.'),
(14, 3, 'Chez moi l''ASMR vocal m''angoisse plus qu''autre chose, mais le bruit des vagues marche bien.'),

-- Topic 15 : Petites victoires
(15, 1, 'Bravo Claire ! Ma victoire du jour : avoir fait 30 minutes de marche malgré la flemme.'),
(15, 4, 'Avoir réussi à ranger mon bureau qui prenait la poussière depuis des semaines !'),

-- Topic 16 : Syndrome de l'imposteur
(16, 2, 'Je garde un dossier "Compliments" dans mes emails où je sauvegarde les retours positifs de mes collègues et clients.'),
(16, 3, 'Tellement fréquent... Rappelle-toi que si tu es à ce poste, c''est pour tes compétences, pas par chance !'),

-- Topic 17 : Journal de gratitude
(17, 1, 'Super retour Samy ! Ça réentraîne le cerveau à repérer le positif au lieu de focaliser uniquement sur les tracas.'),
(17, 4, 'Je le fais aussi sur une petite application mobile avant de dormir, c''est mon rituel.'),

-- Topic 18 : Burn-out
(18, 1, 'Attention au cynisme et à l''impression de tourner à vide... N''attendez pas le malaise physique pour consulter.'),
(18, 2, 'La perte du sommeil réparateur a été le tout premier signal d''alerte de mon côté. Soyez attentifs.'),

-- Topic 19 : Déconnexion week-end
(19, 3, 'J''ai tout simplement désinstallé l''application de messagerie pro de mon téléphone perso. Libération totale !'),
(19, 4, 'Mettre son téléphone en mode "Ne pas déranger" avec accès uniquement aux urgences de la famille proche.'),

-- Topic 20 : Reconversion
(20, 2, 'Après mon burn-out, j''ai pris 6 mois de recul avant de me former aux métiers de l''artisanat. Aucun regret !'),
(20, 1, 'Un bilan de compétences financé par le CPF m''a beaucoup aidée à y voir plus clair sans précipiter les choses.'),

-- Topic 21 : Écriture thérapeutique
(21, 4, 'Le matin à chaud, remplir 2 pages sans se relire ni corriger les fautes : un vrai vide-sac émotionnel.'),
(21, 2, 'Parfois je brûle ou déchire la feuille après avoir tout écrit. Ça symbolise le fait d''évacuer l''émotion.'),

-- Topic 22 : Peinture intuitive
(22, 1, 'La gouache avec les doigts sur de grandes feuilles ! Pas de forme précise, juste étaler des couleurs.'),
(22, 3, 'C''est tellement libérateur de ne pas chercher le beau mais le ressenti.'),

-- Topic 23 : Musique exutoire
(23, 4, 'Un bon morceau d''instrumental ou de piano mélancolique selon l''ambiance de la journée.'),
(23, 3, 'Moi c''est du rock dynamique pour évader toute la frustration accumulée !'),

-- Topic 24 : Mot gentil
(24, 2, 'Une dame dans le bus m''a dit que mon manteau était très joli un jour où j''étais au plus bas. Je m''en rappelle encore 2 ans après !'),
(24, 1, 'Ce sont ces petits gestes gratuits qui sauvent des journées.'),

-- Topic 25 : Bilan 1 an de thérapie
(25, 3, 'Bravo pour ton parcours Samy ! Le premier pas est toujours le plus difficile.'),
(25, 2, 'Ça redonne énormément d''espoir à ceux qui hésitent encore à consulter.'),

-- Topic 26 : Atelier Zoom Méditation
(26, 3, 'Hâte d''y être ! Merci Alice pour l''organisation de ces temps doux.'),
(26, 4, 'Je m''inscris tout de suite, c''est exactement ce dont j''ai besoin en ce moment.'),

-- Topic 27 : Retour Zoom
(27, 1, 'Merci à vous tous pour votre présence chaleureuse et vos partages touchants.'),
(27, 3, 'C''était un super moment, vivement la prochaine session !'),

-- Topic 28 : Marche douce 92
(28, 4, 'Excellente idée ! Je suis disponible le dimanche matin vers le parc de Sceaux par exemple.'),
(28, 2, 'Partant aussi si le rythme reste tranquille !'),

-- Topic 29 : Club de lecture
(29, 1, 'Superbe initiative ! On pourrait commencer par un livre de Christophe André ou de Lise Bourbeau ?'),
(29, 3, 'Carrément motivée ! On pourrait créer un fil dédié pour choisir le premier bouquin.'),

-- Topic 30 : Espace d'entraide nouveaux
(30, 3, 'Bienvenue à tous les nouveaux arrivants ! N''hésitez pas si vous avez des questions sur l''utilisation des salons.'),
(30, 4, 'Ravi de rejoindre cette communauté si bienveillante, merci pour votre accueil !'),
(30, 1, 'N''oubliez pas de lire la charte de bienveillance en haut du forum pour que l''espace reste paisible pour chacun.'),
(30, 2, 'Bienvenue ! On est là pour s''entraider, pas de pression ici.');

-- 6. Insertion d'un événement Zoom de test
INSERT INTO zoom_events (organizer_id, title, description, zoom_url, start_at, end_at) VALUES
(1, 'Atelier Cohérence Cardiaque & Ancrage', 'Rejoignez-nous pour 45min d exercices guidés en petit groupe.', 'https://zoom.us/j/123456789', '2026-09-01 18:00:00', '2026-09-01 18:45:00');