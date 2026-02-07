import { Project } from '../types';

const DB_NAME = 'PromptForgeDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

let db: IDBDatabase;

// --- LOCAL INDEXEDDB SERVICE ---

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBOpenDBRequest).error);
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const addProject = async (project: Project): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(project); // put will add or update

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error('Error adding project:', request.error);
            reject('Error adding project');
        };
    });
};

export const getAllProjects = async (): Promise<Project[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            console.error('Error getting all projects:', request.error);
            reject('Error getting all projects');
        };
    });
};

export const deleteProject = async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error('Error deleting project:', request.error);
            reject('Error deleting project');
        };
    });
};

export const updateProject = async (project: Project): Promise<void> => {
    // This is the same as addProject because `put` handles updates.
    return addProject(project);
};

export const bulkAddProjects = async (projects: Project[]): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        let completed = 0;
        const total = projects.length;
        
        if (total === 0) {
            return resolve();
        }

        const putNext = () => {
            if (completed < total) {
                const request = store.put(projects[completed]);
                request.onsuccess = () => {
                    completed++;
                    putNext();
                };
                request.onerror = () => {
                     console.error('Error during bulk add:', request.error);
                     transaction.abort();
                     reject('Error during bulk add');
                };
            }
        };

        putNext();

        transaction.oncomplete = () => {
            if (completed === total) {
                resolve();
            }
        };
        transaction.onerror = () => {
            reject('Transaction failed during bulk add');
        };
    });
};