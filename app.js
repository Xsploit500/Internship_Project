require('dotenv').config();

const Airtable = require('airtable');

const { MongoClient } = require('mongodb');

const TableName = 'Projects';

const url = 'mongodb+srv://Wizzy500:Dominis580@neocluster.mdkli9u.mongodb.net/?retryWrites=true&w=majority';

const databaseName = 'Airtable_Mongo';

const collectionName = 'Uapb_Students';

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_APIKEY}).base(process.env.AIRTABLE_BASE);


async function ReadDataFromAirtable() {

  try {

    const airtable = new Airtable({ apiKey: process.env.AIRTABLE_APIKEY}).base(process.env.AIRTABLE_BASE);
    
    const airtableRecords = await airtable(TableName).select().all();

    const transformedData = airtableRecords.map(record => ({
      airtable_id: record.id,
      Name: record.get('Name'),
      Major: record.get('Major'),
      Sex: record.get('Sex'),
      Classification: record.get('Classification'),
      City: record.get('City'),
      State: record.get('State'),
      Country: record.get('Country'),
    }));
  
    return transformedData;

  } 
  
  catch (error) 
  
  {
    console.error('Error fetching data from Airtable:', error);
  } 

}

async function insertMongoRecords(transformedData) {

  const mongoClient = new MongoClient(url);
    
  await mongoClient.connect();
    
  const db = mongoClient.db(databaseName);

  const collection = db.collection(collectionName);

  await collection.insertMany(transformedData);
  
}

async function updateRecordInAirtable (updates) {

  try {

    for (const record of updates) {

      await airtable(TableName).update([{id: record.airtable_id, fields: {State: record.State, Country: record.Country, City: record.City, Classification: record.Classification,
         Major: record.Major, Name: record.Name, Sex: record.Sex}}]);

      console.log(`Record ${record.airtable_id} updated in airtable successfully.`);

    }

  }

  catch(error) 
  {
    console.error('Error updating record in Airtable:', error);
  }

}

async function getMongoRecords() {

  try {

    const mongoClient = await MongoClient.connect(url);

    const db = mongoClient.db(databaseName);

    const collection = db.collection(collectionName);
    
    const MongoData =  await collection.find({}).project({State: 1, Country: 1, City: 1, Classification: 1, Major: 1, Name: 1, Sex: 1, airtable_id: 1, _id: 0}).sort("Name").toArray();

    return MongoData;

  }

  catch (error) 
  
  {
    console.log('Problem monitoring changes in MongoDB:', error);
  }
}

function getRecordsToUpdate(MongoData, airtableRecords) {

  const recordsToUpdate = []

  MongoData.forEach((mongoRecord) => {

    const match = airtableRecords.find((airtableRecord) => {return airtableRecord.airtable_id === mongoRecord.airtable_id})

    if(match && JSON.stringify(mongoRecord) !== JSON.stringify(match)){
    

      recordsToUpdate.push(mongoRecord)

      console.log('record dont match', match)

    }
  })

return recordsToUpdate;

}

async function final () {

  const airtableRecords = await ReadDataFromAirtable();

  //await insertMongoRecords(airtableRecords);

  const MongoData = await getMongoRecords(airtableRecords);

  const updates = getRecordsToUpdate(MongoData, airtableRecords);

  await updateRecordInAirtable(updates);

  const responseData = {

    airtable_records: MongoData,

    recordsUpdated: updates.length

  }

return responseData

}

module.exports = final;