DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'chantiers'
          AND column_name = 'type_installation'
          AND udt_name = 'bytea'
    ) THEN
        EXECUTE '
            ALTER TABLE public.chantiers
            ALTER COLUMN type_installation TYPE text
            USING CASE
                WHEN type_installation IS NULL THEN NULL
                ELSE convert_from(type_installation, ''UTF8'')
            END
        ';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'chantiers'
          AND column_name = 'signature_client'
          AND udt_name = 'bytea'
    ) THEN
        EXECUTE '
            ALTER TABLE public.chantiers
            ALTER COLUMN signature_client TYPE text
            USING CASE
                WHEN signature_client IS NULL THEN NULL
                ELSE convert_from(signature_client, ''UTF8'')
            END
        ';
    END IF;
END
$$@@