INSERT INTO techniciens (nom, prenom, email, created_at)
SELECT 'Dupont', 'Jean', 'jean.dupont@example.com', NOW()
WHERE NOT EXISTS (SELECT 1 FROM techniciens WHERE email = 'jean.dupont@example.com')@@

INSERT INTO techniciens (nom, prenom, email, created_at)
SELECT 'Martin', 'Sophie', 'sophie.martin@example.com', NOW()
WHERE NOT EXISTS (SELECT 1 FROM techniciens WHERE email = 'sophie.martin@example.com')@@

INSERT INTO techniciens (nom, prenom, email, created_at)
SELECT 'Bernard', 'Lucas', 'lucas.bernard@example.com', NOW()
WHERE NOT EXISTS (SELECT 1 FROM techniciens WHERE email = 'lucas.bernard@example.com')@@

INSERT INTO techniciens (nom, prenom, email, created_at)
SELECT 'Petit', 'Marie', 'marie.petit@example.com', NOW()
WHERE NOT EXISTS (SELECT 1 FROM techniciens WHERE email = 'marie.petit@example.com')@@

INSERT INTO techniciens (nom, prenom, email, created_at)
SELECT 'Moreau', 'Pierre', 'pierre.moreau@example.com', NOW()
WHERE NOT EXISTS (SELECT 1 FROM techniciens WHERE email = 'pierre.moreau@example.com')@@