import {testStore} from "./storetest.js";
import {createTestStore} from "./createStoreTest.js"

//initialised test store with fake domain
const store = createTestStore();

testStore(store);
