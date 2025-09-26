export default function getMockDatabase() {
  // Simple in-memory mock database providing MongoDB-like interface
    const collections = {};
    return {
        collection: (name) => {
            if (!collections[name]) {
                collections[name] = {
                    data: [],
                    insertOne: async (doc) => {
                        collections[name].data.push(doc);
                        return { insertedId: doc._id };
                    },
                    find: async (query) => {
                        return collections[name].data.filter(doc => {
                            return Object.keys(query).every(key => doc[key] === query[key]);
                        });
                    },
                    findOne: async (query) => {
                        return collections[name].data.find(doc => {
                            return Object.keys(query).every(key => doc[key] === query[key]);
                        }) || null;
                    }
                };
            }
            return collections[name];
        }
    };
}
