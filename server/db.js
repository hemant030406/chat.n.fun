import Database from 'better-sqlite3';

const db = new Database('mydb.sqlite');

export const createTable = () => {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room TEXT NOT NULL,
        messages TEXT NOT NULL
      )
    `).run();
}

export const insert = (room, message) => {
    const row = db.prepare('SELECT messages FROM rooms WHERE room = ?').get(room);
    if (row) {
        const oldMessages = JSON.parse(row.messages);
        const newMessages = [...oldMessages, message];
        db.prepare('UPDATE rooms SET messages = ? WHERE room = ?').run(JSON.stringify(newMessages), room);
    } else {
        db.prepare('INSERT INTO rooms (room, messages) VALUES (?, ?)').run(room, JSON.stringify([message]));
    }
};

export const getMessages = (room) => {
    const row = db.prepare('SELECT messages FROM rooms WHERE room = ?').get(room);
    if (row) {
        return JSON.parse(row.messages);
    } else {
        return [];
    }
};