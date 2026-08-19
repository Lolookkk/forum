-- 0. Nettoyage complet des tables et réinitialisation des IDs à 1
TRUNCATE TABLE users, categories, subcategories, topics, posts, zoom_events RESTART IDENTITY CASCADE;

-- 1. Insertion des utilisateurs (mots de passe hachés fictifs)
INSERT INTO users (username, email, password_hash, role) VALUES
('Alice_Admin', 'admin@safespace.fr', '$2b$10$abcdefghijklmnopqrstuu', 'admin'),
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
INSERT INTO subcategories (category_id, title, description) VALUES
(1, 'Gestion de l''Anxiété', 'Partagez vos histoires et méthodes pour apaiser l''anxiété'),
(1, 'Dépression & Baisse de Moral', 'Un espace d''écoute pour traverser les moments de doute et de solitude'),
(1, 'Relations & Entourage', 'Discussions sur la communication avec les proches et les limites'),
(2, 'Sommeil & Relaxation', 'Techniques pour retrouver un rythme de sommeil paisible'),
(2, 'Développement Personnel', 'Exercices de confiance en soi, gratitude et gestion des émotions'),
(2, 'Travail & Épuisement', 'Échanger autour du burn-out, du stress pro et de la reconversion'),
(3, 'Art & Écriture Thérapies', 'Partagez vos dessins, poèmes et textes libérateurs'),
(3, 'Partage d''Expériences Positives', 'Vos petites victoires et moments d''inspiration du quotidien'),
(4, 'Ateliers Zoom', 'Sessions d''éveil et échanges organisés en direct'),
(4, 'Rencontres & Entraide', 'Initiatives locales et groupes de parole entre membres');

-- 4. Insertion des 30 sujets (topics)
INSERT INTO topics (subcategory_id, user_id, title, content, is_pinned) VALUES
-- Categorie 1 : Soutien & Écoute
(1, 3, 'Comment gérez-vous les crises de panique imprévues ?', 'Bonjour à tous, ces derniers temps j''ai du mal à gérer les montées d''anxiété au travail. Avez-vous des exercices de respiration à me conseiller ?', TRUE),
(1, 4, 'L''impact de la caféine sur le stress au quotidien', 'J''ai remarqué que dès que je bois deux cafés le matin, mes palpitations augmentent. Avez-vous diminué votre consommation ?', FALSE),
(1, 3, 'Gestion de l''anxiété de performance lors des examens', 'Comment réussir à se concentrer quand le cerveau tourne à mille à l''heure avant une épreuve importante ?', FALSE),
(1, 2, 'Technique d''ancrage 5-4-3-2-1 : retour d''expérience', 'Je partage ici cette méthode qui m''a sauvé la vie plus d''une fois lors de mes crises d''angoisse en plein supermarché.', FALSE),
(2, 3, 'Sortir du sentiment de solitude au quotidien', 'C''est parfois difficile de se sentir seul même quand on est entouré. Comment faites-vous pour retrouver du lien authentique ?', FALSE),
(2, 4, 'Surmonter une baisse de moral saisonnière', 'L''hiver arrive et avec lui cette baisse d''énergie habituelle. Quelles sont vos astuces lumineuses pour garder le cap ?', FALSE),
(2, 1, 'Gérer la culpabilité d''avoir une journée sans énergie', 'Accorder du repos à son corps n''est pas de la paresse. Parlons de cette sensation de culpabilité qui nous guette.', FALSE),
(3, 4, 'Exprimer ses besoins sans culpabiliser', 'J''ai toujours eu du mal à dire non à mes amis ou ma famille par peur de décevoir. Quelqu''un a déjà travaillé là-dessus ?', FALSE),
(3, 3, 'Poser des limites claires avec des collègues toxiques', 'Comment maintenir une distance saine au travail sans créer de conflits inutiles avec son entourage pro ?', FALSE),
(3, 4, 'Comment expliquer son anxiété à son/sa partenaire ?', 'Ce n''est pas toujours facile d''expliquer ce qu''on ressent à quelqu''un qui n''a jamais vécu de crise de panique.', FALSE),
(3, 2, 'Gérer la pression familiale lors des fêtes de fin d''année', 'Les réunions de famille peuvent parfois raviver de vieilles blessures. Comment vous vous y préparez ?', FALSE),

-- Categorie 2 : Vie Quotidienne & Bien-être
(4, 3, 'Insomnies et rumination nocturne : vos remèdes naturels', 'Réveillée à 3h du matin avec le cerveau qui tourne en boucle... Avez-vous des tisanes ou routines d''endormissement à recommander ?', FALSE),
(4, 4, 'Créer une routine du soir apaisante et sans écran', 'J''essaie d''éteindre le téléphone une heure avant de dormir. Voici ce que j''ai mis en place depuis deux semaines.', FALSE),
(4, 1, 'L''ASMR et la relaxation sonore : efficace ou gadget ?', 'Certaines personnes adorent les bruits blancs ou le tapotement pour s''endormir, d''autres détestent. Et vous ?', FALSE),
(5, 3, 'Apprendre à célébrer ses petites victoires quotidiennes', 'Aujourd''hui j''ai réussi à passer un appel stressant. Et vous, quelle est votre petite victoire du jour ?', FALSE),
(5, 4, 'Le syndrome de l''imposteur : comment s''en libérer ?', 'Je me sens souvent illégitime dans mon poste alors que mes bilans sont bons. Est-ce que certains vivent ça ici ?', FALSE),
(5, 2, 'Tenir un journal de gratitude : 30 jours de bilan', 'J''écris chaque soir 3 choses positives de ma journée. Les effets sur mon état d''esprit après un mois sont impressionnants.', FALSE),
(6, 3, 'Signes avant-coureurs d''un burn-out : à quoi faire attention ?', 'Épuisement physique, cynisme au travail, irritabilité... Discutons des signaux d''alarme pour s''arrêter à temps.', FALSE),
(6, 4, 'Réussir à déconnecter totalement pendant les week-ends', 'Recevoir des notifications de mails pro le samedi gâche mon repos. Comment réussir à fermer le volet du travail ?', FALSE),
(6, 1, 'Changer de voie professionnelle après un épuisement', 'Certains parmi vous ont-ils entamé une reconversion suite à un surmenage ? Comment s''est passée la transition ?', FALSE),

-- Categorie 3 : Créativité & Expression
(7, 3, 'L''écriture thérapeutique : poser ses pensées sur le papier', 'Je pratique l''écriture libre le matin pour vider mon sac. Ça évite de garder la charge mentale en tête.', FALSE),
(7, 4, 'Peinture et dessin sans recherche de perfection', 'Utiliser la couleur sans chercher à faire joli, juste pour exprimer une émotion. Qui pratique l''art intuitif ?', FALSE),
(7, 2, 'La musique comme exutoire face aux tensions', 'Partagez vos morceaux préférés pour vous évader quand la journée a été particulièrement lourde.', FALSE),
(8, 3, 'Un mot gentil reçu d''un inconnu qui a changé ma journée', 'Racontez ces petits moments d''humanité du quotidien qui redonnent foi en l''avenir et réchauffent le cœur.', FALSE),
(8, 4, 'Mon parcours avec la thérapie : 1 an après, le bilan', 'Il y a un an je n''osais pas franchir la porte d''un cabinet. Voici comment mon quotidien a évolué depuis.', FALSE),

-- Categorie 4 : Événements & Ateliers
(9, 1, 'Prochain atelier Zoom : Méditation guidée et respiration', 'Retrouvez-nous ce mardi à 19h pour un atelier doux axé sur le relâchement des tensions musculaires.', TRUE),
(9, 2, 'Retour sur la session Zoom du mois dernier', 'Merci à tous les participants ! Vos retours bienveillants font très chaud au cœur. On remet ça bientôt.', FALSE),
(10, 3, 'Proposer un groupe de marche douce dans le 92', 'Si certains membres habitent dans les Hauts-de-Seine et souhaitent marcher calmement le dimanche matin...', FALSE),
(10, 4, 'Club de lecture autour de la psychologie et du bien-être', 'Que diriez-vous de lire un livre inspirant par mois et d''en discuter ensemble de manière bienveillante ?', FALSE),
(10, 2, 'Espace d''entraide entre nouveaux membres', 'Tu viens de rejoindre Safe Space ? Viens te présenter ici et poser toutes tes questions sur le fonctionnement du forum !', TRUE);

-- 5. Insertion de quelques réponses (posts)
INSERT INTO posts (topic_id, user_id, content) VALUES
(1, 2, 'Bonjour Claire ! La méthode du 5-4-3-2-1 fonctionne très bien pour moi quand la crise monte : repérer 5 objets autour de soi, 4 bruits, 3 textures... Ça aide à s''ancrer.'),
(1, 4, 'Totalement d''accord avec Marc. La cohérence cardiaque 5 minutes par jour m''a aussi beaucoup aidé !'),
(8, 3, 'C''est un long travail sur soi Samy ! Poser des limites, c''est aussi se respecter soi-même.');

-- 6. Insertion d'un événement Zoom de test
INSERT INTO zoom_events (organizer_id, title, description, zoom_url, start_at, end_at) VALUES
(1, 'Atelier Cohérence Cardiaque & Ancrage', 'Rejoignez-nous pour 45min d exercices guidés en petit groupe.', 'https://zoom.us/j/123456789', '2026-09-01 18:00:00', '2026-09-01 18:45:00');