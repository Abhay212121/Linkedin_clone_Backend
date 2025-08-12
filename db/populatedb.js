require('dotenv').config();
const { Client } = require('pg');

const createUserSQL = `
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_name VARCHAR(255),
    user_mail VARCHAR(255),
    user_password VARCHAR(255),
    user_jobrole VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const postSQL = `
DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts(
    post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    post_content TEXT,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`

const commentSQL = `
DROP TABLE IF EXISTS comments;
CREATE TABLE IF NOT EXISTS comments(
    comment_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_id INTEGER REFERENCES posts(post_id) ON DELETE CASCADE,
    comment_content TEXT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`
const addComment = `
INSERT INTO comments(post_id,comment_content,user_id) VALUES(12,'Excellent Work!👍👍',7);
`

async function main() {
    console.log('Sending...');
    const client = new Client({
        connectionString: process.env.CONNECTION_STRING,
    });

    try {
        await client.connect();
        // await client.query(createUserSQL);
        // await client.query(postSQL);
        await client.query(`ALTER TABLE users ADD COLUMN user_location TEXT;
        `);
        console.log('Done!');
    } catch (err) {
        console.error('Error executing query:', err);
    } finally {
        await client.end();
    }
}

main();
