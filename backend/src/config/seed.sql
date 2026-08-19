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
('Vie Quotidienne & Bien-être', vie-quotidienne, 'Conseils, astuces et discussions sur la santé mentale au quotidien'),
('Événements & Ateliers',evenements-ateliers, 'Prochains rassemblements et sessions de soutien en visio');

-- 3. Insertion des sous-catégories 
INSERT INTO subcategories (category_id, title, description) VALUES
(1, 'Gestion de l''Anxiété', 'Partagez vos histoires et méthodes pour apaiser l anxiété'),
(1, 'Relations & Entourage', 'Discussions sur la communication avec les proches et les limites'),
(2, 'Sommeil & Relaxation', 'Techniques pour retrouver un rythme de sommeil paisible'),
(3, 'Ateliers Zoom', 'Sessions d éveil et échanges organisés en direct');

-- 4. Insertion de sujets (topics)
INSERT INTO topics (subcategory_id, user_id, title, content, is_pinned) VALUES
(1, 3, 'Comment gérez-vous les crises de panique imprévues ?', 'Bonjour à tous, ces derniers temps j ai du mal à gérer les montées d anxiété au travail. Avez-vous des exercices de respiration à me conseiller ?', TRUE),
(2, 4, 'Exprimer ses besoins sans culpabiliser', 'J ai toujours eu du mal à dire non à mes amis ou ma famille par peur de décevoir. Quelqu un a déjà travaillé là-dessus ?', FALSE);

-- 5. Insertion de réponses (posts)
INSERT INTO posts (topic_id, user_id, content) VALUES
(1, 2, 'Bonjour Claire ! La méthode du 5-4-3-2-1 fonctionne très bien pour moi quand la crise monte : repérer 5 objets autour de soi, 4 bruits, 3 textures... Ça aide à s ancrer.'),
(1, 4, 'Totalement d accord avec Marc. La cohérence cardiaque 5 minutes par jour m a aussi beaucoup aidé !'),
(2, 3, 'C est un long travail sur soi Samy ! Poser des limites, c est aussi se respecter soi-même.');

-- 6. Insertion d'un événement Zoom de test
INSERT INTO zoom_events (organizer_id, title, description, zoom_url, start_at, end_at) VALUES
(1, 'Atelier Cohérence Cardiaque & Ancrage', 'Rejoignez-nous pour 45min d exercices guidés en petit groupe.', 'https://zoom.us/j/123456789', '2026-09-01 18:00:00', '2026-09-01 18:45:00');