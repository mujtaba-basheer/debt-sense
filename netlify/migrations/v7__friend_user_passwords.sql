UPDATE users
SET password_hash = crypt(friend_id::TEXT, gen_salt('bf'))
WHERE friend_id IS NOT NULL;
